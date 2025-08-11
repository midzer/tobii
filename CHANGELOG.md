# Changelog

## v2.8.5

### Fixed

- zoom only for zoomable elements

## v2.8.4

### Fixed

- increase focus delay for figure due transition bug on low-end Android devices

## v2.8.3

### Fixed

- fix double click zoom and delayed tap on Android by introducing a threshold

## v2.8.2

### Fixed

- fix aria-label of figure
- tweak caption-toggle CSS

## v2.8.1

### Fixed

- Allow multiple lightbox instances

## v2.8.0

### New

- Toggle caption display on click/touch

## v2.7.3

### Fixed

- Fix unclickable top region for docClose

## v2.7.2

### Fixed

- Encapsulate counter text in P element for better accessibility compliance
- Add new dialogTitle setting to allow dialog title customization for better accessibility compliance
- Revert "fix not clickable close() region for slider"

## v2.7.1

### Fixed

- GitHub Action workflow

## v2.7.0

### New

- Accessibility improvements
- Sizes attribute to properly handle responsive images
- Programmatically set focus on figure elements on slide change

### Fixed

- srcset before src to avoid loading images twice
- scroll to top when opening lightbox

## v2.6.6

### Fixed

- Previous release regression

## v2.6.5

### Fixed

- Reset zoom in any case on cleanup from 2.6.0

## v2.6.4

### Fixed

- Next button after 2nd slide regression from 2.6.0

## v2.6.2

### Fixed

- GitHub Action workflow

## v2.6.1

### Fixed

- Single tap cycle on mobile not working in some cases
- Some elements on demo page were broken
- Allow Node 18 again

## v2.6.0

### New

- Pinch zoom feature for touch devices
- Double click and wheel zoom with mouse/touch clamped pan
- Delayed tap on mobile for prev/next navigation

### Fixed

- Not clickable close() region above slider

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
