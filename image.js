const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const dataDir = path.join(__dirname, "data");
const jsonFile = path.join(dataDir, "data.json");
const imageDir = path.join(dataDir, "image");

const data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));

const images = {};
const hashToUrl = {};
for (const key in data) {
  if ("preferred" in data[key]) {
    const url = data[key].preferred.url;
    const hash = md5(url);
    const filename = path.join(imageDir, md5(url));
    if (fs.existsSync(filename)) {
      hashToUrl[hash] = url;
      images[key] = {
        hash,
        data_provided_wikipedia: data[key],
      };
    }
  }
}

const days = Object.keys(images);
function randomImage() {
  const day = arrayRandomItem(days);
  return images[day];
}

function randomDay() {
  return arrayRandomItem(days); 
}

module.exports = { hashToUrl, images, randomDay, randomImage };

function md5(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min)) + min;
}

function arrayRandomItem(array) {
  return array[getRandomInt(0, array.length)];
}
