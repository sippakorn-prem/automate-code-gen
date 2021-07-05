#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const zipFolder = require('zip-folder')

class Zip {
  constructor () {
    this.zipFilename = 'code-gen.zip'
    this.sourceFolder = path.join(__dirname, '../dist')
    this.destination = path.join(__dirname, '../')
  }
  init () {
    this.generateZipFilename()
    this.buildZip(this.sourceFolder, this.destination, this.zipFilename)
  }
  generateZipFilename () {
    // const { name, version } = this.extractExtensionData()
    // const zipFilename = `${name}-v${version}.zip`
    console.log(this.extractExtensionData())
  }
  extractExtensionData () {
    const extPackageJson = require('../package.json')
    return {
      name: extPackageJson.name,
      version: extPackageJson.version
    }
  }
  buildZip (src, dist, zipFilename) {
    return new Promise((resolve, reject) => {
      console.info(`Building ${zipFilename}...`)
      zipFolder(src, path.join(dist, zipFilename), (err) => {
        err ? reject(err) : resolve()
      })
    })
  }
}
const zipFile = new Zip()
zipFile.init()