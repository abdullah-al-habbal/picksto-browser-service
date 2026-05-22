// picksto-browser-service/src/utils/handleLogin.util.js
const handleLogin = async (page, siteSource, credentials) => {
  const isFreepik = siteSource.toLowerCase().includes("freepik");
  if (!isFreepik) return;

  await page.goto("https://www.freepik.com/login", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.type('input[type="email"]', credentials.email);
  await page.type('input[type="password"]', credentials.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 });
};

module.exports = handleLogin;
