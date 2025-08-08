import fs from "fs";
import path from "path";
import process from "process";
import { parseInput } from "../src/parser";
import { formatPositions, runSimulation } from "../src/engine";

interface TestCase {
  name: string;
  inputPath: string;
  expectedOutputPath?: string;
  expectedErrorSubstring?: string;
}

function discoverCases(): TestCase[] {
  const dir = path.join(__dirname, "cases");
  const cases: TestCase[] = [];

  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    const inputs = files.filter((f) => f.endsWith(".input.txt"));
    for (const inputFile of inputs) {
      const base = inputFile.replace(/\.input\.txt$/, "");
      const inputPath = path.join(dir, `${base}.input.txt`);
      const expectedPath = path.join(dir, `${base}.expected.txt`);
      const errorPath = path.join(dir, `${base}.error.txt`);

      const hasExpected = fs.existsSync(expectedPath);
      const hasError = fs.existsSync(errorPath);
      if (!hasExpected && !hasError) {
        // Skip incomplete case
        continue;
      }

      const testCase: TestCase = {
        name: base,
        inputPath,
        expectedOutputPath: hasExpected ? expectedPath : undefined,
        expectedErrorSubstring: hasError ? fs.readFileSync(errorPath, "utf8").trim() : undefined,
      };
      cases.push(testCase);
    }
  }

  return cases;
}

function runOne(caseDef: TestCase): { ok: boolean; message: string } {
  const input = fs.readFileSync(caseDef.inputPath, "utf8");
  try {
    const spec = parseInput(input);
    const actual = formatPositions(runSimulation(spec)).trim();

    if (caseDef.expectedErrorSubstring) {
      return { ok: false, message: `Expected error \"${caseDef.expectedErrorSubstring}\" but got successful result: ${actual}` };
    }

    const expected = fs.readFileSync(caseDef.expectedOutputPath!, "utf8").trim();
    if (actual === expected) {
      return { ok: true, message: "PASS" };
    }
    const diff = [
      `FAIL: ${caseDef.name}`,
      "--- Expected ---",
      expected,
      "--- Actual ---",
      actual,
    ].join("\n");
    return { ok: false, message: diff };
  } catch (err) {
    const error = err as Error;
    if (!caseDef.expectedErrorSubstring) {
      return { ok: false, message: `Unexpected error: ${error.message}` };
    }
    const got = error.message || String(error);
    const expectedSub = caseDef.expectedErrorSubstring;
    if (got === expectedSub) {
      return { ok: true, message: "PASS" };
    }
    return { ok: false, message: `FAIL: ${caseDef.name}\nExpected error: ${expectedSub}\nGot: ${got}` };
  }
}

function main(): void {
  const cases = discoverCases();
  if (cases.length === 0) {
    console.error("No test cases found.");
    process.exit(1);
  }

  const results = cases.map((c) => ({ name: c.name, ...runOne(c) }));
  let passed = 0;
  for (const r of results) {
    if (r.ok) {
      passed += 1;
      console.log(`${r.name}: PASS`);
    } else {
      console.error(`${r.name}:`);
      console.error(r.message);
    }
  }

  const total = results.length;
  const failed = total - passed;
  if (failed === 0) {
    console.log(`\nAll ${total} tests passed.`);
    process.exit(0);
  } else {
    console.error(`\n${failed}/${total} tests failed.`);
    process.exit(1);
  }
}

main();


