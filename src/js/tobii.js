/**
 * Tobii
 *
 * @author rqrauhvmra
 * @version 2.0.0-alpha
 * @url https://github.com/rqrauhvmra/Tobii
 *
 * MIT License
 */
export default function Tobii (userOptions) {
  /**
   * Global variables
   *
   */
  let config = {}
  const browserWindow = window
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
  let firstFocusableEl = null
  let lastFocusableEl = null
  let offset = null
  let offsetTmp = null
  let resizeTicking = false
  let isYouTubeDependencieLoaded = false
  const waitingEls = []
  const player = []
  let playerId = 0
  const groupAtts = {
    gallery: [],
    slider: null,
    sliderElements: [],
    elementsLength: 0,
    currentIndex: 0,
    x: 0
  }
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
    const options = {
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
        options[key] = userOptions[key]
      })
    }

    return options
  }

  /**
   * Types - you can add new type to support something new
   *
   */
  const supportedElements = {
    image: {
      checkSupport (el) {
        return !el.hasAttribute('data-type') && el.href.match(/\.(png|jpe?g|tiff|tif|gif|bmp|webp|svg|ico)(\?.*)?$/i)
      },

      init (el, container) {
        const figure = document.createElement('figure')
        const figcaption = document.createElement('figcaption')
        const image = document.createElement('img')
        const thumbnail = el.querySelector('img')
        const loadingIndicator = document.createElement('div')

        // Hide figure until the image is loaded
        figure.style.opacity = '0'

        if (thumbnail) {
          image.alt = thumbnail.alt || ''
        }

        image.setAttribute('src', '')
        image.setAttribute('data-src', el.href)

        // Add image to figure
        figure.appendChild(image)

        // Create figcaption
        if (config.captions) {
          if (config.captionsSelector === 'self' && el.getAttribute(config.captionAttribute)) {
            figcaption.textContent = el.getAttribute(config.captionAttribute)
          } else if (config.captionsSelector === 'img' && thumbnail && thumbnail.getAttribute(config.captionAttribute)) {
            figcaption.textContent = thumbnail.getAttribute(config.captionAttribute)
          }

          if (figcaption.textContent) {
            figcaption.id = `tobii-figcaption-${figcaptionId}`
            figure.appendChild(figcaption)

            image.setAttribute('aria-labelledby', figcaption.id)

            ++figcaptionId
          }
        }

        // Add figure to container
        container.appendChild(figure)

        // Create loading indicator
        loadingIndicator.className = 'tobii-loader'
        loadingIndicator.setAttribute('role', 'progressbar')
        loadingIndicator.setAttribute('aria-label', config.loadingIndicatorLabel)

        // Add loading indicator to container
        container.appendChild(loadingIndicator)

        // Register type
        container.setAttribute('data-type', 'image')
      },

      onPreload (container) {
        // Same as preload
        supportedElements.image.onLoad(container)
      },

      onLoad (container) {
        const image = container.querySelector('img')

        if (!image.hasAttribute('data-src')) {
          return
        }

        const figure = container.querySelector('figure')
        const loadingIndicator = container.querySelector('.tobii-loader')

        image.onload = () => {
          container.removeChild(loadingIndicator)
          figure.style.opacity = '1'
        }

        image.setAttribute('src', image.getAttribute('data-src'))
        image.removeAttribute('data-src')
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
        const targetSelector = el.hasAttribute('href') ? el.getAttribute('href') : el.getAttribute('data-target')
        const target = document.querySelector(targetSelector)

        if (!target) {
          throw new Error(`Ups, I can't find the target ${targetSelector}.`)
        }

        // Add content to container
        container.appendChild(target)

        // Register type
        container.setAttribute('data-type', 'html')
      },

      onPreload (container) {
        // Nothing
      },

      onLoad (container) {
        const video = container.querySelector('video')

        if (video) {
          if (video.hasAttribute('data-time') && video.readyState > 0) {
            // Continue where video was stopped
            video.currentTime = video.getAttribute('data-time')
          }

          if (config.autoplayVideo) {
            // Start playback (and loading if necessary)
            video.play()
          }
        }
      },

      onLeave (container) {
        const video = container.querySelector('video')

        if (video) {
          if (!video.paused) {
            // Stop if video is playing
            video.pause()
          }

          // Backup currentTime (needed for revisit)
          if (video.readyState > 0) {
            video.setAttribute('data-time', video.currentTime)
          }
        }
      },

      onCleanup (container) {
        const video = container.querySelector('video')

        if (video) {
          if (video.readyState > 0 && video.readyState < 3 && video.duration !== video.currentTime) {
            // Some data has been loaded but not the whole package.
            // In order to save bandwidth, stop downloading as soon as possible.
            const videoClone = video.cloneNode(true)

            removeSources(video)
            video.load()

            video.parentNode.removeChild(video)

            container.appendChild(videoClone)
          }
        }
      }
    },

    iframe: {
      checkSupport (el) {
        return checkType(el, 'iframe')
      },

      init (el, container) {
        const iframe = document.createElement('iframe')
        const href = el.hasAttribute('href') ? el.getAttribute('href') : el.getAttribute('data-target')

        iframe.setAttribute('frameborder', '0')
        iframe.setAttribute('src', '')
        iframe.setAttribute('data-src', href)

        if (el.getAttribute('data-width')) {
          iframe.style.maxWidth = `${el.getAttribute('data-width')}px`
        }

        if (el.getAttribute('data-height')) {
          iframe.style.maxHeight = `${el.getAttribute('data-height')}px`
        }

        // Add iframe to container
        container.appendChild(iframe)

        // Register type
        container.setAttribute('data-type', 'iframe')
      },

      onPreload (container) {
        // Nothing
      },

      onLoad (container) {
        const iframe = container.querySelector('iframe')

        iframe.setAttribute('src', iframe.getAttribute('data-src'))
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
        const iframePlaceholder = document.createElement('div')

        // Add iframePlaceholder to container
        container.appendChild(iframePlaceholder)

        player[playerId] = new window.YT.Player(iframePlaceholder, {
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
          player[container.getAttribute('data-player')].playVideo()
        }
      },

      onLeave (container) {
        if (player[container.getAttribute('data-player')].getPlayerState() === 1) {
          player[container.getAttribute('data-player')].pauseVideo()
        }
      },

      onCleanup (container) {
        if (player[container.getAttribute('data-player')].getPlayerState() === 1) {
          player[container.getAttribute('data-player')].pauseVideo()
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
      const ownProps = Object.keys(obj)
      let i = ownProps.length
      const resArray = new Array(i)

      while (i--) {
        resArray[i] = [ownProps[i], obj[ownProps[i]]]
      }

      return resArray
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
    const els = document.querySelectorAll(config.selector)

    if (!els) {
      throw new Error(`Ups, I can't find the selector ${config.selector}.`)
    }

    // Execute a few things once per element
    Array.prototype.forEach.call(els, el => {
      checkDependencies(el)
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
        const tag = document.createElement('script')
        const firstScriptTag = document.getElementsByTagName('script')[0]

        tag.id = 'iframe_api'
        tag.src = 'https://www.youtube.com/iframe_api'

        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      }

      if (waitingEls.indexOf(el) === -1) {
        waitingEls.push(el)
      }

      window.onYouTubePlayerAPIReady = () => {
        Array.prototype.forEach.call(waitingEls, waitingEl => {
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
      groups[newGroup] = copyObject(groupAtts)

      createSlider()
    }

    // Check if element already exists
    if (groups[newGroup].gallery.indexOf(el) === -1) {
      groups[newGroup].gallery.push(el)
      groups[newGroup].elementsLength++

      // Set zoom icon if necessary
      if (config.zoom && el.querySelector('img')) {
        const TobiiZoom = document.createElement('div')

        TobiiZoom.className = 'tobii-zoom__icon'
        TobiiZoom.innerHTML = config.zoomText

        el.classList.add('tobii-zoom')
        el.appendChild(TobiiZoom)
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
      throw new Error('Ups, element already added to the lightbox.')
    }
  }

  /**
   * Remove element
   *
   * @param {HTMLElement} el - Element to remove
   * @param {function} callback - Optional callback to call after remove
   */
  const remove = function add (el, callback) {
    const groupName = getGroupName(el)

    // Check if element exists
    if (groups[groupName].gallery.indexOf(el) === -1) {
      // TODO
    } else {
      const slideIndex = groups[groupName].gallery.indexOf(el)
      const slideEl = groups[groupName].sliderElements[slideIndex]

      // TODO If the element to be removed is the currently visible slide

      // TODO Remove element
      // groups[groupName].gallery.splice(groups[groupName].gallery.indexOf(el)) don't work
      groups[groupName].elementsLength--

      // Remove zoom icon if necessary
      if (config.zoom && el.querySelector('.tobii-zoom__icon')) {
        const zoomIcon = el.querySelector('.tobii-zoom__icon')

        zoomIcon.parentNode.classList.remove('tobii-zoom')
        zoomIcon.parentNode.removeChild(zoomIcon)
      }

      // Unbind click event handler
      el.removeEventListener('click', triggerTobii)

      // Remove slide
      slideEl.parentNode.removeChild(slideEl)

      if (isOpen() && groupName === activeGroup) {
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
    lightbox.appendChild(groups[newGroup].slider)
  }

  /**
   * Create a slide
   *
   */
  const createSlide = function createSlide (el) {
    // Detect type
    for (let index in supportedElements) { // const index don't work in IE
      if (Object.prototype.hasOwnProperty.call(supportedElements, index)) {
        if (supportedElements[index].checkSupport(el)) {
          // Create slide elements
          const sliderElement = document.createElement('div')
          const sliderElementContent = document.createElement('div')

          sliderElement.className = 'tobii__slider-slide'
          sliderElement.style.position = 'absolute'
          sliderElement.style.left = `${groups[newGroup].x * 100}%`

          // Create type elements
          supportedElements[index].init(el, sliderElementContent)

          // Add slide content container to slider element
          sliderElement.appendChild(sliderElementContent)

          // Add slider element to slider
          groups[newGroup].slider.appendChild(sliderElement)
          groups[newGroup].sliderElements.push(sliderElement)

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

    if (!isOpen() && !index) {
      index = 0
    }

    if (isOpen()) {
      if (!index) {
        throw new Error('Ups, Tobii is aleady open.')
      }

      if (index === groups[activeGroup].currentIndex) {
        throw new Error(`Ups, slide ${index} is already selected.`)
      }
    }

    if (index === -1 || index >= groups[activeGroup].elementsLength) {
      throw new Error(`Ups, I can't find slide ${index}.`)
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

    // Makes lightbox appear, too
    lightbox.setAttribute('aria-hidden', 'false')

    updateLightbox()

    // Preload previous and next slide
    preload(groups[activeGroup].currentIndex + 1)
    preload(groups[activeGroup].currentIndex - 1)

    // Hack to prevent animation during opening
    setTimeout(function () {
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
      throw new Error('Tobii is already closed.')
    }

    if (config.hideScrollbar) {
      document.documentElement.classList.remove('tobii-is-open')
      document.body.classList.remove('tobii-is-open')
    }

    unbindEvents()

    // Reenable the user’s focus
    lastFocus.focus()

    // Don't forget to cleanup our current element
    const container = groups[activeGroup].sliderElements[groups[activeGroup].currentIndex].querySelector('[data-type]')
    const type = container.getAttribute('data-type')

    supportedElements[type].onLeave(container)
    supportedElements[type].onCleanup(container)

    lightbox.setAttribute('aria-hidden', 'true')

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

    const container = groups[activeGroup].sliderElements[index].querySelector('[data-type]')
    const type = container.getAttribute('data-type')

    supportedElements[type].onPreload(container)
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

    const container = groups[activeGroup].sliderElements[index].querySelector('[data-type]')
    const type = container.getAttribute('data-type')

    supportedElements[type].onLoad(container)
  }

  /**
   * Show the previous slide
   *
   * @param {function} callback - Optional callback function
   */
  const prev = function prev (callback) {
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
   * Show the next slide
   *
   * @param {function} callback - Optional callback function
   */
  const next = function next (callback) {
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
   * Leave slide
   * Will be called before moving index
   *
   * @param {number} index - Index to leave
   */
  const leave = function leave (index) {
    if (groups[activeGroup].sliderElements[index] === undefined) {
      return
    }

    const container = groups[activeGroup].sliderElements[index].querySelector('[data-type]')
    const type = container.getAttribute('data-type')

    supportedElements[type].onLeave(container)
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

    const container = groups[activeGroup].sliderElements[index].querySelector('[data-type]')
    const type = container.getAttribute('data-type')

    supportedElements[type].onCleanup(container)
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
    let focusableEls = null

    if (config.nav) {
      prevButton.disabled = false
      nextButton.disabled = false

      if (dir === 'left') {
        prevButton.focus()
      } else {
        nextButton.focus()
      }

      // If there is only one slide
      if (groups[activeGroup].elementsLength === 1) {
        prevButton.disabled = true
        nextButton.disabled = true

        if (config.close) {
          closeButton.focus()
        }
      } else {
        // If the first slide is displayed
        if (groups[activeGroup].currentIndex === 0) {
          prevButton.disabled = true
          nextButton.focus()
        }

        // If the last slide is displayed
        if (groups[activeGroup].currentIndex === groups[activeGroup].elementsLength - 1) {
          nextButton.disabled = true
          prevButton.focus()
        }
      }
    } else if (config.close) {
      closeButton.focus()
    }

    focusableEls = lightbox.querySelectorAll('.tobii > button:not(:disabled)')
    firstFocusableEl = focusableEls[0]
    lastFocusableEl = focusableEls.length === 1 ? focusableEls[0] : focusableEls[focusableEls.length - 1]
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
    const movementX = drag.endX - drag.startX
    const movementY = drag.endY - drag.startY
    const movementXDistance = Math.abs(movementX)
    const movementYDistance = Math.abs(movementY)

    if (movementX > 0 && movementXDistance > config.threshold && groups[activeGroup].currentIndex > 0) {
      prev()
    } else if (movementX < 0 && movementXDistance > config.threshold && groups[activeGroup].currentIndex !== groups[activeGroup].elementsLength - 1) {
      next()
    } else if (movementY < 0 && movementYDistance > config.threshold && config.swipeClose) {
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

      browserWindow.requestAnimationFrame(() => {
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
      prev()
    } else if (event.target === nextButton) {
      next()
    } else if (event.target === closeButton || (event.target.className === 'tobii__slider-slide' && config.docClose)) {
      close()
    }

    event.stopPropagation()
  }

  /**
   * Keydown event handler
   *
   * @TODO: Remove the deprecated event.keyCode when Edge support event.code and we drop f*cking IE
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
   */
  const keydownHandler = function keydownHandler (event) {
    if (event.keyCode === 9 || event.code === 'Tab') {
      // `TAB` Key: Navigate to the next / previous focusable element
      if (event.shiftKey) {
        // Step backwards in the tab-order
        if (document.activeElement === firstFocusableEl) {
          lastFocusableEl.focus()
          event.preventDefault()
        }
      } else {
        // Step forward in the tab-order
        if (document.activeElement === lastFocusableEl) {
          firstFocusableEl.focus()
          event.preventDefault()
        }
      }
    } else if (event.keyCode === 27 || event.code === 'Escape') {
      // `ESC` Key: Close Tobii
      event.preventDefault()
      close()
    } else if (event.keyCode === 37 || event.code === 'ArrowLeft') {
      // `PREV` Key: Show the previous slide
      event.preventDefault()
      prev()
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
    if (Math.abs(drag.startX - drag.endX) > 0 && !isDraggingY && config.swipeClose) {
      // Horizontal swipe
      groups[activeGroup].slider.style.transform = `translate3d(${offsetTmp - Math.round(drag.startX - drag.endX)}px, 0, 0)`

      isDraggingX = true
      isDraggingY = false
    } else if (Math.abs(drag.startY - drag.endY) > 0 && !isDraggingX) {
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
      browserWindow.addEventListener('keydown', keydownHandler)
    }

    // Resize event
    browserWindow.addEventListener('resize', resizeHandler)

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
    }
  }

  /**
   * Unbind events
   *
   */
  const unbindEvents = function unbindEvents () {
    if (config.keyboard) {
      browserWindow.removeEventListener('keydown', keydownHandler)
    }

    // Resize event
    browserWindow.removeEventListener('resize', resizeHandler)

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
    const sources = el.querySelectorAll('src')

    if (sources) {
      Array.prototype.forEach.call(sources, function (source) {
        source.setAttribute('src', '')
      })
    }
  }

  /**
   * Update Config
   *
   */
  const updateConfig = function updateConfig () {
    if (config.draggable && groups[activeGroup].elementsLength > 1 && !groups[activeGroup].slider.classList.contains('tobii__slider--is-draggable')) {
      groups[activeGroup].slider.classList.add('tobii__slider--is-draggable')
    }

    // Hide buttons if necessary
    if (!config.nav || groups[activeGroup].elementsLength === 1 || (config.nav === 'auto' && isTouchDevice())) {
      prevButton.setAttribute('aria-hidden', 'true')
      nextButton.setAttribute('aria-hidden', 'true')
    } else {
      prevButton.setAttribute('aria-hidden', 'false')
      nextButton.setAttribute('aria-hidden', 'false')
    }

    // Hide counter if necessary
    if (!config.counter || groups[activeGroup].elementsLength === 1) {
      counter.setAttribute('aria-hidden', 'true')
    } else {
      counter.setAttribute('aria-hidden', 'false')
    }
  }

  /**
   * Update slider
   */
  const updateSlider = function updateSlider () {
    for (let name in groups) { // const name don't work in IE
      if (!Object.prototype.hasOwnProperty.call(groups, name)) continue
      groups[name].slider.style.display = activeGroup === name ? 'block' : 'none'
    }
  }

  /**
   * Update lightbox
   *
   * @param {string} dir - Current slide direction
   */
  const updateLightbox = function updateLightbox (dir) {
    updateSlider()
    updateOffset()
    updateCounter()
    updateFocus(dir)
  }

  /**
   * Destroy Tobii
   *
   * @param {function} callback - Optional callback to call after destroy
   */
  const destroy = function destroy (callback) {
    if (isOpen()) {
      close()
    }

    // TODO Cleanup
    const groupsEntries = Object.entries(groups)

    Array.prototype.forEach.call(groupsEntries, function (groupsEntrie) {
      const els = groupsEntrie[1].gallery

      Array.prototype.forEach.call(els, function (el) {
        remove(el)
      })
    })

    lightbox.parentNode.removeChild(lightbox)

    groups = {}
    newGroup = activeGroup = null
    figcaptionId = 0

    // TODO

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
    return ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(el.nodeName) !== -1 || el === prevButton || el === nextButton || el === closeButton || groups[activeGroup].elementsLength === 1
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

  /**
   * Select a specific group
   *
   * @param {string} name
   */
  const selectGroup = function selectGroup (name) {
    if (isOpen()) {
      throw new Error('Ups, I can\'t do this. Tobii is open.')
    }

    if (!name) {
      return
    }

    if (name && !Object.prototype.hasOwnProperty.call(groups, name)) {
      throw new Error(`Ups, I don't have a group called "${name}".`)
    }

    activeGroup = name
  }

  init(userOptions)

  return {
    open: open,
    prev: prev,
    next: next,
    close: close,
    add: checkDependencies,
    remove: remove,
    destroy: destroy,
    isOpen: isOpen,
    currentSlide: currentSlide,
    selectGroup: selectGroup,
    currentGroup: currentGroup
  }
}
