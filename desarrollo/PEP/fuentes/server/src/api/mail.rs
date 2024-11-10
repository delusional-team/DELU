use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};

pub fn send_email(recipient_email: &str, verification_link: &str) {
    let email = Message::builder()
        .from("FisiBot <fisibot986@gmail.com>".parse().unwrap())
        .reply_to("Support <fisibot986@gmail.com>".parse().unwrap())
        .to(recipient_email.parse().unwrap())
        .subject("Verificación de email")
        .header(ContentType::TEXT_HTML)
        .body(format!(
            "<p>Si este eres tú, verifica tu cuenta haciendo click al siguiente link:</p>
            <a href=\"{verification_link}\">Verificar aquí</a>",
            verification_link = verification_link
        ))
        .unwrap();

    let bot_email = std::env::var("EMAIL").unwrap();
    let bot_password = std::env::var("PASSWORD").unwrap();
    let creds = Credentials::new(bot_email.to_owned(), bot_password.to_owned());

    // Open a remote connection to gmail
    let mailer = SmtpTransport::relay("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .build();

    // Send the email
    match mailer.send(&email) {
        Ok(_) => println!("Verification email sent successfully!"),
        Err(e) => panic!("Could not send verification email: {e:?}"),
    }
}
