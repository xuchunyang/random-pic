const debug = require("debug")("dl:pic");
const path = require("path");
const fs = require("fs");
const dateFns = require("date-fns");
const axios = require("axios");
const crypto = require("crypto");

const dataDir = path.join(path.dirname(process.argv[1]), "data");
const jsonFile = path.join(dataDir, "data.json");
const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

const imageDir = path.join(dataDir, "image");
if (!fs.existsSync(imageDir)) {
  debug("mkdir %s", imageDir);
  fs.mkdirSync(imageDir);
}

// 图片下载记录
const imageJson = path.join(dataDir, "image.json");
let imageData = {};
if (fs.existsSync(imageJson)) {
  debug("%s 存在，初始化图片下载记录 ", imageJson);
  data = JSON.parse(fs.readFileSync(imageJson, "utf8"));
}

debug("共有 %d 个图片要下载", Object.keys(data).length);

// 图片大小：original > thumbnail > preferred

(async () => {
  let i = 1;
  for (let key in data) {
    // key is like "2020-12-02"
    debug("[%d/%d]", i++, Object.keys(data).length);
    if (key in imageData) {
      debug("已经处理过 %s，跳过", key);
      continue;
    }
    if ("error" in data) {
      debug("跳过 %s, 没有图片, %o", data.error);
      imageData[key] = {
        ok: false,
        error: data.error,
      };
    } else if ("preferred" in data[key]) {
      const url = data[key].preferred.url;
      debug("下载图片, %s", url);
      try {
        const response = await axios(url, { responseType: "stream" });
        const filename = path.join(imageDir, md5(url));
        debug("图片将要保存到 %s", filename);
        response.data.pipe(fs.createWriteStream(filename));
        imageData[key] = {
          ok: true,
          filename,
        };
      } catch (error) {
        debug("跳过，请求遇到问题：%s", error.message);
        imageData[key] = {
          ok: false,
          error: error.message,
        };
      }
    } else {
      debug("跳过 %s, 有问题，缺少 preferred 数据，%o", data);
      imageData[key] = {
        ok: false,
        error: "缺少 preferred 数据",
      };
    }
  }
})();

function md5(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}
