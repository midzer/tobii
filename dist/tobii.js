class ImageType {
  constructor() {
    this.figcaptionId = 0;
    this.userSettings = null;
  }
  init(el, container, userSettings) {
    this.userSettings = userSettings;
    const FIGURE = document.createElement('figure');
    const IMAGE = document.createElement('img');
    const THUMBNAIL = el.querySelector('img');
    const LOADING_INDICATOR = document.createElement('div');

    // Accessibility: allow setting focus programmatically on figure elements.
    FIGURE.tabIndex = -1;

    // Add role="group" to figure
    FIGURE.setAttribute('role', 'group');

    // Hide figure until the image is loaded
    FIGURE.style.opacity = '0';
    if (THUMBNAIL) {
      IMAGE.alt = THUMBNAIL.alt || '';
    }
    IMAGE.setAttribute('data-src', el.href);
    if (el.hasAttribute('data-srcset')) {
      IMAGE.setAttribute('data-srcset', el.getAttribute('data-srcset'));
    }
    if (el.hasAttribute('data-sizes')) {
      IMAGE.setAttribute('data-sizes', el.getAttribute('data-sizes'));
    }

    // Add image to figure
    FIGURE.appendChild(IMAGE);

    // Create figcaption
    let captionContent;
    if (typeof this.userSettings.captionText === 'function') {
      captionContent = this.userSettings.captionText(el);
    } else if (this.userSettings.captionsSelector === 'self' && el.hasAttribute(this.userSettings.captionAttribute)) {
      captionContent = el.getAttribute(this.userSettings.captionAttribute);
    } else if (this.userSettings.captionsSelector === 'img' && THUMBNAIL && THUMBNAIL.hasAttribute(this.userSettings.captionAttribute)) {
      captionContent = THUMBNAIL.getAttribute(this.userSettings.captionAttribute);
    }
    if (this.userSettings.captions && captionContent) {
      const FIGCAPTION = document.createElement('figcaption');
      FIGCAPTION.id = `tobii-figcaption-${this.figcaptionId}`;
      const SPAN = document.createElement('span');
      if (this.userSettings.captionHTML) {
        SPAN.innerHTML = captionContent;
      } else {
        SPAN.textContent = captionContent;
      }
      FIGCAPTION.appendChild(SPAN);
      if (this.userSettings.captionToggle) {
        const BUTTON = document.createElement('button');
        BUTTON.className = 'caption-toggle';
        BUTTON.textContent = BUTTON.title = this.userSettings.captionToggleLabel[0];
        BUTTON.setAttribute('aria-controls', FIGCAPTION.id);
        BUTTON.setAttribute('aria-expanded', true);
        const preventAndStopEvent = event => {
          event.preventDefault();
          event.stopPropagation();
        };
        BUTTON.addEventListener('pointerdown', event => preventAndStopEvent(event));
        BUTTON.addEventListener('pointerup', event => preventAndStopEvent(event));
        BUTTON.addEventListener('click', event => {
          preventAndStopEvent(event);
          const isExpanded = BUTTON.getAttribute('aria-expanded') === 'true';
          const buttonLabel = isExpanded ? this.userSettings.captionToggleLabel[1] : this.userSettings.captionToggleLabel[0];
          BUTTON.textContent = BUTTON.title = buttonLabel;
          BUTTON.setAttribute('aria-expanded', !isExpanded);
          SPAN.setAttribute('aria-hidden', isExpanded);
        });
        FIGCAPTION.appendChild(BUTTON);
      }
      FIGURE.appendChild(FIGCAPTION);
      IMAGE.setAttribute('aria-labelledby', FIGCAPTION.id);

      // Add aria-label to the figure containing the caption content
      FIGURE.setAttribute('aria-label', SPAN.textContent);
      ++this.figcaptionId;
    }

    // Add figure to container
    container.appendChild(FIGURE);

    // Create loading indicator
    LOADING_INDICATOR.className = 'tobii__loader';
    LOADING_INDICATOR.setAttribute('role', 'progressbar');
    LOADING_INDICATOR.setAttribute('aria-label', this.userSettings.loadingIndicatorLabel);

    // Add loading indicator to container
    container.appendChild(LOADING_INDICATOR);

    // Register type
    container.setAttribute('data-type', 'image');
    container.classList.add('tobii-image');
  }
  onPreload(container) {
    // Same as preload
    this.onLoad(container);
  }
  onLoad(container) {
    const IMAGE = container.querySelector('img');
    if (!IMAGE.hasAttribute('data-src')) {
      return;
    }
    const FIGURE = container.querySelector('figure');
    const LOADING_INDICATOR = container.querySelector('.tobii__loader');
    const handleImageEvent = () => {
      container.removeChild(LOADING_INDICATOR);
      FIGURE.style.opacity = '1';
    };
    IMAGE.addEventListener('load', handleImageEvent);
    IMAGE.addEventListener('error', handleImageEvent);
    if (IMAGE.hasAttribute('data-srcset')) {
      IMAGE.setAttribute('srcset', IMAGE.getAttribute('data-srcset'));
      IMAGE.removeAttribute('data-srcset');
    }
    if (IMAGE.hasAttribute('data-sizes')) {
      IMAGE.setAttribute('sizes', IMAGE.getAttribute('data-sizes'));
      IMAGE.removeAttribute('data-sizes');
    }
    IMAGE.setAttribute('src', IMAGE.getAttribute('data-src'));
    IMAGE.removeAttribute('data-src');
  }
  onLeave(container) {
    // Nothing
  }
  onCleanup(container) {
    // Nothing
  }
  onReset() {
    this.figcaptionId = 0;
  }
}

class IframeType {
  constructor() {
    this.userSettings = null;
  }
  init(el, container, userSettings) {
    this.userSettings = userSettings;
    const HREF = el.hasAttribute('data-target') ? el.getAttribute('data-target') : el.getAttribute('href');
    container.setAttribute('data-HREF', HREF);
    if (el.hasAttribute('data-allow')) {
      container.setAttribute('data-allow', el.getAttribute('data-allow'));
    }
    if (el.hasAttribute('data-width')) {
      container.setAttribute('data-width', `${el.getAttribute('data-width')}`);
    }
    if (el.hasAttribute('data-height')) {
      container.setAttribute('data-height', `${el.getAttribute('data-height')}`);
    }

    // dont create empty iframes here - very slow

    // Register type
    container.setAttribute('data-type', 'iframe');
    container.classList.add('tobii-iframe');
  }
  onPreload(container) {
    // Nothing
  }
  onLoad(container) {
    let IFRAME = container.querySelector('iframe');

    // Create loading indicator
    const LOADING_INDICATOR = document.createElement('div');
    LOADING_INDICATOR.className = 'tobii__loader';
    LOADING_INDICATOR.setAttribute('role', 'progressbar');
    LOADING_INDICATOR.setAttribute('aria-label', this.userSettings.loadingIndicatorLabel);
    container.appendChild(LOADING_INDICATOR);
    if (IFRAME == null) {
      // create iframe
      IFRAME = document.createElement('iframe');
      const HREF = container.getAttribute('data-href');
      IFRAME.setAttribute('frameborder', '0');
      IFRAME.setAttribute('src', HREF);
      IFRAME.setAttribute('allowfullscreen', '');

      // set allow parameters
      if (HREF.indexOf('youtube.com') > -1) {
        IFRAME.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      } else if (HREF.indexOf('vimeo.com') > -1) {
        IFRAME.setAttribute('allow', 'autoplay; picture-in-picture');
      } else if (container.hasAttribute('data-allow')) {
        IFRAME.setAttribute('allow', container.getAttribute('data-allow'));
      }
      if (container.hasAttribute('data-width')) {
        IFRAME.style.maxWidth = `${container.getAttribute('data-width')}`;
      }
      if (container.hasAttribute('data-height')) {
        IFRAME.style.maxHeight = `${container.getAttribute('data-height')}`;
      }

      // Hide until loaded
      IFRAME.style.opacity = '0';

      // Add iframe to container
      container.appendChild(IFRAME);
      IFRAME.addEventListener('load', () => {
        IFRAME.style.opacity = '1';
        const LOADING_INDICATOR = container.querySelector('.tobii__loader');
        if (LOADING_INDICATOR) {
          container.removeChild(LOADING_INDICATOR);
        }
      });
      IFRAME.addEventListener('error', () => {
        IFRAME.style.opacity = '1';
        const LOADING_INDICATOR = container.querySelector('.tobii__loader');
        if (LOADING_INDICATOR) {
          container.removeChild(LOADING_INDICATOR);
        }
      });
    } else {
      // was already created
      IFRAME.setAttribute('src', container.getAttribute('data-href'));
    }
  }
  onLeave(container) {
    // Nothing
  }
  onCleanup(container) {
    const IFRAME = container.querySelector('iframe');
    IFRAME.setAttribute('src', '');
    IFRAME.style.opacity = '0';
  }
  onReset() {
    // Nothing
  }
}

class HtmlType {
  constructor() {
    this.userSettings = null;
  }
  init(el, container, userSettings) {
    this.userSettings = userSettings;
    const TARGET_SELECTOR = el.hasAttribute('data-target') ? el.getAttribute('data-target') : el.getAttribute('href');
    const TARGET = document.querySelector(TARGET_SELECTOR);
    if (!TARGET) {
      throw new Error(`Ups, I can't find the target ${TARGET_SELECTOR}.`);
    }

    // Add content to container
    container.appendChild(TARGET);

    // Register type
    container.setAttribute('data-type', 'html');
    container.classList.add('tobii-html');
  }
  onPreload(container) {
    // Nothing
  }
  onLoad(container, group) {
    const VIDEO = container.querySelector('video');
    if (VIDEO) {
      if (VIDEO.hasAttribute('data-time') && VIDEO.readyState > 0) {
        // Continue where video was stopped
        VIDEO.currentTime = VIDEO.getAttribute('data-time');
      }

      // Start playback (and loading if necessary)
      VIDEO.play();
    }
    const audio = container.querySelector('audio');
    if (audio) {
      // Start playback (and loading if necessary)
      audio.play();
    }
    container.classList.add('tobii-group-' + group);
  }
  onLeave(container) {
    const VIDEO = container.querySelector('video');
    if (VIDEO) {
      if (!VIDEO.paused) {
        // Stop if video is playing
        VIDEO.pause();
      }

      // Backup currentTime (needed for revisit)
      if (VIDEO.readyState > 0) {
        VIDEO.setAttribute('data-time', VIDEO.currentTime);
      }
    }
    const audio = container.querySelector('audio');
    if (audio) {
      if (!audio.paused) {
        // Stop if is playing
        audio.pause();
      }
    }
  }
  onCleanup(container) {
    const VIDEO = container.querySelector('video');
    if (VIDEO) {
      if (VIDEO.readyState > 0 && VIDEO.readyState < 3 && VIDEO.duration !== VIDEO.currentTime) {
        // Some data has been loaded but not the whole package.
        // In order to save bandwidth, stop downloading as soon as possible.
        const VIDEO_CLONE = VIDEO.cloneNode(true);
        this._removeSources(VIDEO);
        VIDEO.load();
        VIDEO.parentNode.removeChild(VIDEO);
        container.appendChild(VIDEO_CLONE);
      }
    }
  }
  onReset() {
    // Nothing
  }

  /**
   * Remove all `src` attributes
   *
   * @param {HTMLElement} el - Element to remove all `src` attributes
   */
  _removeSources(el) {
    const SOURCES = el.querySelectorAll('src');
    if (SOURCES) {
      SOURCES.forEach(source => {
        source.setAttribute('src', '');
      });
    }
  }
}

class YoutubeType {
  constructor() {
    this.playerId = 0;
    this.PLAYER = [];
    this.userSettings = null;
  }
  init(el, container, userSettings) {
    this.userSettings = userSettings;
    const IFRAME_PLACEHOLDER = document.createElement('div');

    // Add iframePlaceholder to container
    container.appendChild(IFRAME_PLACEHOLDER);
    this.PLAYER[this.playerId] = new window.YT.Player(IFRAME_PLACEHOLDER, {
      host: 'https://www.youtube-nocookie.com',
      height: el.getAttribute('data-height') || '360',
      width: el.getAttribute('data-width') || '640',
      videoId: el.getAttribute('data-id'),
      playerVars: {
        controls: el.getAttribute('data-controls') || 1,
        rel: 0,
        playsinline: 1
      }
    });

    // Set player ID
    container.setAttribute('data-player', this.playerId);

    // Register type
    container.setAttribute('data-type', 'youtube');
    container.classList.add('tobii-youtube');
    this.playerId++;
  }
  onPreload(container) {
    // Nothing
  }
  onLoad(container) {
    this.PLAYER[container.getAttribute('data-player')].playVideo();
  }
  onLeave(container) {
    if (this.PLAYER[container.getAttribute('data-player')].getPlayerState() === 1) {
      this.PLAYER[container.getAttribute('data-player')].pauseVideo();
    }
  }
  onCleanup(container) {
    if (this.PLAYER[container.getAttribute('data-player')].getPlayerState() === 1) {
      this.PLAYER[container.getAttribute('data-player')].pauseVideo();
    }
  }
  onReset() {
    // Nothing
  }
}

/**
 * Tobii
 *
 * @author midzer
 * @version 2.8.5
 * @url https://github.com/midzer/tobii
 *
 * MIT License
 */
function Tobii(userOptions) {
  /**
   * Global variables
   *
   */
  const SUPPORTED_ELEMENTS = {
    image: new ImageType(),
    // default
    html: new HtmlType(),
    iframe: new IframeType(),
    youtube: new YoutubeType()
  };
  const FOCUSABLE_ELEMENTS = ['a[href]:not([tabindex^="-"]):not([inert])', 'area[href]:not([tabindex^="-"]):not([inert])', 'input:not([disabled]):not([inert])', 'select:not([disabled]):not([inert])', 'textarea:not([disabled]):not([inert])', 'button:not([disabled]):not([inert])', 'iframe:not([tabindex^="-"]):not([inert])', 'audio:not([tabindex^="-"]):not([inert])', 'video:not([tabindex^="-"]):not([inert])', '[contenteditable]:not([tabindex^="-"]):not([inert])', '[tabindex]:not([tabindex^="-"]):not([inert])'];
  let userSettings = {};
  const WAITING_ELS = [];
  const GROUP_ATTS = {
    gallery: [],
    slider: null,
    sliderElements: [],
    elementsLength: 0,
    currentIndex: 0,
    x: 0
  };
  let lightbox = null;
  let prevButton = null;
  let nextButton = null;
  let closeButton = null;
  let counter = null;
  let lastFocus = null;
  let offset = null;
  let isYouTubeDependencyLoaded = false;
  let groups = {};
  let activeGroup = null;
  let pointerDownCache = [];
  let lastTapTime = 0;
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const DOUBLE_TAP_TIME = 500; // milliseconds
  const SCALE_SENSITIVITY = 10;
  const TRANSFORM = {
    element: null,
    originX: 0,
    originY: 0,
    translateX: 0,
    translateY: 0,
    scale: MIN_SCALE
  };
  const DRAG = {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    distance: 0
  };

  /**
   * Merge default options with user options
   *
   * @param {Object} userOptions - Optional user options
   * @returns {Object} - Custom options
   */
  const mergeOptions = userOptions => {
    // Default options
    const OPTIONS = {
      selector: '.lightbox',
      captions: true,
      captionsSelector: 'img',
      captionAttribute: 'alt',
      captionText: null,
      captionHTML: false,
      captionToggle: true,
      captionToggleLabel: ['Hide caption', 'Show caption'],
      nav: 'auto',
      navText: ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path stroke="none" d="M0 0h24v24H0z"/><polyline points="15 6 9 12 15 18" /></svg>', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path stroke="none" d="M0 0h24v24H0z"/><polyline points="9 6 15 12 9 18" /></svg>'],
      navLabel: ['Previous image', 'Next image'],
      close: true,
      closeText: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path stroke="none" d="M0 0h24v24H0z"/><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>',
      closeLabel: 'Close lightbox',
      dialogTitle: 'Lightbox',
      loadingIndicatorLabel: 'Image loading',
      counter: true,
      keyboard: true,
      zoom: false,
      zoomText: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path stroke="none" d="M0 0h24v24H0z"/><polyline points="16 4 20 4 20 8" /><line x1="14" y1="10" x2="20" y2="4" /><polyline points="8 20 4 20 4 16" /><line x1="4" y1="20" x2="10" y2="14" /><polyline points="16 20 20 20 20 16" /><line x1="14" y1="14" x2="20" y2="20" /><polyline points="8 4 4 4 4 8" /><line x1="4" y1="4" x2="10" y2="10" /></svg>',
      docClose: true,
      swipeClose: true,
      hideScrollbar: true,
      draggable: true,
      threshold: 100,
      theme: 'tobii--theme-default'
    };
    return {
      ...OPTIONS,
      ...userOptions
    };
  };

  /**
   * Init
   *
   */
  const init = userOptions => {
    // Merge user options into defaults
    userSettings = mergeOptions(userOptions);

    // Create the lightbox container
    lightbox = document.createElement('div');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', userSettings.dialogTitle);
    lightbox.classList.add('tobii');

    // Add theme class
    lightbox.classList.add(userSettings.theme);

    // Create the previous button
    prevButton = document.createElement('button');
    prevButton.className = 'tobii__btn tobii__btn--previous';
    prevButton.setAttribute('type', 'button');
    prevButton.setAttribute('aria-label', userSettings.navLabel[0]);
    prevButton.innerHTML = userSettings.navText[0];
    lightbox.appendChild(prevButton);

    // Create the next button
    nextButton = document.createElement('button');
    nextButton.className = 'tobii__btn tobii__btn--next';
    nextButton.setAttribute('type', 'button');
    nextButton.setAttribute('aria-label', userSettings.navLabel[1]);
    nextButton.innerHTML = userSettings.navText[1];
    lightbox.appendChild(nextButton);

    // Create the close button
    closeButton = document.createElement('button');
    closeButton.className = 'tobii__btn tobii__btn--close';
    closeButton.setAttribute('type', 'button');
    closeButton.setAttribute('aria-label', userSettings.closeLabel);
    closeButton.innerHTML = userSettings.closeText;
    lightbox.appendChild(closeButton);

    // Create the counter
    counter = document.createElement('div');
    counter.className = 'tobii__counter';
    lightbox.appendChild(counter);

    // Append to body
    document.body.appendChild(lightbox);

    // Init only
    if (!userSettings.selector) return;

    // Get a list of all elements within the document
    const LIGHTBOX_TRIGGER_ELS = document.querySelectorAll(userSettings.selector);
    if (!LIGHTBOX_TRIGGER_ELS) {
      throw new Error(`Ups, I can't find the selector ${userSettings.selector} on this website.`);
    }
    LIGHTBOX_TRIGGER_ELS.forEach(el => checkDependencies(el));
  };

  /**
   * Check dependencies
   *
   * @param {HTMLElement} el - Element to add
   */
  const checkDependencies = el => {
    // Check if there is a YouTube video and if the YouTube iframe-API is ready
    if (document.querySelector('[data-type="youtube"]') !== null && !isYouTubeDependencyLoaded) {
      if (document.getElementById('iframe_api') === null) {
        const TAG = document.createElement('script');
        const FIRST_SCRIPT_TAG = document.getElementsByTagName('script')[0];
        TAG.id = 'iframe_api';
        TAG.src = 'https://www.youtube.com/iframe_api';
        FIRST_SCRIPT_TAG.parentNode.insertBefore(TAG, FIRST_SCRIPT_TAG);
      }
      if (WAITING_ELS.indexOf(el) === -1) {
        WAITING_ELS.push(el);
      }
      window.onYouTubePlayerAPIReady = () => {
        WAITING_ELS.forEach(waitingEl => {
          add(waitingEl);
        });
        isYouTubeDependencyLoaded = true;
      };
    } else {
      add(el);
    }
  };

  /**
   * Get group name from element
   *
   * @param {HTMLElement} el
   * @return {string}
   */
  const getGroupName = el => {
    return el.hasAttribute('data-group') ? el.getAttribute('data-group') : 'default';
  };

  /**
   * Copy an object. (The secure way)
   *
   * @param {object} object
   * @return {object}
   */
  const copyObject = object => {
    return JSON.parse(JSON.stringify(object));
  };

  /**
   * Add element
   *
   * @param {HTMLElement} el - Element to add
   */
  const add = el => {
    const newGroup = getGroupName(el);
    if (!Object.prototype.hasOwnProperty.call(groups, newGroup)) {
      groups[newGroup] = copyObject(GROUP_ATTS);

      // Create slider
      groups[newGroup].slider = document.createElement('div');
      groups[newGroup].slider.className = 'tobii__slider';

      // Hide slider
      groups[newGroup].slider.setAttribute('aria-hidden', 'true');
      lightbox.appendChild(groups[newGroup].slider);
    }

    // Check if element already exists
    if (groups[newGroup].gallery.indexOf(el) === -1) {
      groups[newGroup].gallery.push(el);
      groups[newGroup].elementsLength++;

      // Set zoom icon if necessary
      if (userSettings.zoom && el.querySelector('img') && el.getAttribute('data-zoom') !== 'false' || el.getAttribute('data-zoom') === 'true') {
        const TOBII_ZOOM = document.createElement('div');
        TOBII_ZOOM.className = 'tobii-zoom__icon';
        TOBII_ZOOM.innerHTML = userSettings.zoomText;
        el.classList.add('tobii-zoom');
        el.appendChild(TOBII_ZOOM);
      }

      // Bind click event handler
      el.addEventListener('click', triggerTobii);

      // Create slide
      const SLIDER_ELEMENT = document.createElement('div');
      const SLIDER_ELEMENT_CONTENT = document.createElement('div');
      SLIDER_ELEMENT.className = 'tobii__slide';
      SLIDER_ELEMENT.style.position = 'absolute';
      SLIDER_ELEMENT.style.left = `${groups[newGroup].x * 100}%`;

      // Hide slide
      SLIDER_ELEMENT.setAttribute('aria-hidden', 'true');

      // Create type elements
      const model = getModel(el);
      model.init(el, SLIDER_ELEMENT_CONTENT, userSettings);

      // Add slide content container to slider element
      SLIDER_ELEMENT.appendChild(SLIDER_ELEMENT_CONTENT);

      // Add slider element to slider
      groups[newGroup].slider.appendChild(SLIDER_ELEMENT);
      groups[newGroup].sliderElements.push(SLIDER_ELEMENT);
      ++groups[newGroup].x;
      if (isOpen() && newGroup === activeGroup) {
        updateConfig();
        updateLightbox();
      }
    } else {
      throw new Error('Ups, element already added.');
    }
  };

  /**
   * Remove element
   *
   * @param {HTMLElement} el - Element to remove
   */
  const remove = el => {
    const GROUP_NAME = getGroupName(el);

    // Check if element exists
    if (groups[GROUP_NAME].gallery.indexOf(el) === -1) {
      throw new Error(`Ups, I can't find a slide for the element ${el}.`);
    } else {
      const SLIDE_INDEX = groups[GROUP_NAME].gallery.indexOf(el);
      const SLIDE_EL = groups[GROUP_NAME].sliderElements[SLIDE_INDEX];

      // If the element to be removed is the currently visible slide
      if (isOpen() && GROUP_NAME === activeGroup && SLIDE_INDEX === groups[GROUP_NAME].currentIndex) {
        if (groups[GROUP_NAME].elementsLength === 1) {
          close();
          throw new Error('Ups, I\'ve closed. There are no slides more to show.');
        } else {
          // TODO If there is only one slide left, deactivate horizontal dragging/ swiping
          // TODO Set new absolute position per slide

          // If the first slide is displayed
          if (groups[GROUP_NAME].currentIndex === 0) {
            next();
          } else {
            previous();
          }
          updateConfig();
          updateLightbox();
        }
      }
      groups[GROUP_NAME].gallery.splice(groups[GROUP_NAME].gallery.indexOf(el));
      groups[GROUP_NAME].sliderElements.splice(groups[GROUP_NAME].gallery.indexOf(el));
      groups[GROUP_NAME].elementsLength--;
      --groups[GROUP_NAME].x;

      // Remove zoom icon if necessary
      if (userSettings.zoom && el.querySelector('.tobii-zoom__icon')) {
        const ZOOM_ICON = el.querySelector('.tobii-zoom__icon');
        ZOOM_ICON.parentNode.classList.remove('tobii-zoom');
        ZOOM_ICON.parentNode.removeChild(ZOOM_ICON);
      }

      // Unbind click event handler
      el.removeEventListener('click', triggerTobii);

      // Remove slide
      SLIDE_EL.parentNode.removeChild(SLIDE_EL);
    }
  };
  const getModel = el => {
    const type = el.getAttribute('data-type');
    if (SUPPORTED_ELEMENTS[type] !== undefined) {
      return SUPPORTED_ELEMENTS[type];
    } else {
      // unknown - use default
      if (el.hasAttribute('data-type')) {
        console.log('Unknown lightbox element type: ' + type);
      }
      return SUPPORTED_ELEMENTS.image;
    }
  };

  /**
   * Open Tobii
   *
   * @param {number} index - Index to load
   */
  const open = (index = 0) => {
    if (isOpen()) {
      throw new Error('Ups, I\'m aleady open.');
    }
    if (index === -1 || index >= groups[activeGroup].elementsLength) {
      throw new Error(`Ups, I can't find slide ${index}.`);
    }
    document.documentElement.classList.add('tobii-is-open');
    document.body.classList.add('tobii-is-open');
    document.body.classList.add('tobii-is-open-' + activeGroup);
    updateConfig();

    // Hide close if necessary
    if (!userSettings.close) {
      closeButton.disabled = false;
      closeButton.setAttribute('aria-hidden', 'true');
    }

    // Save user’s focus
    lastFocus = document.activeElement;

    // Use `history.pushState()` to make sure the "Back" button behavior
    // that aligns with the user's expectations
    const stateObj = {
      tobii: 'close'
    };
    const url = window.location.href;
    window.history.pushState(stateObj, 'Image', url);

    // Set current index
    groups[activeGroup].currentIndex = index;
    bindEvents();

    // Load slide
    load(groups[activeGroup].currentIndex);

    // Show slider
    groups[activeGroup].slider.setAttribute('aria-hidden', 'false');

    // Show lightbox
    lightbox.setAttribute('aria-hidden', 'false');
    updateLightbox();

    // Preload previous and next slide
    preload(groups[activeGroup].currentIndex + 1);
    preload(groups[activeGroup].currentIndex - 1);
    groups[activeGroup].slider.classList.add('tobii__slider--animate');

    // Create and dispatch a new event
    const openEvent = new window.CustomEvent('open', {
      detail: {
        group: activeGroup
      }
    });
    lightbox.dispatchEvent(openEvent);
  };

  /**
   * Close Tobii
   *
   */
  const close = () => {
    if (!isOpen()) {
      throw new Error('Ups, I\'m already closed.');
    }
    document.documentElement.classList.remove('tobii-is-open');
    document.body.classList.remove('tobii-is-open');
    document.body.classList.remove('tobii-is-open-' + activeGroup);
    unbindEvents();

    // Remove entry in browser history
    if (window.history.state !== null) {
      if (window.history.state.tobii === 'close') {
        window.history.back();
      }
    }

    // Reenable the user’s focus
    lastFocus.focus();

    // Don't forget to cleanup our current element
    leave(groups[activeGroup].currentIndex);
    cleanup(groups[activeGroup].currentIndex);

    // Hide lightbox
    lightbox.setAttribute('aria-hidden', 'true');

    // Hide slider
    groups[activeGroup].slider.setAttribute('aria-hidden', 'true');

    // Reset current index
    groups[activeGroup].currentIndex = 0;

    // Remove the hack to prevent animation during opening
    groups[activeGroup].slider.classList.remove('tobii__slider--animate');

    // Create and dispatch a new event
    const closeEvent = new window.CustomEvent('close', {
      detail: {
        group: activeGroup
      }
    });
    lightbox.dispatchEvent(closeEvent);
  };

  /**
   * Preload slide
   *
   * @param {number} index - Index to preload
   */
  const preload = index => {
    if (groups[activeGroup].sliderElements[index] === undefined) {
      return;
    }
    const CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]');
    const model = getModel(CONTAINER);
    model.onPreload(CONTAINER);
  };

  /**
   * Load slide
   * Will be called when opening the lightbox or moving index
   *
   * @param {number} index - Index to load
   */
  const load = index => {
    if (groups[activeGroup].sliderElements[index] === undefined) {
      return;
    }
    const CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]');
    const model = getModel(CONTAINER);

    // Add active slide class
    groups[activeGroup].sliderElements[index].classList.add('tobii__slide--is-active');
    groups[activeGroup].sliderElements[index].setAttribute('aria-hidden', 'false');
    model.onLoad(CONTAINER, activeGroup);
  };

  /**
   * Select a slide
   *
   * @param {number} index - Index to select
   */
  const select = index => {
    const currIndex = groups[activeGroup].currentIndex;
    if (!isOpen()) {
      throw new Error('Ups, I\'m closed.');
    }
    if (isOpen()) {
      if (!index && index !== 0) {
        throw new Error('Ups, no slide specified.');
      }
      if (index === groups[activeGroup].currentIndex) {
        throw new Error(`Ups, slide ${index} is already selected.`);
      }
      if (index === -1 || index >= groups[activeGroup].elementsLength) {
        throw new Error(`Ups, I can't find slide ${index}.`);
      }
    }

    // Set current index
    groups[activeGroup].currentIndex = index;
    leave(currIndex);
    load(index);
    if (index < currIndex) {
      updateLightbox('left');
      cleanup(currIndex);
      preload(index - 1);
    }
    if (index > currIndex) {
      updateLightbox('right');
      cleanup(currIndex);
      preload(index + 1);
    }
  };

  /**
   * Select the previous slide
   *
   */
  const previous = () => {
    if (!isOpen()) {
      throw new Error('Ups, I\'m closed.');
    }
    if (groups[activeGroup].currentIndex > 0) {
      leave(groups[activeGroup].currentIndex);
      load(--groups[activeGroup].currentIndex);
      updateLightbox('left');
      cleanup(groups[activeGroup].currentIndex + 1);
      preload(groups[activeGroup].currentIndex - 1);
    }

    // Create and dispatch a new event
    const previousEvent = new window.CustomEvent('previous', {
      detail: {
        group: activeGroup
      }
    });
    lightbox.dispatchEvent(previousEvent);
  };

  /**
   * Select the next slide
   *
   */
  const next = () => {
    if (!isOpen()) {
      throw new Error('Ups, I\'m closed.');
    }
    if (groups[activeGroup].currentIndex < groups[activeGroup].elementsLength - 1) {
      leave(groups[activeGroup].currentIndex);
      load(++groups[activeGroup].currentIndex);
      updateLightbox('right');
      cleanup(groups[activeGroup].currentIndex - 1);
      preload(groups[activeGroup].currentIndex + 1);
    }

    // Create and dispatch a new event
    const nextEvent = new window.CustomEvent('next', {
      detail: {
        group: activeGroup
      }
    });
    lightbox.dispatchEvent(nextEvent);
  };

  /**
   * Select a group
   *
   * @param {string} name - Name of the group to select
   */
  const selectGroup = name => {
    if (isOpen()) {
      throw new Error('Ups, I\'m open.');
    }
    if (!name) {
      throw new Error('Ups, no group specified.');
    }
    if (name && !Object.prototype.hasOwnProperty.call(groups, name)) {
      throw new Error(`Ups, I don't have a group called "${name}".`);
    }
    activeGroup = name;
  };

  /**
   * Leave slide
   * Will be called before moving index
   *
   * @param {number} index - Index to leave
   */
  const leave = index => {
    if (groups[activeGroup].sliderElements[index] === undefined) {
      return;
    }
    const CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]');
    const model = getModel(CONTAINER);

    // Remove active slide class
    groups[activeGroup].sliderElements[index].classList.remove('tobii__slide--is-active');
    groups[activeGroup].sliderElements[index].setAttribute('aria-hidden', 'true');
    model.onLeave(CONTAINER);
  };

  /**
   * Cleanup slide
   * Will be called after moving index
   *
   * @param {number} index - Index to cleanup
   */
  const cleanup = index => {
    if (groups[activeGroup].sliderElements[index] === undefined) {
      return;
    }
    const CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]');
    const model = getModel(CONTAINER);
    model.onCleanup(CONTAINER);
    DRAG.startX = 0;
    DRAG.startY = 0;
    DRAG.x = 0;
    DRAG.y = 0;
    DRAG.distance = 0;
    lastTapTime = 0;
    if (isZoomed()) resetZoom();
    TRANSFORM.element = null;
  };

  /**
   * Update offset
   *
   */
  const updateOffset = () => {
    offset = -groups[activeGroup].currentIndex * lightbox.offsetWidth;
    groups[activeGroup].slider.style.transform = `translate(${offset}px, 0)`;
  };

  /**
   * Update counter
   *
   */
  const updateCounter = () => {
    counter.innerHTML = `<p>${groups[activeGroup].currentIndex + 1}/${groups[activeGroup].elementsLength}</p>`;
  };

  /**
   * Update focus
   *
   * @param {string|null} dir - Current slide direction
   */
  const updateFocus = dir => {
    const group = groups[activeGroup];
    const isNavEnabled = userSettings.nav === true || userSettings.nav === 'auto';
    const hasMultipleSlides = group.elementsLength > 1;
    if (isNavEnabled && !isTouchDevice() && hasMultipleSlides) {
      setButtonState(prevButton, true, true);
      setButtonState(nextButton, true, true);
      if (group.currentIndex === 0) {
        setButtonState(nextButton, false, false);
        nextButton.focus();
      } else if (group.currentIndex === group.elementsLength - 1) {
        setButtonState(prevButton, false, false);
        prevButton.focus();
      } else {
        setButtonState(prevButton, false, false);
        setButtonState(nextButton, false, false);
        if (dir === 'left') {
          prevButton.focus();
        } else {
          nextButton.focus();
        }
      }
    } else if (userSettings.close) {
      closeButton.focus();
    }
    if (hasMultipleSlides && group.currentIndex !== 0) {
      const focusableFigure = getFocusableFigure();
      if (focusableFigure) {
        // Small delay to avoid display bug
        setTimeout(() => {
          focusableFigure.focus();
        }, 250);
      }
    }
  };

  /**
   * Resize event
   *
   */
  const resizeHandler = () => {
    updateOffset();
  };

  /**
   * Click event handler to trigger Tobii
   *
   */
  const triggerTobii = event => {
    event.preventDefault();
    activeGroup = getGroupName(event.currentTarget);
    open(groups[activeGroup].gallery.indexOf(event.currentTarget));
  };

  /**
   * Click event handler
   *
   */
  const clickHandler = event => {
    if (event.target === prevButton) {
      previous();
    } else if (event.target === nextButton) {
      next();
    } else if (event.target === closeButton || event.target.classList.contains('tobii__slide') || event.target.classList.contains('tobii') && userSettings.docClose) {
      close();
    }
    event.stopPropagation();
  };

  /**
   * Get the focusable children of the given element
   *
   * @return {Array<Element>}
   */
  const getFocusableChildren = () => {
    return Array.prototype.slice.call(lightbox.querySelectorAll(`.tobii__btn:not([disabled]), .tobii__slide--is-active ${FOCUSABLE_ELEMENTS.join(', .tobii__slide--is-active ')}`)).filter(child => {
      return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
    });
  };

  /**
   * Get the programmatically focusable figure of the given element
   *
   * @return {Element|null}
   */
  const getFocusableFigure = () => {
    return lightbox.querySelector('.tobii__slide--is-active figure[tabindex="-1"]');
  };

  /**
   * Set the hidden/disabled state of a button
   *
   */
  const setButtonState = (button, hidden, disabled) => {
    button.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    button.disabled = disabled;
  };

  /**
   * Keydown event handler
   *
   */
  const keydownHandler = event => {
    const FOCUSABLE_CHILDREN = getFocusableChildren();
    const FOCUSED_ITEM_INDEX = FOCUSABLE_CHILDREN.indexOf(document.activeElement);
    if (event.code === 'Tab') {
      // If the SHIFT key is being pressed while tabbing (moving backwards) and
      // the currently focused item is the first one, move the focus to the last
      // focusable item from the slide
      if (event.shiftKey && FOCUSED_ITEM_INDEX === 0) {
        FOCUSABLE_CHILDREN[FOCUSABLE_CHILDREN.length - 1].focus();
        event.preventDefault();
        // If the SHIFT key is not being pressed (moving forwards) and the currently
        // focused item is the last one, move the focus to the first focusable item
        // from the slide
      } else if (!event.shiftKey && (FOCUSED_ITEM_INDEX === FOCUSABLE_CHILDREN.length - 1 || FOCUSED_ITEM_INDEX === -1)) {
        FOCUSABLE_CHILDREN[0].focus();
        event.preventDefault();
      }
    } else if (event.code === 'Escape') {
      // `ESC` Key: Close Tobii
      event.preventDefault();
      close();
    } else if (event.code === 'ArrowLeft') {
      // `PREV` Key: Show the previous slide
      event.preventDefault();
      previous();
    } else if (event.code === 'ArrowRight') {
      // `NEXT` Key: Show the next slide
      event.preventDefault();
      next();
    }
  };

  /**
   * Contextmenu event handler
   * This is a fix for chromium based browser on mac.
   * The 'contextmenu' terminates a mouse event sequence.
   * https://bugs.chromium.org/p/chromium/issues/detail?id=506801
   *
   */
  const contextmenuHandler = () => {
    pointerDownCache = [];
    updateOffset();
    groups[activeGroup].slider.classList.remove('tobii__slider--is-' + (isZoomed() ? 'moving' : 'dragging'));
  };

  /**
   * Pointerdown event handler
   *
   */
  const pointerdownHandler = event => {
    // Prevent dragging / swiping on textareas, inputs and selects
    if (isIgnoreElement(event.target)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    DRAG.startX = DRAG.x = event.clientX;
    DRAG.startY = DRAG.y = event.clientY;
    DRAG.distance = 0;

    // This event is cached to support 2-finger gestures
    pointerDownCache.push(event);
    if (pointerDownCache.length === 2) {
      const {
        x,
        y
      } = midPoint(pointerDownCache[0].clientX, pointerDownCache[0].clientY, pointerDownCache[1].clientX, pointerDownCache[1].clientY);
      DRAG.startX = DRAG.x = x;
      DRAG.startY = DRAG.y = y;
      DRAG.distance = distance(pointerDownCache[0].clientX - pointerDownCache[1].clientX, pointerDownCache[0].clientY - pointerDownCache[1].clientY) / TRANSFORM.scale;
    }
  };

  /**
   * Pointermove event handler
   *
   */
  const pointermoveHandler = event => {
    if (!pointerDownCache.length) return;
    groups[activeGroup].slider.classList.add('tobii__slider--is-' + (isZoomed() ? 'moving' : 'dragging'));

    // Find this event in the cache and update its record with this event
    const index = pointerDownCache.findIndex(cachedEv => cachedEv.pointerId === event.pointerId);
    pointerDownCache[index] = event;
    if (pointerDownCache.length === 2) {
      // 2-pointer horizontal pinch/zoom gesture
      const {
        x,
        y
      } = midPoint(pointerDownCache[0].clientX, pointerDownCache[0].clientY, pointerDownCache[1].clientX, pointerDownCache[1].clientY);
      const scale = distance(pointerDownCache[0].clientX - pointerDownCache[1].clientX, pointerDownCache[0].clientY - pointerDownCache[1].clientY) / DRAG.distance;
      zoomPan(event.target, clamp(scale, MIN_SCALE, MAX_SCALE), x, y, x - DRAG.x, y - DRAG.y);
      DRAG.x = x;
      DRAG.y = y;
      return;
    }
    if (isZoomed()) {
      const deltaX = event.clientX - DRAG.x;
      const deltaY = event.clientY - DRAG.y;
      pan(deltaX, deltaY);
    }
    DRAG.x = event.clientX;
    DRAG.y = event.clientY;
    if (!isZoomed()) {
      // Drag animation
      const deltaX = DRAG.startX - DRAG.x;
      const deltaY = DRAG.startY - DRAG.y;

      // Skip animation if drag distance is too low
      if (distance(deltaX, deltaY) < 10) return;
      if (Math.abs(deltaX) > Math.abs(deltaY) && groups[activeGroup].elementsLength > 1) {
        // Horizontal swipe
        groups[activeGroup].slider.style.transform = `translate(${offset - Math.round(deltaX)}px, 0)`;
      } else if (userSettings.swipeClose) {
        // Vertical swipe
        groups[activeGroup].slider.style.transform = `translate(${offset}px, -${Math.round(deltaY)}px)`;
      }
    }
  };

  /**
   * Pointerup event handler
   *
   */
  const pointerupHandler = event => {
    // Intercept regular click handler
    if (!pointerDownCache.length) return;
    groups[activeGroup].slider.classList.remove('tobii__slider--is-' + (isZoomed() ? 'moving' : 'dragging'));

    // Remove this event from the target's cache
    const index = pointerDownCache.findIndex(cachedEv => cachedEv.pointerId === event.pointerId);
    pointerDownCache.splice(index, 1);
    const x = event.clientX;
    const y = event.clientY;
    const deltaX = DRAG.startX - x;
    const deltaY = DRAG.startY - y;
    const distanceX = Math.abs(deltaX);
    const distanceY = Math.abs(deltaY);
    if (distanceX > 8 || distanceY > 8) {
      if (!isZoomed()) {
        // Evaluate drag
        if (deltaX < 0 && distanceX > userSettings.threshold && groups[activeGroup].currentIndex > 0) {
          previous();
        } else if (deltaX > 0 && distanceX > userSettings.threshold && groups[activeGroup].currentIndex !== groups[activeGroup].elementsLength - 1) {
          next();
        } else if (deltaY > 0 && distanceY > userSettings.threshold && userSettings.swipeClose) {
          close();
        } else {
          updateOffset();
        }
      }
    } else {
      // Evaluate tap
      const now = Date.now();
      const tapLength = now - lastTapTime;
      if (tapLength < DOUBLE_TAP_TIME && tapLength > 100) {
        // Double click
        event.preventDefault();
        lastTapTime = 0;
        if (isZoomed()) {
          resetZoom();
        } else {
          zoomPan(event.target, MAX_SCALE / 2, x, y, 0, 0);
        }
      } else {
        lastTapTime = now;
        if (isTouchDevice()) {
          // Delayed tap on mobile
          window.setTimeout(() => {
            const {
              left,
              top,
              bottom,
              right,
              width
            } = event.target.getBoundingClientRect();
            if (y < top || y > bottom || !lastTapTime) return;
            if (x > left && x < left + width / 2) {
              previous();
            } else if (x < right && x > right - width / 2) {
              next();
            }
          }, DOUBLE_TAP_TIME);
        }
      }
    }
  };

  /**
   * Wheel event handler
   *
   */
  const wheelHandler = event => {
    const deltaScale = Math.sign(event.deltaY) > 0 ? -1 : 1;
    if (!isZoomed() && !deltaScale) return;
    event.preventDefault();
    const newScale = TRANSFORM.scale + deltaScale / (SCALE_SENSITIVITY / TRANSFORM.scale);
    zoomPan(event.target, clamp(newScale, MIN_SCALE, MAX_SCALE), event.clientX, event.clientY, 0, 0);
  };
  const clampedTranslate = (axis, translate) => {
    // Whole clamping functionality heavily inspired
    // by https://github.com/Neophen/pinch-zoom-pan
    const {
      element,
      scale,
      originX,
      originY
    } = TRANSFORM;
    const axisIsX = axis === 'x';
    const origin = axisIsX ? originX : originY;
    const axisKey = axisIsX ? 'offsetWidth' : 'offsetHeight';
    const containerSize = element.parentNode[axisKey];
    const imageSize = element[axisKey];
    const bounds = element.getBoundingClientRect();
    const imageScaledSize = axisIsX ? bounds.width : bounds.height;
    const defaultOrigin = imageSize / 2;
    const originOffset = (origin - defaultOrigin) * (scale - 1);
    const range = Math.max(0, Math.round(imageScaledSize) - containerSize);
    const max = Math.round(range / 2);
    const min = 0 - max;
    return clamp(translate, min + originOffset, max + originOffset);
  };
  const clamp = (value, min, max) => Math.max(Math.min(value, max), min);
  const isZoomed = () => TRANSFORM.scale !== MIN_SCALE;
  const pan = (deltaX, deltaY) => {
    if (deltaX !== 0) {
      TRANSFORM.translateX = clampedTranslate('x', TRANSFORM.translateX + deltaX);
    }
    if (deltaY !== 0) {
      TRANSFORM.translateY = clampedTranslate('y', TRANSFORM.translateY + deltaY);
    }
    const {
      element,
      originX,
      originY,
      translateX,
      translateY,
      scale
    } = TRANSFORM;
    element.style.transformOrigin = `${originX}px ${originY}px`;
    element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  };
  const zoomPan = (el, newScale, x, y, deltaX, deltaY) => {
    if (el.tagName !== 'IMG') return;
    const {
      left,
      top
    } = el.getBoundingClientRect();
    const originX = x - left;
    const originY = y - top;
    const newOriginX = originX / TRANSFORM.scale;
    const newOriginY = originY / TRANSFORM.scale;
    TRANSFORM.element = el;
    TRANSFORM.originX = newOriginX;
    TRANSFORM.originY = newOriginY;
    TRANSFORM.scale = newScale;
    pan(deltaX, deltaY);
  };
  const distance = (dx, dy) => Math.hypot(dx, dy);
  const midPoint = (x1, y1, x2, y2) => ({
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2
  });
  const resetZoom = () => {
    TRANSFORM.scale = MIN_SCALE;
    TRANSFORM.originX = 0;
    TRANSFORM.originY = 0;
    TRANSFORM.translateX = 0;
    TRANSFORM.translateY = 0;
    pan(0, 0);
  };

  /**
   * Bind events
   *
   */
  const bindEvents = () => {
    if (userSettings.keyboard) {
      window.addEventListener('keydown', keydownHandler);
    }

    // Resize event
    window.addEventListener('resize', resizeHandler);

    // Popstate event
    window.addEventListener('popstate', close);

    // Click event
    on('click', clickHandler);
    if (userSettings.draggable) {
      // Pointer events
      on('pointerdown', pointerdownHandler);
      on('pointermove', pointermoveHandler);
      on('pointerup', pointerupHandler);
      on('pointercancel', contextmenuHandler);
      on('pointerout', contextmenuHandler);
      on('pointerleave', contextmenuHandler);
      on('contextmenu', contextmenuHandler);
    }

    // Wheel event
    on('wheel', wheelHandler);
  };

  /**
   * Unbind events
   *
   */
  const unbindEvents = () => {
    if (userSettings.keyboard) {
      window.removeEventListener('keydown', keydownHandler);
    }

    // Resize event
    window.removeEventListener('resize', resizeHandler);

    // Popstate event
    window.removeEventListener('popstate', close);

    // Click event
    off('click', clickHandler);
    if (userSettings.draggable) {
      // Pointer events
      off('pointerdown', pointerdownHandler);
      off('pointermove', pointermoveHandler);
      off('pointerup', pointerupHandler);
      off('pointercancel', contextmenuHandler);
      off('pointerout', contextmenuHandler);
      off('pointerleave', contextmenuHandler);
      off('contextmenu', contextmenuHandler);
    }

    // Wheel event
    off('wheel', wheelHandler);
  };

  /**
   * Update userSettings
   *
   */
  const updateConfig = () => {
    const group = groups[activeGroup];
    const slider = group.slider;
    if (userSettings.draggable && !slider.classList.contains('tobii__slider--is-draggable')) {
      slider.classList.add('tobii__slider--is-draggable');
    }
    const hideButtons = !userSettings.nav || group.elementsLength === 1 || userSettings.nav === 'auto' && isTouchDevice();
    setButtonState(prevButton, hideButtons, hideButtons);
    setButtonState(nextButton, hideButtons, hideButtons);
    const hideCounter = !userSettings.counter || group.elementsLength === 1;
    counter.setAttribute('aria-hidden', hideCounter ? 'true' : 'false');
  };

  /**
   * Update lightbox
   *
   * @param {string|null} dir - Current slide direction
   */
  const updateLightbox = (dir = null) => {
    updateOffset();
    updateCounter();
    updateFocus(dir);
  };

  /**
   * Reset Tobii
   *
   */
  const reset = () => {
    if (isOpen()) {
      close();
    }

    // TODO Cleanup
    const GROUPS_ENTRIES = Object.entries(groups);
    GROUPS_ENTRIES.forEach(groupsEntrie => {
      const SLIDE_ELS = groupsEntrie[1].gallery;

      // Remove slides
      SLIDE_ELS.forEach(slideEl => {
        remove(slideEl);
      });
    });
    groups = {};
    activeGroup = null;
    for (const i in SUPPORTED_ELEMENTS) {
      SUPPORTED_ELEMENTS[i].onReset();
    }

    // TODO
  };

  /**
   * Destroy Tobii
   *
   */
  const destroy = () => {
    reset();
    lightbox.parentNode.removeChild(lightbox);
  };

  /**
   * Check if Tobii is open
   *
   */
  const isOpen = () => {
    return lightbox.getAttribute('aria-hidden') === 'false';
  };

  /**
   * Detect whether device is touch capable
   *
   */
  const isTouchDevice = () => {
    return 'ontouchstart' in window;
  };

  /**
   * Checks whether element's tagName is part of array
   *
   */
  const isIgnoreElement = el => {
    return ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(el.tagName) !== -1 || el === prevButton || el === nextButton || el === closeButton;
  };

  /**
   * Return current index
   *
   */
  const slidesIndex = () => {
    return groups[activeGroup].currentIndex;
  };

  /**
   * Return elements length
   *
   */
  const slidesCount = () => {
    return groups[activeGroup].elementsLength;
  };

  /**
   * Return current group
   *
   */
  const currentGroup = () => {
    return activeGroup;
  };

  /**
   * Bind events
   * @param {String} eventName
   * @param {function} callback - callback to call
   *
   */
  const on = (eventName, callback) => {
    lightbox.addEventListener(eventName, callback);
  };

  /**
   * Unbind events
   * @param {String} eventName
   * @param {function} callback - callback to call
   *
   */
  const off = (eventName, callback) => {
    lightbox.removeEventListener(eventName, callback);
  };
  init(userOptions);
  Tobii.open = open;
  Tobii.previous = previous;
  Tobii.next = next;
  Tobii.close = close;
  Tobii.add = checkDependencies;
  Tobii.remove = remove;
  Tobii.reset = reset;
  Tobii.destroy = destroy;
  Tobii.isOpen = isOpen;
  Tobii.slidesIndex = slidesIndex;
  Tobii.select = select;
  Tobii.slidesCount = slidesCount;
  Tobii.selectGroup = selectGroup;
  Tobii.currentGroup = currentGroup;
  Tobii.on = on;
  Tobii.off = off;
  return Tobii;
}

module.exports = Tobii;
