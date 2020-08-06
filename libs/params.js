const utilsString = require('./string')
const utilsArray = require('./array')
const inquirer = require('inquirer')
module.exports = {
  /**
   * 获取需要的参数
   * @param useParams
   * @param params
   * @returns {Promise<{}>}
   */
  async getParams (useParams, params = {}) {
    let prompts = []
    Object.keys(useParams).forEach(key => {
      let value = params[key]
      let config = useParams[key]
      if (useParams.type === 'list') {
        // 移除无效的选择项
        if (!useParams.choices.find(item => item.name === value)) {
          value = ''
        }
      }
      if (value == null) {
        config.name = config.name || key
        prompts.push(config)
      }
    })
    if (!prompts.length) return params
    await utilsArray.doSyncQueue(prompts, async prompt => {
      params[prompt.name] = await this.getOnePrompt(prompt)
    })
    return params
  },
  /**
   * 单个操作提示
   * @param prompt
   * @returns {Promise<*>}
   */
  async getOnePrompt (prompt) {
    let data = await new Promise(rev => {
      inquirer.prompt(prompt).then(rev)
    })
    let value = data[prompt.name]
    if (!value) return this.getOnePrompt(prompt)
    if (prompt.regexp) {
      if (!prompt.regexp.test(value)) return this.getOnePrompt(prompt)
    }
    return value
  }
}