class ImageType {
  constructor () {
    this.figcaptionId = 0
    this.userSettings = null
  }

  init (el, container, userSettings) {
    this.userSettings = userSettings

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

    if (el.hasAttribute('data-srcset')) {
      IMAGE.setAttribute('data-srcset', el.getAttribute('data-srcset'))
    }

    // Add image to figure
    FIGURE.appendChild(IMAGE)

    // Create figcaption
    if (this.userSettings.captions) {
      let captionContent
      if (typeof this.userSettings.captionText === 'function') {
        captionContent = this.userSettings.captionText(el)
      } else if (this.userSettings.captionsSelector === 'self' &&
        el.getAttribute(this.userSettings.captionAttribute)) {
        captionContent = el.getAttribute(this.userSettings.captionAttribute)
      } else if (this.userSettings.captionsSelector === 'img' && THUMBNAIL &&
        THUMBNAIL.getAttribute(this.userSettings.captionAttribute)) {
        captionContent = THUMBNAIL.getAttribute(this.userSettings.captionAttribute)
      }

      if (this.userSettings.captionHTML) {
        FIGCAPTION.innerHTML = captionContent
      } else {
        FIGCAPTION.textContent = captionContent
      }

      if (captionContent) {
        FIGCAPTION.id = `tobii-figcaption-${this.figcaptionId}`
        FIGURE.appendChild(FIGCAPTION)

        IMAGE.setAttribute('aria-labelledby', FIGCAPTION.id)

        ++this.figcaptionId
      }
    }

    // Add figure to container
    container.appendChild(FIGURE)

    // Create loading indicator
    LOADING_INDICATOR.className = 'tobii__loader'
    LOADING_INDICATOR.setAttribute('role', 'progressbar')
    LOADING_INDICATOR.setAttribute('aria-label', this.userSettings.loadingIndicatorLabel)

    // Add loading indicator to container
    container.appendChild(LOADING_INDICATOR)

    // Register type
    container.setAttribute('data-type', 'image')
    container.classList.add('tobii-image')
  }

  onPreload (container) {
    // Same as preload
    this.onLoad(container)
  }

  onLoad (container) {
    const IMAGE = container.querySelector('img')

    if (!IMAGE.hasAttribute('data-src')) {
      return
    }

    const FIGURE = container.querySelector('figure')
    const LOADING_INDICATOR = container.querySelector('.tobii__loader')

    IMAGE.addEventListener('load', () => {
      container.removeChild(LOADING_INDICATOR)
      FIGURE.style.opacity = '1'
    })

    IMAGE.addEventListener('error', () => {
      container.removeChild(LOADING_INDICATOR)
      FIGURE.style.opacity = '1'
    })

    IMAGE.setAttribute('src', IMAGE.getAttribute('data-src'))
    IMAGE.removeAttribute('data-src')

    if (IMAGE.hasAttribute('data-srcset')) {
      IMAGE.setAttribute('srcset', IMAGE.getAttribute('data-srcset'))
    }
  }

  onLeave (container) {
    // Nothing
  }

  onCleanup (container) {
    // Nothing
  }

  onReset () {
    this.figcaptionId = 0
  }
}

export default ImageType
