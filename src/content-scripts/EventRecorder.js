const eventsToRecord = ['click', 'dblclick', 'change', 'keydown', 'select', 'submit', 'load', 'unload', 'mouseover']

import regex from '../utils/eventActionTypeRegex.js'
import { capitalize, hyphens2camel } from '../utils/function.js'
import { generalBtn } from '../utils/state.js'
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
    const dataQa = e.target?.getAttribute?.('data-qa') || null
    const msgObj = {
      action: this.getEventAction({ event: e, wrapper, dataQa }),
      selector: e.target?.getAttribute?.('class'),
      wrapper,
      wrapperSelector,
      route: window.location,
      hrd: window.location.pathname.includes('/dashboard') ? 'dashboard' : 'web',
      dataQa,
    }
    if (msgObj.action.name === 'mouseover' ? msgObj.action.type : true) {
      console.log({
        ...msgObj,
        event: e,
        target: e.target,
      })
    }

    this.sendMessage(JSON.stringify(msgObj))
  }

  getEventAction = props => {
    return {
      name: props?.event?.type,
      type: this.classifyEventActionType(props),
    }
  }

  getTargetWrapper = (event, wrapper = []) => {
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

  classifyEventActionType = props => {
    return this[`getEventActionType${capitalize(props?.event?.type)}`]?.(props) || ''
  }

  getEventActionTypeClick = ({ event, wrapper, dataQa }) => {
    const isMatch = regex => dataQa?.match(regex) || wrapper.some(wr => wr.match(regex))
    const isMatchGeneral = generalBtn.some(btnType => isMatch(regex[`click${capitalize(hyphens2camel(btnType))}`]))
    const generalBtnType = generalBtn.find(btnType => isMatch(regex[`click${capitalize(hyphens2camel(btnType))}`]))

    if (isMatch(regex.clickMenu)) return 'menu'
    else if (isMatch(regex.clickTabMenu)) return 'tab-menu'
    else if (isMatch(regex.clickBreadcrumb)) return 'breadcrumb'
    else if (isMatch(regex.clickClose)) return 'close'
    else if (isMatch(regex.clickCard)) return 'card'
    else if (isMatch(regex.clickEditRow)) return 'edit-row'
    else if (isMatch(regex.clickDetailRow)) return 'detail-row'
    else if (isMatchGeneral) return generalBtnType
  }

  getEventActionTypeMouseover = ({ wrapper, dataQa }) => {
    const isMatch = regex => dataQa?.match(regex) || wrapper.some(wr => wr.match(regex))
    if (isMatch(regex.hoverBtnGroup)) return 'btn-group'
  }
}
