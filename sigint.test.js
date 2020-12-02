console.log("wait for 10s, C-c to quit...");
setTimeout(() => {
  console.log("over");
}, 10 * 1000);

process.on("SIGINT", () => {
  console.log("on sigint, quit");
  process.exit(1);
});

test("ignored - otherwise, if no test, jest throws error", () => {});
