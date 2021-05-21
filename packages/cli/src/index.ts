const fs = require("fs");
const puppeteer = require("puppeteer");

// https://github.com/puppeteer/examples/blob/master/speech.js
const DEFAULT_TXT =
  "Hello there, my name is Puppeteer. I am controlling your browser.";

const executablePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// '/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary';

(async () => {
  const browser = await puppeteer.launch({
    executablePath, // Note: need Chrome (not Chromium) to use non-default voices.
    headless: false, // Speech synth API doesn't work in headless. crbug.com/815388
    args: [
      "--window-size=0,0", // Launch baby window for fun.
      "--window-position=0,0",
      "--enable-speech-dispatcher", // Needed for Linux?
    ],
  });

  const page = await browser.newPage();

  // Clever way to "communicate with page". Know when speech is done.
  page.on("console", async (msg) => {
    if (msg.text() === "SPEECH_DONE") {
      await browser.close();
    }
  });

  const flagIdx = process.argv.findIndex((item) => item === "-t");
  const text =
    flagIdx === -1 ? DEFAULT_TXT : process.argv.slice(flagIdx + 1).join(" ");

  // await page.evaluateOnNewDocument(text => Object.assign(window, {TEXT2SPEECH: text}), text);

  // const html = fs.readFileSync('./html/speech_synth.html', {encoding: 'utf-8'});
  // Cause a navigation so the evaluateOnNewDocument kicks in.
  // await page.goto(`data:text/html,${html}`);
  await page.goto(`file:${require.resolve("@dev/web/public/index.html")}`);

  // await  page.waitForTimeout(1000)
  await page.waitForSelector("button", 1000);

  page.$eval("textarea", (el, value) => (el.value = value), text);

  const button = await page.$("button");
  button.click();
})();

export default console.log(["cli"]);
