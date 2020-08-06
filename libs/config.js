let path = require('path')
let fs = require('fs')
let libsFile = require('./file')
let libsObject = require('./object')
module.exports = {
  getPath () {
    return libsFile.getResolvePath('./.zqlianrc')
  },
  init () {
    let configPath = this.getPath()
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify({}))
    }
  },
  merge (key, data = {}) {
    let configPath = this.getPath()
    let config = this.read()
    config[key] = libsObject.merge(config[key] || {}, data)
    this.write(null, config, configPath)
  },
  write (key, data, path) {
    if (!path) this.init()
    path = path || this.getPath()
    let config
    if (key) {
      config = this.read()
      config[key] = data
    } else {
      config = data
    }
    if (typeof config === 'object') {
      try {
        config = JSON.stringify(config, null, 2)
      } catch (e) {}
    }
    fs.writeFileSync(path, config)
  },
  read (key) {
    this.init()
    let configPath = this.getPath()
    let data = fs.readFileSync(configPath) || '{}'
    try {
      data = JSON.parse(data)
    } catch (e) {}
    data = data || {}
    if (key) return data[key]
    return data
  }
}