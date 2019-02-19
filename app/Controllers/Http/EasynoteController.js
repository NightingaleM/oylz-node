'use strict'
const Easynote = use('App/Models/Easynote')
const Tag = use('App/Models/Tag')
const Database = use("Database");
const Hash = use('hash.js')
class EasynoteController {
  /**
 * Show a list of all easynote.
 * GET easynote
 */
  async index({ request, response, view }) {
    const { isSelf = true, page = 1, cout = 20, keywords = "", tags = '' } = request.all()
    const keywordList = keywords ? keywords.split(',') : null
    const tagList = tags ? tags.split(',').sort().map(item => parseInt(item)) : null
    let finaliyTagList = []
    console.log(isSelf, page, cout, keywordList, tagList)

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
    let noteRes = await Easynote.query()
      .orderBy('id', 'desc')
      .where(builder => {
        if (finaliyTagList.length) {
          builder.where('id', 'in', finaliyTagList)
        }
        if (keywordList) {
          keywordList.forEach(item => {
            builder.where('note', 'like', `%${item}%`)
          })
        }
        return builder
      })
      .with('tags')
      .with('user', builder => builder.select('username', 'email'))
      // .fetch();
      .paginate(page, cout)
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
    const { note, tags } = request.all()
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
        note: note
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
