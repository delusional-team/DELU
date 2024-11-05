use rocket::{
    http::Status,
    request::{self, FromRequest},
};

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

        let token = authorization.split_whitespace().nth(1).unwrap_or_default();

        rocket::request::Outcome::Success(user)
    }
}
