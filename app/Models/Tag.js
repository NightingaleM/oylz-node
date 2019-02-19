'use strict'

const Model = use('Model')

class Tag extends Model {
  todoList() {
    return this.belongsToMany('App/Models/TodoList')
  }

  easynote() {
    return this.belongsToMany('App/Models/Easynote')
  }
}

module.exports = Tag
