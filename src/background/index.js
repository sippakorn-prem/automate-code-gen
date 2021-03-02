class RecordingController {
  constructor (){
    this._initialized = false
    this._recording = []
    this._isPaused = false
  }

  init () {
    chrome.extension.onConnect.addListener(port => {
      port.onMessage.addListener(msg => {
        if (msg.action) this[msg.action]()
      })
    })
  }

  start = () =>{
    this.cleanUp(()=>{
      if(!this._initialized) this.injectScript()
      chrome.runtime.onMessage.addListener(this.handleMessage)
    })
  }

  pause = () =>{
    console.debug('pause')
    this._isPaused = true
  }
  
  reset = () =>{
    this.cleanUp(()=>{
      chrome.runtime.onMessage.removeListener(this.handleMessage)
    })
  }

  stop = () =>{
    chrome.runtime.onMessage.removeListener(this.handleMessage)
    chrome.storage.local.set({ recordingEvents: this._recording })
  }

  cleanUp = callback => {
    this._recording = []
    chrome.storage.local.remove('recordingEvents', () => {
      callback?.()
    })
  }

  handleMessage = (msg, sender) => {
    this._recording.push(msg)
    chrome.storage.local.set({ recordingEvents: this._recording })
  }

  handleControlMessage = (msg, sender) =>{
    console.log({ handleControlMessage: msg, sender })
  }

  injectScript = () => {
    this._initialized = true
    chrome.tabs.executeScript({ file: 'content-script.js', allFrames: true })
  }
}

window.recordingController = new RecordingController()
window.recordingController.init()