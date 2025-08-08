export type Direction = "N" | "E" | "S" | "W";

export type Command = "L" | "R" | "F";

export interface Lawn {
  maxX: number;
  maxY: number;
}

export interface Position {
  x: number;
  y: number;
  direction: Direction;
}

export interface MowerProgram {
  start: Position;
  commands: Command[];
}

export interface SimulationSpec {
  lawn: Lawn;
  programs: MowerProgram[];
}

