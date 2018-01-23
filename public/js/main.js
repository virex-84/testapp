  //  работа с выпадающим многоуровневым меню в bootstrap v3
  $(document).ready(function(){
    $('.dropdown-submenu a.dropdown-toggle').on("click", function(e){
      $(this).next('ul').toggle();
      e.stopPropagation();
      e.preventDefault();
    });
  });

  // поиск статей для простого (пользовательского) списка
  $(document).ready(function(){
    $("#listarticlesuser").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticlesuser a").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });
  
  // поиск статей для простого (пользовательского) списка
  $(document).ready(function(){
    $("#listarticleadmin").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticleadmin li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });  
  
  // поиск статей в таблице для админа
  $(document).ready(function(){
    $("#listarticleadmintable").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticleadmintable tr").filter(function() {
        $(this).toggle($(this).find("#findtext").text().toLowerCase().indexOf(value) > -1)
      });      
    });
  });