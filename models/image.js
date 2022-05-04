const Sequelize = require('sequelize')

module.exports = class Image extends Sequelize.Model{
  static init(sequelize) {
    return super.init({
      imgUrl:{
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },

    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Image',
      tableName: 'images',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci'


    })
  }
  static associate(db) {

    db.Image.belongsTo(db.Post)
  }
}