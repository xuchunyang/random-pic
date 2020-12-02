const axios = require("axios");
const fs = require("fs");

test("download file", async () => {
  const response = await axios.get("http://example.com", {
    responseType: "stream",
  });
  response.data.pipe(fs.createWriteStream("/tmp/example.html"));
});
