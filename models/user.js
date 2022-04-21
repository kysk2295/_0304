const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model{
  static init(sequelize) {
    return super.init({
      email:{
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      account:{
        type: Sequelize.STRING(45),
        allowNull: true
      },
      bankType:{
        type: Sequelize.STRING(10),
        allowNull: true
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'


    })
  }
  static associate(db) {
    // user : post(1:n)
    // post 모델에 외래키 userId 칼럼을 추가한다.
    db.User.hasMany(db.Post)

    // user : user(n:m)
    db.User.belongsToMany(db.User,{
      //user1에게 생기는 following, 새로 생기는 칼럼 이름
      foreignKey: 'followingId',
      //생성된 Follow라는 테이블 이름을 바꿔서 가져옴
      as: 'Followers',
      //생성할 테이블 이름
      through: 'Follow'
    })
    db.User.belongsToMany(db.User,{
      //user2에게 생기는 follower, 새로 생기는 칼럼 이름
      foreignKey: 'follwerId',
      as: 'Followings',
      through: 'Follow',
    })




  }
}