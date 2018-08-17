'use strict'
const Tag = use('App/Models/Tag')
const TodoList = use('App/Models/TodoList')
const Database = use('Database')
class TodoListController {
  async index({
    request,
    response
  }) {
    const time = request.only(['year', 'month', 'date'])
    const nextDay = (() => {
      let t = `${time.year}-${time.month}-${time.date}`
      let dayTime = new Date(new Date(t).getTime() + 86400000)
      return `${dayTime.getFullYear()}-${dayTime.getMonth()+1}-${dayTime.getDate()}`
    })()
    const year = {
      now: `${time.year}-01-01`,
      next: `${time.year+1}-01-01`,
    }
    const month = {
      now: `${time.year}-${time.month}-01`,
      next: `${time.month==='12'?parseInt(time.year)+1:time.year}-${time.month==='12'?'01':parseInt(time.month)+1}-01`,
    }

    const date = {
      now: `${time.year}-${time.month}-${time.date}`,
      next: nextDay,
    }

    const yearMsg = await TodoList.query().with('tags')
      .where(function () {
        this.where('type', 'Year')
          .andWhere('planningTime', '>', year.now)
          .andWhere('planningTime', '<', year.next)
          .orWhere('planningTime', '=', year.now)
      }).fetch()
    const monthMsg = await TodoList.query().with('tags')
      .where(function () {
        this.where('type', 'Month')
          .andWhere('planningTime', '>', month.now)
          .andWhere('planningTime', '<', month.next)
          .orWhere('planningTime', '=', month.now)
      }).fetch()
    const dateMsg = await TodoList.query().with('tags')
      .where(function () {
        this.where('type', 'Day')
          .andWhere('planningTime', '>', date.now)
          .andWhere('planningTime', '<', date.next)
          .orWhere('planningTime', '=', date.now)
      }).fetch()
    response.json({
      message: 'success',
      result: {
        year: yearMsg,
        month: monthMsg,
        date: dateMsg
      }
    })
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

  async update({
    params,
    response
  }) {
    let now = new Date()
    // return `更新单个资源的请求 ${params.id}`
    let time = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}:${now.getMinutes()}:10`

    await TodoList.query().where('id', params.id).update({
      isFinished: 1,
      finishTime: time
    })
    response.json({
      message: 'finished',
      result: null
    })
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
