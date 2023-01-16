class HtmlType {
  constructor () {
    this.userSettings = null
  }

  init (el, container, userSettings) {
    this.userSettings = userSettings

    const TARGET_SELECTOR = el.hasAttribute('data-target') ? el.getAttribute('data-target') : el.getAttribute('href')
    const TARGET = document.querySelector(TARGET_SELECTOR).cloneNode(true)

    if (!TARGET) {
      throw new Error(`Ups, I can't find the target ${TARGET_SELECTOR}.`)
    }

    // Add content to container
    container.appendChild(TARGET)

    // Register type
    container.setAttribute('data-type', 'html')
    container.classList.add('tobii-html')
  }

  onPreload (container) {
    // Nothing
  }

  onLoad (container, group) {
    const VIDEO = container.querySelector('video')

    if (VIDEO) {
      if (VIDEO.hasAttribute('data-time') && VIDEO.readyState > 0) {
        // Continue where video was stopped
        VIDEO.currentTime = VIDEO.getAttribute('data-time')
      }

      if (this.userSettings.autoplayVideo) {
        // Start playback (and loading if necessary)
        VIDEO.play()
      }
    }

    const audio = container.querySelector('audio')
    if (audio) {
      if (this.userSettings.autoplayAudio) {
        // Start playback (and loading if necessary)
        audio.play()
      }
    }

    container.classList.add('tobii-group-' + group)
  }

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

    const audio = container.querySelector('audio')

    if (audio) {
      if (!audio.paused) {
        // Stop if is playing
        audio.pause()
      }
    }
  }

  onCleanup (container) {
    const VIDEO = container.querySelector('video')

    if (VIDEO) {
      if (VIDEO.readyState > 0 && VIDEO.readyState < 3 && VIDEO.duration !== VIDEO.currentTime) {
        // Some data has been loaded but not the whole package.
        // In order to save bandwidth, stop downloading as soon as possible.
        const VIDEO_CLONE = VIDEO.cloneNode(true)

        this._removeSources(VIDEO)
        VIDEO.load()

        VIDEO.parentNode.removeChild(VIDEO)

        container.appendChild(VIDEO_CLONE)
      }
    }
  }

  onReset () {
    // Nothing
  }

  /**
   * Remove all `src` attributes
   *
   * @param {HTMLElement} el - Element to remove all `src` attributes
   */
  _removeSources (el) {
    const SOURCES = el.querySelectorAll('src')

    if (SOURCES) {
      SOURCES.forEach((source) => {
        source.setAttribute('src', '')
      })
    }
  }
}

export default HtmlType
