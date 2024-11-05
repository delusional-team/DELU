use rocket::serde::json::Json;
use rocket::{serde, Route, State};
use rocket::http::Status;
use sqlx::query;
use sqlx::Postgres;
use sqlx::Pool;
use uuid::Uuid;

use rocket::serde::Deserialize;
use serde::Serialize;

use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHasher, SaltString
    },
    Argon2
};

use super::mail;

#[derive(Debug, Deserialize, Serialize)]
struct NewUserPayload {
    name: String,
    email: String,
    password: String,
    #[serde(default = "default_active")]
    active: bool,
    #[serde(default = "default_is_admin")]
    is_admin: bool,
    #[serde(default = "default_is_banned")]
    is_banned: bool,
}

pub struct AppUser {
    id: i32,
    name: String,
    email: String,
    hashed_pass: String,
    salt: String,
    active: bool,
    is_admin: bool,
    is_banned: bool,
    verification_token: String,
}

#[derive(Debug, Deserialize, Serialize)]
struct LoginUserPayload {
    email: String,
    password: String,
}

pub fn routes() -> Vec<Route> {
    routes![create_user, options, verify_user, login_user]
}

// Function to hash the password with the generated salt
fn hash_pass(password: &str, salt: &SaltString) -> String {
    let argon = Argon2::default();
    argon.hash_password(password.as_bytes(), salt).unwrap().to_string()
}

#[post("/register", data = "<new_user>")]
async fn create_user(pool: &State<Pool<Postgres>>, new_user: Json<NewUserPayload>) -> Result<Status, Status>{
    let salt = SaltString::generate(&mut OsRng);
    let hashed_pass = hash_pass(&new_user.password, &salt);
    let verification_token = Uuid::new_v4().to_string();

    let result = query!(
        r#"
        INSERT INTO users (name, email, hashed_pass, salt, active, is_admin, is_banned, verification_token)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        "#,
        new_user.name,
        new_user.email,
        hashed_pass,
        salt.to_string(),
        new_user.active,
        new_user.is_admin,
        new_user.is_banned,
        verification_token
    )
    .execute(pool.inner())
    .await;

    match result {
        Ok(_) => {
            // TODO: Change the hostname
            let verification_url = format!("https://localhost:8000/verify?token={}", verification_token);
            mail::send_email(&new_user.email, &verification_url);
            Ok(Status::Created)
        },
        Err(e) => {
            println!("Failed to insert user: {:?}", e);
            Err(Status::InternalServerError)
        }
    }
}

#[get("/verify?<token>")]
async fn verify_user(pool: &State<Pool<Postgres>>, token: String) -> Result<Status, Status>{
    // Query the database to find a user with the provided token
    let result = query!(
        r#"
        SELECT id FROM users WHERE verification_token = $1
        "#,
        token
    )
    .fetch_optional(pool.inner())
    .await;

    match result {
        Ok(Some(record)) => {
            // Token is valid, update the user to be active
            let update_result = query!(
                r#"
                UPDATE users SET active = true, verification_token = NULL
                WHERE id = $1
                "#,
                record.id
            )
            .execute(pool.inner())
            .await;

            match update_result {
                Ok(_) => Ok(Status::Ok),
                Err(_) => Err(Status::InternalServerError),
            }
        }
        Ok(None) => {
            // Token was not found
            Err(Status::NotFound)
        }
        Err(_) => Err(Status::InternalServerError),
    }
}

#[post("/login", data = "<user>")]
async fn login_user(pool: &State<Pool<Postgres>>, user: Json<LoginUserPayload>) -> Result<Status, Status>{
    // Query the database to find a user with the provided token
    let result = query!(
        r#"
        SELECT hashed_pass, salt, active FROM users WHERE email = $1
        "#,
        user.email
    )
    .fetch_optional(pool.inner())
    .await;

    match result {
        Ok(Some(record)) => {
            if record.active == false {
                Err(Status::NotAcceptable)
            } else {
                let old_salt = SaltString::from_b64(&record.salt).map_err(|_| Status::InternalServerError)?;
                let verify_pass = hash_pass(&user.password, &old_salt);
                if verify_pass == record.hashed_pass {
                    return Ok(Status::Ok)
                } else {
                    return Err(Status::InternalServerError)
                }
            }
        }
        Ok(None) => {
            // No existe tal email
            Err(Status::NotFound)
        }
        Err(_) => Err(Status::InternalServerError),
    }
}

#[options("/")]
fn options() -> Status {
    Status::Ok
}

fn default_active() -> bool {
    false
}

fn default_is_admin() -> bool {
    false 
}

fn default_is_banned() -> bool {
    false 
}
