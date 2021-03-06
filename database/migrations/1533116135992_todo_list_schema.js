'use strict'

const Schema = use('Schema')

class TodoListSchema extends Schema {
  up() {
    this.create('todo_lists', (table) => {
      table.increments()
      table.string('title')
      table.text('todo')
      table.string('type')
      table.dateTime('planningTime')
      table.dateTime('finishTime')
      table.boolean('isFinished')
      table.integer('user_id').unsigned() //unsigned为无符号整数
      table.foreign('user_id').references('users.id') //将已存在的键设置为外键，和references搭配使用
      table.timestamps()
    })
  }

  down() {
    this.drop('todo_lists')
  }
}

module.exports = TodoListSchema
