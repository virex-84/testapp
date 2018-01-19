//================
//
//
// # SimpleServer
//
//
//================

// объявление глобальных переменных
const
express = require('express'),
app = express(),
// храним на клиенте только сессию
session = require('express-session'),
bodyParser  = require('body-parser'),
path = require('path'),
favicon = require('serve-favicon'),
// локализация
i18n = require("i18n"),
util = require('util');


// иконка
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

// статические файлы (скрипты, стили и т.д.)
app.use('/public', express.static(path.join(__dirname, '/public')));

// для безопасности
app.disable('x-powered-by');
// ? app.disable('etag');

// шаблонизатор set view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');//pug бывший jade


if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // для сохранения куки сессии в клиентском браузере
  session.cookie.secure = true; // serve secure cookies
}
if (app.get('env') === 'development') {
  app.set('trust proxy', 1); // для сохранения куки сессии в клиентском браузере
  app.locals.pretty = true;  // для PUG - "красивый" вывод html (с табуляцией)
}

// конфигурация сессии
app.use(session({
    secret: 'keyboard cat',//подпись для исключения подделки сессий
    key: 'asdfgh',
    cookie: {
            "path": "/",
            "httpOnly": true,
            "maxAge"  : 3600000,
            secure: true
            },
    saveUninitialized: true, //сохранять пустые сессии
    resave: false,           //пересохранять если нет изменений  
}));

// конфигурация локализатора
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

// инициализация локализатора
app.use(i18n.init);

// разборка body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// небольшой класс для вывода списка лога
class PublicLog {
    constructor() {
        this.items = [];
    }
    addLine(text) {
         this.items.push(text);
    }
    getLines() {
        return this.items;
    }
}

let publicLog=new PublicLog();

// формирования сообщения для вывода в pug->bootstrap
function newmessage(text,type){
  let message={};
  message.text=text;
  message.type=type;
  return message;
}

// выполняется при каждом запросе, кроме ошибки
app.use(function (req, res, next) {
  
    // установка локали
    if (req.session)
      if (req.session.locale){
        i18n.setLocale(req, req.session.locale);
      }
   
    // логирование   
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('%s IP %s; %s %s',new Date().toISOString(), ip, req.method, req.url);
    publicLog.addLine(util.format('%s IP %s; %s %s',new Date().toISOString(), ip, req.method, req.url));
    
    next();
});

// помечаем меню выделением
function checkActive(data,currentLink){
    let keys = Object.keys( data );
    for( let i = 0,length = keys.length; i < length; i++ ) {
        data[ keys[ i ] ];
        if (data[ keys[ i ] ].link==currentLink)
          data[ keys[ i ] ].active=true;
        if (data[ keys[ i ] ].submenu!=undefined)
          checkActive(data[ keys[ i ] ].submenu,currentLink);
    }  
}

// добавление данных для вывода 
function prepareData(currentLink){
  let data={};
  data.log=publicLog.getLines();
  data.title='Sample pug & bootstrap';
  
  //главное меню, навигация
  data.mainnavigation=
  [
    {
    name:"home",
    link:"",
    submenu:[
      {
        name:"home (admin)",
        link:"/?userrole=admin"
      },
      {
        name:"home (user)",
        link:"/?userrole=user"
      },
      ]
    },
    {
    name:"articles",
    link:"",
    submenu:[
      {
        name:"articles (admin)",
        link:"/articles?userrole=admin"
      },
      {
        name:"articles (user)",
        link:"/articles?userrole=user"
      },
      ]
    },
    {
    name:"tree",
    link:"",
    submenu:[
      {
        name:"treeA",
        link:"/treeA",
      },
      {
        name:"treeB",
        link:"",
        submenu:[
          {
            name:"treeC",
            link:"/treeC",
          },
          {
            name:"treeD",
            link:"/treeD",
          },            
          {
          name:"treeE",
          link:"/treeE",
          submenu:[
            {
            name:"treeF",
            link:"/treeF"
            }
            ]
          }
      ]
      }
      ]
    },    
    {
      name:"broken",
      link:"/broken",      
    },
    {
      name:"error",
      link:"/error",      
    },
    {
      name:"log",
      link:"/log",      
    },
    {
      name:"about",
      link:"/about",      
    }
    /*
    ,
    {
      name:"language",
      link:"",
      submenu:[
        {
          name:"english",
          link:"/?lang=en"
        },
        {
          name:"russian",
          link:"/?lang=ru"
        }        
      ]
    }, 
    */
  ];

  //статьи
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

  //пользователь
  data.user={};
  data.user.username='user000';
  data.user.secondName='Иванов';
  data.user.firstName='Иван';
  data.user.threeName='Иванович';
  data.user.born=new Date();
  data.user.gender='male';
  data.user.role=0;
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
  
  //добавляем все доступные локали в главное меню
  let langmenu={
    name:'language',
    link:'',
    submenu:[]
  };  
  for (let item of i18n.getLocales()){
    langmenu.submenu.push({
    name:item,
    link:'/?lang='+item,
    }
    );
  }
  data.mainnavigation.push(langmenu);  
  
  //помечаем(выделяем) текущий линк(ресурс) в главном меню
  if (currentLink)
    checkActive(data.mainnavigation,currentLink);

  return data;
}

// пути route
app.route(['/','/:resource'])
  .get((req, res) => {
    let resource=req.params["resource"];
    
    // произвольная ошибка для теста
    if (resource=='error') throw new Error('Example error text');     
    
    //добавляем данные для pug шаблонизатора
    let data=prepareData(req.originalUrl);
    
    // сохраняем в сессию только поддерживаемые локали
    if (req.query["lang"]){
      if (i18n.getLocales().indexOf(req.query["lang"])>-1){
        req.session.locale=req.query["lang"];
        i18n.setLocale(req, req.session.locale);
      }
    }
    
    // в зависимости от роли - показываем сообщение-приветствие
    let userrole=req.query["userrole"];
    switch (userrole) {
      case 'admin':
        data.user.role=1;
        data.message=newmessage('hi admin!','info');
        break;
      case 'user':
        data.user.role=2;
        data.message=newmessage('hi user!','success');
        break;
      default:
        delete data.user;
    } 

    //загружаем ресурс
    if (resource){
      res.render(resource,data, function(err, html) {
        if(err) {
          //res.render('404',data);
          data.message=newmessage(err.message,'warning');
          res.render('error', data);
          return;
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
  
// главный route, содержит перенаправление на 404 при остальных запросах
// (не добавленных ранее маршрутов)
app.all('*', function (req, res, next) {
    let data=prepareData();
    res.render('404',data);
});

// обработка ошибок
// все обработчики ошибок должны иметь 4 параметра, иначе они будут обычными контроллерами
app.use(function(err,req,res,next)
{
    if (req.xhr) {
      res.status(err.status).send({ error: err.message });
    } else {
      // render the error page
      res.status(err.status || 500);
      let data=prepareData(req.originalUrl);
      data.message=newmessage(err.message,'danger');
      res.render('error',data);
      return;
    }
    next();
});

// запуск сервера
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
  console.log('Сервер запущен '+process.env.PORT || 3000);
});

// prevent too long threshold
app.timeout = 2048;