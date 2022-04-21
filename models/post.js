const Sequelize = require('sequelize')

module.exports = class Post extends Sequelize.Model{
  static init(sequelize) {
    return super.init({
      artistName:{
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      productName:{
        type: Sequelize.STRING(40),
        allowNull: false,
      },
      thumbnailUrl:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      imgUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        get() {
       return this.getDataValue('imgUrl').split(';')
       },
      set(val)
      {
      this.setDataValue('imgUrl',Array.isArray(val) ? val.join(','):val);

    }
      },

    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Post',
      tableName: 'posts',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'


    })
  }
  static associate(db) {
    //1:n 관계
    db.Post.belongsTo(db.User)
    //n:M 관계
    db.Post.belongsToMany(db.Hashtag, {through: 'PostHashtag'})

  }
}