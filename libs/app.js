const fs = require('fs')
const path = require('path')
const libsFile = require('./file')
module.exports = {
  getPath () {
    return libsFile.getResolvePath('./src/app.jsx')
  },
  async init (pages) {
    let appjsxPath = this.getPath()
    if (fs.existsSync(appjsxPath)) return true
    let indexPath = libsFile.getResolvePath('./src/index.html')
    if (!fs.existsSync(indexPath)) {
      libsFile.copy(path.join(__dirname, '../src/index.html'), indexPath)
    }
    // 不存在app.js 则新增
    let pkg = libsFile.getPkg()
    let navigationBarTitleText = pkg.name || 'zqlian-demo'
    if (typeof pages === 'object') pages = JSON.stringify(pages, null, 2)
    libsFile.write(appjsxPath, `import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

class App extends Component {
  config = {
    pages: ${pages},
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: "#2163E0",
      navigationBarTitleText: "${navigationBarTitleText}",
      navigationBarTextStyle: "white"
    }
  }
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
`)
  },
  getPages () {
    let appPath = this.getPath()
    let pages = []
    if (fs.existsSync(appPath)) {
      let appString = fs.readFileSync(appPath).toString()
      let pagesMatch = appString.match(/(?<=\bpages:\s*)(\[[^\]]*\])/gm)
      if (pagesMatch) {
        try {
          return eval(`(${pagesMatch[0]})`)
        } catch (e) {
        }
      }
    }
    return pages
  },
  setPages (pages) {
    console.log('setPages', pages)
    let appPath = this.getPath()
    // 已有文件
    if (this.init(pages)) {
      console.log('setPages init')
      if (typeof pages === 'object') pages = JSON.stringify(pages, null, 2)
      let appString = fs.readFileSync(appPath).toString()
      libsFile.write(appPath, appString.replace(/(?<=\bpages:\s*)(\[[^\]]*\])/gm, pages))
    }
  },
  getSubpackages () {
    let appPath = this.getPath()
    let pages = []
    if (fs.existsSync(appPath)) {
      let appString = fs.readFileSync(appPath).toString()
      let pagesMatch = appString.match(/(?<=\bsubpackages:\s*)(\[[^\]]*\])/gm)
      if (pagesMatch) {
        try {
          return eval(`(${pagesMatch[0]})`)
        } catch (e) {
        }
      }
    }
    return pages
  },
  /**
   * 设置分包 - 设置分包时默认appjsx存在
   * @param pages
   */
  setSubpackages (pages) {
    let appPath = this.getPath()
    if (typeof pages === 'object') pages = JSON.stringify(pages, null, 2)
    let appString = fs.readFileSync(appPath).toString()
    // 已有分包的处理
    if (appString.indexOf('subpackages') > -1) {
      libsFile.write(appPath, appString.replace(/(?<=\bsubpackages:\s*)(\[[^\]]*\])/gm, pages))
    } else {
      libsFile.write(appPath, appString.replace(/(?<=\bpages:\s*\[[^\]]*\]\s*)(,)/gm, ',\nsubpackages:' + pages + ','))
    }
  },
  async mergePages (pages) {
    console.log('mergePages', pages)
    let autoPages = this.getPages()
    pages = autoPages.filter(page => pages.indexOf(page) === -1).concat(pages)
    this.setPages(pages)
  },
  mergeSubpackages (pages) {
    let autoPages = this.getSubpackages()
    let newRoots = pages.map(item => item.root)
    pages = autoPages.filter(page => newRoots.indexOf(page.root) === -1).concat(pages)
    this.setSubpackages(pages)
  }
}