const string = require('./libs/string')
const fs = require('fs')
const path = require('path')

const libsPath = path.join(__dirname, './libs')
const files = fs.readdirSync(libsPath)
const exportMap = {}
files.forEach(file => {
  const filePath = path.join(libsPath, file)
  if (!/\.js$/.test(filePath)) return
  let fileKey = file.split('.')[0]
  exportMap[string.turnKey(fileKey)] = require(filePath)
})
module.exports = exportMap