# Tobii

[![Version](https://img.shields.io/badge/Version-2.0.0--alpha-1a2a3a.svg)](https://github.com/rqrauhvmra/Tobii/releases)
[![License](https://img.shields.io/badge/License-MIT-1a2a3a.svg)](https://github.com/rqrauhvmra/Tobii/blob/master/LICENSE.md)
![Dependecies](https://img.shields.io/badge/Dependencies-none-1a2a3a.svg)
[![Amazon wishlist](https://img.shields.io/badge/Amazon_wishlist-0366d6.svg)](https://www.amazon.de/hz/wishlist/ls/29WXITO63O0BX)

An accessible, open-source lightbox with no dependencies.

[Play on CodePen](https://codepen.io/collection/nbqJVV)

![Open slide with a picture of the Berlin television tower](https://rqrauhvmra.com/tobi/tobi.png)

## Table of contents

- [Features](#features)
- [Get Tobii](#get-Tobii)
  - [Download](#download)
  - [Package managers](#package-managers)
- [Usage](#usage)
- [Media types](#media-types)
  - [Image](#image)
  - [Inline HTML](#inline-html)
  - [Iframe](#iframe)
  - [YouTube](#youtube)
- [Grouping](#grouping)
- [Options](#options)
- [API](#api)
- [Browser support](#browser-support)
- [To do](#to-do)
- [Contributing](#contributing)
- [License](#license)

## Features

- No dependencies
- Accessible:
  - ARIA roles
  - Keyboard navigation:
    - `Prev`/ `Next` Keys: Navigate through slides
    - `ESCAPE` Key: Close Tobii
    - `TAB` Key: Focus elements within Tobii, not outside
  - User preference media features:
    - `prefers-reduced-motion` media query
  - When Tobii opens, focus is set to the first focusable element in Tobii
  - When Tobii closes, focus returns to what was in focus before Tobii opened
- Touch & Mouse drag support:
  - Drag/ Swipe horizontal to navigate through slides
  - Drag/ Swipe vertical to close Tobii
- Responsive
- Support iframes
- Support inline HTML

## Get Tobii

### Download

CSS: `css/tobii.min.css` minified, or `css/Totii.css` un-minified

JavaScript: `js/tobii.min.js` minified, or `js/tobii.js` un-minified

### Package managers

Tobii is also available on npm.

`npm install tobii --save`

## Usage

You can install Tobii by linking the `.css` and `.js` files to your html file. The HTML code may look like this:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Your page title</title>

  <!-- CSS -->
  <link href="tobii.min.css" rel="stylesheet">
</head>
<body>
  <!-- Your HTML content -->

  <!-- JS -->
  <script src="tobii.min.js"></script>
</body>
</html>
```

Initialize the script by running:

```js
const tobii = new Tobii()
```

## Media types

### Image

[Play on CodePen](https://codepen.io/rqrauhvmra/pen/ZRZdwG)

The standard way of using Tobii is a linked thumbnail image with the class name `lightbox` to a larger image:

```html
<a href="path/to/image.jpg" class="lightbox">
  <img src="path/to/thumbnail.jpg" alt="I am a caption">
</a>
```

Instead of a thumbnail, you can also refer to a larger image with a textlink:

```html
<a href="path/to/image.jpg" class="lightbox">
  Open image
</a>
```

### Inline HTML

[Play on CodePen](https://codepen.io/rqrauhvmra/pen/BOLxqj)

For inline HTML, create an element with a unique ID:

```html
<div id="selector">
  <!-- Your HTML content -->
</div>
```

Then create a link with the class name `lightbox` and a `href` attribute that matches the ID of the element:

```html
<a href="#selector" data-type="html" class="lightbox">
  Open HTML content
</a>
```

or a button with the class name `lightbox` and a `data-target` attribute that matches the ID of the element:

```html
<button type="button" data-type="html" data-target="#selector" class="lightbox">
  Open HTML content
</button>
```

In both ways, the attribute `data-type` with the value `html` must be added.

### Iframe

[Play on CodePen](https://codepen.io/rqrauhvmra/pen/GXJwar)

For an iframe, create a link with the class name `lightbox`:

```html
<a href="https://www.wikipedia.org" data-type="iframe" class="lightbox">
  Open Wikipedia
</a>
```

or a button with the class name `lightbox` and a `data-target` attribute:

```html
<button type="button" data-type="iframe" data-target="https://www.wikipedia.org" class="lightbox">
  Open Wikipedia
</button>
```

In both ways, the attribute `data-type` with the value `iframe` must be added.

#### Optional attributes

- `data-height` set the height and `data-width` the width of the iframe.

### YouTube

[Play on CodePen](https://codepen.io/rqrauhvmra/pen/rgpjXE)

For an YouTube video, create a link with the class name `lightbox` and a `data-id` attribute with the YouTube video ID:

```html
<a href="#" data-type="youtube" data-id="KU2sSZ_90PY" class="lightbox">
  Open YouTube video
</a>
```

or a button with the class name `lightbox` and a `data-id` attribute with the YouTube video ID:

```html
<button type="button" data-type="youtube" data-id="KU2sSZ_90PY" class="lightbox">
  Open YouTube video
</button>
```

In both ways, the attribute `data-type` with the value `youtube` must be added.

#### Optional attributes

- `data-controls` indicates whether the video player controls are displayed: `0` do not display and `1` display controls in the player.
- `data-height` set the height and `data-width` the width of the player. I recommend using an external library for responsive iframes.

## Grouping

[Play on CodePen](https://codepen.io/rqrauhvmra/pen/PvKVxp)

If you have a group of related types that you would like to combine into a set, add the `data-group` attribute:

```html
<a href="path/to/image_1.jpg" class="lightbox" data-group="vacation">
  <img src="path/to/thumbnail_1.jpg" alt="I am a caption">
</a>

<a href="path/to/image_2.jpg" class="lightbox" data-group="vacation">
  <img src="path/to/thumbnail_2.jpg" alt="I am a caption">
</a>

// ...

<a href="path/to/image_4.jpg" class="lightbox" data-group="birthday">
  <img src="path/to/thumbnail_4.jpg" alt="I am a caption">
</a>

// ...
```

## Options

[Play on CodePen](https://codepen.io/rqrauhvmra/pen/MBYEog)

You can pass an object with custom options as an argument.

```js
const tobii = new Tobii({
  captions: false
})
```

The following options are available:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| selector | string | ".lightbox" | All elements with this class triggers Tobii. |
| captions | bool | true | Display captions, if available. |
| captionsSelector | "self", "img" | "img" | Set the element where the caption is. Set it to "self" for the `a` tag itself. |
| captionAttribute | string | "alt" | Get the caption from given attribute. |
| nav | bool, "auto" | "auto" | Display navigation buttons. "auto" hides buttons on touch-enabled devices. |
| navText | string | ["inline svg", "inline svg"] | Text or HTML for the navigation buttons. |
| navLabel | string | ["Previous", "Next"] | ARIA label for screen readers. |
| close | bool | true | Display close button. |
| closeText | string | "inline svg" | Text or HTML for the close button. |
| closeLabel | string | "Close" | ARIA label for screen readers. |
| loadingIndicatorLabel | string | "Image loading" | ARIA label for screen readers. |
| counter | bool | true | Display current image index. |
| keyboard | bool | true | Allow keyboard navigation. |
| zoom | bool | true | Display zoom icon. |
| zoomText | string | "inline svg" | Text or HTML for the zoom icon. |
| docClose | bool | true | Click outside to close Tobii. |
| swipeClose | bool | true | Swipe up to close Tobii. |
| hideScrollbar | bool | true | Hide browser scrollbars if Tobii is displayed. |
| draggable | bool | true | Use dragging and touch swiping. |
| threshold | number | 100 | Touch and mouse dragging threshold (in px). |
| autoplayVideo | bool | false | Videos will automatically start playing as soon as they can do so without stopping to finish loading the data. |

## API

| Function | Description |
| --- | --- |
| `open(index, callback)` | Open Tobii. Optional with a specific slide with `index` (number). Optional `callback` (function) as a second argument. |
| `next(callback)` | Show the next slide. Optional `callback` (function). |
| `prev(callback)` | Show the previous slide. Optional `callback` (function). |
| `close(callback)` | Close Tobii. Optional `callback` (function). |
| `add(element, callback)` | Add an `element` (DOM element) ([example on CodePen](https://codepen.io/rqrauhvmra/pen/vzbXxQ)). Optional `callback` (function) as a second argument ([example on CodePen](https://codepen.io/rqrauhvmra/pen/qyEmXR)). |
| `remove(element, callback)` | Remove an `element` (DOM element). Optional `callback` (function) as a second argument. |
| `isOpen()` | Check if Tobii is open. |
| `currentSlide()` | Return the current slide index. |
| `selectGroup()` | Select a specific group. |
| `currentGroup()` | Return the current group. |
| `destroy()` | Destroy Tobii. Optional `callback` (function). |

## Browser support

Tobii has been tested in the following browsers (all the latest versions):

- Chrome
- Firefox
- Internet Explorer
- Edge
- Safari

## To do

- [ ] Support for `srcset` and `picture`

## Contributing

- Open an issue or a pull request to suggest changes or additions
- Spread the word

## License

Tobii is available under the MIT license. See the [LICENSE](https://github.com/rqrauhvmra/Tobii/blob/master/LICENSE.md) file for more info.
