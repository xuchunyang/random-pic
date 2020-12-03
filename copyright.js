// 抓取维基百科图片的版权信息
//
// 使用
// https://www.mediawiki.org/wiki/API:Imageinfo

const axios = require("axios");
const debug = require("debug")("pic:copyright");
const { htmlToText } = require("html-to-text");

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
      let {
        Artist,
        Credit,
        Attribution,
        LicenseUrl,
        LicenseShortName,
      } = extmetadata;

      Artist = Artist && Artist.value;
      Credit = Credit && Credit.value;
      Attribution = Attribution && Attribution.value;
      LicenseShortName = LicenseShortName && LicenseShortName.value;
      LicenseUrl = LicenseUrl && LicenseUrl.value;

      const author = Attribution || Artist || Credit;
      return { pageTitle, author, LicenseShortName, LicenseUrl };
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

function html2text(html) {
  return htmlToText(html, {
    tags: {
      a: {
        options: { ignoreHref: true },
      },
    },
  }).trim();
}

function normalizeAuthor(copyright) {
  if (!copyright.author) return;
  copyright.author = html2text(copyright.author);
}

module.exports = { getCopyright, normalizeAuthor };
