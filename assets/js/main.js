  "use strict";
  
  import $ from 'jquery';
  import bootstrap from './bootstrap.min.js';
  import {app as re} from './react/app.jsx';


  // сразу после загрузки страницы
  $(document).ready(function(){
    
  // работа с выпадающим многоуровневым меню в bootstrap v3
  // см. mainnavbar.pug; mixins.pug -> subitem
    $('.dropdown-submenu a.dropdown-toggle').on("click", function(e){
      $(this).next('ul').toggle();
      e.stopPropagation();
      e.preventDefault();
    });

  // поиск статей для простого списка
  // см.mixins.pug -> listarticlesuser
    $("#listarticlesuser").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticlesuser a").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      });
    });
  
  // поиск статей для простого списка
  // см.mixins.pug -> listarticlesadminv1
    $("#listarticleadmin").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticleadmin li").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });
  
  // поиск статей в таблице для админа
  // см.mixins.pug -> listarticlesadmintablev2  
    $("#listarticleadmintable").on("keyup", function() {
      var value = $(this).val().toLowerCase();
      $("#listarticleadmintable tr").filter(function() {
        $(this).toggle($(this).find("#findtext").text().toLowerCase().indexOf(value) > -1);
      });      
    });
  
  // фильтр для таблицы
  // см.mixins.pug -> listarticlesadmintablev3  
    $('.filterable .filters input').on('keyup input mouseup',function(e){
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

  //============


    // формат строки
    var strformat = function (str, col) {
      col = typeof col === 'object' ? col : Array.prototype.slice.call(arguments, 1);
  
      return str.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
          if (m == "{{") { return "{"; }
          if (m == "}}") { return "}"; }
          return col[n];
      });
    };
    
    // пример редактируемой таблицы на JQuery с возможностью загрузить/сохранить данные в форматах JSON и CSV
    var $App = {
      
      // список по умолчанию
      items:[{name:'name11',value:'value11'},{name:'name22',value:'value22'},{name:'name33',value:'value33'}],
      
      // пересоздание DOM элементов из массива
      Repaint: function() {
        
        $('#items').empty();
        for(var index in this.items){
          var item=this.items[index];
          var $tr=$('<tr>').attr('index',index);
          // кнопки
          var $td=$('<td>').addClass('up down').appendTo($tr);
          $('<a>').addClass('btn glyphicon glyphicon-chevron-up editrow').attr('onclick', 'window.App.Up('+index+')').appendTo($td);
          $('<a>').addClass('btn glyphicon glyphicon-chevron-down text-danger').attr('onclick', 'window.App.Down('+index+')').appendTo($td);
          // данные
          $('<td>').addClass('namerow').text(item.name).appendTo($tr);
          $('<td>').addClass('valuerow').text(item.value).appendTo($tr);
          // кнопки
          $td=$('<td>').addClass('edit').appendTo($tr);
          $('<a>').addClass('btn glyphicon glyphicon-pencil editrow').attr('onclick', 'window.App.Edit('+index+')').appendTo($td);          
          $('<a>').addClass('btn glyphicon glyphicon-trash text-danger deleterow').attr('onclick', 'window.App.Delete('+index+')').appendTo($td); 
          $tr.appendTo("#items");
        }
        
        // последняя строка - добавление новой
        var $tr=$('<tr>').attr('index',this.items.length+1);
        $('<td>').text('Добавить').appendTo($tr);           
        var $tdNameRow=$('<td>').addClass('namerow').appendTo($tr);
        var $tdValueRow=$('<td>').addClass('valuerow').appendTo($tr);
        $('<input>').addClass('form-control inputNameRow').attr("required",true).attr("aria-label","наименование").appendTo($tdNameRow);
        $('<input>').addClass('form-control inputValueRow').attr("required",true).attr("aria-label","значение").appendTo($tdValueRow);
        var $td=$('<td>').appendTo($tr);
        $('<a>').addClass('btn glyphicon glyphicon-plus applyrow').attr('onclick', 'window.App.Apply('+(this.items.length+1)+')').appendTo($td); 
        $tr.appendTo("#items");
        
        // очищаем фильтр
        $('.filterable .filters input').val("");
      },
      // добавление в массив
      Add: function(name,value) {
        if (!name && !value) {
          this.Message('Невозможно добавить элемент','Необходимо заполнить хотя-бы одно значение')
          return;
        }
        //очистка от кавычек
        if (name.indexOf('"')>-1) name=name.split(/"/)[1];
        if (value.indexOf('"')>-1) value=value.split(/"/)[1];
        this.items.push({name:name,value:value});
        this.Repaint();
      },
      // режим редактирования элемента
      Edit: function(index) {
        this.Repaint();
        
        var $tr=$('#items').find('tr[index="' + index +'"]');
        var $td=$tr.find('td.edit');
        var $tdNameRow=$tr.find('.namerow');
        var $tdValueRow=$tr.find('.valuerow');

        $tdNameRow.empty();
        $tdValueRow.empty();

        $('<input>').addClass('form-control inputNameRow').val(this.items[index].name).appendTo($tdNameRow);
        $('<input>').addClass('form-control inputValueRow').val(this.items[index].value).appendTo($tdValueRow);
        $('<a>').addClass('btn glyphicon glyphicon-ok applyrow').appendTo($('<td>')).attr('onclick', 'window.App.Apply('+index+')').appendTo($td); 
      },
      // сохранение отредактированного элемента
      Apply: function(index) {
        var $tr=$('#items').find('tr[index="' + index +'"]');
        var $inputNameRow=$tr.find('.inputNameRow');
        var $inputValueRow=$tr.find('.inputValueRow');
        
        if (index>this.items.length){
          this.Add($inputNameRow.val(),$inputValueRow.val());
        } else {
          this.items[index].name=$inputNameRow.val();
          this.items[index].value=$inputValueRow.val();
          this.Repaint();
        }
      },
      // удаление элемента
      Delete: function(index) {
        this.items=this.items.slice(0, index).concat(this.items.slice(index+1, this.items.length));
        this.Repaint();
      },
      // смена позиции (вверх)
      Up: function(index){
        var top=index-1;
        if (top<0) return;
        var topitem=this.items[top];
        this.items[top] = this.items[index];
        this.items[index] = topitem;
        
        this.Repaint();
      },
      // смена позиции (вниз)
      Down: function(index){
        var bottom=index+1;
        if (bottom>this.items.length-1) return;
        var topitem=this.items[bottom];
        this.items[bottom] = this.items[index];
        this.items[index] = topitem;
        
        this.Repaint();
      },
      // сообщение (об ошибке)
      Message:function(error,text){
        var $message=$('#message');
        var $form=$('<div>').addClass('alert alert-danger').appendTo($message);
        $('<strong>').text('Внимание').appendTo($form);
        $('<a>').addClass('close').attr('data-dismiss','alert').text('x').appendTo($form);
        $('<pre>').text(error).appendTo($form);
        $('<pre>').text(text).appendTo($form);
      },
      // массив -> JSON или CSV
      Get: function(format){
        var source='';
        switch (format){
          case 'JSON':
            source=JSON.stringify(this.items);
            break;
          case 'CSV':
            for(var index in this.items){
              source+=strformat('"{0}","{1}"',this.items[index].name,this.items[index].value)+String.fromCharCode(13);
            }
            break;
        }
        $('#source').val(source);
      },
      // JSON или CSV -> массив
      Set: function(format){
        var source=$('#source').val();
        try{
        switch (format){
          case 'JSON':
            this.items=JSON.parse(source);
            break;
          case 'CSV':
            var arr=source.split('\n');
            this.items=[];
            for(var index in arr){
              var item=arr[index].split(',');
              if (item[0] && item[1]) //пропускаем пустые строки
                this.Add(item[0],item[1]); 
            }
            break;
        }        
        } catch (e){
          //alert('JSON некорректный: '+ e.message)
          this.Message(e.message,source);
        }
        this.Repaint();
      },
      // сохранение в файл
      Save: function(filename, content){
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([content], {type: "octet/stream"});
        var URL = window.URL || window.webkitURL;
        var url =URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      // загрузка из файла
      Load: function(filename){
        var reader = new FileReader();
        reader.onload = function(e) {
          var source = e.target.result;
          //source = JSON.parse(source);
          $('#source').val(source);
        };
        reader.readAsText(filename);
      }
    };
    
    // определяем как глобальную переменную
    window.App=$App;
    
    // перерисовываем
    $App.Repaint();
    
    // выводим содержимое
    $App.Get('JSON');
    
    // поле ввода -> items
    $("#setitems").on("click", function() {
      var format='';
      $('input[name="format"]').each(function () {
        if ($(this).prop('checked')) {
          format=$(this).val();
        }
      });
      $App.Set(format);
    });
    
    // items -> поле ввода
    $("#getitems").on("click", function() {
      var format='';
      $('input[name="format"]').each(function () {
        if ($(this).prop('checked')) {
          format=$(this).val();
        }
      });
      $App.Get(format);
    });   
    
    // загрузка из файла
    $("#load").on("change", function() {
      $App.Load(this.files[0]);
    });   
    
    // сохранение в файл
    $("#save").on("click", function() {
      $App.Save('items.txt',$('#source').val());
    });      
  });
