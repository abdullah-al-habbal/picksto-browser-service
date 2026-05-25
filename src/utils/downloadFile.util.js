// picksto-browser-service/src/utils/downloadFile.util.js
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const config = require("../config/app.config");
const detectFileType = require("./fileTypeDetector.util");

const DOWNLOADS_DIR = config.downloadDir;

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
];

const getRandomUserAgent = () =>
  USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

const downloadFile = async (fileUrl, siteSource) => {
  const timestamp = Date.now();
  const cleanName = siteSource.replace(/[^a-zA-Z0-9]/g, "_");
  const tempName = `${cleanName}_${timestamp}.bin`;
  const filePath = path.join(DOWNLOADS_DIR, tempName);

  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    method: "GET",
    url: fileUrl,
    responseType: "stream",
    timeout: 600000,
    maxRedirects: 10,
    headers: {
      "User-Agent": process.env.DOWNLOAD_USER_AGENT || getRandomUserAgent(),
    },
  });

  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  const buffer = fs.readFileSync(filePath);
  const preview = buffer.toString("utf8", 0, Math.min(500, buffer.length));

  if (preview.includes("<html") || preview.includes("<!DOCTYPE")) {
    fs.unlinkSync(filePath);
    throw new Error("Downloaded HTML error page instead of file");
  }

  const detected = detectFileType(buffer);
  const finalName = `${cleanName}_${timestamp}.${detected.ext}`;
  const finalPath = path.join(DOWNLOADS_DIR, finalName);
  fs.renameSync(filePath, finalPath);

  return finalPath;
};

module.exports = downloadFile;
