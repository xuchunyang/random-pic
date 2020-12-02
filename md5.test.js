const crypto = require("crypto");

function md5(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}

test("md5", () => {
  expect(md5("hello")).toBe("5d41402abc4b2a76b9719d911017c592");
});
