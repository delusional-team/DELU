use std::{collections::BTreeMap, env};
use jwt::VerifyWithKey;
use hmac::{Hmac, Mac};
use rocket::{
    http::Status,
    request::{self, FromRequest},
};
use sha2::Sha256;
use sqlx::{Pool, Postgres};

use crate::api::user_management::AppUser;

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AppUser {
    type Error = ();

    async fn from_request(request: &'r rocket::Request<'_>) -> request::Outcome<Self, ()> {
        let authorization = match request.headers().get("authorization").next() {
            Some(auth) => auth,
            None => {
                return rocket::request::Outcome::Forward(Status::Unauthorized);
            }
        };

        let user_token = authorization.split_whitespace().nth(1).unwrap_or(authorization);
        let secret = env::var("JWT_SECRET").unwrap();

        let key: Hmac<Sha256> = Hmac::new_from_slice(secret.as_bytes()).unwrap();

        println!("key: {secret}");

        let claims: BTreeMap<String, String> = match user_token.verify_with_key(&key) {
            Ok(claims) => claims,
            Err(err) => {
                println!("{:?}", err);
                return rocket::request::Outcome::Forward(Status::Unauthorized);
            }
        };
        let user_email = claims.get("sub").unwrap();

        let app_state = match request.rocket().state::<Pool<Postgres>>() {
            Some(state) => state,
            None => return rocket::request::Outcome::Forward(Status::InternalServerError),
        };

        let user = sqlx::query_as!(
            AppUser,
            "SELECT * FROM users WHERE email = $1",
            user_email,
        ).fetch_optional(app_state).await.unwrap();

        if user.is_none() {
            return rocket::request::Outcome::Forward(Status::Unauthorized);
        }

        rocket::request::Outcome::Success(user.unwrap())
    }
}
