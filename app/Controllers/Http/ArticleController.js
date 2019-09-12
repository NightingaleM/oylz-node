'use strict'
const Article = use('App/Models/Article')
const Database = use("Database");

const CheckStickNumber = async ({ uid }) => {
  let countRes = await Article.query()
    .where(builder => {
      builder.where('user_id', uid)
      builder.where('is_stick', 1)
      builder.where('delete_at', null)
    })
    .getCount()
  return countRes || 0
}
class ArticleController {
  /**
   * Show a list of all article.
   * GET article
   */
  async index({ request, response, view }) {
    const { isSelf = false, tag = null, page = 1, count = 5 } = request.all()
    const uid = request.userInfo ? request.userInfo.id : ''
    let tagArticleId
    if (tag) {
      tagArticleId = await Database.table('article_tag')
        .select(['article_id'])
        .where('tag_id', '=', tag)
    }
    let stickArticles = []
    let stickIds
    if (page === 1) {
      let stickArticlesRes = await Article.query()
        .orderBy('created_at', 'desc')
        .where(builder => {
          builder.where('is_public', 1)
          builder.where('is_stick', 1)
          if (isSelf) {
            builder.where('user_id', uid)
          } else {
            builder.where('is_public', 1)
          }
        })
        .with('user', builder => {
          builder.setVisible(['username', 'sex'])
        })
        .with('tags', builder => {
          builder.setVisible(['tag'])
        })
        .paginate(1, 2)


      stickArticles = [...stickArticlesRes.rows]
      stickIds = stickArticlesRes.rows.map(e => e.id)
    }
    let articleRes = await Article.query()
      .orderBy('created_at', 'desc')
      .where(builder => {
        if (stickIds) {
          builder.where('id', '!=', stickIds)
        }
        if (tagArticleId) {
          builder.where('id', '=', tagArticleId)
        }
        if (isSelf) {
          builder.where('user_id', uid)
        } else {
          builder.where('is_public', 1)
        }
        builder.where('delete_at', null)
        builder.where('is_stick', 0)
      })
      .with('user', builder => {
        builder.setVisible(['username', 'sex'])
      })
      .with('tags', builder => {
        builder.setVisible(['tag'])
      })
      .paginate(page, count)

    articleRes.rows.unshift(...stickArticles)
    // if (!isSelf) {
    //   console.log(articleRes.rows[0])
    //   articleRes.rows.forEach(e => {
    //     e.content = e.content.substr(0, 600)
    //   })
    // }
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
  // 文章的tag为4
  async store({ request, response, session }) {
    const uid = request.userInfo.id
    const { title, content, tag = [], isPublic = 1, isStick = 0 } = request.all()
    if (isStick) {
      let countRes = await CheckStickNumber({ uid })
      if (countRes >= 2) {
        response.status(412).json({
          message: '置顶文章不能超过两篇'
        })
        return
      }
    }
    if (tag.indexOf(4) < 0) {
      tag.push(4)
    }
    if (!title || !content) {
      response.status(412).json({
        message: '请填写完整内容'
      })
      return
    }
    try {
      let ArticleRes = await Article.create({
        title,
        content,
        user_id: uid,
        is_public: isPublic,
        is_stick: isStick
      })
      await ArticleRes.tags().attach(tag)
      response.json({
        message: 'success',
        result: null
      })
    } catch (e) {
      throw (e)
    }
  }

  /**
   * Display a single receipt.
   * GET article/:id
   */
  async show({ params, request, response, view }) {
    const { id } = params
    let articleRes = await Article.query()
      .where(builder => {
        builder.where('id', id)
        builder.where('delete_at', null)
      })
      .with('user', builder => {
        builder.setVisible(['username', 'sex'])
      })
      .with('tags', builder => {
        builder.setVisible(['tag'])
      })
      .fetch()
    response.json({
      message: 'success',
      result: articleRes
    })
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
    const { tag_id = [], title, content, tag = [], isPublic = 1, isStick = 0 } = request.all()
    const { id } = params
    const uid = request.userInfo.id
    if (isStick) {
      let countRes = await CheckStickNumber({ uid })
      if (countRes >= 2) {
        response.status(412).json({
          message: '置顶文章不能超过两篇'
        })
        return
      }
    }
    if (tag.indexOf(4) < 0) {
      tag.push(4)
    }
    if (!title || !content) {
      response.status(412).json({
        message: '请填写完整内容'
      })
      return
    }
    try {
      let mvTagArticleRes = await Database.table('article_tag')
        .where(builder => {
          builder.where('article_id', id)
          builder.where('tag_id', 'in', tag_id)
        })
        .del()
      let ArticleRes = await Article.query()
        .where(builder => {
          builder.where('id', '=', id)
          builder.where('user_id', '=', uid)
        })
        .update({
          title: title,
          content: content,
          is_public: isPublic,
          is_stick: isStick
        })

      let aaa = await Article.findBy('id', id)
      await aaa.tags().attach(tag)
      response.json({
        message: "update success",
        result: null
      })
    } catch (e) {
      throw (e)
    }
  }

  /**
   * Delete a receipt with id.
   * DELETE article/:id
   */
  async destroy({ params, request, response }) {
    const { id } = params
    const uid = request.userInfo.id
    const now = new Date()
    try {
      let destroyRes = await Article.query()
        .where(builder => {
          builder.where('id', '=', id)
          builder.where('user_id', '=', uid)
        })
        .update({
          delete_at: now
        })
      response.json({
        message: "delete success",
        result: null
      })
    } catch (e) {
      throw (e)
    }
  }
}

module.exports = ArticleController
