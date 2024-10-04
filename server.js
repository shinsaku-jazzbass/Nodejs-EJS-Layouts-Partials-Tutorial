//Imports
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const aboutRouter = require("./routes/about");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 5009;

//database import
var database = require("./config/mysqldb");

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // HTTPSを使用
        httpOnly: true, // XSS攻撃を防ぐ
        sameSite: 'strict', // CSRF攻撃を防ぐ
        maxAge: 24 * 60 * 60 * 1000 // セッションの有効期限を設定（例: 24時間）
    }
}));


//Static Files
app.use(express.static('public'));
//__dirname は、現在実行中のソースコードが格納されているディレクトリパス
//stylesheetローカルに設定は下記の様に指定
app.use('/css', express.static(__dirname + 'public/css'));

//Set Templating Engine
app.use(expressLayouts);
//layout.evs上にindex.ejsレンダリング
//ejsではデフォルトではlayout.ejsとindex.ejsが自動的に
//<%- body %>へレンダリングするが、.setにて変更できる。
app.set('layout','./layouts/layout.ejs');
//固定ペー技をmain.ejsに変更した場合
//app.set('layout','./layouts/main.ejs');
//とする。

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true}));

//Navigation
app.get('', (req, res) => {
    res.render('index',{
        title: "Top Page",
    });
})

app.use("/about",aboutRouter);

//layout.evs上にabout.ejsレンダリングはフォルダroutesのabout.jsが行う
// app.get('/about', (req, res) => {
//     res.render('about',{
//         title: "About Page",
//         layout: './layouts/sidebar'
//     });
// })

//layout.evs上にabout.ejsレンダリング
app.get('/login', (req, res) => {
    console.log(req.session.authenticated);
    if (req.session.authenticated) {
        res.render('login',{
            title: "Login Page",
            loginsw: false,
        });
        //res.send("Start nodejs mysql auth test");
        // ユーザーが認証済みの場合、ユーザーデータを表示
    } else {
        // ユーザーが未認証の場合、ログインページにリダイレクト
        //res.redirect('/login');
        res.render('login',{
            title: "Login Page",
            loginsw: true,
        });
    }
    
})

app.post("/login", async (req, res, next) => {
    const {id, password} = req.body;
    //var hashed_password = await bcrypt.hashSync("jazzbass", 10);
    console.log(password);
    //var inppassword = password;
    let dbpassword = "";
    var query = `SELECT * FROM sample_data WHERE id = ${id}`;
    var isMatch = false;
    console.log(query);
    database.query(query, async function(error, data){

		if(error)
		{
			throw error; 
		}
	
			dbpassword = data[0]['password'];
            console.log(dbpassword);
            isMatch = await bcrypt.compare(password, data[0]['password']);
            console.log(isMatch);
            if(isMatch){
                req.session.authenticated = true; // セッションに認証ステータスを保存
                res.redirect("/");
            }else{
                res.redirect("/login");
            }
	});
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            // エラーを処理
        } else {
            res.redirect('/login');
        }
    });
});

//Listen On Port 5000
app.listen(PORT, () => console.log(`App lisetn on port ${PORT}`));
