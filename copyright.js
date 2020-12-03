// 抓取维基百科图片的版权信息
//
// 使用
// https://www.mediawiki.org/wiki/API:Imageinfo

const axios = require("axios");
const debug = require("debug")("copyright");

// 页面
// https://commons.wikimedia.org/wiki/File:Maggie_Roswell.jpg
// 的标题是 File:Maggie_Roswell.jpg
async function getCopyright(pageTitle) {
  debug("正在下载 %s 的版权信息", pageTitle);
  try {
    const response = await axios.get(
      "https://commons.wikimedia.org/w/api.php",
      {
        params: {
          action: "query",
          format: "json",
          prop: "imageinfo",
          iiprop: "extmetadata",
          titles: pageTitle,
        },
      }
    );
    const pages =
      response.data && response.data.query && response.data.query.pages;
    if (Object.keys(pages).length === 1) {
      const page = Object.values(pages)[0];
      debug("pageid: %d", page.pageid);
      const extmetadata = page.imageinfo[0].extmetadata;
      const {
        Artist,
        Credit,
        Attribution,
        LicenseUrl,
        LicenseShortName,
      } = extmetadata;
      return { Artist, Credit, Attribution, LicenseUrl, LicenseShortName };
    } else {
      debug(
        "刚好有一页才对，获得了 %d 页面，response.data: %o",
        Object.keys(pages).length,
        response.data
      );
    }
  } catch (error) {
    debug(`getCopyright: ${pageTitle} 失败：${error.message}`);
  }
}

module.exports = { getCopyright };
