#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

class PublishChromeExtension {
  constructor () {
    this.zipFilename = 'code-gen.zip'
    this.webStore = null
  }
  init () {
    this.setupWebstore()
    this.uploadFile()
  }
  setupWebstore () {
    this.webStore = require('chrome-webstore-upload')({
      extensionId: process.env.EXTENSION_ID,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN
    })
  }
  uploadFile () {
    const myZipFile = fs.createReadStream(`../${this.zipFilename}`)
    console.log(this.webStore)
    // this.webStore.uploadExisting(myZipFile).then(res => {
    //   console.log(res)
    // })
  }
}
const publishExtension = new PublishChromeExtension()
publishExtension.init()