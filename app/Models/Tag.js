'use strict'

const Model = use('Model')

class Tag extends Model {
  todoList() {
    return this.belongsToMany('App/Models/TodoList')
  }
}

module.exports = Tag
