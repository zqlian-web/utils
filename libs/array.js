module.exports = {
  async doSyncQueue (list, func) {
    for (var i = 0; i < list.length; i++) {
      await func(list[i])
    }
  }
}