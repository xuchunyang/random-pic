const debug = require("debug")("dl:pic");
const path = require("path");
const fs = require("fs");
const dateFns = require("date-fns");
const axios = require("axios");
const crypto = require("crypto");
const filesize = require("filesize");

const dataDir = path.join(path.dirname(process.argv[1]), "data");
const jsonFile = path.join(dataDir, "data.json");
const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

const imageDir = path.join(dataDir, "image");
if (!fs.existsSync(imageDir)) {
  debug("mkdir %s", imageDir);
  fs.mkdirSync(imageDir);
}

debug("共有 %d 个图片要下载", Object.keys(data).length);

// 图片大小：original > thumbnail > preferred

(async () => {
  let i = 1;
  for (let key in data) {
    // key is like "2020-12-02"
    debug("[%d/%d]", i++, Object.keys(data).length);
    if ("error" in data) {
      debug("跳过 %s, 没有图片, %o", data.error);
    } else if ("preferred" in data[key]) {
      await downloadImage(data[key].preferred.url);
    } else {
      debug("跳过 %s, 有问题，缺少 preferred 数据，%o", data);
    }
  }
})();

async function downloadImage(url) {
  const filename = path.join(imageDir, md5(url));
  if (fs.existsSync(filename)) {
    debug("图片 %s 已经存在，跳过", filename);
    return;
  }
  debug("下载图片, %s", url);
  try {
    const response = await axios(url, {
      responseType: "stream",
      timeout: 10 * 1000,
    });
    debug("图片将要保存到 %s", filename);
    if ("content-length" in response.headers) {
      const content_length = parseInt(response.headers["content-length"]);
      debug("图片大小：%s", filesize(content_length));
    } else {
      debug("有问题，缺少 content-length: %o", response.headers);
    }
    response.data.pipe(fs.createWriteStream(filename));
  } catch (error) {
    debug("跳过，请求遇到问题：%s", error.message);
  }
}

function md5(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}
