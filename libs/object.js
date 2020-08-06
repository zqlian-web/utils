function merge (data, mergeData) {
  Object.keys(mergeData).forEach(key => {
    let mergeItem = mergeData[key]
    let dataItem = data[key]
    // 新字段 或者空内容直接赋值
    if (!(key in data) || !dataItem) {
      data[key] = mergeItem
      return
    }
    // 数组直接赋值
    if (Array.isArray(mergeItem)) {
      data[key] = mergeItem
      return
    }
    // 非对象或者null 直接赋值
    if (!mergeItem || typeof mergeItem !== 'object' || typeof dataItem !== 'object') {
      data[key] = mergeItem
      return
    }
    data[key] = merge(dataItem, mergeItem)
  })
}
module.exports = {
  /**
   * 对象merge
   * @returns {unknown}
   */
  merge () {
    let args = [].slice.apply(arguments)
    // 忽略无效值
    args = args.filter(item => item)
    if (args.length < 2) return args[0]
    let rt = args[0]
    args.slice(1).forEach(arg => merge(rt, arg))
    return rt
  }
}