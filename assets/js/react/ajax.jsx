//================
//
//
// # ajax.js
// # модуль загрузки данных через метод fetch
//
//================

import 'whatwg-fetch'; //fetch polyfill

// верси API сервера
const API = "/api/v1/";

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
function JSONQuery(self,timeout,resource,callback){
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

export {JSONQuery};