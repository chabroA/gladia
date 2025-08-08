import { Direction, Lawn, MowerProgram, Position, SimulationSpec } from "./types";

const leftTurn: Record<Direction, Direction> = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};

const rightTurn: Record<Direction, Direction> = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

function moveForwardIfInside(lawn: Lawn, position: Position): Position {
  const deltas: Record<Direction, { dx: number; dy: number }> = {
    N: { dx: 0, dy: 1 },
    E: { dx: 1, dy: 0 },
    S: { dx: 0, dy: -1 },
    W: { dx: -1, dy: 0 },
  };
  const { dx, dy } = deltas[position.direction];
  const nextX = position.x + dx;
  const nextY = position.y + dy;
  if (nextX < 0 || nextY < 0 || nextX > lawn.maxX || nextY > lawn.maxY) {
    return position;
  }
  return { ...position, x: nextX, y: nextY };
}

function runProgram(lawn: Lawn, program: MowerProgram): Position {
  let current: Position = { ...program.start };
  for (const command of program.commands) {
    if (command === "L") {
      current = { ...current, direction: leftTurn[current.direction] };
    } else if (command === "R") {
      current = { ...current, direction: rightTurn[current.direction] };
    } else if (command === "F") {
      current = moveForwardIfInside(lawn, current);
    }
  }
  return current;
}

export function runSimulation(spec: SimulationSpec): Position[] {
  const results: Position[] = [];
  for (const program of spec.programs) {
    results.push(runProgram(spec.lawn, program));
  }
  return results;
}

export function formatPositions(positions: Position[]): string {
  return positions.map((p) => `${p.x} ${p.y} ${p.direction}`).join("\n");
}

