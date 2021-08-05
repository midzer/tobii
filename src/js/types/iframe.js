class IframeType {
  constructor () {
    this.userSettings = null
  }

  init (el, container, userSettings) {
    this.userSettings = userSettings

    const HREF = el.hasAttribute('data-target') ? el.getAttribute('data-target') : el.getAttribute('href')

    container.setAttribute('data-HREF', HREF)
    if (el.getAttribute('data-allow')) {
      container.setAttribute('data-allow', el.getAttribute('data-allow'))
    }
    if (el.hasAttribute('data-width')) {
      container.setAttribute('data-width', `${el.getAttribute('data-width')}`)
    }
    if (el.hasAttribute('data-height')) {
      container.setAttribute('data-height', `${el.getAttribute('data-height')}`)
    }

    // dont create empty iframes here - very slow

    // Register type
    container.setAttribute('data-type', 'iframe')
    container.classList.add('tobii-iframe')
  }

  onPreload (container) {
    // Nothing
  }

  onLoad (container) {
    let IFRAME = container.querySelector('iframe')

    // Create loading indicator
    const LOADING_INDICATOR = document.createElement('div')
    LOADING_INDICATOR.className = 'tobii__loader'
    LOADING_INDICATOR.setAttribute('role', 'progressbar')
    LOADING_INDICATOR.setAttribute('aria-label', this.userSettings.loadingIndicatorLabel)
    container.appendChild(LOADING_INDICATOR)

    if (IFRAME == null) {
      // create iframe
      IFRAME = document.createElement('iframe')
      const HREF = container.getAttribute('data-href')

      IFRAME.setAttribute('frameborder', '0')
      IFRAME.setAttribute('src', HREF)
      IFRAME.setAttribute('allowfullscreen', '')

      // set allow parameters
      if (HREF.indexOf('youtube.com') > -1) {
        IFRAME.setAttribute('allow',
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
      } else if (HREF.indexOf('vimeo.com') > -1) {
        IFRAME.setAttribute('allow', 'autoplay; picture-in-picture')
      } else if (container.hasAttribute('data-allow')) {
        IFRAME.setAttribute('allow', container.getAttribute('data-allow'))
      }

      if (container.getAttribute('data-width')) {
        IFRAME.style.maxWidth = `${container.getAttribute('data-width')}`
      }

      if (container.getAttribute('data-height')) {
        IFRAME.style.maxHeight = `${container.getAttribute('data-height')}`
      }

      // Hide until loaded
      IFRAME.style.opacity = '0'

      // Add iframe to container
      container.appendChild(IFRAME)

      IFRAME.addEventListener('load', () => {
        IFRAME.style.opacity = '1'
        const LOADING_INDICATOR = container.querySelector('.tobii__loader')
        if (LOADING_INDICATOR) {
          container.removeChild(LOADING_INDICATOR)
        }
      })
      IFRAME.addEventListener('error', () => {
        IFRAME.style.opacity = '1'
        const LOADING_INDICATOR = container.querySelector('.tobii__loader')
        if (LOADING_INDICATOR) {
          container.removeChild(LOADING_INDICATOR)
        }
      })
    } else {
      // was already created
      IFRAME.setAttribute('src', container.getAttribute('data-href'))
    }
  }

  onLeave (container) {
    // Nothing
  }

  onCleanup (container) {
    const IFRAME = container.querySelector('iframe')
    IFRAME.setAttribute('src', '')
    IFRAME.style.opacity = '0'
  }

  onReset () {
    // Nothing
  }
}

export default IframeType
