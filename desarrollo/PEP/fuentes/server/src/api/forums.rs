use rocket::serde::json::Json;
use rocket::{serde, Route, State};
use rocket::http::Status;
use sqlx::{query, Pool, Postgres};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
struct ForumPost {
    id: i32,
    title: String,
    upvotes: i32,
    content: String,
    user: UserInfo,
}

#[derive(Debug, Deserialize, Serialize)]
struct UserInfo {
    id: i32,
    name: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct NewForumPost {
    title: String,
    content: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct Comment {
    id: i32,
    user: UserInfo,
    text: String,
    upvotes: i32,
}

#[derive(Debug, Deserialize, Serialize)]
struct NewComment {
    text: String,
}

#[get("/forum/posts")]
async fn get_forum_posts(pool: &State<Pool<Postgres>>) -> Result<Json<Vec<ForumPost>>, Status> {
    let forums = query!(
        r#"
        SELECT f.id, f.title, f.content, f.upvotes, u.id AS user_id, u.name AS user_name
        FROM forum f
        JOIN users u ON f.user_id = u.id
        WHERE f.upvotes IS NOT NULL
        "#
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|_| Status::InternalServerError)?;

    let data: Vec<ForumPost> = forums
        .into_iter()
        .map(|f| ForumPost {
            id: f.id,
            title: f.title,
            upvotes: f.upvotes.unwrap_or(0), // default to 0 if upvotes is NULL
            content: f.content,
            user: UserInfo {
                id: f.user_id,
                name: f.user_name,
            },
        })
        .collect();

    Ok(Json(data))
}

#[get("/forum/posts/<id>")]
async fn get_forum_post(pool: &State<Pool<Postgres>>, id: i32) -> Result<Json<ForumPost>, Status> {
    let forum = query!(
        r#"
        SELECT f.id, f.title, f.content, f.upvotes, u.id AS user_id, u.name AS user_name
        FROM forum f
        JOIN users u ON f.user_id = u.id
        WHERE f.id = $1
        "#,
        id
    )
    .fetch_one(pool.inner())
    .await
    .map_err(|_| Status::NotFound)?;

    let post = ForumPost {
        id: forum.id,
        title: forum.title,
        upvotes: forum.upvotes.unwrap_or(0),
        content: forum.content,
        user: UserInfo {
            id: forum.user_id,
            name: forum.user_name,
        },
    };

    Ok(Json(post))
}

#[post("/forum/posts?<user_id>", data = "<new_post>")]
async fn create_forum_post(
    pool: &State<Pool<Postgres>>,
    new_post: Json<NewForumPost>,
    user_id: i32, // TODO: use auth guard
) -> Result<Status, Status> {
    query!(
        r#"
        INSERT INTO forum (title, content, user_id, upvotes, date)
        VALUES ($1, $2, $3, 0, CURRENT_DATE)
        "#,
        new_post.title,
        new_post.content,
        user_id
    )
    .execute(pool.inner())
    .await
    .map_err(|_| Status::InternalServerError)?;

    Ok(Status::Created)
}

#[get("/forum/posts/<id>/comments")]
async fn get_comments_for_post(
    pool: &State<Pool<Postgres>>,
    id: i32,
) -> Result<Json<Vec<Comment>>, Status> {
    let comments = query!(
        r#"
        SELECT c.id, c.text, c.upvotes, u.id AS user_id, u.name AS user_name
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.forum_id = $1
        "#,
        id
    )
    .fetch_all(pool.inner())
    .await
    .map_err(|_| Status::NotFound)?;

    let data: Vec<Comment> = comments
        .into_iter()
        .map(|c| Comment {
            id: c.id,
            user: UserInfo {
                id: c.user_id,
                name: c.user_name,
            },
            text: c.text,
            upvotes: c.upvotes,
        })
        .collect();

    Ok(Json(data))
}

#[post("/forum/posts/<id>/comments?<user_id>", data = "<new_comment>")]
async fn create_comment_for_post(
    pool: &State<Pool<Postgres>>,
    id: i32,
    new_comment: Json<NewComment>,
    user_id: i32, // TODO: use auth guard
) -> Result<Status, Status> {
    // Check if the post exists first
    query!("SELECT id FROM forum WHERE id = $1", id)
        .fetch_one(pool.inner())
        .await
        .map_err(|_| Status::NotFound)?;

    query!(
        r#"
        INSERT INTO comments (text, upvotes, user_id, forum_id)
        VALUES ($1, 0, $2, $3)
        "#,
        new_comment.text,
        user_id,
        id
    )
    .execute(pool.inner())
    .await
    .map_err(|_| Status::InternalServerError)?;

    Ok(Status::Created)
}

pub fn routes() -> Vec<Route> {
    routes![
        get_forum_posts,
        get_forum_post,
        create_forum_post,
        get_comments_for_post,
        create_comment_for_post,
    ]
}
