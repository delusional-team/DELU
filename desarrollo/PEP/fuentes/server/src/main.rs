use rocket::http::uri::Origin;
use dotenvy::dotenv;
use sqlx::Postgres;
use sqlx::Pool;

use rocket::config::{Ident, LogLevel};
use rocket::data::{Limits, ToByteUnit};
use rocket::Config;

#[macro_use] extern crate rocket;

mod db;
mod api;
mod guards;

const PROFESOFT: Origin<'static> = uri!("/profesoft");

#[get("/")]
async fn index(pool: &rocket::State<Pool<Postgres>>) -> Result<&'static str, rocket::response::status::Custom<&'static str>> {
    let test_result = db::pool::test_connection(pool).await;

    match test_result {
        Ok(_) => Ok("Connected to the db"),
        Err(_) => Err(rocket::response::status::Custom(rocket::http::Status::InternalServerError, "Failed to execute test query")),
    }
}

pub const PORT: u16 = 6969;

#[launch]
async fn rocket() -> _ {
    dotenv().expect("No .env file");

    let config = Config {
        port: PORT,
        address: [0, 0, 0, 0].into(),
        ident: Ident::none(),
        log_level: LogLevel::Normal,
        limits: Limits::new()
            .limit("forms", 16.mebibytes())
            .limit("json", 32.mebibytes()),
        ..Config::default()
    };
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    println!("{}", database_url);
    let pool = db::pool::create_pool(&database_url).await.unwrap();

    rocket::build()
        .configure(config)
        .attach(api::fairings::Cors)
        .manage(pool)
        .mount(PROFESOFT, routes![index])
        .mount(PROFESOFT, api::user_management::routes())
        .mount(PROFESOFT, api::forums::routes())
        .mount(PROFESOFT, api::professors::routes())
}
