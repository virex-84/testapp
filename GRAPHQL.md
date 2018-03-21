# GraphQL

## Установка модулей для серверной части
```
npm install graphql express-graphql --save
```

## Установка модулей для клиентской части
```
npm install apollo-client apollo-cache-inmemory apollo-link-http react-apollo graphql-tag --save
```
* apollo-client apollo-cache-inmemory apollo-link-http для React приложения
* graphql-tag - для запросов
* react-apollo - для задания параметров в запросе

## Описание
На серверной части создается graphql "endpoint" - единая точка входа для всех GraphQL запросов

На клиентской части все запросы через [apollo-client](https://www.apollographql.com/docs/react/)

## Особенности
Обычно для CRUD (create, read, update, delete) модели взаимодействия с сервером через JSON приходится создавать множество "endpoint" - точек входа для операций, например:
* site.com/v1/articles/
* site.com/v1/news/
* site.com/v1/notes/
и т.д.

Для каждого запроса необходимо проектировать свой API, а со временем API может сильно поменяться, поэтому появляются новые версии API, для которых создаются новые точки входа:
* site.com/v2/articles/
* site.com/v3/news/
* site.com/v15/notes/
и т.д.

GraphQL позволяет взаимодействовать с сервером через **единую точку входа**, с помощью различных запросов, соответствующих определенным схемам

Пример:
```
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
```
Что означает: "запросить все статьи в виде массива объектов, в том числе и количество статей".

Пример 2:
```
{
  articles (id: 0) {
    items {
      id
      title
      text
      description
      author
    }
  }
}
```
Что означает: "запросить статью с id==0".