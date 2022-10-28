import puppeteer from "puppeteer-core";
import config from "./config";

(async () => {
  console.log("Launching browser");

  let browser = await puppeteer.launch({
    headless: false,
    executablePath: config.chrome_exe_path,
  });
  let page = await browser.newPage();

  new Promise((r) => setTimeout(r, 1000));

  console.log("Visiting website");
  await page.goto("https://www.omegle.com");
  await page.focus(".newtopicinput");

  await Promise.all(
    config.keyword.map(async (i) => {
      await page.keyboard.type(`${i}`);
      await page.keyboard.press("Enter");
    })
  );

  await page.click("#textbtn");

  const elHandleArray = await page.$$("div div p label");

  for (const el of elHandleArray) {
    await el.click();
  }

  const confirm = await page.$$("div div p input");
  var d = 0;

  console.log("Confirming chat request");
  for (const el of confirm) {
    d++;
    if (d == 3) await el.click();
  }

  async function sendMessage() {
    while (await page.$(".sendbtn[disabled]")) {
      console.log("Waiting to connect");
    }

    new Promise((r) => setTimeout(r, 3000));

    let randomMessage = config.messages[
      Math.floor(Math.random() * config.messages.length)
    ] as string;

    console.log("Sending message");
    await page.focus(".chatmsg");
    await page.keyboard.type(`${randomMessage}`);
    await page.keyboard.press("Enter");

    new Promise((r) => setTimeout(r, 2000));

    console.log("Screenshotting");
    await page.screenshot({ path: `./tmp/${Date.now()}.png` });
    await page.click(".disconnectbtn");
    await page.click(".disconnectbtn");
  }

  sendMessage();
})();
