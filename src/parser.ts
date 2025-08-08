import { Command, Direction, MowerProgram, SimulationSpec } from "./types";

function parseDirection(token: string): Direction {
  if (token !== "N" && token !== "E" && token !== "S" && token !== "W") {
    throw new Error(`Invalid direction: ${token}`);
  }
  return token;
}

function parseCommands(line: string): Command[] {
  const commands: Command[] = [];
  for (const ch of line.trim()) {
    if (ch === "L" || ch === "R" || ch === "F") {
      commands.push(ch);
    } else if (ch === " ") {
      continue;
    } else {
      throw new Error(`Invalid command character: ${ch}`);
    }
  }
  return commands;
}

export function parseInput(input: string): SimulationSpec {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 3) {
    throw new Error("Input must contain at least 3 non-empty lines");
  }

  const [maxXStr, maxYStr] = lines[0].split(/\s+/);
  const maxX = Number(maxXStr);
  const maxY = Number(maxYStr);
  if (!Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    throw new Error("Invalid lawn coordinates on first line");
  }

  const programs: MowerProgram[] = [];
  for (let i = 1; i < lines.length; i += 2) {
    const positionLine = lines[i];
    const commandsLine = lines[i + 1];
    if (commandsLine === undefined) {
      throw new Error("Unmatched mower position without commands line");
    }

    const [xStr, yStr, dirStr] = positionLine.split(/\s+/);
    const x = Number(xStr);
    const y = Number(yStr);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      throw new Error(`Invalid mower coordinates: ${positionLine}`);
    }
    const direction = parseDirection(dirStr);

    if (x < 0 || y < 0 || x > maxX || y > maxY) {
      throw new Error(
        `Mower starting position outside lawn bounds: ${x} ${y}`
      );
    }

    const commands = parseCommands(commandsLine);
    programs.push({ start: { x, y, direction }, commands });
  }

  return {
    lawn: { maxX, maxY },
    programs,
  };
}

