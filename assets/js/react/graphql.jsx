//================
//
//
// # graphql.js
// # модуль загрузки данных через graphql запросы посредством apollo-client
//
//================

import gql from 'graphql-tag';
//import { graphql } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

// клиент для запросов
const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache()
});

const
  GET_ALL_ARTICLES=1,
  GET_ARTICLE=2,
  DELETE_ARTICLE=3;

// шаблон запроса на все статьи
const gqlAllArticles=gql`
{
  articles {
    items {
      id
      title
      text
      description
      author
    }
    count
  }
}
`;

// шаблон запроса определенной статьи
// должно быть articles (id:$id), для передачи параметров
const gqlArticle=gql`
{
  articles (id:0){
    items {
      id
      title
      text
      description
      author
    }
  }
}
`;

/*
const gqldeleteArticle=gql`
mutation Mutation{
  deleteArticle(id: $id) {
    message
  }
}
`;
*/
const gqldeleteArticle=gql`
mutation deleteArticle($id: ID!){
  deleteArticle(id: $id) {
    result {
      items {
        id
        title
        text
        description
        author
      }
      count
    }
    message
  }
}
`;



// сам запрос
const gqlQuery=function(self, action, args, callback){
  let gqlAction;
  switch (action) {
    case GET_ALL_ARTICLES:
      gqlAction=gqlAllArticles;
      break;
    case GET_ARTICLE:
      gqlAction=gqlArticle;
      //gqlAction=graphql(gqlArticle,{options: { variables: { id: args.id } } })
      break;
  }
  client.query({ query: gqlAction })
  .then(function(data){
    callback(self,data,null);
  })
  .catch(function(err){
    callback(self,null,err);
  })
}

const gqlMutate=function(self, action, args, callback){
  let gqlAction;
  switch (action) {
    case DELETE_ARTICLE:
      gqlAction=gqldeleteArticle;
      break;
  }
  client.mutate({ mutation: gqlAction, variables: args})
  .then(function(data){
    callback(self,data,null);
  })
  .catch(function(err){
    callback(self,null,err);
  })
}

// сброс кеша (заставляем клиент сделать запрос к серверу заново)
const gqlResetStore=function(self,callback){
  client.resetStore();    
}


export {GET_ALL_ARTICLES, GET_ARTICLE, DELETE_ARTICLE, gqlQuery, gqlMutate, gqlResetStore};