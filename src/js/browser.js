import '../scss/tobii.scss'
import './polyfill/CustomEvent'
import './polyfill/forEach'
import Tobii from './index'

if (typeof module < 'u') {
  module.exports = Tobii
} else {
  self.Tobii = Tobii
}
