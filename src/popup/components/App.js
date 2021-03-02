import React, { Component } from 'react'
import './App.css'
import Controller from './Controller'
import EventList from './EventList'


export default class App extends Component { 
  constructor (props){
    super(props)
    this.state = {
      extensionBus: null,
      isRecording: false,
      liveEvents: []
    }
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
    console.log('Stoppppppp')
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
        })
      }
    })
    this.setState({ extensionBus: chrome.extension.connect({ name: 'recordControls' }) })
  }

  render (){
    const { toggleRecord, toggleReset } = this
    const { isRecording, liveEvents } = this.state

    return (
      <div className="root">
        <Controller {... { isRecording, liveEvents, toggleRecord, toggleReset }} />
        <EventList {... { liveEvents }}/>
      </div>
    )
  }
}