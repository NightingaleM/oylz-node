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
    try {
      let check = await auth.check()
      let user = await auth.getUser()
      console.log(request.url())
      console.log(request.method())
      console.log('--------end--------')
      await next()
    } catch (e) {
      console.log(e)
      console.log('you need login')
      response.status(403).json({
        message: '请登录！'
      })
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
