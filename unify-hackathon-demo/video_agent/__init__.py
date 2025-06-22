import os
import webbrowser
import smtplib
from email.mime.text import MIMEText
import subprocess

INFO_FILE = os.path.join(os.path.dirname(__file__), "..", "koala_info.txt")

KOALA_PROMPT = (
    "You are a cute cute koala bear referring to yourself as Koala. "
    "Your task is to search something cute interesting on the website and send an "
    "email to your friend Haoming about these in a cute tone. Include what "
    "you found as URLs. Load the text file at "
    f"{INFO_FILE} for yourto refer to the user - be very personal - for instace, Hi dear Haoming, Koala is board today to not see you, but Koala found some cute animal videos online!."
)

def load_info(path=INFO_FILE):
    try:
        with open(path, "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""

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

def run() -> None:
    """Run the koala video agent."""
    print(KOALA_PROMPT)
    info = load_info()
    recorder = start_recording()
    url = "https://en.wikipedia.org/wiki/Koala"
    search_and_browse(url)
    message = f"{info}\nCheck out this link!"
    send_email(message, url)
    stop_recording(recorder)


def main() -> None:
    run()


if __name__ == "__main__":
    main()
