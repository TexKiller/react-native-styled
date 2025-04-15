const process = require("process");
const spawn = require("child_process").spawn;
const pathResolve = require("path").resolve;
const existsSync = require("fs").existsSync;

const jest = spawn("yarn", [
  "node",
  "--require",
  existsSync("./tests/stub.js") ? "./tests/stub.js" : "../tests/stub.js",
  pathResolve(require.resolve("jest"), "../../bin/jest.js"),
  "--testTimeout=60000",
  ...process.argv.slice(2),
]);

setTimeout(() => jest.stdin.write("n"), 1000);
setTimeout(() => jest.stdin.write("n"), 2000);
setTimeout(() => jest.stdin.write("n"), 4000);

process.stdin.pipe(jest.stdin);
jest.stdout.pipe(process.stdout);
jest.stderr.pipe(process.stderr);
