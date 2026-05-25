// picksto-browser-service/src/utils/handleLogin.util.js
const handleLogin = async (page, siteSource, credentials) => {
  const loginUrl = credentials.loginUrl || getDefaultLoginUrl(siteSource);
  if (!loginUrl) return;

  await page.goto(loginUrl, { waitUntil: "domcontentloaded" });
  await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  await page.type('input[type="email"]', credentials.email);
  await page.type('input[type="password"]', credentials.password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 });
};

const getDefaultLoginUrl = (siteSource) => {
  if (siteSource.toLowerCase().includes("freepik")) {
    return "https://www.freepik.com/login";
  }
  return null;
};

module.exports = handleLogin;
