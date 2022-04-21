const Sequelize = require('sequelize')

module.exports = class Hashtag extends Sequelize.Model{
  static init(sequelize) {
    return super.init({
      email:{
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true
      }

    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Hashtag',
      tableName: 'hashtags',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci'


    })
  }
  static associate(db) {
    //post와 hashtag는 n:m 관계
    //through는 생성할 테이블 이름
    //postId와 hashTagId를 외래키로 생성한다
    db.Hashtag.belongsToMany(db.Post, {through: 'PostHashtag'})
  }
}