/**
 * CustomEvent() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
 *
 */
if (typeof window.CustomEvent !== 'function') {
  const CustomEvent = function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }

    const evt = document.createEvent('CustomEvent')

    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
}
