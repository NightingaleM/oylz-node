'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EasynoteSchema extends Schema {
  up() {
    this.create('easynotes', (table) => {
      table.increments()
      table.text('note')
      table.boolean('isPublic').notNullable()
      table.integer('user_id').unsigned() //unsigned为无符号整数
      table.foreign('user_id').references('users.id') //将已存在的键设置为外键，和references搭配使用
      table.timestamps()
    })
  }

  down() {
    this.drop('easynotes')
  }
}

module.exports = EasynoteSchema
