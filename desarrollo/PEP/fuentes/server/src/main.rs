use rocket::http::uri::Origin;
use dotenvy::dotenv;
use sqlx::Postgres;
use sqlx::Pool;

#[macro_use] extern crate rocket;

mod db;
mod api;

const GPTHOLA: Origin<'static> = uri!("/profesoft");

#[get("/")]
async fn index(pool: &rocket::State<Pool<Postgres>>) -> Result<&'static str, rocket::response::status::Custom<&'static str>> {
    let test_result = db::pool::test_connection(pool).await;

    match test_result {
        Ok(_) => Ok("Connected to the db"),
        Err(_) => Err(rocket::response::status::Custom(rocket::http::Status::InternalServerError, "Failed to execute test query")),
    }
}


#[launch]
async fn rocket() -> _ {
    dotenv().expect("No .env file");

    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    let pool = db::pool::create_pool(&database_url).await.unwrap();

    rocket::build()
        .manage(pool)
        .mount(GPTHOLA, routes![index])
        .mount(GPTHOLA, api::user_management::routes())
}