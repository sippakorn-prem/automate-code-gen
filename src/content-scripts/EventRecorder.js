const eventsToRecord = {
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  CHANGE: 'change',
  KEYDOWN: 'keydown',
  SELECT: 'select',
  SUBMIT: 'submit',
  LOAD: 'load',
  UNLOAD: 'unload',
  // MOUSEOVER: 'mouseover'
}

export default class EventRecorder {
  init () {
    this.initializeRecorder()
  }

  initializeRecorder = async () =>{
    const events = Object.values(eventsToRecord)
    await this.removeAllListeners(events)
    await this.addAllListeners(events)
  }

  addAllListeners = events => {
    events.forEach(type => {
      window.addEventListener(type, this.recordEvent, true)
    })
  }

  removeAllListeners = events => {
    events.forEach(type => {
      window.removeEventListener(type, this.recordEvent, true)
    })
  }

  sendMessage = msg => {
    if (chrome.runtime && chrome.runtime.onMessage) chrome.runtime.sendMessage(msg)
  }

  recordEvent = e => {
    const wrapper = this.getTargetWrapper(e.target).reverse()
    const wrapperSelector = wrapper.map(s => `[data-qa="${s}"]`).join(' ')

    const msgObj = {
      action: e.type,
      selector: e.target?.getAttribute('class'),
      wrapper,
      wrapperSelector,
      dataQa: e.target?.getAttribute('data-qa') || null,
      data: {
        event: e,
        target: e.target
      }
    }
    console.log(msgObj)
    this.sendMessage(msgObj)
  }

  getTargetWrapper (event, wrapper = []){
    if(wrapper.length >= 3) return wrapper
    else {
      if(event?.parentNode?.getAttribute?.('data-qa')){
        wrapper.push(event?.parentNode?.getAttribute('data-qa'))
      }
      if(event?.parentNode) this.getTargetWrapper(event.parentNode, wrapper)
      return wrapper
    }
  }
  
}