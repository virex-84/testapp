import 'babel-polyfill';
import 'raf/polyfill';

import React from "react";
import { render } from "react-dom";
import Navigator from "./Navigator.jsx";
import Footer from "./Footer.jsx";
import Page from "./Page.jsx";
import Message from "./Message.jsx";
import Reload from "./Reload.jsx";

// верси API сервера
const API = "/api/v1/";

const styles = {
  fontFamily: "sans-serif"
};

// данные по умолчанию
let Pages = [
  {
    id: 0,
    title: "Главная",
    text: "Обновите список статей"
  }
];

// промис с таймером
function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    // запускаем таймер
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      reject(new Error("Время запроса истекло ("+ms+" мс)"));
    }, ms);
    promise.then(
      (res) => {
        clearTimeout(timeoutId);
      },
      (err) => {
        
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

// получение данных через API сайта
// (функцию можно вынести в отдельный модуль)
function GetData(self,timeout,resource,callback){
  // признак окончания работы таймера
  let didTimeOut = false;
  
  // промис
  let timedFetch=window.fetch(API+resource, {headers: {'Cache-Control': 'no-cache'}},)
    .then(function(response) {
      // если таймер уже истек, а сервер присылает результат - игнорируем
      if(didTimeOut) return;
      if (response.status !=200) return Promise.reject(new Error(response.statusText));
      return response.json();
    }) 
    .then(
      (result) => {
        if(didTimeOut) return;
        callback(self,null,result);
      },
      (error) => {
        callback(self,error,null);
      }
    );
      
  // запускаем промис
  timeoutPromise(timeout, timedFetch).then(function(response) {
    callback(self,null,response);
  }).catch(function(error) {
    // при ошибке - считаем что таймер истек
    didTimeOut = true;
    callback(self,error,null);
  });
}      

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: null,      
      
      pages:this.props.data,
      pageCount: this.props.data.length,
      pageID: 0,
      page: this.props.data[0],
      aloowBack: false,
      aloowNext: true
    };
    this.backPage = this.backPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.reloadPages = this.reloadPages.bind(this);
  }
  
  onReloadPages(){
    this.setState({ isLoading: true });
    // загружаем статьи, таймер - на 5 сек
    GetData(this,5000,'articles',function(self,error,data){
      if (data) {
        self.setState({
          isLoading: false,
          error: null,
          
          pages:data,
          pageCount: data.length,
          pageID: 0,          
          page: data[0],
          aloowBack: false,
          aloowNext: true
        });
      }
      if (error) {
        self.setState({
          isLoading: false,
          error:error
        })
      }
    });
  }
  
  componentWillMount() {
    // автоматическая загрузка при создании компонента
    //this.onReloadPages();
  }  
  
  backPage() {
    let aloowBack = this.state.pageID - 1 > 0;
    let aloowNext = this.state.pageID < this.state.pageCount;
    let pageID =
      this.state.pageID - 1 > -1 ? this.state.pageID - 1 : this.state.pageID;

    this.setState({
      pageID: pageID,
      //page: this.props.data[pageID],
      page: this.state.pages[pageID],
      aloowBack: aloowBack,
      aloowNext: aloowNext
    });
  }
  nextPage(e) {
    e.preventDefault();
    let aloowBack = this.state.pageID > -1;
    let aloowNext = this.state.pageID + 1 < this.state.pageCount - 1;
    let pageID =
      this.state.pageID + 1 < this.state.pageCount
        ? this.state.pageID + 1
        : this.state.pageID;

    this.setState({
      pageID: pageID,
      page: this.state.pages[pageID],
      aloowBack: aloowBack,
      aloowNext: aloowNext
    });
  }
  
  reloadPages(e){
    e.preventDefault();
    this.onReloadPages();
  }
  
  render() {
    const { isLoading, error } = this.state;

    // при ошибке загрузки статей - выдаем сообщение с кнопкой перезагрузки
    if (error) {
      let data={type:"danger",title:"Ошибка!",message:error.message};
      return (
        <div className="panel panel-default" style={styles}>
          <Message data={data}/>
          <div className="panel-footer">
            <div className="btn-group">
              <Reload onReload={this.reloadPages} />
            </div>
          </div>
        </div>
      );
    }

    // отображаем сообщение во момент загрузки
    if (isLoading) {
      let data={type:"info",title:"Подождите",message:"Идет загрузка статей..."};
      return <Message data={data}/>;
    }    
    
    return (
      <div className="panel panel-default" style={styles}>
        <Navigator links="links" />
        <Page data={this.state.page} />
        <Footer
          onBack={this.backPage}
          onNext={this.nextPage}
          aloowBack={this.state.aloowBack}
          aloowNext={this.state.aloowNext}
        />
        <div className="panel-footer">
          <div className="btn-group">
            <Reload onReload={this.reloadPages} />
          </div>
        </div>        
      </div>
    );
  }
}

// запуск React приложения если найден root элемент
function run() {
  if (document.getElementById("root"))
    render(<App data={Pages} />, document.getElementById("root"));
}

const loadedStates = ['complete', 'loaded', 'interactive'];

// ожидаем полной загрузки страницы
if (loadedStates.includes(document.readyState) && document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}


