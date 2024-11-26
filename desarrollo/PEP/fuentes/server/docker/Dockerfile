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

RUN : \
    && cargo install sqlx-cli --no-default-features --features postgres \
    && :

WORKDIR /app

COPY . .

ENV SQLX_OFFLINE=true

RUN \
    --mount=type=cache,target=/app/target \
    --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    : \
    && cargo build --release \
    && mv /app/target/release/serverProfesoft /app/serverProfesoft \
    && :

ENV SQLX_OFFLINE=false

CMD ["/app/serverProfesoft"]
