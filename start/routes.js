'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

Route.on('/').render('welcome')
Route.get('oy/api/tags', 'TagController.index')
Route.group('advertisement', function () {
  Route.resource('/tags', 'TagController')
  Route.resource('/todolist', 'TodoListController')
  Route.resource('/easynote', 'EasynoteController')
}).prefix('oy/api').middleware('permission')

Route.resource('oy/api/user', 'UserController')
// 登录
Route.post('oy/api/login', 'UserController.login')
// 登出
Route.post('oy/api/logout', 'UserController.logout')