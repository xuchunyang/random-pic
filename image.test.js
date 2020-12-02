const { hashToUrl, images, randomImage } = require("./image.js");

test("hashToUrl", () => {
  expect(Object.keys(hashToUrl).length >= 0).toBe(true);
});

test("images", () => {
  expect(Object.keys(images).length >= 0).toBe(true);
});

test("randomImage", () => {
  expect("hash" in randomImage()).toBe(true);
});
