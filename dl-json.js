const debug = require("debug")("dl:json");
const path = require("path");
const fs = require("fs");
const dateFns = require("date-fns");
const axios = require("axios");

const startDate = process.argv[2] && dateFns.parseISO(process.argv[2]);
if (!(startDate && dateFns.isValid(startDate))) {
  if (startDate) {
    console.error("startDate:", startDate);
  } else {
    console.error("missing startDate");
  }
  throw new Error(`usage: node ${process.argv[1]} startDate [endDate]

date is in 2020-12-02 format`);
}
const wikipedia_feature_picture_start_day = new Date(2005, 0, 1);
if (dateFns.isBefore(startDate, wikipedia_feature_picture_start_day)) {
  throw new Error(
    `太早了，起始日期需要晚于 ${wikipedia_feature_picture_start_day}`
  );
}
const endDate =
  (process.argv[3] && dateFns.parseISO(process.argv[3])) || new Date();

debug("startDate: %s, endDate: %s", startDate, endDate);
//process.exit(0);

debug("argv[1]: %s, dir: %s", process.argv[1], path.dirname(process.argv[1]));
const dataDir = path.join(path.dirname(process.argv[1]), "data");
debug("dataDir: %s", dataDir);

if (!fs.existsSync(dataDir)) {
  debug("mkdir %s", dataDir);
  fs.mkdirSync(dataDir);
}

const jsonFile = path.join(dataDir, "data.json");
let data = {};
if (fs.existsSync(jsonFile)) {
  debug("%s 存在，初始化数据", jsonFile);
  data = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
}

(async () => {
  const days = dateRange(startDate, new Date());
  let i = 1;
  console.log("C-c to quit, data will be saved");
  for (const day of days) {
    debug("[%d/%d]", i++, days.length);
    const key = dateFns.format(day, "yyyy-MM-dd");
    if (key in data) {
      debug(`pass, ${key} already exists`);
      continue;
    }
    try {
      const url = `https://wppotd.vercel.app/api/get?date=${key}`;
      debug("请求 %s ...", url);
      const response = await axios.get(url);
      debug("保存 %s", key);
      data[key] = response.data;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data &&
        error.response.data.error.code === "missingtitle"
      ) {
        debug(`${key} 这一天原本就没有图片`);
        data[key] = error.response.data;
      } else {
        console.log(`${key} 遇到问题：${error.message}`);
      }
    }
  }

  saveData();
})();

function saveData() {
  debug("保存结果到 %s", jsonFile);
  fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2));
}

function dateRange(start, end) {
  const days = [];
  for (let i = start; i < end; i.setDate(i.getDate() + 1)) {
    days.push(new Date(i));
  }
  return days;
}

process.on("SIGINT", () => {
  console.log("on SIGINT, save data to disk");
  fs.writeFileSync(jsonFile, JSON.stringify(data, null, 2));
  process.exit(1);
});

// https://wppotd.vercel.app/api/get?date=2006-11-20
// https://wppotd.vercel.app/api/get?date=2016-07-16
