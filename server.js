//================
//
//
// # SimpleServer
//
//
//================

// объявление глобальных констант
const
express = require('express'),
app = express(),
// храним данные о сеансе на сервере
// в самом файле cookie сохраняется только ИД сеанса
session = require('express-session'),
bodyParser  = require('body-parser'),
path = require('path'),
favicon = require('serve-favicon'),
// локализация
i18n = require("i18n"),
util = require('util'),

// для тем
fs = require('fs'),
filewatcher = require('filewatcher'),
watcher = filewatcher(),

store = require("./store.js"),
apiVersion1 = require("./api1.js");

const
// сборщик
webpack = require("webpack"),
// конфигурация
config=require('./webpack.config.js'),
// компилятор
compiler = webpack(config);
// слежение за изменением файла
compiler.watch({
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => {
  //console.log(stats);
  console.log('react rebuild');
});

// переменная - путь к темам
const themesPath=path.join(__dirname, 'public/css/themes');

// объявляем глобальную переменную
app.locals.cssthemes=[];

// загрузка списка тем оформления
function GetThemesList(){
  app.locals.cssthemes.length=0;
  app.locals.cssthemes.push({name:'default theme',link:"/?theme=default"});
  fs.readdir(themesPath, (err, files) => {
    files.forEach(file => {
      app.locals.cssthemes.push({name:file,link:"/?theme="+file});
    });
  });
}

// загружаем список тем оформления
GetThemesList();

// слежение за изменениями в папке тем оформления
watcher.add(themesPath);
watcher.on('change', function(file, stat) {
  console.log('%s Theme modified in %s',new Date().toISOString(), file);
  GetThemesList();
});

// выводим все сессии
// см. MemoryStore.prototype.all
function GetAllSessions(sessionStore){
  var sessionIds = Object.keys(sessionStore.sessions);
  var result = [];

  for (var i = 0; i < sessionIds.length; i++) {
    let session = JSON.parse(sessionStore.sessions[sessionIds[i]]);
    session.id=sessionIds[i];
    result.push(session);
  }
  
  return result;
}

// иконка
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

// статические файлы (скрипты, стили и т.д.)
app.use('/public', express.static(path.join(__dirname, '/public')));

// апи версия 1
app.use("/api/v1", apiVersion1);

// для безопасности
app.disable('x-powered-by');
// ? app.disable('etag');

// шаблонизатор set view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');//pug бывший jade

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // для сохранения куки сессии в клиентском браузере
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
            //domain:'example.com', // указывает домен cookie; используется для сравнения с доменом сервера, на котором запрашивается данный URL. В случае совпадения выполняется проверка следующего атрибута - пути
            path: "/",              // указывает путь cookie; используется для сравнения с путем запроса. Если путь и домен совпадают, выполняется отправка cookie в запросе.
            httpOnly: true,         // обеспечивает отправку cookie только с использованием протокола HTTP(S), а не клиентского JavaScript, что способствует защите от атак межсайтового скриптинга.
            maxAge  : 24 * 60 * 60 * 1000, // время жизни куки - 24 часа
            secure: false,          // (false для отладки в Cloud 9 I) обеспечивает отправку cookie браузером только с использованием протокола HTTPS
            proxy: true             // The "X-Forwarded-Proto" header will be used.
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
    //перезагрузка локалей при изменении файла локализации
    autoReload: true,    
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
  
    if (req.session) {
      // установка локали
      if (req.session.locale){
        i18n.setLocale(req, req.session.locale);
      }
      
      // установка css темы
      if (req.session.theme){
        res.locals.theme=req.session.theme;
        if (req.session.theme=='default') delete req.session.theme;
      }
      
      //проверка на мобильного клиента
      let ua = req.header('user-agent');
      if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile|ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(ua)) {
        req.session.mobile=1;
      } else {}
      
      // fix
      // игнорируем apple-touch-icon.png, apple-touch-icon-precomposed.png и т.д. (apple-touch-icon*png)
      // что-бы не плодились лишние сессии от android или apple устройства которые запрашивают эти файлы для превью
      // regexp выражение можно проверить на https://regex101.com/
      // на продакшн лучше выдавать эти файлы силами прокси например nginx
      if (/apple-touch-icon.*[png]/i.test(req.url)) delete req.session;
      
    }//if (req.session)
   
    // логирование   
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('%s IP %s; %s %s',new Date().toISOString(), ip, req.method, req.url);
    publicLog.addLine(util.format('%s IP %s; %s %s',new Date().toISOString(), ip, req.method, req.url));
    
    next();
});

// добавление данных для rss ленты 
function prepareRSS(url,host,items){
  let data={};
  data.title="testapp feed";
  data.link=url;
  data.description="articles";
  data.lastBuildDate=new Date();
  data.Feeds=[];
  for (var item of items){
    data.Feeds.push({
      title:item.title,
      link:host+"/articles/read/"+item._id,
      description:item.description,
      author:item.author,
      pubDate:new Date()
    });
  }
  return data;
}

// пути route
app.route(['/','/:resource','/:resource/:command/:id'])
  .get((req, res) => {
    let resource=req.params["resource"];
    let command=req.params["command"];
    let id=req.params["id"];

    // произвольная ошибка для теста
    if (resource=='error') throw new Error('Example error text');     
    
    //добавляем данные для pug шаблонизатора
    let data=store.prepareData(req.originalUrl,publicLog, i18n.getLocales(),app.locals.cssthemes);

    // сохраняем в сессию только поддерживаемые локали
    if (req.query["lang"]){
      if (i18n.getLocales().indexOf(req.query["lang"])>-1){
        req.session.locale=req.query["lang"];
        i18n.setLocale(req, req.session.locale);
      }
    }
    
    // установка темы
    if (req.query["theme"]){
      //сохраняем в сесию
      req.session.theme=req.query["theme"];
      res.locals.theme=req.query["theme"];
      if (req.session.theme=='default') {
        delete req.session.theme;
        delete res.locals.theme;
      }
    }

    // в зависимости от роли - показываем сообщение-приветствие
    let userrole=req.query["userrole"];
    switch (userrole) {
      case 'admin':
        data.user.role=1;
        data.messages.push(newmessage('hi admin!','info'));
        break;
      case 'user':
        data.user.role=2;
        data.messages.push(newmessage('hi user!','success'));
        break;
      default:
        delete data.user;
    }
    
    // запрос на изменение профиля
    if (req.query["profile"]){
      data.profile=data.user;
    }
    
    // поиск на сайте
    let search=req.query["search"];
    if (search){
      data.messages.push(newmessage('Can not find '+search,'info'));
    }     
    
    // страница "сессии"
    if (resource=='sessions'){
      if (command=='delete') {
        if (id=='all') {
          req.sessionStore.clear();
        } else 
          req.sessionStore.destroy(id);
        
        // возвращаемся обратно
        res.redirect('back');
        
        // выходим, во избежании "Error: Can't set headers after they are sent.
        return ;
      }
    }

    // загружаем ресурс
    if (resource){
      // загружаем статью из массива
      if ((resource=='articles') && ((command=='read') || (command=='edit')) && (id)) {
         data.article=data.articles.filter(function(item) { 
          return item._id == id; 
        })[0];
        // если массив загружен - указываем команду для pug
        if (data.article) data.article.command=command;
      }
      //для rss
      if (resource=='rss') {
        let host = req.protocol + '://' + req.get('host');
        let url = req.protocol + '://' + req.get('host') + req.originalUrl;
        data=prepareRSS(url,host,data.articles);
      }
      if (resource=='sessions') {
        data.sessions=GetAllSessions(req.sessionStore);
      }
      // рендер html страницы из шаблона
      res.render(resource,data, function(err, html) {
        if(err) {
          //res.render('404',data);
          let data=store.prepareData(req.originalUrl,publicLog, i18n.getLocales(),app.locals.cssthemes);
          data.messages.push(newmessage(err.message,'warning'));
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
    let data=store.prepareData(req.originalUrl,publicLog, i18n.getLocales(),app.locals.cssthemes);
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
      let data=store.prepareData(req.originalUrl,publicLog, i18n.getLocales(),app.locals.cssthemes);
      data.messages.push(newmessage(err.message,'danger'));
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