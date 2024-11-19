FROM debian:bullseye-slim AS builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    libssl-dev \
    pkg-config \
    build-essential \ 
    && rm -rf /var/lib/apt/lists/*

# Install rustup and set the nightly version of Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup default nightly

WORKDIR /app

# Copy the Cargo.toml and Cargo.lock files to fetch dependencies
COPY Cargo.toml Cargo.lock .sqlx ./

ENV SQLX_OFFLINE=true

RUN cargo fetch

COPY . .

RUN cargo build --release

# Use a minimal runtime image
FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/target/release/serverProfesoft /app/

COPY .env .env

ENV SQLX_OFFLINE=false

CMD ["/app/serverProfesoft"]
