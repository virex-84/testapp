//================
//
//
// # graphql api
//
//
//================

const
express = require("express"),
store = require("./store.js"),
graphql = require('graphql'),
graphqlHTTP = require('express-graphql'),
//getSchemaFromData = require('graphql-schema-from-json').default, //npm install --save graphql-schema-from-json
api = express.Router();

/*
// создаем схему на основе json данных
// const schema = getSchemaFromData(store.articles);

// создаем схему данных вручную
// статья
const ArticleType = new graphql.GraphQLObjectType({
  name: 'Article',
    fields: {
      id: { type: graphql.GraphQLString  },
      title: { type: graphql.GraphQLString },
      text: { type: graphql.GraphQLString },
      description: { type: graphql.GraphQLString },
      author: { type: graphql.GraphQLString }
    }
});

// список статей
const ArticlesType = new graphql.GraphQLObjectType({
  name: 'Articles',
    fields: {
      items: { type: new graphql.GraphQLList(ArticleType) },
      count: { type: graphql.GraphQLString}
    }
});

// схема
const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      articles: {
        type: ArticlesType,
        args: {
          id: { type: graphql.GraphQLID   }
        }        
      }
    } 
  })
});
*/

// схема данных на языке GraphQL
// выглядит намного проще чем создание вручную
var schema = graphql.buildSchema(`
"This is an article"
type Article {
  "Identification number of article"
  id: String
  title: String
  text: String
  description: String
  author: String
}

"Array of articles"
type Articles {
  items: [Article]
  count: String
}

"All queries"
type Query {
  "Get Articles or one article by ID"
  articles(id: ID): Articles
}

"Result of modifications"
type Status {
  result: Articles
  message: String
}

"All modifications"
type Mutation {
  "New article"
  newArticle(id:ID, title: String, text: String, description: String, author: String): Status
  "Update article by ID"
  updateArticle(id: ID, title: String, text: String, description: String, author: String):Status
  "Delete article by ID"
  deleteArticle(id: ID):Status
}

`);

/*
Примеры использования:

query Query{
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

query Query{
  articles(id:1) {
    items {
      id
      title
      text
      description
      author
    }
  }
}

mutation Mutation {
  newArticle (id:4,title:"title",text:"text",description:"description",author:"author") {
    message
  }
}

mutation Mutation {
  updateArticle (id:4,title:"title4",text:"text4",description:"description",author:"author") {
    message
  }
}
mutation Mutation{
  deleteArticle(id:1) {
    message
  }
}  
*/

function getResult(id){
  let articles={
    items: [],
    count: store.articles.length
  };
  if (id) {
    articles.items.push(store.articles[id]);
    count: articles.items.length;
  } else {
    articles.items=store.articles.slice();
  }
  return articles; 
}

// обработка GraphQL запроса
const resolver = {
  
    //выдача статей
    articles(args, req, request) {
      return getResult(args.id);
    },

    //новая статья
    newArticle(args){
      let index=store.articles.findIndex(x => x.id==args.id);

      if (index>-1) {
        return {result:getResult(), message:"Already exists"};
      } else {
        store.articles.push(args);
        return {result:getResult(), message:"Added"};
      }    

    },
    
    //обновить статью
    updateArticle(args){
      let index=store.articles.findIndex(x => x.id==args.id);

      if (index>-1) {
        store.articles[index]=args;
        return {result:getResult(), message:"Updated"};
      } else {
        return {result:getResult(), message:"Not found"}; 
      }      
      
    },
    
    //удалить статью
    deleteArticle(args){
      try{
        let index=store.articles.findIndex(x => x.id==args.id);

        if (index>-1) {
          store.articles.splice(index,1);
        } else {
          return {result:getResult(), message:"Not found"}; 
        }
      }catch(error){
        return {result:getResult(), message:error.message};
      }
      return {result:getResult(), message:"Deleted"};      
    }
};

// распечатка схемы
// console.log(graphql.printSchema(schema));

// создаем endpoint
api.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolver,
  // при graphiql==true, при заходе на /graphql подгружается страница для ручного интерактивного тестирования запросов
  graphiql: true
}));

module.exports = api;