import config from "../config";
import puppeteer from "puppeteer-extra";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import constructChat from "./tags";
import handleChat from "./chat";

export default class OmegleFuery {
  page: any;
  browser: any;
  
  constructor() {
    this.initPlugins();
    this.buildBrowser();
  }

  async initPlugins() {
    puppeteer.use(
      RecaptchaPlugin({
        provider: {
          id: "2captcha",
          token: config._2captchaKey,
        },
        visualFeedback: true,
      })
    );
  }

  async buildBrowser() {
    console.log("Launching browser");

    this.browser = await puppeteer.launch({
      headless: config.headless,
      executablePath: config.chrome_exe_path,
      args: ["--disable-web-security"],
    });

    this.page = await this.browser.newPage();

    await constructChat(this.page);
    await handleChat(this.page);
  }
}
