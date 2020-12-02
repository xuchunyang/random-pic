const fs = require("fs");

// 不是，会堵塞
test("pipe 是异步的吗？立即返回？", () => {
  // dd if=/dev/urandom of=128MB bs=1048576 count=128
  if (fs.existsSync("128MB")) {
    const inp = fs.createReadStream("128MB");
    const out = fs.createWriteStream("/tmp/x");
    const start = new Date();
    console.log(start);
    inp.pipe(out);
    const duration = new Date() - start;
    console.log(duration + " seconds");
  }
});
