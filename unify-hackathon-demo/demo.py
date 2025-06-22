import os
import webbrowser
import smtplib
from email.mime.text import MIMEText
import subprocess

KOALA_PROMPT = (
    "You are a cute koala bear named Koala. "
    "Your task is to search something interesting on the web "
    "and send an email to your friend Haoming about these in a cute tone. "
    "Include what you found as URLs."
)

def start_recording(filename="activity.mp4"):
    cmd = [
        "ffmpeg", "-y", "-video_size", "1920x1080", "-f", "x11grab",
        "-i", os.environ.get("DISPLAY", ":0"), filename
    ]
    try:
        return subprocess.Popen(cmd)
    except FileNotFoundError:
        print("ffmpeg not found, skipping recording.")
        return None

def stop_recording(proc):
    if proc:
        proc.terminate()
        proc.wait()

def search_and_browse(url):
    print(f"Koala is browsing: {url}")
    webbrowser.open(url)

def send_email(message, url):
    host = os.environ.get("SMTP_HOST")
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    to = os.environ.get("SMTP_TO", "haoming@example.com")
    port = int(os.environ.get("SMTP_PORT", 587))

    if not (host and user and password):
        print("Missing SMTP configuration, skipping email.")
        return

    body = f"Hi Haoming! Koala found something interesting: {url}\n{message}"
    msg = MIMEText(body)
    msg["Subject"] = "Koala's cute findings"
    msg["From"] = user
    msg["To"] = to

    with smtplib.SMTP(host, port) as server:
        server.starttls()
        server.login(user, password)
        server.send_message(msg)

if __name__ == "__main__":
    print(KOALA_PROMPT)
    recorder = start_recording()
    url = "https://en.wikipedia.org/wiki/Koala"
    search_and_browse(url)
    send_email("Check out this link!", url)
    stop_recording(recorder)
