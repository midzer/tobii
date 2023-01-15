# Tobii

[![Version](https://badgen.net/npm/v/@midzer/tobii)](https://github.com/midzer/tobii/releases)
[![License](https://badgen.net/npm/license/@midzer/tobii)](https://github.com/midzer/tobii/blob/master/LICENSE.md)
![Dependencies](https://badgen.net/npm/dependents/@midzer/tobii)
![npm bundle size](https://badgen.net/bundlephobia/minzip/@midzer/tobii)

An accessible, open-source lightbox with no dependencies.

[See it in Action](https://midzer.github.io/tobii/demo/)

![Open slide with a picture of the Berlin television tower](https://rqrauhvmra.com/tobi/tobi.png)

## Table of contents

- [Features](#features)
- [Get Tobii](#get-tobii)
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
- [Events](#events)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Features

- No dependencies
- Supports multiple content types:
  - Images
  - Inline HTML
  - Iframes
  - Videos (YouTube, Vimeo)
- Grouping
- Events
- Customizable with settings and CSS
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

## Get Tobii

### Download

CSS: `dist/tobii.min.css`

JavaScript:

* `dist/tobii.min.js`: IIFE build for maximum browser support, including IE 11
* `dist/tobii.mjs`: Build specially designed to work in all modern browsers
* `dist/tobii.module.js`: ESM build
* `dist/tobii.umd.js`: UMD build
* `dist/tobii.js`: CommonJS/Node build

### Package managers

Tobii is also available on npm.

`npm install @midzer/tobii --save`

## Usage

You can install Tobii by linking the `.css` and `.js` files to your HTML file. The HTML code may look like this:

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

The standard way of using Tobii is a linked thumbnail image with the class name `lightbox` to a larger image:

```html
<a href="path/to/image.jpg" class="lightbox">
  <img src="path/to/thumbnail.jpg" alt="I am a caption">
</a>
```

Instead of a thumbnail, you can also refer to a larger image with a text link:

```html
<a href="path/to/image.jpg" class="lightbox">
  Open image
</a>
```

If you use a Markdown parser or CMS and want to make all images in a post
automatically viewable in a lightbox, use the following JavaScript code to add
all images to the same album:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // This assumes your article is wrapped in an element with the class "content-article".
  document.querySelectorAll('.content-article img').forEach((articleImg) => {
    // Add lightbox elements in blog articles for Tobii.
    const lightbox = document.createElement('a');
    lightbox.href = articleImg.src;
    lightbox.classList.add('lightbox');
    lightbox.dataset.group = 'article';
    articleImg.parentNode.appendChild(lightbox);
    lightbox.appendChild(articleImg);
  });
});
```

### Inline-HTML

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

In both ways, the attribute `data-type` with the value `html` is required.

### Iframe

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

In both ways, the attribute `data-type` with the value `iframe` is required.

#### Optional attributes

- `data-height` set the height and `data-width` the width of the iframe.

### YouTube

For a YouTube video, create a link with the class name `lightbox` and a `data-id` attribute with the YouTube video ID:

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

In both ways, the attribute `data-type` with the value `youtube` is required.

#### Optional attributes

- `data-controls` indicates whether the video player controls are displayed: `0` do not display and `1` display controls in the player.
- `data-height` set the height and `data-width` the width of the player. I recommend using an external library for responsive iframes.

## Grouping

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
| captionText | function | null | Custom callback which returns the caption text for the current element. The first argument of the callback is the element. If set, `captionsSelector` and `captionAttribute` are ignored. |
| captionHTML | bool | false | Allow HTML captions. |
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
| draggable | bool | true | Use dragging and touch swiping. |
| threshold | number | 100 | Touch and mouse dragging threshold (in px). |
| autoplayVideo | bool | false | Videos will automatically start playing as soon as they can do so without stopping to finish loading the data. |
| autoplayAudio | bool | false | Audio will automatically start playing. |

### Data attributes

You can also use data attributes to customize HTML elements.

```js
<a href="path/to/image.jpg" class="lightbox" data-group="custom-group">
  Open image.
</a>
```

The following options are available:

| Property | Description |
| --- | --- |
| data-type | Sets media type. Possible values: `html`,`iframe`,`youtube`. |
| data-id | Required for youtube media type. |
| data-target | Can be used to set target for "iframe" and "html" types. |
| data-group | Set custom group |
| data-width | Set container width for iframe or youtube types.  |
| data-height | Set container height for iframe or youtube types. |
| data-controls | Indicates whether the video player controls are displayed: 0 do not display and 1 display controls in the player. |
| data-allow | Allows to set allow attribute on iframes. |
| data-srcset | Allows to have Responsive image or retina images  |
| data-zoom | Allows to enable or disable zoom icon. Values: "true" or "false"  |

## API

| Function | Description |
| --- | --- |
| `open(index)` | Open Tobii. Optional `index` (Integer), zero-based index of the slide to open. |
| `select(index)` | Select a slide with `index` (Integer), zero-based index of the slide to select. |
| `previous()` | Select the previous slide. |
| `next()` | Select the next slide. |
| `selectGroup(value)` | Select a group with `value` (string), name of the group to select. |
| `close()` | Close Tobii. |
| `add(element)` | Add `element` (DOM element). |
| `remove(element)` | Remove `element` (DOM element). |
| `isOpen()` | Check if Tobii is open. |
| `slidesIndex()` | Return the current slide index. |
| `slidesCount()` | Return the current number of slides. |
| `currentGroup()` | Return the current group name. |
| `reset()` | Reset Tobii. |
| `destroy()` | Destroy Tobii. |

## Events

Bind events with the `.on()` and `.off()` methods.

```js
const tobii = new Tobii()

const listener = function listener () {
  console.log('eventName happened')
}

// bind event listener
tobii.on(eventName, listener)

// unbind event listener
tobii.off(eventName, listener)
```

| eventName | Description |
| --- | --- |
| `open` | Triggered after Tobii has been opened. |
| `close` | Triggered after Tobii has been closed. |
| `previous` | Triggered after the previous slide is selected. |
| `next` | Triggered after the next slide is selected. |

## Browser support

Tobii supports the following browser (all the latest versions):

- Chrome
- Firefox
- Internet Explorer 11
- Edge
- Safari

## Build instructions
See [Wiki > Build instructions](https://github.com/midzer/tobii/wiki/Build-instructions)

## Contributing

- Open an issue or a pull request to suggest changes or additions
- Spread the word

## License

Tobii is available under the MIT license. See the [LICENSE](https://github.com/midzer/Tobii/blob/master/LICENSE.md) file for more info.
