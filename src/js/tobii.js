/**
 * Tobii
 *
 * @author rqrauhvmra
 * @version 2.0.0-beta
 * @url https://github.com/rqrauhvmra/Tobii
 *
 * MIT License
 */
export default function Tobii (userOptions) {
  /**
   * Global variables
   *
   */
  const BROWSER_WINDOW = window
  const FOCUSABLE_ELEMENTS = [
    'a[href]:not([tabindex^="-"]):not([inert])',
    'area[href]:not([tabindex^="-"]):not([inert])',
    'input:not([disabled]):not([inert])',
    'select:not([disabled]):not([inert])',
    'textarea:not([disabled]):not([inert])',
    'button:not([disabled]):not([inert])',
    'iframe:not([tabindex^="-"]):not([inert])',
    'audio:not([tabindex^="-"]):not([inert])',
    'video:not([tabindex^="-"]):not([inert])',
    '[contenteditable]:not([tabindex^="-"]):not([inert])',
    '[tabindex]:not([tabindex^="-"]):not([inert])'
  ]
  const WAITING_ELS = []
  const GROUP_ATTS = {
    gallery: [],
    slider: null,
    sliderElements: [],
    elementsLength: 0,
    currentIndex: 0,
    x: 0
  }
  const PLAYER = []

  let config = {}
  let figcaptionId = 0
  let lightbox = null
  let prevButton = null
  let nextButton = null
  let closeButton = null
  let counter = null
  let drag = {}
  let isDraggingX = false
  let isDraggingY = false
  let pointerDown = false
  let lastFocus = null
  let offset = null
  let offsetTmp = null
  let resizeTicking = false
  let isYouTubeDependencieLoaded = false
  let playerId = 0
  let groups = {}
  let newGroup = null
  let activeGroup = null

  /**
   * Merge default options with user options
   *
   * @param {Object} userOptions - Optional user options
   * @returns {Object} - Custom options
   */
  const mergeOptions = function mergeOptions (userOptions) {
    // Default options
    const OPTIONS = {
      selector: '.lightbox',
      captions: true,
      captionsSelector: 'img',
      captionAttribute: 'alt',
      nav: 'auto',
      navText: [
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 18l-6-6 6-6"/></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 6l6 6-6 6"/></svg>'
      ],
      navLabel: [
        'Previous image',
        'Next image'
      ],
      close: true,
      closeText: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewbox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M6 18L18 6"/></svg>',
      closeLabel: 'Close lightbox',
      loadingIndicatorLabel: 'Image loading',
      counter: true,
      download: false, // TODO
      downloadText: '', // TODO
      downloadLabel: 'Download image', // TODO
      keyboard: true,
      zoom: true,
      zoomText: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 16v5h-5"/><path d="M8 21H3v-5"/><path d="M16 3h5v5"/><path d="M3 8V3h5"/></svg>',
      docClose: true,
      swipeClose: true,
      hideScrollbar: true,
      draggable: true,
      threshold: 100,
      rtl: false, // TODO
      loop: false, // TODO
      autoplayVideo: false
    }

    if (userOptions) {
      Object.keys(userOptions).forEach(key => {
        OPTIONS[key] = userOptions[key]
      })
    }

    return OPTIONS
  }

  /**
   * Types - you can add new type to support something new
   *
   */
  const SUPPORTED_ELEMENTS = {
    image: {
      checkSupport (el) {
        return !el.hasAttribute('data-type') && el.href.match(/\.(png|jpe?g|tiff|tif|gif|bmp|webp|svg|ico)(\?.*)?$/i)
      },

      init (el, container) {
        const FIGURE = document.createElement('figure')
        const FIGCAPTION = document.createElement('figcaption')
        const IMAGE = document.createElement('img')
        const THUMBNAIL = el.querySelector('img')
        const LOADING_INDICATOR = document.createElement('div')

        // Hide figure until the image is loaded
        FIGURE.style.opacity = '0'

        if (THUMBNAIL) {
          IMAGE.alt = THUMBNAIL.alt || ''
        }

        IMAGE.setAttribute('src', '')
        IMAGE.setAttribute('data-src', el.href)

        // Add image to figure
        FIGURE.appendChild(IMAGE)

        // Create figcaption
        if (config.captions) {
          if (config.captionsSelector === 'self' && el.getAttribute(config.captionAttribute)) {
            FIGCAPTION.textContent = el.getAttribute(config.captionAttribute)
          } else if (config.captionsSelector === 'img' && THUMBNAIL && THUMBNAIL.getAttribute(config.captionAttribute)) {
            FIGCAPTION.textContent = THUMBNAIL.getAttribute(config.captionAttribute)
          }

          if (FIGCAPTION.textContent) {
            FIGCAPTION.id = `tobii-figcaption-${figcaptionId}`
            FIGURE.appendChild(FIGCAPTION)

            IMAGE.setAttribute('aria-labelledby', FIGCAPTION.id)

            ++figcaptionId
          }
        }

        // Add figure to container
        container.appendChild(FIGURE)

        // Create loading indicator
        LOADING_INDICATOR.className = 'tobii-loader'
        LOADING_INDICATOR.setAttribute('role', 'progressbar')
        LOADING_INDICATOR.setAttribute('aria-label', config.loadingIndicatorLabel)

        // Add loading indicator to container
        container.appendChild(LOADING_INDICATOR)

        // Register type
        container.setAttribute('data-type', 'image')
      },

      onPreload (container) {
        // Same as preload
        SUPPORTED_ELEMENTS.image.onLoad(container)
      },

      onLoad (container) {
        const IMAGE = container.querySelector('img')

        if (!IMAGE.hasAttribute('data-src')) {
          return
        }

        const FIGURE = container.querySelector('figure')
        const LOADING_INDICATOR = container.querySelector('.tobii-loader')

        IMAGE.onload = () => {
          container.removeChild(LOADING_INDICATOR)
          FIGURE.style.opacity = '1'
        }

        IMAGE.setAttribute('src', IMAGE.getAttribute('data-src'))
        IMAGE.removeAttribute('data-src')
      },

      onLeave (container) {
        // Nothing
      },

      onCleanup (container) {
        // Nothing
      }
    },

    html: {
      checkSupport (el) {
        return checkType(el, 'html')
      },

      init (el, container) {
        const TARGET_SELECTOR = el.hasAttribute('href') ? el.getAttribute('href') : el.getAttribute('data-target')
        const TARGET = document.querySelector(TARGET_SELECTOR)

        if (!TARGET) {
          throw new Error(`Ups, I can't find the target ${TARGET_SELECTOR}.`)
        }

        // Add content to container
        container.appendChild(TARGET)

        // Register type
        container.setAttribute('data-type', 'html')
      },

      onPreload (container) {
        // Nothing
      },

      onLoad (container) {
        const VIDEO = container.querySelector('video')

        if (VIDEO) {
          if (VIDEO.hasAttribute('data-time') && VIDEO.readyState > 0) {
            // Continue where video was stopped
            VIDEO.currentTime = VIDEO.getAttribute('data-time')
          }

          if (config.autoplayVideo) {
            // Start playback (and loading if necessary)
            VIDEO.play()
          }
        }
      },

      onLeave (container) {
        const VIDEO = container.querySelector('video')

        if (VIDEO) {
          if (!VIDEO.paused) {
            // Stop if video is playing
            VIDEO.pause()
          }

          // Backup currentTime (needed for revisit)
          if (VIDEO.readyState > 0) {
            VIDEO.setAttribute('data-time', VIDEO.currentTime)
          }
        }
      },

      onCleanup (container) {
        const VIDEO = container.querySelector('video')

        if (VIDEO) {
          if (VIDEO.readyState > 0 && VIDEO.readyState < 3 && VIDEO.duration !== VIDEO.currentTime) {
            // Some data has been loaded but not the whole package.
            // In order to save bandwidth, stop downloading as soon as possible.
            const VIDEO_CLONE = VIDEO.cloneNode(true)

            removeSources(VIDEO)
            VIDEO.load()

            VIDEO.parentNode.removeChild(VIDEO)

            container.appendChild(VIDEO_CLONE)
          }
        }
      }
    },

    iframe: {
      checkSupport (el) {
        return checkType(el, 'iframe')
      },

      init (el, container) {
        const IFRAME = document.createElement('iframe')
        const HREF = el.hasAttribute('href') ? el.getAttribute('href') : el.getAttribute('data-target')

        IFRAME.setAttribute('frameborder', '0')
        IFRAME.setAttribute('src', '')
        IFRAME.setAttribute('data-src', HREF)

        if (el.getAttribute('data-width')) {
          IFRAME.style.maxWidth = `${el.getAttribute('data-width')}px`
        }

        if (el.getAttribute('data-height')) {
          IFRAME.style.maxHeight = `${el.getAttribute('data-height')}px`
        }

        // Add iframe to container
        container.appendChild(IFRAME)

        // Register type
        container.setAttribute('data-type', 'iframe')
      },

      onPreload (container) {
        // Nothing
      },

      onLoad (container) {
        const IFRAME = container.querySelector('iframe')

        IFRAME.setAttribute('src', IFRAME.getAttribute('data-src'))
      },

      onLeave (container) {
        // Nothing
      },

      onCleanup (container) {
        // Nothing
      }
    },

    youtube: {
      checkSupport (el) {
        return checkType(el, 'youtube')
      },

      init (el, container) {
        const IFRAME_PLACEHOLDER = document.createElement('div')

        // Add iframePlaceholder to container
        container.appendChild(IFRAME_PLACEHOLDER)

        PLAYER[playerId] = new window.YT.Player(IFRAME_PLACEHOLDER, {
          host: 'https://www.youtube-nocookie.com',
          height: el.getAttribute('data-height') || '360',
          width: el.getAttribute('data-width') || '640',
          videoId: el.getAttribute('data-id'),
          playerVars: {
            controls: el.getAttribute('data-controls') || 1,
            rel: 0,
            playsinline: 1
          }
        })

        // Set player ID
        container.setAttribute('data-player', playerId)

        // Register type
        container.setAttribute('data-type', 'youtube')

        playerId++
      },

      onPreload (container) {
        // Nothing
      },

      onLoad (container) {
        if (config.autoplayVideo) {
          PLAYER[container.getAttribute('data-player')].playVideo()
        }
      },

      onLeave (container) {
        if (PLAYER[container.getAttribute('data-player')].getPlayerState() === 1) {
          PLAYER[container.getAttribute('data-player')].pauseVideo()
        }
      },

      onCleanup (container) {
        if (PLAYER[container.getAttribute('data-player')].getPlayerState() === 1) {
          PLAYER[container.getAttribute('data-player')].pauseVideo()
        }
      }
    }
  }

  /**
   * Add compatible Object.entries support for IE
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#Polyfill
   *
   */
  if (!Object.entries) {
    Object.entries = function (obj) {
      const OWN_PROPS = Object.keys(obj)
      let i = OWN_PROPS.length
      const RES_ARRAY = new Array(i)

      while (i--) {
        RES_ARRAY[i] = [OWN_PROPS[i], obj[OWN_PROPS[i]]]
      }

      return RES_ARRAY
    }
  }

  /**
   * Init
   *
   */
  const init = function init (userOptions) {
    // Merge user options into defaults
    config = mergeOptions(userOptions)

    // Check if the lightbox already exists
    if (!lightbox) {
      createLightbox()
    }

    // Get a list of all elements within the document
    const LIGHTBOX_TRIGGER_ELS = document.querySelectorAll(config.selector)

    if (!LIGHTBOX_TRIGGER_ELS) {
      throw new Error(`Ups, I can't find the selector ${config.selector} on this website.`)
    }

    // Execute a few things once per element
    Array.prototype.forEach.call(LIGHTBOX_TRIGGER_ELS, lightboxTriggerEl => {
      checkDependencies(lightboxTriggerEl)
    })
  }

  /**
   * Check dependencies
   *
   * @param {HTMLElement} el - Element to add
   * @param {function} callback - Optional callback to call after add
   */
  const checkDependencies = function checkDependencies (el, callback) {
    // Check if there is a YouTube video and if the YouTube iframe-API is ready
    if (document.querySelector('[data-type="youtube"]') !== null && !isYouTubeDependencieLoaded) {
      if (document.getElementById('iframe_api') === null) {
        const TAG = document.createElement('script')
        const FIRST_SCRIPT_TAG = document.getElementsByTagName('script')[0]

        TAG.id = 'iframe_api'
        TAG.src = 'https://www.youtube.com/iframe_api'

        FIRST_SCRIPT_TAG.parentNode.insertBefore(TAG, FIRST_SCRIPT_TAG)
      }

      if (WAITING_ELS.indexOf(el) === -1) {
        WAITING_ELS.push(el)
      }

      window.onYouTubePlayerAPIReady = () => {
        Array.prototype.forEach.call(WAITING_ELS, waitingEl => {
          add(waitingEl, callback)
        })

        isYouTubeDependencieLoaded = true
      }
    } else {
      add(el, callback)
    }
  }

  /**
   * Get group name from element
   *
   * @param {HTMLElement} el
   * @return {string}
   */
  const getGroupName = function getGroupName (el) {
    return el.hasAttribute('data-group') ? el.getAttribute('data-group') : 'default'
  }

  /**
   * Copy an object. (The secure way)
   *
   * @param {object} object
   * @return {object}
   */
  const copyObject = function copyObject (object) {
    return JSON.parse(JSON.stringify(object))
  }

  /**
   * Add element
   *
   * @param {HTMLElement} el - Element to add
   * @param {function} callback - Optional callback to call after add
   */
  const add = function add (el, callback) {
    newGroup = getGroupName(el)

    if (!Object.prototype.hasOwnProperty.call(groups, newGroup)) {
      groups[newGroup] = copyObject(GROUP_ATTS)

      createSlider()
    }

    // Check if element already exists
    if (groups[newGroup].gallery.indexOf(el) === -1) {
      groups[newGroup].gallery.push(el)
      groups[newGroup].elementsLength++

      // Set zoom icon if necessary
      if (config.zoom && el.querySelector('img')) {
        const TOBII_ZOOM = document.createElement('div')

        TOBII_ZOOM.className = 'tobii-zoom__icon'
        TOBII_ZOOM.innerHTML = config.zoomText

        el.classList.add('tobii-zoom')
        el.appendChild(TOBII_ZOOM)
      }

      // Bind click event handler
      el.addEventListener('click', triggerTobii)

      createSlide(el)

      if (isOpen() && newGroup === activeGroup) {
        updateConfig()
        updateLightbox()
      }

      if (callback) {
        callback.call(this)
      }
    } else {
      throw new Error('Ups, element already added.')
    }
  }

  /**
   * Remove element
   *
   * @param {HTMLElement} el - Element to remove
   * @param {function} callback - Optional callback to call after remove
   */
  const remove = function remove (el, callback) {
    const GROUP_NAME = getGroupName(el)

    // Check if element exists
    if (groups[GROUP_NAME].gallery.indexOf(el) === -1) {
      // TODO
    } else {
      const SLIDE_INDEX = groups[GROUP_NAME].gallery.indexOf(el)
      const SLIDE_EL = groups[GROUP_NAME].sliderElements[SLIDE_INDEX]

      // TODO If the element to be removed is the currently visible slide

      // TODO Remove element
      // groups[GROUP_NAME].gallery.splice(groups[GROUP_NAME].gallery.indexOf(el)) don't work
      groups[GROUP_NAME].elementsLength--

      // Remove zoom icon if necessary
      if (config.zoom && el.querySelector('.tobii-zoom__icon')) {
        const ZOOM_ICON = el.querySelector('.tobii-zoom__icon')

        ZOOM_ICON.parentNode.classList.remove('tobii-zoom')
        ZOOM_ICON.parentNode.removeChild(ZOOM_ICON)
      }

      // Unbind click event handler
      el.removeEventListener('click', triggerTobii)

      // Remove slide
      SLIDE_EL.parentNode.removeChild(SLIDE_EL)

      if (isOpen() && GROUP_NAME === activeGroup) {
        updateConfig()
        updateLightbox()
      }

      if (callback) {
        callback.call(this)
      }
    }
  }

  /**
   * Create the lightbox
   *
   */
  const createLightbox = function createLightbox () {
    // Create the lightbox
    lightbox = document.createElement('div')
    lightbox.setAttribute('role', 'dialog')
    lightbox.setAttribute('aria-hidden', 'true')
    lightbox.className = 'tobii'

    // Create the previous button
    prevButton = document.createElement('button')
    prevButton.className = 'tobii__prev'
    prevButton.setAttribute('type', 'button')
    prevButton.setAttribute('aria-label', config.navLabel[0])
    prevButton.innerHTML = config.navText[0]
    lightbox.appendChild(prevButton)

    // Create the next button
    nextButton = document.createElement('button')
    nextButton.className = 'tobii__next'
    nextButton.setAttribute('type', 'button')
    nextButton.setAttribute('aria-label', config.navLabel[1])
    nextButton.innerHTML = config.navText[1]
    lightbox.appendChild(nextButton)

    // Create the close button
    closeButton = document.createElement('button')
    closeButton.className = 'tobii__close'
    closeButton.setAttribute('type', 'button')
    closeButton.setAttribute('aria-label', config.closeLabel)
    closeButton.innerHTML = config.closeText
    lightbox.appendChild(closeButton)

    // Create the counter
    counter = document.createElement('div')
    counter.className = 'tobii__counter'
    lightbox.appendChild(counter)

    document.body.appendChild(lightbox)
  }

  /**
   * Create a slider
   */
  const createSlider = function createSlider () {
    groups[newGroup].slider = document.createElement('div')
    groups[newGroup].slider.className = 'tobii__slider'

    // Hide slider
    groups[newGroup].slider.setAttribute('aria-hidden', 'true')

    lightbox.appendChild(groups[newGroup].slider)
  }

  /**
   * Create a slide
   *
   */
  const createSlide = function createSlide (el) {
    // Detect type
    for (let index in SUPPORTED_ELEMENTS) { // const index don't work in IE
      if (Object.prototype.hasOwnProperty.call(SUPPORTED_ELEMENTS, index)) {
        if (SUPPORTED_ELEMENTS[index].checkSupport(el)) {
          // Create slide elements
          const SLIDER_ELEMENT = document.createElement('div')
          const SLIDER_ELEMENT_CONTENT = document.createElement('div')

          SLIDER_ELEMENT.className = 'tobii__slider-slide'
          SLIDER_ELEMENT.style.position = 'absolute'
          SLIDER_ELEMENT.style.left = `${groups[newGroup].x * 100}%`

          // Hide slide
          SLIDER_ELEMENT.setAttribute('aria-hidden', 'true')

          // Create type elements
          SUPPORTED_ELEMENTS[index].init(el, SLIDER_ELEMENT_CONTENT)

          // Add slide content container to slider element
          SLIDER_ELEMENT.appendChild(SLIDER_ELEMENT_CONTENT)

          // Add slider element to slider
          groups[newGroup].slider.appendChild(SLIDER_ELEMENT)
          groups[newGroup].sliderElements.push(SLIDER_ELEMENT)

          ++groups[newGroup].x

          break
        }
      }
    }
  }

  /**
   * Open Tobii
   *
   * @param {number} index - Index to load
   * @param {function} callback - Optional callback to call after open
   */
  const open = function open (index, callback) {
    activeGroup = activeGroup !== null ? activeGroup : newGroup

    if (isOpen()) {
      throw new Error('Ups, I\'m aleady open.')
    }

    if (!isOpen()) {
      if (!index) {
        index = 0
      }

      if (index === -1 || index >= groups[activeGroup].elementsLength) {
        throw new Error(`Ups, I can't find slide ${index}.`)
      }
    }

    if (config.hideScrollbar) {
      document.documentElement.classList.add('tobii-is-open')
      document.body.classList.add('tobii-is-open')
    }

    updateConfig()

    // Hide close if necessary
    if (!config.close) {
      closeButton.disabled = false
      closeButton.setAttribute('aria-hidden', 'true')
    }

    // Save user’s focus
    lastFocus = document.activeElement

    // Set current index
    groups[activeGroup].currentIndex = index

    clearDrag()
    bindEvents()

    // Load slide
    load(groups[activeGroup].currentIndex)

    // Show slider
    groups[activeGroup].slider.setAttribute('aria-hidden', 'false')

    // Show lightbox
    lightbox.setAttribute('aria-hidden', 'false')

    updateLightbox()

    // Preload previous and next slide
    preload(groups[activeGroup].currentIndex + 1)
    preload(groups[activeGroup].currentIndex - 1)

    // Hack to prevent animation during opening
    setTimeout(() => {
      groups[activeGroup].slider.classList.add('tobii__slider--animate')
    }, 1000)

    if (callback) {
      callback.call(this)
    }
  }

  /**
   * Close Tobii
   *
   * @param {function} callback - Optional callback to call after close
   */
  const close = function close (callback) {
    if (!isOpen()) {
      throw new Error('Ups, I\'m already closed.')
    }

    if (config.hideScrollbar) {
      document.documentElement.classList.remove('tobii-is-open')
      document.body.classList.remove('tobii-is-open')
    }

    unbindEvents()

    // Reenable the user’s focus
    lastFocus.focus()

    // Don't forget to cleanup our current element
    leave(groups[activeGroup].currentIndex)
    cleanup(groups[activeGroup].currentIndex)

    // Hide lightbox
    lightbox.setAttribute('aria-hidden', 'true')

    // Hide slider
    groups[activeGroup].slider.setAttribute('aria-hidden', 'true')

    // Reset current index
    groups[activeGroup].currentIndex = 0

    // Remove the hack to prevent animation during opening
    groups[activeGroup].slider.classList.remove('tobii__slider--animate')

    if (callback) {
      callback.call(this)
    }
  }

  /**
   * Preload slide
   *
   * @param {number} index - Index to preload
   */
  const preload = function preload (index) {
    if (groups[activeGroup].sliderElements[index] === undefined) {
      return
    }

    const CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]')
    const TYPE = CONTAINER.getAttribute('data-type')

    SUPPORTED_ELEMENTS[TYPE].onPreload(CONTAINER)
  }

  /**
   * Load slide
   * Will be called when opening the lightbox or moving index
   *
   * @param {number} index - Index to load
   */
  const load = function load (index) {
    if (groups[activeGroup].sliderElements[index] === undefined) {
      return
    }

    const CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]')
    const TYPE = CONTAINER.getAttribute('data-type')

    // Add active slide class
    groups[activeGroup].sliderElements[index].classList.add('tobii__slider-slide--is-active')
    groups[activeGroup].sliderElements[index].setAttribute('aria-hidden', 'false')

    SUPPORTED_ELEMENTS[TYPE].onLoad(CONTAINER)
  }

  /**
   * Select a slide
   *
   * @param {number} index - Index to select
   * @param {function} callback - Optional callback function
   */
  const select = function select (index, callback) {
    const currIndex = groups[activeGroup].currentIndex

    if (!isOpen()) {
      throw new Error('Ups, I\'m closed.')
    }

    if (isOpen()) {
      if (!index && index !== 0) {
        throw new Error('Ups, no slide specified.')
      }

      if (index === groups[activeGroup].currentIndex) {
        throw new Error(`Ups, slide ${index} is already selected.`)
      }

      if (index === -1 || index >= groups[activeGroup].elementsLength) {
        throw new Error(`Ups, I can't find slide ${index}.`)
      }
    }

    // Set current index
    groups[activeGroup].currentIndex = index

    leave(currIndex)
    load(index)

    if (index < currIndex) {
      updateLightbox('left')
      cleanup(currIndex)
      preload(index - 1)
    }

    if (index > currIndex) {
      updateLightbox('right')
      cleanup(currIndex)
      preload(index + 1)
    }

    if (callback) {
      callback.call(this)
    }
  }

  /**
   * Select the previous slide
   *
   * @param {function} callback - Optional callback function
   */
  const previous = function previous (callback) {
    if (!isOpen()) {
      throw new Error('Ups, I\'m closed.')
    }

    if (groups[activeGroup].currentIndex > 0) {
      leave(groups[activeGroup].currentIndex)
      load(--groups[activeGroup].currentIndex)
      updateLightbox('left')
      cleanup(groups[activeGroup].currentIndex + 1)
      preload(groups[activeGroup].currentIndex - 1)

      if (callback) {
        callback.call(this)
      }
    }
  }

  /**
   * Select the next slide
   *
   * @param {function} callback - Optional callback function
   */
  const next = function next (callback) {
    if (!isOpen()) {
      throw new Error('Ups, I\'m closed.')
    }

    if (groups[activeGroup].currentIndex < groups[activeGroup].elementsLength - 1) {
      leave(groups[activeGroup].currentIndex)
      load(++groups[activeGroup].currentIndex)
      updateLightbox('right')
      cleanup(groups[activeGroup].currentIndex - 1)
      preload(groups[activeGroup].currentIndex + 1)

      if (callback) {
        callback.call(this)
      }
    }
  }

  /**
   * Select a group
   *
   * @param {string} name
   */
  const selectGroup = function selectGroup (name) {
    if (isOpen()) {
      throw new Error('Ups, I\'m open.')
    }

    if (!name) {
      throw new Error('Ups, no group specified.')
    }

    if (name && !Object.prototype.hasOwnProperty.call(groups, name)) {
      throw new Error(`Ups, I don't have a group called "${name}".`)
    }

    activeGroup = name
  }

  /**
   * Leave slide
   * Will be called before moving index
   *
   * @param {number} index - Index to leave
   */
  const leave = function leave (index) {
    if (groups[activeGroup].sliderElements[index] === undefined) {
      return
    }

    const CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]')
    const TYPE = CONTAINER.getAttribute('data-type')

    // Remove active slide class
    groups[activeGroup].sliderElements[index].classList.remove('tobii__slider-slide--is-active')
    groups[activeGroup].sliderElements[index].setAttribute('aria-hidden', 'true')

    SUPPORTED_ELEMENTS[TYPE].onLeave(CONTAINER)
  }

  /**
   * Cleanup slide
   * Will be called after moving index
   *
   * @param {number} index - Index to cleanup
   */
  const cleanup = function cleanup (index) {
    if (groups[activeGroup].sliderElements[index] === undefined) {
      return
    }

    const CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]')
    const TYPE = CONTAINER.getAttribute('data-type')

    SUPPORTED_ELEMENTS[TYPE].onCleanup(CONTAINER)
  }

  /**
   * Update offset
   *
   */
  const updateOffset = function updateOffset () {
    activeGroup = activeGroup !== null ? activeGroup : newGroup

    offset = -groups[activeGroup].currentIndex * lightbox.offsetWidth

    groups[activeGroup].slider.style.transform = `translate3d(${offset}px, 0, 0)`
    offsetTmp = offset
  }

  /**
   * Update counter
   *
   */
  const updateCounter = function updateCounter () {
    counter.textContent = `${groups[activeGroup].currentIndex + 1}/${groups[activeGroup].elementsLength}`
  }

  /**
   * Set focus to the next slide
   *
   * @param {string} dir - Current slide direction
   */
  const updateFocus = function updateFocus (dir) {
    if (config.nav) {
      // If there is only one slide
      if (groups[activeGroup].elementsLength === 1) {
        if (config.close) {
          closeButton.focus()
        }
      } else {
        // If the first slide is displayed
        if (groups[activeGroup].currentIndex === 0) {
          prevButton.setAttribute('aria-hidden', 'true')
          prevButton.disabled = true
          nextButton.setAttribute('aria-hidden', 'false')
          nextButton.disabled = false
          nextButton.focus()
        }

        // If the last slide is displayed
        if (groups[activeGroup].currentIndex === groups[activeGroup].elementsLength - 1) {
          prevButton.setAttribute('aria-hidden', 'false')
          prevButton.disabled = false
          nextButton.setAttribute('aria-hidden', 'true')
          nextButton.disabled = true
          prevButton.focus()
        }
      }
    } else if (config.close) {
      closeButton.focus()
    }
  }

  /**
   * Clear drag after touchend and mousup event
   *
   */
  const clearDrag = function clearDrag () {
    drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      endY: 0
    }
  }

  /**
   * Recalculate drag / swipe event
   *
   */
  const updateAfterDrag = function updateAfterDrag () {
    const MOVEMENT_X = drag.endX - drag.startX
    const MOVEMENT_Y = drag.endY - drag.startY
    const MOVEMENT_X_DISTANCE = Math.abs(MOVEMENT_X)
    const MOVEMENT_Y_DISTANCE = Math.abs(MOVEMENT_Y)

    if (MOVEMENT_X > 0 && MOVEMENT_X_DISTANCE > config.threshold && groups[activeGroup].currentIndex > 0) {
      previous()
    } else if (MOVEMENT_X < 0 && MOVEMENT_X_DISTANCE > config.threshold && groups[activeGroup].currentIndex !== groups[activeGroup].elementsLength - 1) {
      next()
    } else if (MOVEMENT_Y < 0 && MOVEMENT_Y_DISTANCE > config.threshold && config.swipeClose) {
      close()
    } else {
      updateOffset()
    }
  }

  /**
   * Resize event using requestAnimationFrame
   *
   */
  const resizeHandler = function resizeHandler () {
    if (!resizeTicking) {
      resizeTicking = true

      BROWSER_WINDOW.requestAnimationFrame(() => {
        updateOffset()

        resizeTicking = false
      })
    }
  }

  /**
   * Click event handler to trigger Tobii
   *
   */
  const triggerTobii = function triggerTobii (event) {
    event.preventDefault()

    activeGroup = getGroupName(this)

    open(groups[activeGroup].gallery.indexOf(this))
  }

  /**
   * Click event handler
   *
   */
  const clickHandler = function clickHandler (event) {
    if (event.target === prevButton) {
      previous()
    } else if (event.target === nextButton) {
      next()
    } else if (event.target === closeButton || (event.target.classList.contains('tobii__slider-slide') && config.docClose)) {
      close()
    }

    event.stopPropagation()
  }

  /**
   * Get the focusable children of the given element
   *
   * @return {Array<Element>}
   */
  const getFocusableChildren = function getFocusableChildren () {
    return Array.prototype.slice.call(lightbox.querySelectorAll(`.tobii__close:not([disabled]), .tobii__prev:not([disabled]), .tobii__next:not([disabled]), .tobii__slider-slide--is-active + ${FOCUSABLE_ELEMENTS.join(', .tobii__slider-slide--is-active ')}`)).filter(function (child) {
      return !!(
        child.offsetWidth ||
        child.offsetHeight ||
        child.getClientRects().length
      )
    })
  }

  /**
   * Keydown event handler
   *
   * @TODO: Remove the deprecated event.keyCode when Edge support event.code and we drop f*cking IE
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
   */
  const keydownHandler = function keydownHandler (event) {
    const FOCUSABLE_CHILDREN = getFocusableChildren()
    const FOCUSED_ITEM_INDEX = FOCUSABLE_CHILDREN.indexOf(document.activeElement)

    if (event.keyCode === 9 || event.code === 'Tab') {
      // If the SHIFT key is being pressed while tabbing (moving backwards) and
      // the currently focused item is the first one, move the focus to the last
      // focusable item from the slide
      if (event.shiftKey && FOCUSED_ITEM_INDEX === 0) {
        FOCUSABLE_CHILDREN[FOCUSABLE_CHILDREN.length - 1].focus()
        event.preventDefault()
        // If the SHIFT key is not being pressed (moving forwards) and the currently
        // focused item is the last one, move the focus to the first focusable item
        // from the slide
      } else if (!event.shiftKey && FOCUSED_ITEM_INDEX === FOCUSABLE_CHILDREN.length - 1) {
        FOCUSABLE_CHILDREN[0].focus()
        event.preventDefault()
      }
    } else if (event.keyCode === 27 || event.code === 'Escape') {
      // `ESC` Key: Close Tobii
      event.preventDefault()
      close()
    } else if (event.keyCode === 37 || event.code === 'ArrowLeft') {
      // `PREV` Key: Show the previous slide
      event.preventDefault()
      previous()
    } else if (event.keyCode === 39 || event.code === 'ArrowRight') {
      // `NEXT` Key: Show the next slide
      event.preventDefault()
      next()
    }
  }

  /**
   * Touchstart event handler
   *
   */
  const touchstartHandler = function touchstartHandler (event) {
    // Prevent dragging / swiping on textareas inputs and selects
    if (isIgnoreElement(event.target)) {
      return
    }

    event.stopPropagation()

    pointerDown = true

    drag.startX = event.touches[0].pageX
    drag.startY = event.touches[0].pageY

    groups[activeGroup].slider.classList.add('tobii__slider--is-dragging')
  }

  /**
   * Touchmove event handler
   *
   */
  const touchmoveHandler = function touchmoveHandler (event) {
    event.stopPropagation()

    if (pointerDown) {
      event.preventDefault()

      drag.endX = event.touches[0].pageX
      drag.endY = event.touches[0].pageY

      doSwipe()
    }
  }

  /**
   * Touchend event handler
   *
   */
  const touchendHandler = function touchendHandler (event) {
    event.stopPropagation()

    pointerDown = false

    groups[activeGroup].slider.classList.remove('tobii__slider--is-dragging')

    if (drag.endX) {
      isDraggingX = false
      isDraggingY = false

      updateAfterDrag()
    }

    clearDrag()
  }

  /**
   * Mousedown event handler
   *
   */
  const mousedownHandler = function mousedownHandler (event) {
    // Prevent dragging / swiping on textareas inputs and selects
    if (isIgnoreElement(event.target)) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    pointerDown = true

    drag.startX = event.pageX
    drag.startY = event.pageY

    groups[activeGroup].slider.classList.add('tobii__slider--is-dragging')
  }

  /**
   * Mousemove event handler
   *
   */
  const mousemoveHandler = function mousemoveHandler (event) {
    event.preventDefault()

    if (pointerDown) {
      drag.endX = event.pageX
      drag.endY = event.pageY

      doSwipe()
    }
  }

  /**
   * Contextmenu event handler
   * This is a fix for chromium based browser on mac.
   * The 'contextmenu' terminates a mouse event sequence.
   * https://bugs.chromium.org/p/chromium/issues/detail?id=506801
   *
   */
  const contextmenuHandler = function contextmenuHandler (event) {
    pointerDown = false
  }

  /**
   * Mouseup event handler
   *
   */
  const mouseupHandler = function mouseupHandler (event) {
    event.stopPropagation()

    pointerDown = false

    groups[activeGroup].slider.classList.remove('tobii__slider--is-dragging')

    if (drag.endX) {
      isDraggingX = false
      isDraggingY = false

      updateAfterDrag()
    }

    clearDrag()
  }

  /**
   * Decide whether to do horizontal of vertical swipe
   *
   */
  const doSwipe = function doSwipe () {
    if (Math.abs(drag.startX - drag.endX) > 0 && !isDraggingY && groups[activeGroup].elementsLength > 1) {
      // Horizontal swipe
      groups[activeGroup].slider.style.transform = `translate3d(${offsetTmp - Math.round(drag.startX - drag.endX)}px, 0, 0)`

      isDraggingX = true
      isDraggingY = false
    } else if (Math.abs(drag.startY - drag.endY) > 0 && !isDraggingX && config.swipeClose) {
      // Vertical swipe
      groups[activeGroup].slider.style.transform = `translate3d(${offsetTmp}px, -${Math.round(drag.startY - drag.endY)}px, 0)`

      isDraggingX = false
      isDraggingY = true
    }
  }

  /**
   * Bind events
   *
   */
  const bindEvents = function bindEvents () {
    if (config.keyboard) {
      BROWSER_WINDOW.addEventListener('keydown', keydownHandler)
    }

    // Resize event
    BROWSER_WINDOW.addEventListener('resize', resizeHandler)

    // Click event
    lightbox.addEventListener('click', clickHandler)

    if (config.draggable) {
      if (isTouchDevice()) {
        // Touch events
        lightbox.addEventListener('touchstart', touchstartHandler)
        lightbox.addEventListener('touchmove', touchmoveHandler)
        lightbox.addEventListener('touchend', touchendHandler)
      }

      // Mouse events
      lightbox.addEventListener('mousedown', mousedownHandler)
      lightbox.addEventListener('mouseup', mouseupHandler)
      lightbox.addEventListener('mousemove', mousemoveHandler)
      lightbox.addEventListener('contextmenu', contextmenuHandler)
    }
  }

  /**
   * Unbind events
   *
   */
  const unbindEvents = function unbindEvents () {
    if (config.keyboard) {
      BROWSER_WINDOW.removeEventListener('keydown', keydownHandler)
    }

    // Resize event
    BROWSER_WINDOW.removeEventListener('resize', resizeHandler)

    // Click event
    lightbox.removeEventListener('click', clickHandler)

    if (config.draggable) {
      if (isTouchDevice()) {
        // Touch events
        lightbox.removeEventListener('touchstart', touchstartHandler)
        lightbox.removeEventListener('touchmove', touchmoveHandler)
        lightbox.removeEventListener('touchend', touchendHandler)
      }

      // Mouse events
      lightbox.removeEventListener('mousedown', mousedownHandler)
      lightbox.removeEventListener('mouseup', mouseupHandler)
      lightbox.removeEventListener('mousemove', mousemoveHandler)
      lightbox.removeEventListener('contextmenu', contextmenuHandler)
    }
  }

  /**
   * Checks whether element has requested data-type value
   *
   */
  const checkType = function checkType (el, type) {
    return el.getAttribute('data-type') === type
  }

  /**
   * Remove all `src` attributes
   *
   * @param {HTMLElement} el - Element to remove all `src` attributes
   */
  const removeSources = function setVideoSources (el) {
    const SOURCES = el.querySelectorAll('src')

    if (SOURCES) {
      Array.prototype.forEach.call(SOURCES, source => {
        source.setAttribute('src', '')
      })
    }
  }

  /**
   * Update Config
   *
   */
  const updateConfig = function updateConfig () {
    if ((config.draggable && config.swipeClose && !groups[activeGroup].slider.classList.contains('tobii__slider--is-draggable')) || (config.draggable && groups[activeGroup].elementsLength > 1 && !groups[activeGroup].slider.classList.contains('tobii__slider--is-draggable'))) {
      groups[activeGroup].slider.classList.add('tobii__slider--is-draggable')
    }

    // Hide buttons if necessary
    if (!config.nav || groups[activeGroup].elementsLength === 1 || (config.nav === 'auto' && isTouchDevice())) {
      prevButton.setAttribute('aria-hidden', 'true')
      prevButton.disabled = true
      nextButton.setAttribute('aria-hidden', 'true')
      nextButton.disabled = true
    } else {
      prevButton.setAttribute('aria-hidden', 'false')
      prevButton.disabled = false
      nextButton.setAttribute('aria-hidden', 'false')
      nextButton.disabled = false
    }

    // Hide counter if necessary
    if (!config.counter || groups[activeGroup].elementsLength === 1) {
      counter.setAttribute('aria-hidden', 'true')
    } else {
      counter.setAttribute('aria-hidden', 'false')
    }
  }

  /**
   * Update lightbox
   *
   * @param {string} dir - Current slide direction
   */
  const updateLightbox = function updateLightbox (dir) {
    updateOffset()
    updateCounter()
    updateFocus(dir)
  }

  /**
   * Reset Tobii
   *
   * @param {function} callback - Optional callback to call after reset
   */
  const reset = function reset (callback) {
    if (isOpen()) {
      close()
    }

    // TODO Cleanup
    const GROUPS_ENTRIES = Object.entries(groups)

    Array.prototype.forEach.call(GROUPS_ENTRIES, groupsEntrie => {
      const SLIDE_ELS = groupsEntrie[1].gallery

      // Remove slides
      Array.prototype.forEach.call(SLIDE_ELS, slideEl => {
        remove(slideEl)
      })
    })

    groups = {}
    newGroup = activeGroup = null
    figcaptionId = 0

    // TODO

    if (callback) {
      callback.call(this)
    }
  }

  /**
   * Destroy Tobii
   *
   * @param {function} callback - Optional callback to call after destroy
   */
  const destroy = function destroy (callback) {
    reset()

    lightbox.parentNode.removeChild(lightbox)

    if (callback) {
      callback.call(this)
    }
  }

  /**
   * Check if Tobii is open
   *
   */
  const isOpen = function isOpen () {
    return lightbox.getAttribute('aria-hidden') === 'false'
  }

  /**
   * Detect whether device is touch capable
   *
   */
  const isTouchDevice = function isTouchDevice () {
    return 'ontouchstart' in window
  }

  /**
   * Checks whether element's nodeName is part of array
   *
   */
  const isIgnoreElement = function isIgnoreElement (el) {
    return ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(el.nodeName) !== -1 || el === prevButton || el === nextButton || el === closeButton
  }

  /**
   * Return current index
   *
   */
  const currentSlide = function currentSlide () {
    return groups[activeGroup].currentIndex
  }

  /**
   * Return current group
   *
   */
  const currentGroup = function currentGroup () {
    return activeGroup !== null ? activeGroup : newGroup
  }

  init(userOptions)

  return {
    open: open,
    previous: previous,
    next: next,
    close: close,
    add: checkDependencies,
    remove: remove,
    reset: reset,
    destroy: destroy,
    isOpen: isOpen,
    currentSlide: currentSlide,
    select: select,
    selectGroup: selectGroup,
    currentGroup: currentGroup
  }
}
