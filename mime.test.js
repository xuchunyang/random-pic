const mime = require("mime-types");

test("check if mime.lookup works with url", () => {
  expect(
    mime.lookup("http://127.0.0.1:3000/00c70bca129f77111c5ceb4fc12cdb3e.jpg")
  ).toBe("image/jpeg");
  expect(
    mime.lookup("http://127.0.0.1:3000/00c70bca129f77111c5ceb4fc12cdb3e.svg")
  ).toBe("image/svg+xml");
  expect(
    mime.lookup("http://127.0.0.1:3000/00c70bca129f77111c5ceb4fc12cdb3e.gif")
  ).toBe("image/gif");
  expect(
    mime.lookup("http://127.0.0.1:3000/00c70bca129f77111c5ceb4fc12cdb3e.png")
  ).toBe("image/png");

  expect(mime.lookup("xxx")).toBe(false);
});
