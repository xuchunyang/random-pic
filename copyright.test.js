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

test("File:Washington_Dulles_International_Airport_at_Dusk.jpg", async () => {
  const result = await getCopyright(
    "File:Washington_Dulles_International_Airport_at_Dusk.jpg"
  );
  console.log(result);
});
