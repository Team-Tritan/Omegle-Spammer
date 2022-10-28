import puppeteer from "puppeteer-core";
import config from "./config";

(async () => {
  console.log("Launching browser");

  let browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:\\Users\\Administrator.SADMIN\\Desktop\\Chrome\\chrome-win\\chrome.exe",
  });

  async function init() {
    let page = await browser.newPage();

    new Promise((r) => setTimeout(r, 1000));

    console.log("Visiting website");
    await page.goto("https://www.omegle.com");
    await page.focus(".newtopicinput");

    config.keyword.forEach(async (i) => {
      await page.keyboard.type(`${i}`);
      await page.keyboard.press("Enter");
    });

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

    await page.waitForTimeout(2000);

    let randomMessage = config.messages[
      Math.floor(Math.random() * config.messages.length)
    ] as string;

    console.log("Sending message");
    await page.focus(".chatmsg");
    await page.keyboard.type(`${randomMessage}`);
    await page.keyboard.press("Enter");

    console.log("Keyword: ", await page.$(".statuslog"));
    new Promise((r) => setTimeout(r, 2000));

    console.log("Screenshotting");
    await page.screenshot({ path: `./tmp/${Date.now()}.png` });

    console.log("Disconnecting");
    await page.click(".disconnectbtn");
    await page.click(".disconnectbtn");
    await page.click(".disconnectbtn");

    while ((await page.$(".sendbtn[disabled]")) !== null) {
      new Promise((r) => setTimeout(r, 3000));
      await page.click(".disconnectbtn");
      break;
    }

    await page.close();
    init();
  }

  init();
})();
