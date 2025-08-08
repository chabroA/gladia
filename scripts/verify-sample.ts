import fs from "fs";
import path from "path";
import { parseInput } from "../src/parser";
import { formatPositions, runSimulation } from "../src/engine";

function exitWithMessage(ok: boolean, message: string): never {
  if (ok) {
    console.log(message);
    process.exit(0);
  } else {
    console.error(message);
    process.exit(1);
  }
}

const inputPath = path.join(__dirname, "sample_input.txt");
const expectedPath = path.join(__dirname, "expected_output.txt");

if (!fs.existsSync(inputPath) || !fs.existsSync(expectedPath)) {
  exitWithMessage(false, `Sample files missing. Expected both sample_input.txt and expected_output.txt in the project root.`);
}

const input = fs.readFileSync(inputPath, "utf8");
const expected = fs.readFileSync(expectedPath, "utf8").trim();

const spec = parseInput(input);
const actual = formatPositions(runSimulation(spec)).trim();

if (actual === expected) {
  exitWithMessage(true, "Sample test passed.");
} else {
  const diffMsg = [
    "Sample test FAILED.",
    "--- Expected ---",
    expected,
    "--- Actual ---",
    actual,
  ].join("\n");
  exitWithMessage(false, diffMsg);
}

