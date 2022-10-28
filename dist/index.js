"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const config_1 = __importDefault(require("./config"));
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Launching browser");
        let browser = yield puppeteer_core_1.default.launch({
            headless: true,
            executablePath: "/usr/bin/chromium-browser",
        });
        let page = yield browser.newPage();
        new Promise((r) => setTimeout(r, 1000));
        console.log("Visiting website");
        yield page.goto("https://www.omegle.com");
        yield page.$eval(".newtopicinput", (el) => (el.value = config_1.default.keyword));
        yield page.click("#textbtn");
        const elHandleArray = yield page.$$("div div p label");
        for (const el of elHandleArray) {
            yield el.click();
        }
        const confirm = yield page.$$("div div p input");
        var d = 0;
        console.log("Confirming chat request");
        for (const el of confirm) {
            d++;
            if (d == 3)
                yield el.click();
        }
        yield page.waitForTimeout(2000);
        do {
            let randomMessage = config_1.default.messages[Math.floor(Math.random() * config_1.default.messages.length)];
            console.log("Sending message");
            yield page.$eval(".chatmsg ", (el) => (el.value = randomMessage));
            yield page.keyboard.press("Enter");
            new Promise((r) => setTimeout(r, 2000));
            console.log("Disconnecting");
            yield page.click(".disconnectbtn");
            yield page.click(".disconnectbtn");
            yield page.click(".disconnectbtn");
            while ((yield page.$(".sendbtn[disabled]")) !== null) {
                new Promise((r) => setTimeout(r, 3000));
                yield page.click(".disconnectbtn");
            }
        } while (true);
    });
}
exports.default = init;
init();
