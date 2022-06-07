# Changelog

## v2.4.0

### Changes

- tobii.mjs -> tobii.modern.js

### Fixed

- All CSS custom properties are now prefixed with `--tobii-` to avoid conflicts (e.g. `--tobii-base-font-size` instead of `--base-font-size: 18px`).

### Deprecated

- Unprefixed forms of CSS custom properties are deprecated and will no longer be supported in the next major release. Update now by adding the `--tobii-` prefix to your variables:
    - Before: `--base-font-size: 18px;`
    - After: `--tobii-base-font-size: 18px;`
