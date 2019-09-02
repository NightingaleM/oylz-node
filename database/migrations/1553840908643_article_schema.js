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
      table.integer('user_id').unsigned() //unsigned为无符号整数
      table.foreign('user_id').references('users.id') //将已存在的键设置为外键，和references搭配使用
      table.integer('is_public').unsigned().defaultTo(1)
      table.integer('is_stick').unsigned()
      table.timestamps()
    })
  }

  down() {
    this.drop('articles')
  }
}

module.exports = ArticleSchema
