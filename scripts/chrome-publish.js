#!/usr/bin/env node
const fs = require('fs')
const http = require('http')
const fetch = require("node-fetch")
class PublishChromExtension {
  constructor () {
    this.workflow = {}
    this.lastWorkflowRun = {}
    this.artifacts = []
  }
  async init () {
    await this.getGithubWorkflow()
    await this.getLastWorkflowRun()
    await this.getArtifactList()
    await this.downloadArtifact()
  }
  getGithubWorkflow () {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await this.getData('https://api.github.com/repos/sippakorn-prem/automate-code-gen/actions/workflows')
        this.workflow = data && data.total_count ? data.workflows.find(({ path }) => path === '.github/workflows/build-extension.yml') : {}
        resolve()
      } catch (err) { reject(err) }
    })
  }
  getLastWorkflowRun () {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.workflow.id) {
          const data = await this.getData('https://api.github.com/repos/sippakorn-prem/automate-code-gen/actions/runs')
          this.lastWorkflowRun = data && data.total_count ? 
            data.workflow_runs.filter(
              ({ workflow_id, status }) => workflow_id === this.workflow.id && status === 'complete'
            )[0] : {}
        }
        resolve()
      } catch (err) { reject(err) }
    })
  }
  getArtifactList () {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.lastWorkflowRun.check_suite_id) {
          const data = await this.getData(this.lastWorkflowRun.artifacts_url)
          this.artifacts = data.artifacts
        }
        resolve()
      } catch (err) { reject(err) }
    })
  }
  downloadArtifact () {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.artifacts[0]) {
          const { id: artifactID } = this.artifacts[0]
          await this.downloadFile(`http://github.com/sippakorn-prem/automate-code-gen/suites/${this.lastWorkflowRun.check_suite_id}/artifacts/${artifactID}`)
        }
        resolve()
      } catch (err) { reject(err) }
    })
  }
  getData (apiPath) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(apiPath)
        const data = await res.json()
        resolve(data)
      } catch (err) { reject(err) }
    })
  }
  downloadFile (apiPath) {
    return new Promise(async (resolve, reject) => {
      try {
        http.get(apiPath, response => {
          const file = fs.createWriteStream('./code-gen.zip')
          response.pipe(file)
          file.on('finish',() => {
            filePath.close()
            console.log('Download Completed');
          })
        })
        resolve()
      } catch (err) { reject(err) }
    })
  }
}

const publishChrome = new PublishChromExtension()
publishChrome.init()
