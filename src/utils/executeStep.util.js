// picksto-browser-service/src/utils/executeStep.util.js
const executeStep = async (page, step, credentials) => {
  switch (step.action) {
    case "goto":
      await page.goto(step.url.replace("{fileUrl}", step.urlPattern || ""), {
        waitUntil: step.waitUntil || "domcontentloaded",
        timeout: step.timeout || 30000,
      });
      break;

    case "wait":
      if (step.selector) {
        await page.waitForSelector(step.selector, {
          timeout: step.timeout || 10000,
        });
      } else if (step.ms) {
        await new Promise((r) => setTimeout(r, step.ms));
      }
      break;

    case "click":
      await page.waitForSelector(step.selector, {
        visible: true,
        timeout: 10000,
      });
      await page.click(step.selector);
      break;

    case "type":
    case "fill":
      await page.waitForSelector(step.selector, { visible: true });
      await page.click(step.selector, { clickCount: 3 });
      await page.keyboard.press("Backspace");

      const value =
        step.useConfig === "email"
          ? credentials.email
          : step.useConfig === "password"
            ? credentials.password
            : step.text;

      await page.keyboard.type(value, { delay: step.delay || 50 });
      break;

    case "captureDownloadLink":
      break;
  }

  if (step.waitAfter) {
    await new Promise((r) => setTimeout(r, step.waitAfter));
  }
};

module.exports = executeStep;
