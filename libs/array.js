module.exports = {
  /**
   * 同步队列
   * @param list
   * @param func
   * @returns {Promise<void>}
   */
  async doSyncQueue (list, func) {
    for (var i = 0; i < list.length; i++) {
      await func(list[i])
    }
  }
}