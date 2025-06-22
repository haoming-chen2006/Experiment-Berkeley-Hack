# Unify Hackathon Demo

This project contains a small demo of the **planning agent** approach used in [Unify](https://github.com/unifyai). The agent can open a browser, search the web and create an email draft based on your resume.

## Setup

1. Install the dependencies using [uv](https://github.com/astral-sh/uv):

   ```bash
   uv sync
   ```

2. Playwright requires a one‑time download of its browser binaries. Run:

   ```bash
   uv run playwright install
   ```

   Without this step you'll see an error like `BrowserType.launch: Executable doesn't exist`.

3. (Optional) To run your existing Chrome profile with remote debugging enabled execute:

   ```bash
   ./start_chrome_debug.sh
   ```

   The agent will try to connect to Chrome on port `9222` and fall back to Playwright's Chromium if it cannot.

4. Adjust values in `specialized_agents/constants.py` such as `RESUME_PATH` and `JOB_PAGE_URL` so the agent uses your resume and the job posting you want.

5. Run the planning agent:

   ```bash
   uv run -m specialized_agents.planning_agent
   ```

The agent will orchestrate a research tool and a computer tool to browse the web and draft an email. Set the SMTP environment variables (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_TO`, `SMTP_PORT`) if you want the demo email functionality.
