use rocket::http::Status;
use rocket::serde::json::Json;
use rocket::{Route, State};
use ::serde::Serialize;
use sqlx::query;
use sqlx::Postgres;
use sqlx::Pool;

pub fn routes() -> Vec<Route> {
    routes![get_professors, get_professors_by_id]
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
        r#"SELECT * FROM teachers"#
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
                    courses: None
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