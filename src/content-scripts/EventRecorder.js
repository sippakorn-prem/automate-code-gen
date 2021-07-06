const eventsToRecord = ['click', 'dblclick', 'change', 'keydown', 'select', 'submit', 'load', 'unload']

export default class EventRecorder {
  init() {
    this.initializeRecorder()
    this.setRouteLocation()
  }

  initializeRecorder = async () => {
    await this.removeAllListeners(eventsToRecord)
    await this.addAllListeners(eventsToRecord)
  }

  addAllListeners = events => {
    events.forEach(type => window.addEventListener(type, this.classifyEvent, true))
  }

  removeAllListeners = events => {
    events.forEach(type => window.removeEventListener(type, this.classifyEvent, true))
  }

  sendMessage = msg => {
    chrome?.runtime?.sendMessage(msg)
  }

  classifyEvent = e => {
    this.setRouteLocation()
    this.recordEvent(e)
  }

  recordEvent = e => {
    const wrapper = this.getTargetWrapper(e.target).reverse()
    const wrapperSelector = wrapper.map(s => `[data-qa="${s}"]`).join(' ')
    const msgObj = {
      action: e.type,
      selector: e.target?.getAttribute?.('class'),
      wrapper,
      wrapperSelector,
      route: window.location,
      dataQa: e.target?.getAttribute?.('data-qa') || null,
    }
    console.log({
      ...msgObj,
      event: e,
      target: e.target,
    })
    this.sendMessage(JSON.stringify(msgObj))
  }

  getTargetWrapper(event, wrapper = []) {
    if (wrapper.length >= 3) return wrapper
    else {
      if (event?.parentNode?.getAttribute?.('data-qa')) {
        wrapper.push(event?.parentNode?.getAttribute?.('data-qa'))
      }
      if (event?.parentNode) this.getTargetWrapper(event.parentNode, wrapper)
      return wrapper
    }
  }

  setRouteLocation = () => {
    chrome.storage.local.set({ routeLocation: JSON.stringify(window.location) })
  }
}
