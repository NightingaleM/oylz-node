'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Easynote extends Model {
  tags() {
    return this.belongsToMany('App/Models/Tag')
  }
  user() {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Easynote
