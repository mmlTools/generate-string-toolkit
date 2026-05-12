# Change Log

All notable changes to the **Generate String Toolkit** extension are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-12

### Added

- Initial release of **Generate String Toolkit**.
- Right-click editor context menu **Generate String** with nested submenu groups:
  - **GUID / UUID**
  - **Random Strings**
  - **Random Hashes**
  - **Utilities**
- GUID / UUID generators:
  - `GUID / UUID v4`
  - `UUID v4 Uppercase`
  - `UUID v4 Without Dashes`
- Random string generators:
  - `Random Alphanumeric String`
  - `Nano ID Style String`
  - `Secure Password`
  - `Random Hex 32 Characters`
  - `Random Hex 64 Characters`
  - `Random Base64 Token`
  - `Random Base64URL Token`
- Random hash generators (computed from a cryptographically random seed):
  - `MD5 Hash of Random Seed`
  - `SHA-1 Hash of Random Seed`
  - `SHA-256 Hash of Random Seed`
  - `SHA-384 Hash of Random Seed`
  - `SHA-512 Hash of Random Seed`
- Utility generators:
  - `Random URL Slug`
  - `Unix Timestamp`
  - `ISO 8601 Timestamp`
- `Custom Random String...` generator with selectable character sets and custom length.
- Insert at cursor, replace selected text, and multi-cursor support.
- All commands available from the Command Palette under the `Generate String` category.
- Configuration settings:
  - `generateString.defaultLength` (1–4096)
  - `generateString.passwordLength` (8–256)
  - `generateString.slugWords` (2–12)
  - `generateString.copyToClipboard`
  - `generateString.showSuccessMessage`
- Uses Node.js `crypto.randomBytes()` and `crypto.randomUUID()` for secure value generation.

[1.0.0]: https://github.com/mmlTools/generate-string-toolkit/releases/tag/v1.0.0
