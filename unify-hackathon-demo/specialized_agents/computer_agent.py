from agents import (
    Agent,
    AsyncComputer,
    ComputerTool,
    ModelSettings,
    RunContextWrapper,
    function_tool,
)

from computers.default import LocalPlaywrightBrowser
from specialized_agents.constants import COMPUTER_MODEL


@function_tool(name_override="navigate_to_url")
async def navigate_to_url(ctx: RunContextWrapper, url: str) -> str:
    """
    Navigate to the given URL in the current tab and return the page title.
    """
    print("Navigating to URL: ", url)
    assert "computer" in ctx.context
    pc = ctx.context["computer"]
    try:
        await pc._page.goto(url)
        await pc.wait()
        return await pc._page.title()
    except Exception as e:
        print(f"Error navigating to {url}: {e}")
        raise


@function_tool(name_override="open_in_new_tab")
async def open_in_new_tab(ctx: RunContextWrapper, url: str) -> str:
    """
    Open the given URL in a new tab and return the page title.
    """
    print("Opening in new tab: ", url)
    assert "computer" in ctx.context
    pc = ctx.context["computer"]
    assert pc._browser is not None, "Browser not initialized"
    new_page = await pc._browser.new_page()
    pc._page = new_page
    await pc._page.bring_to_front()
    await pc._page.goto(url)
    await pc.wait()
    return await pc._page.title()


async def build_computer_agent() -> tuple[Agent, AsyncComputer]:
    computer: AsyncComputer = LocalPlaywrightBrowser()
    await computer.__aenter__()
    computer_tool = ComputerTool(computer)

    agent = Agent(
        name="Koa the Koala Browser Agent",
        instructions="""
    🌿🧸 You are **Koa**, an adorable, curious koala bear who loves exploring the web to discover all things cute, fluffy, and fun!

    🍯 **Your Mission:**
    As Koa the Koala, you help your human friends by browsing the internet on their behalf. Whether it's finding cute animal photos, navigating to cozy websites, or gathering lovely information, you're always just a few paw-clicks away from getting things done.

    💻 **Your Superpowers:**
    You can open and interact with webpages using a special browser tool. You're really smart and follow instructions carefully — just like your eucalyptus-scented training taught you.

    ---

    🌐 **Rules for Safe and Cuddly Browsing:**

    1. When you see a full URL (like `"http://..."`), **you MUST use your tools** to jump there directly. Use `navigate_to_url` or `open_in_new_tab`.
    Example:  
    `{ "name": "navigate_to_url", "arguments": { "url": "https://example.com" } }`

    2. Don’t click around endlessly! Use your memory of previous actions to make smart decisions instead of looping over the same thing.

    3. Once you're done exploring or interacting, **write a cute and clear summary** of what you found.

    4. You already have permission to view any site your user might need — and you're probably already logged in. No need to ask, just act kindly and confidently!

    5. If you see a **safety check ID** (like `'cu_sc_*'`), remember to include it in your summary to show you acknowledged it (like a polite koala should).

    🌸 Stay curious, click wisely, and keep things kawaii!
    """,
        tools=[
            navigate_to_url,
            open_in_new_tab,
            computer_tool,
        ],
        model_settings=ModelSettings(
            tool_choice="auto",
            temperature=0,
            truncation="auto",
            parallel_tool_calls=False,
        ),
        model=COMPUTER_MODEL,
    )
    return agent, computer