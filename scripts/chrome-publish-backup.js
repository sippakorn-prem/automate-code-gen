#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const DEST_ZIP_DIR = path.join(__dirname, '../')

const webStore = require('chrome-webstore-upload')({
  extensionId: process.env.EXTENSION_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN
})

const main = () => {
  const myZipFile = fs.createReadStream(`${DEST_ZIP_DIR}/${zipFilename}`)
  console.log('myZipFile ', myZipFile)
  console.log('webStore ', webStore)
}

main()
