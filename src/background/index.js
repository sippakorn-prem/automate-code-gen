class RecordingController {
  constructor() {
    this._initialized = false
    this._recording = {}
    this._isPaused = false
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
    this._recording = {}
    chrome.storage.local.remove(['recordingEvents', 'route'], callback)
    chrome.browserAction.setIcon({ path: 'icon32.png' })
  }

  handleMessage = (message, sender) => {
    const msg = message && JSON.parse(message)
    if (msg) {
      if (this._recording[msg.action.name]) this._recording[msg.action.name].push(msg)
      else this._recording[msg.action.name] = [msg]
      console.log({ _recording: this._recording })
      chrome.storage.local.set({ recordingEvents: this._recording })
    }
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
