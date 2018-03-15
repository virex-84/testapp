//================
//
//
// # store
//
//
//================

const articles=[{
    _id:"1",
    title:"Title A",
    text:"text1 text1 text1 text1 text1 text1 text1 text1 text1 text1 text1 text1",
    description:"some info about A",
    author:"author1"
  },{
    _id:"2",
    title:"Title B",
    text:"text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2 text2",
    description:"description from B",
    author:"ivan"
  },{
    _id:"3",
    title:"Some title C",
    text:"text3 text3 text3 text3 text3 text3 text3 text3 text3 text3 text3 text3",
    description:"bla-bla-bla",
    author:"alex"
  },{
    _id:"4",
    title:"About this site",
    text:"text4 text4 text4 text4 text4 text4 text4 text4 text4 text4 text4 text4",
    description:"about text",
    author:"admin"
  },
  ];
  
//пользователь  
const user={};
user.username='user000';
user.secondName='Иванов';
user.firstName='Иван';
user.threeName='Иванович';
user.born=new Date();
user.gender='male';
user.role=0;
user.email='a@a.com';
user.password='secret';

const mainnavigation=
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
      {
        name:"mail",
        link:"/mail?userrole=user"
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
      name:"other",
      link:"",
      submenu:[
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
          name:"RSS",
          link:"/rss",      
        },
        {    
          name:"sessions",
          link:"/sessions"
        },
        {    
          name:"jquery + table",
          link:"/test"
        },
        {    
          name:"React.js",
          link:"/react"
        }    
        ]
    },
    {
      name:"about",
      link:"/about",      
    }
  ];

// помечаем меню выделением
function checkActive(data,currentLink){
    let keys = Object.keys( data );
    for( let i = 0,length = keys.length; i < length; i++ ) {
        data[ keys[ i ] ];
        if (data[ keys[ i ] ].link==currentLink) {
          data[ keys[ i ] ].active=true;
        } else {
          delete data[ keys[ i ] ].active;
        }
        if (data[ keys[ i ] ].submenu!=undefined)
          checkActive(data[ keys[ i ] ].submenu,currentLink);
    }  
}

// добавление данных для вывода 
function prepareData(currentLink,log,locales,cssthemes){
  let data={};
  //data.log=publicLog.getLines();
  data.log=log.items.slice(0);
  data.title='Sample pug & bootstrap';
  data.messages=[];
  
  //главное меню, навигация
  data.mainnavigation=mainnavigation.slice(0);

  //статьи
  data.articles=articles.slice(0);

  //пользователь
  data.user=Object.assign({}, user);
  
  data.usernavigation=[{
    name:"mail",
    link:"mail?userrole=user"
  },{
    name:"profile",
    link:"/?userrole=user&profile=user"
  }];
  
  
  //эл.почта
  //список пользователей для отправки почты
  let mailusers=[];
  mailusers.push({
    _id:1,
    username:"user001"
  });
  mailusers.push({
    _id:2,
    username:"user002"
  });
  //письма-сообщения
  let mails=[];
  mails.push({
    _id:1,
    from:{username:"user001"},
    message:"hello!"
  });
  mails.push({
    _id:2,
    from:{username:"user002"},
    message:"message from user002!"
  });
  mails.push({
    _id:3,
    from:{username:"user002"},
    message:"how do you do?!"
  });   
  
  data.user.mails=mails;
  data.user.mailusers=mailusers;
  //количество сообщений
  data.user.mailcount=mails.length;
  
  
  //добавляем все доступные локали в главное меню
  let langmenu={
    name:'language',
    link:'',
    submenu:[]
  };  
  //for (let item of i18n.getLocales()){
  for (let item of locales){
    langmenu.submenu.push({
    name:item,
    link:'/?lang='+item,
    }
    );
  }
  data.mainnavigation.push(langmenu);
  
  // добавляем список тем
  let themes={
    name:'themes',
    link:'',
    //submenu:app.locals.cssthemes
    submenu:cssthemes
  };
  data.mainnavigation.push(themes);
  
  //помечаем(выделяем) текущий линк(ресурс) в главном меню
  if (currentLink)
    checkActive(data.mainnavigation,currentLink);

  return data;
}

module.exports = {
  articles:articles,
  user: user,
  prepareData:prepareData
};
