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
      _id: { type: graphql.GraphQLString  },
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
type Article {
  _id: String
  title: String
  text: String
  description: String
  author: String
}

type Articles {
  items: [Article]
  count: String
}

type Query {
  articles(id: ID): Articles
}
`);

// обработка GraphQL запроса
const resolver = {
    articles(args, req, request) {
      
      let articles={
        items: [],
        count: store.articles.length
      };
      
      // если указан аргумент - ищем элемент
      if (args.id){
        articles.items.push(store.articles[args.id]);
      } else {
      // иначе выводим всё
        articles.items=store.articles.slice();
      }
      
      return articles;
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