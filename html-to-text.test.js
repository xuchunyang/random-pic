const { htmlToText } = require("html-to-text");

test("html to text", () => {
  expect(
    htmlToText(
      '<bdi><a href="https://en.wikipedia.org/wiki/en:James_E._Purdy" class="extiw" title="w:en:James E. Purdy">James Edward Purdy</a>\n</bdi>',
      {
        tags: {
          a: {
            options: { ignoreHref: true },
          },
        },
      }
    ).trim()
  ).toBe("James Edward Purdy");
});

test("html to text - 2", () => {
  console.log(
    htmlToText(
      // FIXME
      // https://commons.wikimedia.org/wiki/File:Khalili_Collections_A_Composite_Imaginary_View_of_Japan.jpg
      // 应该使用
      // Khalili Collections, CC BY-SA 4.0 <https://creativecommons.org/licenses/by-sa/4.0>, via Wikimedia Commons
      '<div class="fn value">\n<div style="float:left;">Unknown author</div> <a href="https://www.wikidata.org/wiki/Q92557474#P170" title="Edit this at Wikidata"><img alt="Edit this at Wikidata" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg/10px-OOjs_UI_icon_edit-ltr-progressive.svg.png" decoding="async" width="10" height="10" style="vertical-align: text-top" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg/15px-OOjs_UI_icon_edit-ltr-progressive.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/OOjs_UI_icon_edit-ltr-progressive.svg/20px-OOjs_UI_icon_edit-ltr-progressive.svg.png 2x" data-file-width="20" data-file-height="20"></a>\n</div>',
      {
        tags: {
          a: {
            options: { ignoreHref: true },
          },
        },
      }
    ).trim()
  );
});

test("html to text - 3", () => {
  console.log(
    htmlToText(
      '<p><br style="clear:both"></p>\n<table align="CENTER" style="width:80%; background-color:#f7f8ff; border:2px solid #8888aa; padding:5px;"><tbody><tr><td><table border="0" width="100%" style="background-color:#f7f8ff;"><tbody><tr style="font-family: Segoe UI, Trebuchet MS, serif;">\n<td align="center" valign="top">\n\t\t<div style="padding-bottom:25px;"><font size="4"><b><a href="https://en.wikipedia.org/wiki/User:Fir0002" class="extiw" title="en:User:Fir0002">fir0002</a> <br> flagstaffotos [at] gmail.com</b></font></div>\n\t\t<div style="font-size:11pt">Canon 20D + Sigma 150mm f/2.8 + Canon MT 24-EX</div>\n\t\t</td>\n\t\t<td valign="top" align="left">\n                    <table border="0" width="240" style="background-color:#f7f8ff;"><tbody><tr>\n<td valign="top"><div class="floatleft"><a href="//commons.wikimedia.org/wiki/File:Sigma_150mm_with_Canon_MT_24-EX.jpg" class="image"><img alt="Sigma 150mm with Canon MT 24-EX.jpg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Sigma_150mm_with_Canon_MT_24-EX.jpg/120px-Sigma_150mm_with_Canon_MT_24-EX.jpg" decoding="async" width="120" height="80" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Sigma_150mm_with_Canon_MT_24-EX.jpg/180px-Sigma_150mm_with_Canon_MT_24-EX.jpg 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Sigma_150mm_with_Canon_MT_24-EX.jpg/240px-Sigma_150mm_with_Canon_MT_24-EX.jpg 2x" data-file-width="1600" data-file-height="1067"></a></div></td>\n                         <td valign="top"><div class="floatleft"><a href="//commons.wikimedia.org/wiki/File:Sigma_150_macro02.jpg" class="image"><img alt="Sigma 150 macro02.jpg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sigma_150_macro02.jpg/120px-Sigma_150_macro02.jpg" decoding="async" width="120" height="80" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sigma_150_macro02.jpg/180px-Sigma_150_macro02.jpg 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sigma_150_macro02.jpg/240px-Sigma_150_macro02.jpg 2x" data-file-width="1600" data-file-height="1067"></a></div></td>\n                         <td valign="top"><div class="floatleft"><a href="//commons.wikimedia.org/wiki/File:Sigma_150_macro03.jpg" class="image"><img alt="Sigma 150 macro03.jpg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sigma_150_macro03.jpg/120px-Sigma_150_macro03.jpg" decoding="async" width="120" height="80" srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sigma_150_macro03.jpg/180px-Sigma_150_macro03.jpg 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Sigma_150_macro03.jpg/240px-Sigma_150_macro03.jpg 2x" data-file-width="1600" data-file-height="1067"></a></div></td>\n                         </tr></tbody></table>\n</td>\n\t</tr></tbody></table></td></tr></tbody></table>',
      {
        tags: {
          a: {
            options: { ignoreHref: true },
          },
        },
      }
    ).trim()
  );
});
