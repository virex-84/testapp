import 'babel-polyfill';
import 'raf/polyfill';

import React from "react";
import { render } from "react-dom";

import {JSONQuery} from "./ajax.jsx"; 
import {gqlQuery, gqlMutate, gqlResetStore, GET_ALL_ARTICLES, GET_ARTICLE, DELETE_ARTICLE} from "./graphql.jsx";

import Navigator from "./Navigator.jsx";
import Footer from "./Footer.jsx";
import Page from "./Page.jsx";
import Message from "./Message.jsx";
import Reload from "./Reload.jsx";

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
    this.deletePage = this.deletePage.bind(this);
    this.reloadPagesJSON = this.reloadPagesJSON.bind(this);
    this.reloadPagesGQL = this.reloadPagesGQL.bind(this);
  }
  
  componentWillMount() {
    // автоматическая загрузка при создании компонента
    //this.reloadPagesJSON();
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
  deletePage(e) {
    e.preventDefault();
    this.setState({ isLoading: true });
    
    // запрос
    gqlMutate(this,DELETE_ARTICLE,{id: this.state.page.id},function(self, res, error){
      if (res){
        
        let data;
        
        if (res.data.deleteArticle.result.count==0) {
          data=Pages.slice(0);
        } else {       
          data=res.data.deleteArticle.result.items;
        }

        self.setState({
          isLoading: false,
          error: null,
        
          pages:data,
          pageCount: data.length,
          pageID: 0,          
          page: data[0],
          aloowBack: false,
          aloowNext: true,
          
          message:res
        });
        gqlResetStore(); //сбрасываем кэш (заставляем клиент сделать последующий запрос к серверу заново)
      }
      
      if (error) {
        self.setState({
          isLoading: false,
          error:error
        });
      }
      
    });
  }  
  
  reloadPagesJSON(e){
    e.preventDefault();
    this.setState({ isLoading: true });
    // загружаем статьи, таймер - на 5 сек
    JSONQuery(this,5000,'articles',function(self,error,data){
      if (data) {
        //если данные - пустые, добавляем по умолчанию
        if (data.length==0) {
          data=Pages.slice(0);
        }
        
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
        });
      }
    });
  }
  
  reloadPagesGQL(e){
    e.preventDefault();
    this.setState({ isLoading: true });
    
    // запрос
    gqlQuery(this,GET_ALL_ARTICLES,null,function(self, res, error){
    //qlQuery(this,GET_ARTICLE,{id:0},function(self, res, error){
      if (res){
        let data=res.data.articles.items;
        //если данные - пустые, добавляем по умолчанию
        if (data.length==0) {
          data=Pages.slice(0);
        }         
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
        gqlResetStore(); //сбрасываем кэш (заставляем клиент сделать последующий запрос к серверу заново)
      };
      
      if (error) {
        self.setState({
          isLoading: false,
          error:error
        });
      }
      
    });
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
              <Reload title='Обновить JSON' onReload={this.reloadPagesJSON} />
              <Reload title='Обновить GraphQL' onReload={this.reloadPagesGQL} />
            </div>
          </div>
        </div>
      );
    }

    // отображаем сообщение в момент загрузки
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
          onDelete={this.deletePage}
          aloowBack={this.state.aloowBack}
          aloowNext={this.state.aloowNext}
        />
        <div className="panel-footer">
          <div className="btn-group">
              <Reload title='Обновить JSON' onReload={this.reloadPagesJSON} />
              <Reload title='Обновить GraphQL' onReload={this.reloadPagesGQL} />
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


