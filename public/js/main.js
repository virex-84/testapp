  //  работа с выпадающим многоуровневым меню в bootstrap v3
  $(document).ready(function(){
    $('.dropdown-submenu a.dropdown-toggle').on("click", function(e){
      $(this).next('ul').toggle();
      e.stopPropagation();
      e.preventDefault();
    });
  });

  $(document).ready(function(){
    $("#listarticles").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticles li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });