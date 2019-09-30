'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Permission {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, auth }, next) {
    // call next to advance the request
    let user
    try {
      console.log('-------start-------')
      let check = await auth.check()
      user = await auth.getUser()
    } catch (e) {
      console.log('you need login')
      response.status(403).json({
        message: '请登录！'
      })
      return
    }
    try {
      request.userInfo = user
      await next()
    } catch (e) {
      console.log(e)
      response.status(502).json({
        message: 'bad request!!',
        error: e
      })
      return
    }
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle({ request }, next) {
    // call next to advance the request
    await next()
  }
}

module.exports = Permission
