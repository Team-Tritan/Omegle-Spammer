import puppeteer from "puppeteer-core";
import config from "./config";

export default async function init() {
  console.log("Launching browser");
  let browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
  });

  let page = await browser.newPage();

  new Promise((r) => setTimeout(r, 1000));

  console.log("Visiting website");
  await page.goto("https://www.omegle.com");

  await page.focus(".newtopicinput");
  await page.keyboard.type(`${config.keyword}`);
  // await page.$eval(
  //   ".newtopicinput",
  //   (el: any) => (el.value = config.keyword as string)
  // );
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

  do {
    let randomMessage = config.messages[
      Math.floor(Math.random() * config.messages.length)
    ] as string;

    console.log("Sending message");
    await page.$eval(".chatmsg ", (el: any) => (el.value = randomMessage));
    await page.keyboard.press("Enter");

    new Promise((r) => setTimeout(r, 2000));

    console.log("Disconnecting");
    await page.click(".disconnectbtn");
    await page.click(".disconnectbtn");
    await page.click(".disconnectbtn");

    while ((await page.$(".sendbtn[disabled]")) !== null) {
      new Promise((r) => setTimeout(r, 3000));
      await page.click(".disconnectbtn");
    }
  } while (true);
}

init();
