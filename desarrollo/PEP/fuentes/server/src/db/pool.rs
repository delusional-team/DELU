use sqlx::{Error as SqlxError, Pool, Postgres};
use std::thread::available_parallelism;

pub async fn create_pool(database_url: &str) -> Result<Pool<Postgres>, SqlxError> {
    let pool = sqlx::postgres::PgPoolOptions::new()
        .acquire_timeout(std::time::Duration::from_secs(15))
        .max_connections(available_parallelism().unwrap().get() as u32)
        .connect(database_url)
        .await?;

    Ok(pool)
}

pub async fn test_connection(pool: &Pool<Postgres>) -> Result<(), SqlxError> {
    let row: (i32,) = sqlx::query_as("SELECT 1")
        .fetch_one(pool)
        .await?;
    
    println!("Test connection result: {}", row.0);
    Ok(())
}