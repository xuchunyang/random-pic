const debug = require("debug")("dl:copyright");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { getCopyright } = require("./copyright.js");

const dataDir = path.join(path.dirname(process.argv[1]), "data");
const dataJson = path.join(dataDir, "data.json");
const copyrightJson = path.json(dataDir, "copyright.json");

// 对象，键是日期，值是图片对象
const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

let copyrights = {};
if (fs.existsSync(copyrightJson)) {
  debug("%s 存在，初始化数据", copyrightJson);
  copyrights = JSON.parse(fs.readFileSync(copyrights, "utf8"));
}

(async () => {
  let i = 1;
  for (const key in data) {
    debug("[%d/%d]", i++, Object.keys(data).length);
    if ("error" in data[key]) {
      debug("跳过 %s, 没有图片, %o", key, data[key].error);
    } else {
      const pageTitle = decodeURIComponent(
        path.basename(data[key].file_description_url)
      );
      debug("处理 %s", pageTitle);
      try {
        copyrights[key] = await getCopyright(pageTitle);
      } catch (error) {
        debug("遇到问题：%s", error.message);
        if (error.response) {
          debug(
            "服务器回复报错，status: %s, data: %o",
            error.response.status,
            error.response.data
          );
          debug("跳过，以后也跳过");
          copyrights[key] = {
            error: {
              status: error.response.status,
              data: error.response.data,
            },
          };
        } else {
          debug("服务器没回复，跳过，下次再尝试");
        }
      }
    }
  }
})();
