import React, { Component } from 'react'
import './App.css'
import Controller from './Controller'
import EventList from './EventList'
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      extensionBus: null,
      isRecording: false,
      liveEvents: [],
      routeLocation: {},
    }
  }

  toggleRecord = async () => {
    this[this.state.isRecording ? 'stopRecording' : 'startRecording']()
    await this.setState(prev => ({ isRecording: !prev.isRecording }))
    this.storeState()
  }

  toggleReset = () => {
    this.cleanUp()
    this.state.extensionBus.postMessage({ action: 'reset' })
  }

  startRecording = () => {
    this.cleanUp()
    this.state.extensionBus.postMessage({ action: 'start' })
  }

  stopRecording = () => {
    this.state.extensionBus.postMessage({ action: 'stop' })
    chrome.storage.local.get(['recordingEvents'], async ({ recordingEvents: liveEvents }) => {
      await this.setState({ liveEvents })
      this.storeState()
    })
  }

  cleanUp = async () => {
    await this.setState(() => ({
      liveEvents: [],
      isRecording: false,
    }))
    this.storeState()
  }

  storeState = (obj = {}) => {
    chrome.storage.local.set({
      recordingEvents: this.state.liveEvents,
      controls: {
        isRecording: this.state.isRecording,
      },
      ...obj,
    })
  }

  loadState = callback => {
    this.setState({ extensionBus: chrome.extension.connect({ name: 'recordControls' }) })
    chrome.storage.local.get(['controls', 'routeLocation'], async ({ controls, routeLocation }) => {
      if (controls) await this.setState({ isRecording: controls.isRecording })
      await this.setState(prev => ({ ...prev, routeLocation: routeLocation ? JSON.parse(routeLocation) : {} }))
      callback?.()
    })
  }

  componentDidMount() {
    this.loadState(() => {
      if (this.state.isRecording) {
        chrome.storage.local.get(['recordingEvents'], async ({ recordingEvents }) => {
          await this.setState({ liveEvents: recordingEvents })
        })
      }
    })
  }

  render() {
    const { toggleRecord, toggleReset } = this
    const { isRecording, liveEvents = [], routeLocation } = this.state
    const controllerProps = { routeLocation, isRecording, liveEvents, toggleRecord, toggleReset }
    const eventListProps = { liveEvents }

    return (
      <div className='root'>
        <Controller {...controllerProps} />
        <EventList {...eventListProps} />
      </div>
    )
  }
}
