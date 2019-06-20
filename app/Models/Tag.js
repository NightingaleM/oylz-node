'use strict'

const Model = use('Model')

class Tag extends Model {
  todoList() {
    return this.belongsToMany('App/Models/TodoList')
  }

  easynote() {
    return this.belongsToMany('App/Models/Easynote')
  }

  article() {
    return this.belongsToMany('App/Models/Article')
  }
}

module.exports = Tag
