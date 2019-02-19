'use strict'


const Tag = use('App/Models/Tag')
class TagController {
  async index({ request }) {
    let tags = await Tag.query().select(['tag', 'id'])
    return tags
  }

  store() {
    return "创建资源的请求"
  }

  async show({
    params
  }) {

  }

  update({
    params
  }) {
    return `更新单个资源的请求 ${params.id}`
  }

  destroy({
    params
  }) {
    return `删除资源的请求 ${params.id}`
  }
  create() {
    return `创建资源表单`
  }
  edit({
    params
  }) {
    return `根据id，获取对应资源放入表单 ${params.id}`
  }
}

module.exports = TagController
