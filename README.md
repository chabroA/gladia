## Gladia Mower (TypeScript)

### Requirements

- Node.js 18+

### Install

```bash
npm install
```

### Run

Provide a path to an input file:

```bash
npx ts-node src/index.ts sample_input.txt
```

### Build

```bash
npm run build
node dist/src/index.js sample_input.txt
```

### Test (validates the sample from `TODO.md`)

```bash
npm test
```

Expected output for `sample_input.txt`:

```
1 3 N
5 1 E
```