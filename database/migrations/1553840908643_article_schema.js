'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticleSchema extends Schema {
  up() {
    this.create('articles', (table) => {
      table.increments()
      table.string('title')
      table.text('content')
      table.dateTime('delete_at').defaultTo(null)
      table.timestamps()
    })
  }

  down() {
    this.drop('articles')
  }
}

module.exports = ArticleSchema
