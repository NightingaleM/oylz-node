'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TagEasynotSchema extends Schema {
  up() {
    this.create('tag_easynots', (table) => {
      table.increments()
      table.integer('easynote_id').unsigned()
      table.foreign('easynote_id').references('easynotes.id')
      table.integer('tag_id').unsigned()
      table.foreign('tag_id').references('tags.id')
      table.timestamps()
    })
  }

  down() {
    this.drop('tag_easynots')
  }
}

module.exports = TagEasynotSchema
