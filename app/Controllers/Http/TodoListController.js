'use strict'
const Tag = use('App/Models/Tag')
const TodoList = use('App/Models/TodoList')
class TodoListController {
  async index() {
    const time = request.input('time')
    // const
    const yearMsg = TodoList.findAll().where('planningTime','<',time.year)
  }

  async store({
    request,
    response
  }) {
    // console.log(request)
    const newList = request.only(['title',
      'todo',
      'type',
      'planningTime',
      'finishTime',
      'isFinished',
    ])
    const tags = request.input('tags')
    const todoList = await TodoList.create(newList)
    await todoList.tags().attach(tags)
    response.json({
      message: 'success',
      result: null
    })
  }

  async show({
    request,
    response
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
  async create({
    request,
    response
  }) {

  }
  edit({
    params
  }) {
    return `根据id，获取对应资源放入表单 ${params.id}`
  }
}

module.exports = TodoListController
