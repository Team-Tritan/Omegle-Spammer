import puppeteer from "puppeteer-core";
import config from "../config";
import handleConnection from "./handleConnection";

/*
 * Init the browser connection and then type in keywords
 */
export default async function initBrowser() {
  console.log("Launching browser");

  let browser = await puppeteer.launch({
    headless: config.headless,
    executablePath: config.chrome_exe_path,
  });

  let page = await browser.newPage();

  new Promise((r) => setTimeout(r, 1000));

  console.log("Visiting website in browser");
  await page.goto("https://www.omegle.com");
  await page.focus(".newtopicinput");

  await Promise.all(
    config.keyword.map(async (i) => {
      await page.keyboard.type(`${i}`);
      await page.keyboard.press("Enter");
    })
  );

  await page.click("#textbtn");

  let elHandleArray = await page.$$("div div p label");

  for (const el of elHandleArray) {
    await el.click();
  }

  const confirm = await page.$$("div div p input");
  var d = 0;

  console.log("Confirming chat request on UI");
  for (const el of confirm) {
    d++;
    if (d == 3) await el.click();
  }

  handleConnection(page, config);
}
