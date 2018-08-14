'use strict'

const Schema = use('Schema')

class TodoListSchema extends Schema {
  up () {
    this.create('todo_lists', (table) => {
      table.increments()
      table.string('title')
      table.text('todo')
      table.string('type')
      table.dateTime('planningTime')
      table.dateTime('finishTime')
      table.boolean('isFinished')
      table.timestamps()
    })
  }

  down () {
    this.drop('todo_lists')
  }
}

module.exports = TodoListSchema
