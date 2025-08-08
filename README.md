## Gladia Mower (TypeScript)

### Requirements

- Node.js 18+

### Install

```bash
npm install
```

### Run

Provide a path to an input file (sample included):

```bash
npm run start tests/cases/sample.input.txt
```

### Build

```bash
npm run build
node dist/src/index.js tests/cases/sample.input.txt
```

### Test

```bash
npm test
```

The suite discovers cases in `tests/cases/`:
- `<name>.input.txt`: input
- `<name>.expected.txt`: expected output (on success)
- `<name>.error.txt`: exact expected error message (on failure)

Sample case lives at `tests/cases/sample.input.txt`/`.expected.txt`.