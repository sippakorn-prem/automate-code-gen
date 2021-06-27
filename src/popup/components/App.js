import React, { Component } from 'react'
import './App.css'
import Controller from './Controller'
import SelectEvent  from './SelectEvent'
import EventList from './EventList'
import { Typography } from '@material-ui/core'

export default class App extends Component { 
  constructor (props){
    super(props)
    this.state = {
      extensionBus: null,
      isRecording: false,
      liveEvents: {},
      currentEvent: ''
    }
  }

  onChangeEvent = event => {
    this.setState({ currentEvent: event.target.value })
  }

  toggleRecord = async () =>{
    this[this.state.isRecording ? 'stopRecording' : 'startRecording']()
    await this.setState(prev => ({ isRecording: !prev.isRecording }))
    this.storeState()
  }

  toggleReset = () =>{
    this.cleanUp()
    this.state.extensionBus.postMessage({ action: 'reset' })
  }

  startRecording = () =>{
    this.cleanUp()
    this.state.extensionBus.postMessage({ action: 'start' })
  }

  stopRecording = () =>{
    this.state.extensionBus.postMessage({ action: 'stop' })
    chrome.storage.local.get(['recordingEvents'], async ({ recordingEvents }) => {
      await this.setState({ liveEvents: recordingEvents })
      this.storeState()
    })
  }

  cleanUp = async () =>{
    await this.setState(() =>({
      liveEvents: [],
      isRecording: false
    }))
    this.storeState()
  }

  storeState = () =>{
    chrome.storage.local.set({
      recordingEvents: this.state.liveEvents,
      controls: {
        isRecording: this.state.isRecording
      }
    })
  }

  loadState = callback =>{
    chrome.storage.local.get(['controls'], async ({ controls }) => {
      if (controls) {
        await this.setState({ isRecording: controls.isRecording })
      }
      callback?.()
    })
  }

  componentDidMount (){
    this.loadState(()=>{
      if(this.state.isRecording){
        chrome.storage.local.get(['recordingEvents'], async ({ recordingEvents }) => {
          await this.setState({ liveEvents: recordingEvents })
          await this.setState({ currentEvent: Object.keys(recordingEvents)[0] || '' })
        })
      }
    })
    this.setState({ extensionBus: chrome.extension.connect({ name: 'recordControls' }) })
  }

  render (){
    const { toggleRecord, toggleReset, onChangeEvent } = this
    const { isRecording, liveEvents, currentEvent } = this.state
    
    return (
      <div className="root">
        <Typography variant="caption" display="block" gutterBottom>
          Automate Code Gen
        </Typography>
        <Controller {... { isRecording, liveEvents, toggleRecord, toggleReset }} />
        {Boolean(Object.keys(liveEvents).length) && <SelectEvent { ... { liveEvents, currentEvent, onChangeEvent } }/>}
        <EventList {... { liveEvents, currentEvent }}/>
      </div>
    )
  }
}