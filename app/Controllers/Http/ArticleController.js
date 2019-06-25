'use strict'
const Article = use('App/Models/Article')
const Database = use("Database");

class ArticleController {
  /**
   * Show a list of all article.
   * GET article
   */
  async index({ request, response, view }) {
    const { tag = null, page = 1, count = 5 } = request.all()
    let tagArticleId
    if (tag) {
      tagArticleId = await Database.table('article_tag')
        .select(['article_id'])
        .where('tag_id', '=', tag)
    }
    let articleRes = await Article.query()
      .orderBy('created_at', 'desc')
      .where(builder => {
        if (tagArticleId) {
          builder.where('id', '=', tagArticleId)
        }
        return builder
      })
      .with('tags')
      .paginate(page, count)
    if (!articleRes.pages.total) {
      response.json({
        message: '没有符合该搜索组合的内容!',
        result: {
          data: [],
          total: 0
        }
      })
    }
    response.json({
      message: 'success',
      result: articleRes
    })
  }

  /**
   * Render a form to be used for creating a new receipt.
   * GET article/create
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new receipt.
   * POST article
   */
  async store({ request, response, session }) {

  }

  /**
   * Display a single receipt.
   * GET article/:id
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing receipt.
   * GET article/:id/edit
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update receipt details.
   * PUT or PATCH article/:id
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a receipt with id.
   * DELETE article/:id
   */
  async destroy({ params, request, response }) {
  }
}

module.exports = ArticleController
