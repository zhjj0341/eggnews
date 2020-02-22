/* eslint-disable */

/**
 * 1. create custom user
 * 2. create collection (Before MongoDB can save your new database, a collection name must also be specified at the time of creation.)
 */
db.createUser({
  user: 'test',
  pwd: 'test',
  roles: [
    {
      role: 'readWrite',
      db: 'egg_news'
    }
  ]
})

db.egg_news.insert({
  egg_news: 'egg-news'
})
