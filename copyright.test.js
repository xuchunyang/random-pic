const { getCopyright } = require("./copyright.js");

// 页面
// https://commons.wikimedia.org/wiki/File:Maggie_Roswell.jpg
// 的标题是 File:Maggie_Roswell.jpg

test("File:Maggie_Roswell.jpg", async () => {
  const result = await getCopyright("File:Maggie_Roswell.jpg");
  console.log(result);
});

test("File:ZavarzinaAlena6.jpg", async () => {
  const result = await getCopyright("File:ZavarzinaAlena6.jpg");
  console.log(result);
});
