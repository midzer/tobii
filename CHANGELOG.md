# Changelog

## v2.5.0

### New

- Apply opacity to buttons on :hover
- Change opacity on close button
- Support for audio element
- Bigger inline content in demo and
- Introduce captionHTML parameter
- Replace em function

### Fixed

- Big local video elements
- Missing close button in rare cases
- Update lightbox on remove element
- Adding/removing elements dynamically
- YouTube link in demo

## v2.4.0

### Changes

- tobii.mjs -> tobii.modern.js

### Fixed

- All CSS custom properties are now prefixed with `--tobii-` to avoid conflicts (e.g. `--tobii-base-font-size` instead of `--base-font-size: 18px`).

### Deprecated

- Unprefixed forms of CSS custom properties are deprecated and will no longer be supported in the next major release. Update now by adding the `--tobii-` prefix to your variables:
    - Before: `--base-font-size: 18px;`
    - After: `--tobii-base-font-size: 18px;`
