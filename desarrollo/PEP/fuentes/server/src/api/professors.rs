use rocket::serde::{Deserialize, json::Json};
use rocket::http::Status;
use rocket::{Route, State};
use ::serde::Serialize;
use serde_json::{json, Value};
use sqlx::query;
use sqlx::Postgres;
use sqlx::Pool;

use super::user_management::AppUser;

pub fn routes() -> Vec<Route> {
    routes![get_professors, get_professors_by_id, post_professor_comment, get_professor_comments]
}

#[derive(Serialize)]
struct Professor {
    id: i32,
    name: String,
    grade: f64,
    department: Option<String>,
    courses: Option<Vec<String>>
}

#[get("/professors")]
async fn get_professors(pool: &State<Pool<Postgres>>) -> Result<Json<Vec<Professor>>, Status> {
    let result = query!(
        r#"
        SELECT teachers.id, teachers.name, teachers.grade, teachers.department,
               array_agg(courses.name) AS courses
        FROM teachers
        LEFT JOIN teachers_courses ON teachers.id = teachers_courses.profesor_id
        LEFT JOIN courses ON teachers_courses.cursos_id = courses.id
        GROUP BY teachers.id;
        "#
    )
    .fetch_all(pool.inner())
    .await;

    match result {
        Ok(records) => {
            let professors: Vec<Professor> = records
                .into_iter()
                .map(|record| Professor {
                    id: record.id,
                    name: record.name,
                    grade: record.grade,
                    department: record.department,
                    courses: Some(record.courses.unwrap_or_default()),
                })
                .collect();
            Ok(Json(professors))
        }
        Err(_) => Err(Status::InternalServerError),
    }
}

#[get("/professors?<id>")]
async fn get_professors_by_id(pool: &State<Pool<Postgres>>, id: i32) -> Result<Json<Professor>, Status> {
    let result = query!(
        r#"
        SELECT teachers.id, teachers.name, teachers.grade, array_agg(courses.name) AS courses
        FROM teachers
        JOIN teachers_courses ON teachers.id = teachers_courses.profesor_id
        JOIN courses ON teachers_courses.cursos_id = courses.id
        WHERE teachers.id = $1
        GROUP BY teachers.id;
        "#, id
    )
    .fetch_optional(pool.inner())
    .await;

    match result {
        Ok(Some(record)) => {
            let professor = Professor {
                id: record.id,
                name: record.name,
                grade: record.grade,
                department: None,
                courses: Some(record.courses.unwrap_or_default()),
            };
            Ok(Json(professor))
        }
        Ok(None) => Err(Status::NotFound),
        Err(_) => Err(Status::InternalServerError),
    }
}

#[derive(Deserialize, Debug)]
struct Comment {
    text: String,
}

#[post("/professor/<id>/comments", data = "<comment>")]
async fn post_professor_comment(
    pool: &State<Pool<Postgres>>, id: i32, comment: Json<Comment>, user: AppUser,
) -> Result<Json<Professor>, Status> {
    println!("Adding comment for professor {id} {:#?}", comment);

    let result = query!(
        r#"
        INSERT INTO professor_comments (user_id, profesor_id, text)
        VALUES ($1, $2, $3)
        RETURNING id;
        "#,
        user.id,
        id,
        comment.text
    )
    .fetch_one(pool.inner())
    .await;

    match result {
        Ok(_) => get_professors_by_id(pool, id).await,
        Err(_) => Err(Status::InternalServerError),
    }
}

#[get("/professor/<id>/comments")]
async fn get_professor_comments(pool: &State<Pool<Postgres>>, id: i32) -> Result<serde_json::Value, Status> {
    let result = query!(
        r#"
        SELECT
            professor_comments.id as comment_id,
            professor_comments.text as comment_text,
            professor_comments.user_id as comment_user_id,
            professor_comments.profesor_id as comment_profesor_id,
            users.id as users_id,
            users.name as user_name,
            users.email as user_email,
            users.hashed_pass as user_hashed_pass,
            users.salt as user_salt,
            users.active as user_active,
            users.is_admin as user_is_admin,
            users.is_banned as user_is_banned
        FROM professor_comments
        NATURAL JOIN users
        WHERE profesor_id = $1;
        "#, id
    )
    .fetch_all(pool.inner())
    .await;

    match result {
        Ok(comments) => {
            let comments = comments.iter().map(|comment| {
                json!({
                    "id": comment.comment_id,
                    "text": comment.comment_text,
                    "user": {
                        "id": comment.users_id,
                        "name": comment.user_name,
                        "email": comment.user_email,
                        "active": comment.user_active,
                        "is_admin": comment.user_is_admin,
                        "is_banned": comment.user_is_banned
                    }
                })
            }).collect::<Vec<Value>>();
            Ok(json!(comments))
        }
        Err(_) => Err(Status::InternalServerError),
    }
}
