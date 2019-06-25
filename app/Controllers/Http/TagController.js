'use strict'
const Tag = use('App/Models/Tag')
const { validate, validateAll } = use('Validator') // 用于表单验证

class TagController {
  /**
   * Show a list of all tags.
   * GET tags
   */
  async index({ request, response, view }) {
    let tags = await Tag.query().select(['tag', 'id'])
    return tags
  }

  /**
   * Render a form to be used for creating a new receipt.
   * GET tags/create
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new receipt.
   * POST tags
   */
  async store({ request, response, session }) {
    const { tag } = request.all()
    try {
      let tagRes = await Tag.create({ tag })
      response.json({
        a: 'fasdfa'
      })
    } catch (e) {
      throw (e)
    }
  }

  /**
   * Display a single receipt.
   * GET tags/:id
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing receipt.
   * GET tags/:id/edit
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update receipt details.
   * PUT or PATCH tags/:id
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a receipt with id.
   * DELETE tags/:id
   */
  async destroy({ params, request, response }) {
  }

}

module.exports = TagController
