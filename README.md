# Generate String Toolkit

Generate String Toolkit is a lightweight VS Code extension for inserting secure GUIDs, UUID variants, random strings, tokens, hashes, slugs, timestamps, and custom random strings directly into the current editor.

It is designed for developers who frequently need test identifiers, API keys for local development, fixture values, migration GUIDs, seed data, mock tokens, URL-safe strings, and random strings while coding.

## Features

- Right-click editor submenu: **Generate String**
- Nested submenu groups for clean navigation
- Insert at cursor or replace selected text
- Multi-cursor support
- GUID / UUID v4 generation
- Uppercase UUID and UUID without dashes
- Random hex tokens
- Random Base64 and Base64URL-safe tokens
- Random alphanumeric strings
- Secure password-style strings
- Nano ID style strings
- Random MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes
- Random URL slugs
- Unix and ISO 8601 timestamps
- Custom random string generator with selectable character sets and custom length
- Optional copy-to-clipboard behavior

## Context menu layout

Right-click inside a file and select:

```text
Generate String
├── GUID / UUID
│   ├── GUID / UUID v4
│   ├── UUID v4 Uppercase
│   └── UUID v4 Without Dashes
├── Random Strings
│   ├── Random Alphanumeric String
│   ├── Nano ID Style String
│   ├── Secure Password
│   ├── Random Hex 32 Characters
│   ├── Random Hex 64 Characters
│   ├── Random Base64 Token
│   └── Random Base64URL Token
├── Random Hashes
│   ├── MD5 Hash of Random Seed
│   ├── SHA-1 Hash of Random Seed
│   ├── SHA-256 Hash of Random Seed
│   ├── SHA-384 Hash of Random Seed
│   └── SHA-512 Hash of Random Seed
├── Utilities
│   ├── Random URL Slug
│   ├── Unix Timestamp
│   └── ISO 8601 Timestamp
└── Custom Random String...
```

## Commands

All commands are also available from the Command Palette.

- `Generate String: GUID / UUID v4`
- `Generate String: UUID v4 Uppercase`
- `Generate String: UUID v4 Without Dashes`
- `Generate String: Random Hex 32 Characters`
- `Generate String: Random Hex 64 Characters`
- `Generate String: Random Base64 Token`
- `Generate String: Random Base64URL Token`
- `Generate String: Random Alphanumeric String`
- `Generate String: Secure Password`
- `Generate String: Nano ID Style String`
- `Generate String: MD5 Hash of Random Seed`
- `Generate String: SHA-1 Hash of Random Seed`
- `Generate String: SHA-256 Hash of Random Seed`
- `Generate String: SHA-384 Hash of Random Seed`
- `Generate String: SHA-512 Hash of Random Seed`
- `Generate String: Random URL Slug`
- `Generate String: Unix Timestamp`
- `Generate String: ISO 8601 Timestamp`
- `Generate String: Custom Random String...`

## Extension settings

```json
{
  "generateString.defaultLength": 32,
  "generateString.passwordLength": 24,
  "generateString.slugWords": 4,
  "generateString.copyToClipboard": false,
  "generateString.showSuccessMessage": true
}
```

### `generateString.defaultLength`

Default length for configurable string generators. The accepted range is 1 to 4096.

### `generateString.passwordLength`

Default length for secure generated passwords. The accepted range is 8 to 256.

### `generateString.slugWords`

Number of words used by the random slug generator. The accepted range is 2 to 12.

### `generateString.copyToClipboard`

When enabled, every generated value is copied to the clipboard after it is inserted into the editor.

### `generateString.showSuccessMessage`

When enabled, the extension displays a short status bar confirmation after insertion.

## Development

Install dependencies:

```bash
npm install
```

Compile:

```bash
npm run compile
```

Watch TypeScript changes:

```bash
npm run watch
```

Package the extension:

```bash
npm run package
```

Publish the extension:

```bash
npm run publish
```

## Security note

This extension uses Node.js `crypto.randomBytes()` and `crypto.randomUUID()` for generated values. It is suitable for development utilities, mock data, local secrets, test data, and placeholder tokens. For production secrets, always follow your organization’s secret management policy.

## License

MIT
