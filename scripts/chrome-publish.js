#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const zipFolder = require('zip-folder')

const DEST_DIR = path.join(__dirname, '../dist')
const DEST_ZIP_DIR = path.join(__dirname, '../')

const webStore = require('chrome-webstore-upload')({
  extensionId: process.env.EXTENSION_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN
})

const extractExtensionData = () => {
  const extPackageJson = require('../package.json')

  return {
    name: extPackageJson.name,
    version: extPackageJson.version
  }
}

const makeDestZipDirIfNotExists = () => {
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR)
  }
}

const buildZip = (src, dist, zipFilename) => {
  console.info(`Building ${zipFilename}...`)

  return new Promise((resolve, reject) => {
    zipFolder(src, path.join(dist, zipFilename), (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

const main = () => {
  // const { name, version } = extractExtensionData()
  // const zipFilename = `${name}-v${version}.zip`
  const zipFilename = `code-gen.zip`

  makeDestZipDirIfNotExists()

  buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
    .then(() => {
      const myZipFile = fs.createReadStream(`${DEST_ZIP_DIR}/${zipFilename}`)
      console.log(myZipFile)
      // webStore.uploadExisting(myZipFile).then(res => {
      //   console.log(res)
      // })
    })
    .catch(console.err)
}

main()
