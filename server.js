//================
//
//
// # SimpleServer
//
//
//================

// Объявление глобальных переменных
var
express = require('express'),
app = express(),
//храним на клиенте только сессию
session = require('express-session'),
bodyParser  = require('body-parser'),
path = require('path'),
favicon = require('serve-favicon'),
//локализация
i18n = require("i18n"),
util = require('util');


//иконка
//app.use(express.favicon());
//app.use(express.favicon('public/images/favicon.ico'));
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

//статические файлы (скрипты, стили и т.д.)
app.use('/public', express.static(path.join(__dirname, '/public')));

//для безопасности
app.disable('x-powered-by');
// ? app.disable('etag');

//Шаблонизатор set view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');//pug бывший jade


if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  session.cookie.secure = true; // serve secure cookies
}
if (app.get('env') === 'development') {
  //"красивый" вывод html (с табуляцией)
  app.locals.pretty = true;
}

//конфигурация локализатора
i18n.configure({
    locales:['en', 'ru'],
    directory: __dirname + '/locales',
    api: {
    //теперь в любом модуле (или шаблоне) можно указать t("text")
    //для трансляции на язык указанный в хедерак куки от пользователя
      '__': 't',
    },
    register: global
});

//инициализация локализатора
app.use(i18n.init);


//разборка body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

class PublicLog {
    constructor() {
        // always initialize all instance properties
        this.items = [];
    }
    addLine(text) {
         this.items.push(text);
    }
    getLines() {
        return this.items;
    }
}

var publicLog=new PublicLog();

// выполняется при каждом запросе, кроме ошибки
app.use(function (req, res, next) {
    // установка локали
    if (req.session)
      if (req.session.user)
        if (req.session.user.locale) {
        }
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('%s IP %s; method %s; URL %s',new Date().toISOString(),ip, req.url,req.method);
    publicLog.addLine(util.format('%s IP %s; method %s; URL %s',new Date().toISOString(),ip, req.url,req.method));
    next();
});

function prepareData(){
  var data={};
  data.log=publicLog.getLines();
  data.title='text web page';
  data.mainnavigation=[{
    name:"home",
    link:"/"
  },{name:"articles",
    link:"/articles"
  },{name:"about",
    link:"/about"
  },{name:"error",
    link:"/error"
  },{name:"log",
    link:"/log"
  }    
  ];
  
  data.articles=[{
    _id:"1",
    title:"title1",
    text:"text1"
  },{
    _id:"2",
    title:"title2",
    text:"text2"
  }];
  
  data.article={
    title:"title1",
    text:"text1"
  };  

  data.user={};
  data.user.username='user000';
  data.user.secondName='Иванов';
  data.user.firstName='Иван';
  data.user.threeName='Иванович';
  data.user.born=new Date();
  data.user.gender='male';
  data.user.role=1;
  data.mailcount=3;
  data.usernavigation=[{
    name:"mail",
    link:"link1"
  },{name:"name1",
    link:"link2"
  }
  ,{name:"name2",
    link:"link2"
  }];
  
  //delete  data.user;
  
  return data;
}

//пути route
app.route(['/','/:resource'])
  .get((req, res) => {
   //throw new Error('example error text');
    
    var data=prepareData();
    
    var resource=req.params["resource"];
    if (resource){
      res.render(resource,data, function(err, html) {
        if(err) {
          //res.redirect('404'); // File doesn't exist
          //res.send(404);
          res.render('404',data);
        } else {
          res.send(html);
        }
        });
    } else
      res.render('index', data);
  })
  .post()
  .put()
  .delete();
  
//главный route, содержит перенаправление на 404 при остальных запросах
//для остальных запросов
app.get('*', function(req, res, next){
    var data=prepareData();
    res.render('404',data);
});

//обработка ошибок
// Все обработчики ошибок должны иметь 4 параметра, иначе они будут обычными контроллерами
app.use(function(err,req,res,next)
{

    if (req.xhr) {
      res.status(err.status).send({ error: err.message });
    } else {

      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      var data=prepareData();
      res.render('error',data); 
    }
    next();
});


//обработка ошибок
// Все обработчики ошибок должны иметь 4 параметра, иначе они будут обычными контроллерами
module.exports = function(err,req,res,next)
{
    if (req.xhr) {
      res.status(err.status).send({ error: err.message });
    } else {
      // render the error page
      res.status(err.status || 500);
      res.render('error'); 
    }
    next();
};

//запуск сервера
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
  console.log('Сервер запущен '+process.env.PORT || 3000);
});

// prevent too long threshold
app.timeout = 2048;
