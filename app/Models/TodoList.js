'use strict'

const Model = use('Model')

class TodoList extends Model {
  tags() {
    return this.belongsToMany('App/Models/Tag')
  }
}

module.exports = TodoList
