const axios = require("axios");
const { user_agent } = require("../config");
const { EventEmitter } = require("events");

const SOLVE_ENDPOINT = (sitekey: any, data: any, userAgent: any) =>
  "http://2captcha.com/in.php?key=6LekMVAUAAAAAPDp1Cn7YMzjZynSb9csmX5V4a9P&method=userrecaptcha&googlekey=6Le-wvkSVVABCPBMRTvw0Q4Muexq1bi0DJwx_mJ-&pageurl=https://omegle.com";
const CHECK_ENDPOINT = (requestID: any) =>
  "http://2captcha.com/res.php?key=6LekMVAUAAAAAPDp1Cn7YMzjZynSb9csmX5V4a9P&method=hcaptcha&id=${requestID}&json=1&action=get";

class CaptchaSolver extends EventEmitter {
  constructor(sitekey: string, data = "") {
    super();
    this.sitekey = sitekey;
    this.data = data;
    this.request_id = null;
    this.solved_key = null;
    this.timeout = 5000;
  }

  async check() {
    if (!this.request_id) throw new Error("No request id provided!");

    console.log("Checking status of captcha " + this.request_id);
    let res = await axios
      .get(CHECK_ENDPOINT(this.request_id))
      .then((res: { data: any }) => res.data)
      .catch((err: any) => null);

    if (res.status == 0) {
      this.timer();
      console.log(res);
    } else if (res.status == 1) {
      this.solved_key = res.request;
      this.emit("solved", res.request);
    }

    return this;
  }

  async solve() {
    let res = await axios
      .post(SOLVE_ENDPOINT(this.sitekey, this.data, user_agent[0]))
      .then((res: { data: any }) => res.data)
      .catch((err: any) => null);

    if (res.status == 1) {
      this.request_id = res.request;
      this.emit("solving", res.request);
      this.timer();
    }

    return this;
  }

  timer() {
    setTimeout(() => {
      this.check();
    }, this.timeout);
  }
}

export default CaptchaSolver;
