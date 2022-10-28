import CaptchaSolver from "./captchaSolver";
import { Page } from "puppeteer-core";

async function handleConnection(page: Page, config: any) {
  let frames = await page.frames();

  console.log("Waiting for DOM load");
  setTimeout(async () => {
    let pageadata = await page.evaluate(
      //@ts-ignore
      () => document.querySelector("*").outerHTML
    );

    let siteKey: string;

    if (pageadata.includes("https://www.google.com/recaptcha/api2/anchor")) {
      let pageData = pageadata.split('"');
      let upURL = pageData.find((i) =>
        i.includes("https://www.google.com/recaptcha/api2/")
      );

      let url = new URL(upURL as string);

      siteKey = url.searchParams.get("amp;k") as string;
    } else {
      siteKey = "";
    }

    let frame = frames.find(async (f) => (await f.name()) == "reCAPTCHA");

    if (frame) {
      console.log("Found a captcha");

      let url = new URL(frame.url());

      let captchaGod = new CaptchaSolver(siteKey as string);

      await captchaGod.solve();

      captchaGod.on("solving", () => {
        console.log("Solving");
      });

      captchaGod.on("solved", async (key: string) => {
        console.log("Solved captcha: ", key);
        //2. TODO: weird error, sometimes cannot find #g-recaptcha-response
        await page.$eval(
          "#g-recaptcha-response",
          (i, key) => {
            console.log(key);
            i.textContent = key;
          },
          key
        );

        //1. TODO: Doesn't seem to post the key, captcha doesn't go away when solved.
        await new Promise((r) => setTimeout(r, 3000));

        let randomMessage = config.messages[
          Math.floor(Math.random() * config.messages.length)
        ] as string;

        debugger;
        console.log("Sending message");
        await page.focus(".chatmsg");
        await page.keyboard.type(`${randomMessage}`);
        await page.keyboard.press("Enter");

        await new Promise((r) => setTimeout(r, 3000));

        console.log("Screenshotting");
        await page.screenshot({ path: `./tmp/${Date.now()}.png` });

        console.log("Disconnecting");
        await page.click(".disconnectbtn");
        await page.click(".disconnectbtn");

        setTimeout(async () => {
          await page.click(".disconnectbtn");
          handleConnection(page, config);
        }, 3000);
      });
    } else if (!frame) {
      await new Promise((r) => setTimeout(r, 3000));

      let randomMessage = config.messages[
        Math.floor(Math.random() * config.messages.length)
      ] as string;

      console.log("Sending message");
      await page.focus(".chatmsg");
      await page.keyboard.type(`${randomMessage}`);
      await page.keyboard.press("Enter");

      await new Promise((r) => setTimeout(r, 3000));

      console.log("Screenshotting");
      await page.screenshot({ path: `./tmp/${Date.now()}.png` });

      console.log("Disconnecting");
      await page.click(".disconnectbtn");
      await page.click(".disconnectbtn");

      setTimeout(async () => {
        await page.click(".disconnectbtn");
        handleConnection(page, config);
      }, 3000);
    }
  }, 3000);

  // while (await page.$(".sendbtn[disabled]")) {
  //   console.log("Waiting to connect");
  // }

  // } else {
  //   new Promise((r) => setTimeout(r, 3000));

  //   let randomMessage = config.messages[
  //     Math.floor(Math.random() * config.messages.length)
  //   ] as string;

  //   console.log("Sending message");
  //   await page.focus(".chatmsg");
  //   await page.keyboard.type(`${randomMessage}`);
  //   await page.keyboard.press("Enter");

  //   new Promise((r) => setTimeout(r, 3000));

  //   console.log("Screenshotting");
  //   await page.screenshot({ path: `./tmp/${Date.now()}.png` });

  //   console.log("Disconnecting");
  //   await page.click(".disconnectbtn");
  //   await page.click(".disconnectbtn");

  //   setTimeout(async () => {
  //     await page.click(".disconnectbtn");
  //     sendMessage(page, config);
  //   }, 2000);
  // }
}

export default handleConnection;
