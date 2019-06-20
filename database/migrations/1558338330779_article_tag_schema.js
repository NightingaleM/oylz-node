'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticleTagSchema extends Schema {
  up() {
    this.create('article_tag', (table) => {
      table.increments()
      table.integer('article_id').unsigned()
      table.foreign('article_id').references('articles.id')
      table.integer('tag_id').unsigned()
      table.foreign('tag_id').references('tags.id')
      table.timestamps()
    })
  }

  down() {
    this.drop('article_tag')
  }
}

module.exports = ArticleTagSchema
