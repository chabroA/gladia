Each test case is defined by files with a shared base name:

- <name>.input.txt: Input to the CLI (same format as sample)
- <name>.expected.txt: Expected output positions (success case)
- <name>.error.txt: A substring expected to be found in the thrown error message (error case)

Provide exactly one of .expected.txt or .error.txt for each <name>.