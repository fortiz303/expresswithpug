const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

app.set('view engine', 'pug');

// app.use((req,res,next)=>{
//     console.log('Hello');
//     const err = new Error ('oh nooooo');
//     err.status = 500; 
//     next(err);
// }); 

// app.use((req,res,next)=>{
//     console.log('Initial middleware console logging');
//     next();
// });

//If there is a name, render index.pug page
//If no name, redirect to '/home'
app.get('/', (req, res) => {
    const name = req.cookies.username;
    if(name){
        res.render('index', {name})
    }else{
        res.redirect('/home')
    }
});

//If there is a name redirect to '/'
//If no name, render home.pug, which has a form for user to create name
app.get('/home', (req,res) => {
    const name = req.cookies.username;
    if(name){
    res.redirect('/')
    } else {
    res.render('home');
    }
});

//Will store a cookie named username(see home.pug(note1))
app.post('/home', (req,res) => {
    res.cookie('username', req.body.username);
    //Simalteneously redirects to '/'
    res.redirect('/');
});

//This route is executed by index.pug(note2)
app.post('/goodbye', (req,res)=> {
    res.clearCookie('username');
    //Redirects cient to '/home' after clearing cookie concurrently
    res.redirect('/home');
});

//Express middleware error handler
app.use((req,res,next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

// app.get('/cards', (req, res) => {
//     res.render('card', {prompt : 'Who is the hardest?'});
// });

//Error handler - responds the client with the error
app.use((err,req,res,next) => {
    res.status(err.status);
    res.locals.error = err;
    res.render('error');
});


app.listen(3000, () => {
    console.log('The application is running on localhost3000');
});



