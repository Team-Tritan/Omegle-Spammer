import config from "../../config";

export default async function handleChat(page: any) {
  console.log("Waiting for DOM load");
  await new Promise((r) => setTimeout(r, 2000));

  console.log("Connecting to new stranger");
  let bench = Date.now();

  console.log("Checking/solving captchas");
  await page.solveRecaptchas();
  console.log("Connected after", Date.now() - bench + " ms");

  await new Promise((r) => setTimeout(r, 2000));

  let randomMessage = config.messages[
    Math.floor(Math.random() * config.messages.length)
  ] as string;

  console.log("Sending message");
  await page.focus(".chatmsg");
  await page.keyboard.type(`${randomMessage}`);
  await page.keyboard.press("Enter");

  console.log("Screenshotting");
  await page.screenshot({ path: `./tmp/${Date.now()}.png` });

  console.log("Disconnecting");
  await page.click(".disconnectbtn");
  await page.click(".disconnectbtn");

  await page.click(".disconnectbtn");

  handleChat(page);
}
