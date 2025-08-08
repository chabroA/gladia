import fs from "fs";
import path from "path";
import process from "process";
import { parseInput } from "./parser";
import { formatPositions, runSimulation } from "./engine";

function printUsage(): void {
  const script = path.basename(process.argv[1] || "index.js");
  console.error(`Usage: node ${script} <path-to-input-file>`);
}

function main(): void {
  const inputPath = process.argv[2];
  if (!inputPath) {
    printUsage();
    process.exit(1);
  }
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(inputPath, "utf8");
  const spec = parseInput(content);
  const finalPositions = runSimulation(spec);
  const output = formatPositions(finalPositions);
  console.log(output);
}

main();

