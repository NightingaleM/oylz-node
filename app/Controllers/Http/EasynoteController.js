'use strict'
const Easynote = use('App/Models/Easynote')
const Tag = use('App/Models/Tag')
const Database = use("Database");
const Hash = use('hash.js')

const NOTHING = {
  message: '没有符合该搜索组合的内容!',
  result: {
    data: [],
    total: 0
  }
}
class EasynoteController {
  /**
 * Show a list of all easynote.
 * GET easynote
 */
  async index({ request, response, view }) {
    const { isSelf, page = 1, count = 20, keywords = "", tags = '' } = request.all()
    const keywordList = keywords ? keywords.split(',') : null
    const uid = request.userInfo ? request.userInfo.id : ''
    const tagList = tags ? tags.split(',').sort().map(item => parseInt(item)) : null
    let finaliyTagList = []
    if (tagList) {
      let tagsRes = await Database.table('easynote_tag').select(['easynote_id', 'tag_id'])
        .where(builder => {
          if (tagList) {
            builder.where('tag_id', 'in', tagList)
          }
        })
      // 再对所有条目进行分类，将每个noteid所包含的tagid放入一个数组
      let tagMap = new Map()
      tagsRes.forEach(item => {
        if (!tagMap.has(item.easynote_id)) {
          tagMap.set(item.easynote_id, [item.tag_id])
        } else {
          tagMap.get(item.easynote_id).push(item.tag_id)
          tagMap.get(item.easynote_id).sort()
        }
      })
      // 将tagid数组符合查询数组的内容题选出来
      // 使用hash将会严格匹配传进来的tags，不能多也不能少，略微奇怪，所以改成判断长度，可以多，不能少
      // let tagListHash = Hash
      //   .sha256()
      //   .update(tagList)
      //   .digest("hex")
      tagMap.forEach((tags, noteid) => {
        // let tagMapHash = Hash
        //   .sha256()
        //   .update(tags)
        //   .digest("hex")
        if (tags.length >= tagList.length) finaliyTagList.push(noteid)
      })
    }
    if (!finaliyTagList.length && tagList) {
      response.json(NOTHING)
      return
    }
    if (tagList && !finaliyTagList.length) { }
    let noteRes = await Easynote.query()
      .orderBy('id', 'desc')
      .where(builder => {
        if (finaliyTagList.length) builder.where('id', 'in', finaliyTagList);
        if (keywordList) {
          keywordList.forEach(item => {
            builder.where('note', 'like', `%${item}%`)
          })
        }
        if (isSelf === 'true') {
          builder.where('user_id', uid)
        } else {
          builder.where('isPublic', 1)
        }
        return builder
      })
      .with('tags')
      .with('user', builder => builder.select('username', 'email'))
      // .fetch();
      .paginate(page, count)
    if (!noteRes.pages.total) {
      response.json(NOTHING)
      return
    }
    response.json({
      message: 'success',
      result: noteRes
    })
  }

  /**
   * Render a form to be used for creating a new receipt.
   * GET easynote/create
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new receipt.
   * POST easynote
   */
  async store({ request, response, session }) {
    const { note, tags, isPublic } = request.all()
    const uid = request.userInfo.id
    if (!note || (tags && tags.length > 5)) {
      response.status(412).json({
        message: !note ? '请填写文本内容！' : '请选择不多于5条的标签！'
      })
      return
    }
    try {
      let easynoteRes = await Easynote.create({
        user_id: uid,
        note: note,
        isPublic: isPublic
      })
      await easynoteRes.tags().attach(tags)
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
   * GET easynote/:id
   */
  async show({ params, request, response, view }) {
    const { id } = params
    let detailRes = await Easynote.query()
      .where('id', id)
      .with('user')
      .with('tags')
      .fetch();
    let detail = {
      created_at: detailRes.rows[0].created_at,
      id: detailRes.rows[0].id,
      note: detailRes.rows[0].note.replace(/\n|\r/g, '<br>'),
      usernames: detailRes.rows[0]['$relations'].user.username.split(''),
      usersex: detailRes.rows[0]['$relations'].user.sex,
      tags: detailRes.rows[0]['$relations'].tags
    }
    response.json({
      message: 'success',
      result: detail
    })
  }

  /**
   * Render a form to update an existing receipt.
   * GET easynote/:id/edit
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update receipt details.
   * PUT or PATCH easynote/:id
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a receipt with id.
   * DELETE easynote/:id
   */
  async destroy({ params, request, response }) {

  }
}

module.exports = EasynoteController
