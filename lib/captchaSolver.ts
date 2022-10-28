import axios from "axios";
import config from "../config";
import { EventEmitter } from "events";

const SOLVE_ENDPOINT = (sitekey: string, data: any, userAgent: string) =>
  `http://2captcha.com/in.php?key=${config._2captchaKey}&method=userrecaptcha&googlekey=${sitekey}&pageurl=https://omegle.com&json=1`;
const CHECK_ENDPOINT = (requestID: any) =>
  `http://2captcha.com/res.php?key=${config._2captchaKey}&method=hcaptcha&id=${requestID}&json=1&action=get`;

/*
 * Thank you <github/WindowsCMD> <3
 */
class CaptchaSolver extends EventEmitter {
  sitekey: string;
  data: any;
  request_id: any;
  solved_key: any;
  timeout: number;

  constructor(sitekey: any, data = "") {
    super();
    this.sitekey = sitekey;
    this.data = data;
    this.request_id = null;
    this.solved_key = null;
    this.timeout = 5000;
  }

  async check() {
    if (!this.request_id) throw new Error("No request id provided!");

    console.log("Checking status of captcha: " + this.request_id);
    let res = await axios
      .get(CHECK_ENDPOINT(this.request_id))
      .then((res) => res.data)
      .catch((err: any) => null);

    if (res.status == 0) {
      this.timer();
      console.log(res);
    } else if (res.status == 1) {
      this.solved_key = res.request;
      this.emit("Solved", res.request);
    }

    return this;
  }

  async solve() {
    let res = await axios
      .post(SOLVE_ENDPOINT(this.sitekey, this.data, config.user_agent[0]))
      .then((res) => res.data)
      .catch((err: any) => {
        console.log(err);
        return null;
      });

    console.log("Status: ", res.status);

    if (res.status == 1) {
      this.request_id = res.request;
      this.emit("Solving", res.request);
      this.timer();
    }

    return this;
  }

  timer() {
    console.log("Captcha timer is getting called");
    setTimeout(() => {
      console.log("Timer uwu");
      this.check();
    }, this.timeout);
  }
}

export default CaptchaSolver;
