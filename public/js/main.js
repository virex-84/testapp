//работа с выпадающим многоуровневым меню в bootstrap v3
//!!! не совместимо с bootstrap.min.js
    $(function() {
        $(".dropdown").on('click', function(event) {
            //скрываем все главные элементы
            $(".dropdown").removeClass('open');
            
            //помечаем свои элементы как не удаляемые
            $(this).find(".dropdown-submenu").each(function(){
              $(this).addClass('nodel');
            });  
            //удаляем все кроме помеченных
            $(".dropdown-submenu").not('.nodel').removeClass('open');
            //удаляем пометку
            $(this).find(".dropdown-submenu").each(function(){
              $(this).removeClass('nodel');
            });              
            
            //помечаем текущий как открытый
            $(this).addClass('open');
        });
    });

   
    $(function() {
        $(".dropdown-submenu").on('click', function(event) {
            //раскрываем субэлемент
            $(this).addClass('open');
        });
    });     