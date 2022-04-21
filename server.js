
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const mysql = require('mysql')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const session = require('express-session')
const dbConfig = require('./config')
const MySQLStore = require('express-mysql-session')
const { redirect } = require('express/lib/response')
const flash = require('flash')

const Post = require('./models/post')


var sequelize = require('./models').sequelize
//alter: true 모델 수정할 수 있게
//force : true면 매번 실행할때마다 테이블 drop 하고 다시 설치
sequelize.sync({ force: false, alter:true })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });



const dbOptions ={
    host:dbConfig.host,
    port:dbConfig.port,
    password:dbConfig.password,
    user:dbConfig.user,
    database:dbConfig.database
}

const conn = mysql.createConnection(dbOptions)

conn.connect()

app.set('view-engine', 'ejs')

//json값 받기
app.use(express.json())

app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'asdasd',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(dbOptions)
}))


app.use(express.json())


app.get('/', (req,res)=>{
    if(!req.session.email)
        return res.redirect('/login')
    return res.render('index.ejs', { name : req.session.name })
})

app.get('/login', (req,res)=>{
    if(!req.session.email)
        return res.render('login.ejs')
    return res.redirect('/')
})

app.get('/register',(req,res)=>{
    if(!req.session.email)
        return res.render('register.ejs')
    return res.redirect('/')
})

app.post('/home',async (req,res)=>{
    try{

        const posts = await Post.findAll()
        res.send(posts)
    }catch(error){
        console.log(error)
    }


})

app.post('/login',(req,res)=>{
    const param = [req.body.email,req.body.password]
    //row는 일치하는 유저 데이터 배열
    conn.query('SELECT * FROM users WHERE email=?',param[0],(err,row)=>{
        if (err) throw err;

        //유저가 존재한다면
        if(row.length>0){
            bcrypt.compare(param[1],row[0].password,(err,result)=>{
                if(result){
                    req.session.email=param[0]
                    req.session.password=row[0].password
                    req.session.name = row[0].name
                    console.log('success')
                    req.session.save(function(){

                        // Post.create({
                        //     artistName: "kys",
                        //     productName: "SideProject",
                        //     thumbnailUrl: "https://media.timeout.com/images/105685403/image.jpg",
                        //     imgUrl: [
                        //         "https://dd20lazkioz9n.cloudfront.net/wp-content/uploads/2021/06/Andertontrim.jpg",
                        //         "https://media.timeout.com/images/105685403/image.jpg"
                        //     ]
                        // })

                        // Post.create({
                        //     artistName: "toby",
                        //     productName: "hotspur",
                        //     thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwZ3KUJBqpbi9pHwj9-s8oHd-i7qJGoORMfw&usqp=CAU",
                        //     imgUrl: [
                        //         "https://dd20lazkioz9n.cloudfront.net/wp-content/uploads/2021/06/Andertontrim.jpg",
                        //         "https://media.timeout.com/images/105685403/image.jpg"
                        //     ]
                        // })

                        // Post.create({
                        //     artistName: "kane",
                        //     productName: "donda",
                        //     thumbnailUrl: "https://media-cdn.tripadvisor.com/media/photo-s/15/a4/9b/77/legacy-hotel-at-img-academy.jpg",
                        //     imgUrl: [
                        //         "https://dd20lazkioz9n.cloudfront.net/wp-content/uploads/2021/06/Andertontrim.jpg",
                        //         "https://media.timeout.com/images/105685403/image.jpg"
                        //     ]
                        // })

                        // Post.create({
                        //     artistName: "son",
                        //     productName: "sonny",
                        //     thumbnailUrl: "https://cdn-imgix.headout.com/tour/28481/TOUR-IMAGE/2bbd5c6c-e3dc-4dc4-b4d5-11c94baad3e3-15133-dubai-combo-img-worlds-of-adventure---free-burj-khalifa-at-the-top-with-coffee-06.JPG",
                        //     imgUrl: [
                        //         "https://dd20lazkioz9n.cloudfront.net/wp-content/uploads/2021/06/Andertontrim.jpg",
                        //         "https://media.timeout.com/images/105685403/image.jpg"
                        //     ]
                        // })

                        //data와 같이 redirect하기
                         var string = encodeURIComponent('success');
                         return res.redirect('?/='+string)
                    })

                }
                else{
                    console.log('password wrong')
                    return res.send('비밀번호가 틀렸습니다.')
//                    return res.redirect('/login')
                }
            })

        }
        else{
            console.log('email wrong')
            res.send('이메일이 틀렸습니다.')
           // return res.redirect('/login')
        }
    })
})

app.post('/register',async(req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        const param=[req.body.name,req.body.email,hashedPassword, req.body.account,req.body.bankType]
        //이메일 중복 체크
        conn.query('SELECT * FROM users WHERE email=?', param[1], (err, row)=>{
            if (err) throw err;
            //중복된 이메일이 없다면
            if(row.length==0)
            {
                conn.query('INSERT INTO users (`name`, `email`, `password`, `account`, `bankType`) VALUES (?,?,?,?,?)',param,(err,row)=>{
                    if(err) console.log(err)
                })
                //return res.redirect('/login')
                var string = encodeURIComponent('success');
                return res.redirect('?/='+string)
            }
            //이메일이 중복된다면
            else
            {
                console.log(row[0])

                res.send('이메일이 이미 존재합니다.')

            }
        })

    }catch{
        return res.redirect('/register')
    }

})

app.post('/logout',(req,res)=>{
    req.session.destroy(function(err){
        res.redirect('/login')
    })
})

app.listen(3000)

