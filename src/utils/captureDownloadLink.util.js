// picksto-browser-service/src/utils/captureDownloadLink.util.js
const captureDownloadLink = (page) => {
  return new Promise((resolve) => {
    let found = null;

    const responseHandler = (resp) => {
      const ct = resp.headers()["content-type"] || "";
      const cd = resp.headers()["content-disposition"] || "";
      const u = resp.url();

      if (
        ct.includes("application/") ||
        ct.includes("octet-stream") ||
        cd.includes("attachment") ||
        u.includes(".zip") ||
        u.includes(".rar")
      ) {
        found = u;
        page.removeListener("response", responseHandler);
      }
    };

    page.on("response", responseHandler);

    setTimeout(() => {
      page.removeListener("response", responseHandler);
      resolve(found);
    }, 5000);
  });
};

module.exports = captureDownloadLink;
