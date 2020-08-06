module.exports = {
  /**
   * url参数拆分
   * @param text
   * @returns {{}}
   */
  getParams (text) {
    let obj = {}
    if (!text) return obj
    text.split('&').forEach(args => {
      let index = args.indexOf('=')
      if (index === -1) {
        obj[args] = null
      }
      let key = args.slice(0, index)
      obj[key] = args.slice(index + 1)
    })
    return obj
  },
  /**
   * 将指定字符串去掉变驼峰
   * @param str
   * @param reg
   * @returns {*}
   */
  turnKey (str, reg = /(_|-)\w/g) {
    return str.replace(reg, (a) => {
      return a.split('')[1].toUpperCase()
    })
  }
}