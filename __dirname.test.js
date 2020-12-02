test("__dirname vs process.argv[1]", () => {
  // __dirname 总是返回当前文件所在目录
  // process.argv[1] 返回命令行参数，不一定是当前文件
  console.log(__dirname, process.argv[1]);
});
