'use strict';

const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const User = require('./user')
const Post = require('./post')
const Hashtag = require('./hashtag')
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}



db.sequelize = sequelize;
db.Sequelize = Sequelize;

//모델 연결
db.User = User
db.Post = Post
db.Hashtag = Hashtag

//각 객체 실행
User.init(sequelize)
Post.init(sequelize)
Hashtag.init(sequelize)

//관계 연결
User.associate(db)
Post.associate(db)
Hashtag.associate(db)

module.exports = db;
