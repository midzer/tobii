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

    // Accessibility: allow setting focus programmatically on figure elements.
    FIGURE.tabIndex = -1

    // Add role="group" to figure
    FIGURE.setAttribute('role', 'group')

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

    if (el.hasAttribute('data-sizes')) {
      IMAGE.setAttribute('data-sizes', el.getAttribute('data-sizes'))
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

      FIGCAPTION.id = `tobii-figcaption-${this.figcaptionId}`

      if (captionContent) {
        const SPAN = document.createElement('span')
        if (this.userSettings.captionHTML) {
          SPAN.innerHTML = captionContent
        } else {
          SPAN.textContent = captionContent
        }
        FIGCAPTION.appendChild(SPAN)

        if (this.userSettings.captionToggle) {
          const BUTTON = document.createElement('button')
          BUTTON.className = 'caption-toggle'
          BUTTON.title = this.userSettings.captionToggleLabel[0]
          BUTTON.innerText = this.userSettings.captionToggleLabel[0]
          BUTTON.setAttribute('aria-controls', FIGCAPTION.id)
          BUTTON.setAttribute('aria-expanded', true)
          BUTTON.addEventListener('pointerdown', (event) => {
            event.preventDefault()
            event.stopPropagation()
          })
          BUTTON.addEventListener('pointerup', (event) => {
            event.preventDefault()
            event.stopPropagation()
          })
          BUTTON.addEventListener('click', (event) => {
            event.preventDefault()
            event.stopPropagation()
            const isExpanded = BUTTON.getAttribute('aria-expanded') === 'true'
            const buttonLabel = isExpanded
              ? this.userSettings.captionToggleLabel[1]
              : this.userSettings.captionToggleLabel[0]
            BUTTON.title = buttonLabel
            BUTTON.innerText = buttonLabel
            BUTTON.setAttribute('aria-expanded', !isExpanded)
            SPAN.setAttribute('aria-hidden', isExpanded)
          })
          FIGCAPTION.appendChild(BUTTON)
        }

        FIGURE.appendChild(FIGCAPTION)

        IMAGE.setAttribute('aria-labelledby', FIGCAPTION.id)

        // Add aria-label to the figure containing the caption content
        FIGURE.setAttribute('aria-label', FIGCAPTION.textContent)

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

    if (IMAGE.hasAttribute('data-srcset')) {
      IMAGE.setAttribute('srcset', IMAGE.getAttribute('data-srcset'))
      IMAGE.removeAttribute('data-srcset')
    }

    if (IMAGE.hasAttribute('data-sizes')) {
      IMAGE.setAttribute('sizes', IMAGE.getAttribute('data-sizes'))
      IMAGE.removeAttribute('data-sizes')
    }

    IMAGE.setAttribute('src', IMAGE.getAttribute('data-src'))
    IMAGE.removeAttribute('data-src')
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
