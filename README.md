# TypeScript Skill-Up Session

A simple project for demonstrating TypeScript concepts.

## Setup

```bash
pnpm install
```

## Project Structure

```
examples/
├── javascript/    # JavaScript examples (for comparison)
└── typescript/    # TypeScript examples
```

## Running Examples

### JavaScript files
```bash
node examples/javascript/01-basics.js
```

### TypeScript files

First compile, then run:
```bash
pnpm build
node dist/01-basics.js
```

Or compile in watch mode while you work:
```bash
pnpm build:watch
```

## Quick TypeScript Compilation

To compile a single file quickly:
```bash
npx tsc examples/typescript/01-basics.ts --outDir dist
```
