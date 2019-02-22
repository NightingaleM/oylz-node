'use strict'
const User = use('App/Models/User')
const { validate, validateAll } = use('Validator') // 用于表单验证

class UserController {
  /**
   * Show a list of all user.
   * GET user
   */
  async index({ request, response, view }) {
    return "yes"
  }

  /**
   * Render a form to be used for creating a new receipt.
   * GET user/create
   */
  async create({ request, response, view }) {
  }

  /**
   * Create/save a new receipt.
   * POST user
   */
  async store({ request, response, session }) {
    const rules = {
      username: 'required|unique:users',// required=>必填,unique:users=>这个字段在users表中应该是唯一的值
      email: 'required|unique:users', // unique:email=>这个字段在users表中应该是唯一的值
      password: 'required|min:8|max:30',// min=>最小长度,max=>最大长度
    }
    const validation = await validateAll(request.all(), rules)

    if (validation.fails()) {
      session
        .withErrors(validation.messages())

      return response.status(412).json({
        message: validation.messages(),
        result: null
      })
    }
    console.log("ffffffffffffffffffffff")
    const newUserInfo = request.only(['username', 'email', 'password', 'sex'])
    const user = await User.create(newUserInfo)
    return {
      message: 'register success',
      user: {
        username: user.username,
        email: user.email,
        sex: user.sex
      }
    }
  }

  /**
   * Display a single receipt.
   * GET user/:id
   */
  async show({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing receipt.
   * GET user/:id/edit
   */
  async edit({ params, request, response, view }) {
  }

  /**
   * Update receipt details.
   * PUT or PATCH user/:id
   */
  async update({ params, request, response }) {
  }

  /**
   * Delete a receipt with id.
   * DELETE user/:id
   */
  async destroy({ params, request, response }) {
  }

  /**
   * User login with email and password.
   * POST login
   */
  async login({ params, request, response, auth }) {
    console.log('用户登录')
    const { email, password } = request.all()
    await auth.attempt(email, password)
    const user = await auth.getUser()
    response.status(200).json({
      message: 'login success',
      result: {
        username: user.username,
        id: user.id,
        email: user.email
      }
    })
  }

  /**
   * User logout.
   * POST logout
   */
  async logout({ params, request, response, auth }) {
    console.log('用户登出')
    let logout = await auth.logout()
    response.status(200).json({
      message: 'logout success',
      result: logout
    })
  }
  /**
   * Check user status
   */
  async checkUserStatus() {
    return 'ok'
  }
}

module.exports = UserController
