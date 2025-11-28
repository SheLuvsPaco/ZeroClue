use anyhow::{anyhow, Result};
use clap::Parser;
use image::ImageEncoder;
use image::{codecs::png::PngEncoder, ExtendedColorType, GrayImage, Luma};
use qrcode::{Color as QrColor, EcLevel, QrCode};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::{
    fs,
    io::{Cursor, Write},
    path::PathBuf,
};
use termcolor::{Color, ColorChoice, ColorSpec, StandardStream, WriteColor};
use uuid::Uuid;

#[derive(Parser, Debug)]
#[command(name = "admin_cli", about = "ZeroChat admin helper")]
struct Args {
    #[arg(long)]
    username: String,

    #[arg(long, default_value = "http://localhost:8080")]
    base: String,

    #[arg(long)]
    out_token: Option<PathBuf>,

    #[arg(long)]
    out_qr: Option<PathBuf>,

    #[arg(long, default_value_t = 60)]
    ttl: i64,

    #[arg(long, default_value = "install")]
    purpose: String,
}

#[derive(Serialize, Deserialize)]
struct CreateUserReq {
    username: String,
}

#[derive(Serialize, Deserialize)]
struct CreateUserResp {
    user_id: Uuid,
}

#[derive(Serialize, Deserialize)]
struct ProvisionCreateReq {
    user_id: Uuid,
    purpose: String,
    ttl_minutes: Option<i64>,
}

#[derive(Serialize, Deserialize)]
struct ProvisionCreateResp {
    token: String,
    expires_at: String,
}

fn admin_token() -> Result<String> {
    std::env::var("ADMIN_TOKEN").map_err(|_| anyhow!("Set ADMIN_TOKEN in your environment"))
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();
    let http = Client::new();
    let admin = admin_token()?;

    let user_id = http
        .post(format!("{}/api/users", args.base))
        .header("x-admin-token", &admin)
        .json(&CreateUserReq {
            username: args.username.clone(),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<CreateUserResp>()
        .await?
        .user_id;

    let resp = http
        .post(format!("{}/api/provision/create", args.base))
        .header("x-admin-token", admin)
        .json(&ProvisionCreateReq {
            user_id,
            purpose: args.purpose.clone(),
            ttl_minutes: Some(args.ttl),
        })
        .send()
        .await?
        .error_for_status()?
        .json::<ProvisionCreateResp>()
        .await?;

    let token = resp.token;
    let base = args.base;
    let deeplink = format!(
        "zerochat://provision?token={}&base={}",
        token,
        urlencoding::encode(&base)
    );

    let mut stdout = StandardStream::stdout(ColorChoice::Always);
    stdout.set_color(ColorSpec::new().set_fg(Some(Color::Cyan)).set_bold(true))?;
    writeln!(&mut stdout, "\nUser: {}", args.username)?;
    writeln!(&mut stdout, "User ID: {}", user_id)?;
    stdout.set_color(ColorSpec::new().set_fg(Some(Color::Green)).set_bold(true))?;
    writeln!(&mut stdout, "\nDeeplink: {}", deeplink)?;
    stdout.reset()?;

    let code = QrCode::with_error_correction_level(deeplink.as_bytes(), EcLevel::M)?;
    let qr_string = code
        .render::<char>()
        .light_color(' ')
        .dark_color('█')
        .quiet_zone(true)
        .module_dimensions(2, 1)
        .build();
    println!("\n{}", qr_string);

    if let Some(path) = args.out_token {
        fs::write(path, &token)?;
    }

    if let Some(path) = args.out_qr {
        let modules = code.width() as u32;
        let scale = 8u32;
        let size = modules * scale;
        let mut img: GrayImage = GrayImage::new(size, size);
        for (idx, color) in code.to_colors().into_iter().enumerate() {
            let mx = (idx as u32) % modules;
            let my = (idx as u32) / modules;
            let val = if color == QrColor::Dark { 0u8 } else { 255u8 };
            for dx in 0..scale {
                for dy in 0..scale {
                    img.put_pixel(mx * scale + dx, my * scale + dy, Luma([val]));
                }
            }
        }
        let mut buf = Vec::new();
        {
            let mut cursor = Cursor::new(&mut buf);
            PngEncoder::new(&mut cursor).write_image(
                img.as_raw(),
                img.width(),
                img.height(),
                ExtendedColorType::L8,
            )?;
        }
        fs::write(path, &buf)?;
    }

    Ok(())
}
