use rocket::serde::json::Json;
use rocket::{serde, Route, State};
use rocket::http::Status;
use sqlx::query;
use sqlx::Postgres;
use sqlx::Pool;

use hmac::{Hmac, Mac};
use jwt::SignWithKey;
use sha2::Sha256;
use std::collections::BTreeMap;
use std::env;

use rocket::serde::Deserialize;
use serde::Serialize;

use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHasher, SaltString
    },
    Argon2,
};

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

#[allow(dead_code)]
pub struct AppUser {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub hashed_pass: String,
    pub salt: String,
    pub active: bool,
    pub is_admin: bool,
    pub is_banned: bool,
}

#[derive(Debug, Deserialize, Serialize)]
struct LoginPayload {
    email: String,
    password: String,
}

#[derive(Serialize)]
struct LoginResponse {
    message: &'static str,
    token: String,
}

pub fn routes() -> Vec<Route> {
    routes![create_user, options, login_user]
}

fn generate_token(subject: &str) -> Result<String, Box<dyn std::error::Error>> {
    let secret = env::var("JWT_SECRET")?;
    let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes())?;
    let mut claims = BTreeMap::new();
    claims.insert("sub", subject);

    let expiration = (chrono::Utc::now().timestamp() + 6 * 3600) as u64; // 6 hours in seconds
    let binding = expiration.to_string();
    claims.insert("exp", &binding);

    let token_str = claims.sign_with_key(&key)?;
    Ok(token_str)
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

    let result = query!(
        r#"
        INSERT INTO users (name, email, hashed_pass, salt, active, is_admin, is_banned)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        "#,
        new_user.name,
        new_user.email,
        hashed_pass,
        salt.to_string(),
        new_user.active,
        new_user.is_admin,
        new_user.is_banned,
    )
    .execute(pool.inner())
    .await;

    match result {
        Ok(_) => {
            Ok(Status::Created)
        },
        Err(e) => {
            println!("Failed to insert user: {:?}", e);
            Err(Status::Conflict)
        }
    }
}

#[post("/login", data = "<user>")]
async fn login_user(pool: &State<Pool<Postgres>>, user: Json<LoginPayload>) -> Result<Json<LoginResponse>, Status> {
    let result = query!(
        r#"
        SELECT hashed_pass, salt, active FROM users WHERE email = $1
        "#,
        user.email
    )
    .fetch_optional(pool.inner())
    .await;

    match result {
        Ok(Some(record)) if record.active => {
            let old_salt = SaltString::from_b64(&record.salt).map_err(|_| Status::InternalServerError)?;
            let verify_pass = hash_pass(&user.password, &old_salt);

            if verify_pass == record.hashed_pass {
                let token = generate_token(&user.email).map_err(|_| Status::InternalServerError)?;

                let response = LoginResponse {
                    message: "Login successful",
                    token,
                };
                Ok(Json(response))
            } else {
                Err(Status::Unauthorized)
            }
        }
        Ok(Some(_)) => Err(Status::NotAcceptable), // User not active
        Ok(None) => Err(Status::NotFound), // No user found
        Err(_) => Err(Status::InternalServerError),
    }
}

#[options("/")]
fn options() -> Status {
    Status::Ok
}

fn default_active() -> bool {
    true
}

fn default_is_admin() -> bool {
    false
}

fn default_is_banned() -> bool {
    false
}
