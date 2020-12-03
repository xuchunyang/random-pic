const express = require("express");
const serveStatic = require("serve-static");
const morgan = require("morgan");
const debug = require("debug")("pic");
const path = require("path");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const mime = require("mime");
const { images, hashToUrl, randomDay } = require("./image.js");

const app = express();

app.set("x-powered-by", false);
app.set("trust proxy", 1);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
});

app.use(limiter);

app.use(morgan("dev"));

app.use(
  "/image",
  express.static("data/image", {
    immutable: true,
    maxAge: "1y",
    setHeaders: (res, mypath, stat) => {
      const hash = path.basename(mypath);
      const url = hashToUrl[hash];
      debug("add content-type: %o", { mypath, hash, url });
      const type = mime.lookup(url);
      if (type) {
        res.set("content-type", type);
      } else {
        console.log(
          `有问题，不能设置 content-type, mypath: ${mypath}, url: ${url}`
        );
      }
    },
  })
);

app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
  const day = req.query.random;
  if (day && day in images) {
    const img = images[day];
    const {
      data_provided_wikipedia: {
        title: alt,
        file_description_url: href,
        preferred: { width, height },
      },
      copyright: { author, LicenseShortName, LicenseUrl },
    } = img;
    const src = `/image/${img.hash}`;
    const locals = {
      href,
      src,
      alt,
      width,
      height,
      author,
      LicenseShortName,
      LicenseUrl,
    };
    if (locals.alt) {
      locals.alt = path.basename(alt, path.extname(alt));
    }
    debug("locals: %o", locals);
    res.render("image", locals);
    return;
  }
  res.redirect(302, `/?random=${randomDay()}`);
});

app.get("/api", (req, res) => {
  res.render("api");
});

app.use(cors());

app.get("/api/random", (req, res) => {
  const img = images[randomDay()];
  const src = `/image/${img.hash}`;
  res.redirect(302, src);
});

app.get("/api/random/json", (req, res) => {
  const img = images[randomDay()];
  res.json(img);
});

app.get("/api/images", (req, res) => {
  res.json(Object.keys(images));
});

app.get("/api/image/:day", (req, res) => {
  const day = req.params.day;
  if (!(day in images)) {
    res.json({ error: "No such day" });
    return;
  }
  res.json(images[day]);
});

const server = app.listen(
  process.env.PORT || 3000,
  process.env.HOST || "localhost",
  () => {
    const { address, port } = server.address();
    console.log(`Listening at http://${address}:${port}/`);
  }
);

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});
