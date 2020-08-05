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
      let key = args.slice(0, index - 1)
      obj[key] = args.slice(index)
    })
    return obj
  }
}