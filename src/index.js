const core = require("@actions/core");
const main = require("./main");

try {
  main();
} catch (error) {
  core.setFailed(error.message);
}
