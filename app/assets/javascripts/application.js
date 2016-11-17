// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
$(document).ready(function get_json(){
   $.getJSON({
       type: 'GET',
       url: 'http://localhost:3000/cars/index',
       dataType: 'json',
       success: function(data) {
           var items = [],
                      $ul;
           $.each(data, function(key, val) {
            console.log(val);
            items.push(
                  '<li id="' + key + '"><span class="name">' + val.name + '</span><br><span class="manufacturer">' + val.manufacturer + '</span><br><span class="colour">' + val.colour + '</span></li><br>');
           });
           $ul = $('<ul />').appendTo('#feed');

           //append list items to list
           $ul.append(items);
        }
   });
   return false;
});
