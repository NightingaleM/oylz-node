'use strict'

/*
|--------------------------------------------------------------------------
| TagSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')
const Tag = use('App/Models/Tag')
class TagSeeder {
  async run() {
    const tags = [
      {
        tag: '学习'
      },
      {
        tag: '工作'
      },
      {
        tag: '生活'
      },
      {
        tag: '文章'
      },
      {
        tag: '大数据'
      },
      {
        tag: 'TODO'
      },
      {
        tag: '吃'
      }
    ]

    await Tag.createMany(tags)
  }
}

module.exports = TagSeeder
