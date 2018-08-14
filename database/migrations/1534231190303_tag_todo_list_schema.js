'use strict'

const Schema = use('Schema')

class TagTodoListSchema extends Schema {
  up() {
    this.create('tag_todo_list', (table) => {
      table.increments()
      table.integer('todo_list_id').unsigned()
      table.foreign('todo_list_id').references('todo_lists.id')
      table.integer('tag_id').unsigned()
      table.foreign('tag_id').references('tags.id')
      table.timestamps()
    })
  }

  down() {
    this.drop('tag_todo_list')
  }
}

module.exports = TagTodoListSchema
