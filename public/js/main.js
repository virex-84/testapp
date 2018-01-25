  // работа с выпадающим многоуровневым меню в bootstrap v3
  // см. mainnavbar.pug; mixins.pug -> subitem
  $(document).ready(function(){
    $('.dropdown-submenu a.dropdown-toggle').on("click", function(e){
      $(this).next('ul').toggle();
      e.stopPropagation();
      e.preventDefault();
    });
  });

  // поиск статей для простого списка
  // см.mixins.pug -> listarticlesuser
  $(document).ready(function(){
    $("#listarticlesuser").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticlesuser a").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });
  
  // поиск статей для простого списка
  // см.mixins.pug -> listarticlesadminv1
  $(document).ready(function(){
    $("#listarticleadmin").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticleadmin li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  });  
  
  // поиск статей в таблице для админа
  // см.mixins.pug -> listarticlesadmintablev2  
  $(document).ready(function(){
    $("#listarticleadmintable").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticleadmintable tr").filter(function() {
        $(this).toggle($(this).find("#findtext").text().toLowerCase().indexOf(value) > -1)
      });      
    });
  });
  
  // фильтр для таблицы
  // см.mixins.pug -> listarticlesadmintablev3  
  $(document).ready(function(){
    $('.filterable .filters input').keyup(function(e){
        /* Ignore tab key */
        var code = e.keyCode || e.which;
        if (code == '9') return;
        /* Useful DOM data and selectors */
        var $input = $(this),
        inputContent = $input.val().toLowerCase(),
        $panel = $input.parents('.filterable'),
        column = $panel.find('.filters th').index($input.parents('th')),
        $table = $panel.find('.table'),
        $rows = $table.find('tbody tr');
        /* Dirtiest filter function ever ;) */
        var $filteredRows = $rows.filter(function(){
            var value = $(this).find('td').eq(column).text().toLowerCase();
            return value.indexOf(inputContent) === -1;
        });
        /* Clean previous no-result if exist */
        $table.find('tbody .no-result').remove();
        /* Show all rows, hide filtered ones (never do that outside of a demo ! xD) */
        $rows.show();
        $filteredRows.hide();
        /* Prepend no-result row if all rows are filtered */
        if ($filteredRows.length === $rows.length) {
            $table.find('tbody').prepend($('<tr class="no-result text-center"><td colspan="'+ $table.find('.filters th').length +'">-</td></tr>'));
        }
    });
});