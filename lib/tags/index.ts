import config from "../../config";
import useProxy from "puppeteer-page-proxy";
import handleChat from "../chat";

export default async function tags(page: any) {
  await page.setRequestInterception(true);

  await useProxy(page, config.proxy_url);

  const proxy = await useProxy.lookup(page);
  console.log("Proxy IP: " + proxy.ip);
  
  console.log("Visiting website");
  await page.goto("https://www.omegle.com", { waitUntil: "load", timeout: 0 });
  await page.focus(".newtopicinput");

  await Promise.all(
    config.keyword.map(async (i) => {
      console.log(`Entering tag: ${i}`);
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

  console.log("Confirming TOS");
  for (const el of confirm) {
    d++;
    if (d == 3) await el.click();
  }

  return;
}
