use rocket::serde::json::Json;
use rocket::{serde, Route, State};
use rocket::http::Status;
use sqlx::{query, Error as SqlxError};
use sqlx::Postgres;
use sqlx::Pool;

use rocket::serde::Deserialize;
use serde::Serialize;

use argon2::{
    password_hash::{
        rand_core::OsRng,
        PasswordHash, PasswordHasher, PasswordVerifier, SaltString
    },
    Argon2
};

#[derive(Debug, Deserialize, Serialize)]
struct NewUser {
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

pub fn routes() -> Vec<Route> {
    routes![create_user, options]
}

// Generates a salt
fn salting() -> SaltString {
    SaltString::generate(&mut OsRng)
}

// Function to hash the password with the generated salt
fn hash_pass(password: &str, salt: &SaltString) -> String {
    let argon = Argon2::default();
    argon.hash_password(password.as_bytes(), salt).unwrap().to_string()
}

#[post("/register", data = "<new_user>")]
async fn create_user(pool: &State<Pool<Postgres>>, new_user: Json<NewUser>) -> Result<Status, Status>{
    let salt = salting();
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
        new_user.is_banned
    )
    .execute(pool.inner())
    .await;

    match result {
        Ok(_) => Ok(Status::Created),
        Err(e) => {
            println!("Failed to insert user: {:?}", e);
            Err(Status::InternalServerError)
        }
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