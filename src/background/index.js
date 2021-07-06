import regex from '../utils/eventActionTypeRegex.js'
import { allowEvents } from '../utils/state.js'
class RecordingController {
  constructor() {
    this._initialized = false
    this._isPaused = false
    this._recording = []
    this._storeEventMessage = null
  }

  init() {
    chrome.extension.onConnect.addListener(port => {
      port.onMessage.addListener(msg => {
        if (msg.action) this[msg.action]()
      })
    })
  }

  start = () => {
    this.cleanUp(() => {
      if (!this._initialized) this.injectScript()
      chrome.runtime.onMessage.addListener(this.handleMessage)
      chrome.browserAction.setIcon({ path: 'record32.png' })
    })
  }

  pause = () => {
    this._isPaused = true
  }

  reset = () => {
    this.cleanUp(() => {
      chrome.runtime.onMessage.removeListener(this.handleMessage)
    })
  }

  stop = () => {
    chrome.runtime.onMessage.removeListener(this.handleMessage)
    chrome.storage.local.set({ recordingEvents: this._recording })
    chrome.browserAction.setIcon({ path: 'icon32.png' })
  }

  cleanUp = callback => {
    this._recording = []
    chrome.storage.local.remove(['recordingEvents', 'route'], callback)
    chrome.browserAction.setIcon({ path: 'icon32.png' })
  }

  handleMessage = (message, sender) => {
    const msg = message && JSON.parse(message)
    if (msg) {
      if (msg.action?.name === 'mouseover' && msg.action?.type) this._storeEventMessage = msg
      else this.classifyAndCombineEvent(msg)
    }
  }

  classifyAndCombineEvent = msg => {
    if (this.isAllowEvent(msg)) {
      let combinedEvent = {}
      if (this._storeEventMessage) {
        const isMatch = (event, regex) => event.dataQa?.match(regex) || event.wrapper.some(wr => wr.match(regex))
        const isClickBtnGroup = isMatch(this._storeEventMessage, regex.hoverBtnGroup) && isMatch(msg, regex.clickButton)
        if (isClickBtnGroup) Object.assign(combinedEvent, { action: { name: 'click', type: 'btn-group' }, hoverEvent: this._storeEventMessage })
      }
      this._recording.push({ ...msg, ...combinedEvent })
      this._storeEventMessage = null
      chrome.storage.local.set({ recordingEvents: this._recording })
    }
  }

  isAllowEvent = msg => {
    return allowEvents.includes(msg?.action?.name)
  }

  handleControlMessage = (msg, sender) => {
    console.log({ handleControlMessage: msg, sender })
  }

  injectScript = () => {
    this._initialized = true
    chrome.tabs.executeScript({ file: 'content-script.js', allFrames: true })
  }
}

window.recordingController = new RecordingController()
window.recordingController.init()
