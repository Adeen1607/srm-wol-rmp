// Run with: node --test tests/cgpa.test.cjs
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const html = fs.readFileSync(path.join(__dirname, "..", "webathon project", "cgpa.html"), "utf8");
const script = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(script, "calculator script must exist");
// Evaluate only the pure calculation logic, without a browser or third-party packages.
const pureLogic = script[1].split("const subjects =")[0];
const calculate = vm.runInNewContext(pureLogic + "\ncalculateCgpa");

test("all O grades average to 10", () => {
  assert.equal(calculate(["O", "O", "O", "O", "O"]), 10);
});
test("mixed grades use all five subjects", () => {
  assert.equal(calculate(["O", "A+", "A", "B", "C"]), 8);
});
test("all D grades average to 5", () => {
  assert.equal(calculate(["D", "D", "D", "D", "D"]), 5);
});
test("missing grade is rejected", () => {
  assert.throws(() => calculate(["O", "A+", "", "B", "C"]), /valid grade/);
});
test("unknown grade is rejected", () => {
  assert.throws(() => calculate(["O", "A+", "F", "B", "C"]), /valid grade/);
});
test("wrong subject count is rejected", () => {
  assert.throws(() => calculate(["O", "A+"]), /valid grade/);
});
