class IframeType {
  constructor () {
    this.userSettings = null
  }

  init (el, container, userSettings) {
    this.userSettings = userSettings

    const IFRAME = document.createElement('iframe')
    const HREF = el.hasAttribute('data-target') ? el.getAttribute('data-target') : el.getAttribute('href')

    IFRAME.setAttribute('frameborder', '0')
    IFRAME.setAttribute('src', '')
    IFRAME.setAttribute('allowfullscreen', '')
    IFRAME.setAttribute('data-src', HREF)

    // Hide until loaded
    IFRAME.style.opacity = '0'

    // set allow parameters
    if (HREF.indexOf('youtube.com') > -1) {
      IFRAME.setAttribute('allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture')
    } else if (HREF.indexOf('vimeo.com') > -1) {
      IFRAME.setAttribute('allow', 'autoplay; picture-in-picture')
    } else if (el.hasAttribute('data-allow')) {
      IFRAME.setAttribute('allow', el.getAttribute('data-allow'))
    }

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
    container.classList.add('tobii-iframe')
  }

  onPreload (container) {
    // Nothing
  }

  onLoad (container) {
    const IFRAME = container.querySelector('iframe')
    IFRAME.setAttribute('src', IFRAME.getAttribute('data-src'))

    IFRAME.onload = () => {
      IFRAME.style.opacity = '1'
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
