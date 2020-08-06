let path = require('path')
let fs = require('fs')
module.exports = {
  /**
   * 获取项目所在路径
   * @returns {*}
   */
  getRootPath () {
    return process.cwd()
  },
  /**
   * 获取对应的绝对路径
   * @returns {*}
   */
  getResolvePath (usePath) {
    return path.join(this.getRootPath(), usePath)
  },
  /**
   * 获取package.json 内容
   * @returns {any}
   */
  getPkg () {
    return require(this.getResolvePath('./package.json'))
  },
  /**
   * 拷贝目录
   * @param from
   * @param to
   * @param options
   */
  copyDir (from, to, options = {}) {
    let files = fs.readdirSync(from)
    files.forEach(file => {
      let fromPath = path.join(from, file)
      // 排除内容
      if (options.ignore) {
        let ignore = options.ignore
        if (!Array.isArray(ignore)) ignore = [ignore]
        // 使用正则
        if (ignore.find(regexp => !regexp.text(fromPath))) return
      }
      let fileStat = fs.statSync(fromPath)
      let toPath = path.join(to, file)
      if (fileStat.isDirectory()) {
        return this.copyDir(fromPath, toPath, options)
      }
      if (options.formatToPath) {
        toPath = options.formatToPath(toPath)
      }
      this.copy(fromPath, toPath)
    })
  },
  /**
   * 拷贝文件
   * @param from
   * @param to
   */
  copy (from, to) {
    this.mkdir(to, 1)
    fs.copyFileSync(from, to)
  },
  /**
   * 新增文件夹
   * @param dir
   * @param isFile
   */
  mkdir (dir, isFile) {
    if (isFile) dir = dir.replace(/[\\/][^\\/]+$/, '')
    if (fs.existsSync(dir)) return
    let parentDir = dir.replace(/[\\/][^\\/]+$/, '')
    if (!fs.existsSync(parentDir)) {
      this.mkdir(parentDir)
    }
    fs.mkdirSync(dir)
  },
  /**
   * 写入文件
   * @param path
   * @param data
   * @param options
   */
  write (path, data, options) {
    this.mkdir(path, 1)
    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }
    fs.writeFileSync(path, data, options)
  }
}