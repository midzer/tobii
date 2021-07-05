class YoutubeType {
  constructor () {
    this.playerId = 0
    this.PLAYER = []
    this.userSettings = null
  }

  init (el, container, userSettings) {
    this.userSettings = userSettings

    const IFRAME_PLACEHOLDER = document.createElement('div')

    // Add iframePlaceholder to container
    container.appendChild(IFRAME_PLACEHOLDER)

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
    })

    // Set player ID
    container.setAttribute('data-player', this.playerId)

    // Register type
    container.setAttribute('data-type', 'youtube')
    container.classList.add('tobii-youtube')

    this.playerId++
  }

  onPreload (container) {
    // Nothing
  }

  onLoad (container) {
    if (this.userSettings.autoplayVideo) {
      this.PLAYER[container.getAttribute('data-player')].playVideo()
    }
  }

  onLeave (container) {
    if (this.PLAYER[container.getAttribute('data-player')].getPlayerState() === 1) {
      this.PLAYER[container.getAttribute('data-player')].pauseVideo()
    }
  }

  onCleanup (container) {
    if (this.PLAYER[container.getAttribute('data-player')].getPlayerState() === 1) {
      this.PLAYER[container.getAttribute('data-player')].pauseVideo()
    }
  }

  onReset () {
    // Nothing
  }
}

export default YoutubeType
