// picksto-browser-service/src/utils/fileTypeDetector.util.js
const detectFileType = (buffer) => {
  const signatures = {
    ffd8ffe0: "jpg",
    ffd8ffe1: "jpg",
    ffd8ffe2: "jpg",
    ffd8ffe3: "jpg",
    ffd8ffe8: "jpg",
    "89504e47": "png",
    47494638: "gif",
    "504b0304": "zip",
    52617221: "rar",
    25504446: "pdf",
    "7b5c7274": "rtf",
    d0cf11e0: "doc",
    49443303: "mp3",
    "000001ba": "mpg",
    "000001b3": "mpg",
  };

  const hex = buffer.toString("hex", 0, 4);
  for (const [sig, ext] of Object.entries(signatures)) {
    if (hex.startsWith(sig)) return { ext, mime: `application/${ext}` };
  }
  return { ext: "bin", mime: "application/octet-stream" };
};

module.exports = detectFileType;
