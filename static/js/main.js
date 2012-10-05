(function($){
  var converter = new Showdown.converter();

  var Router = Backbone.Router.extend({
    SELECTOR: ".ui_panel .content",
    routes:{
      "!page/:name":"event_page",
      "":"event_about"
    },
    event_page: function(name){
      var self = this;
      var url = "/md/{name}.md".replace("{name}",name);
      $.get(url,
        function(d, status, xhr){
          var html = converter.makeHtml(d);
          $(self.SELECTOR).html(html);
        });
    },
    event_about: function(){
      return this.event_page("about")
    }
  });

  $(document).ready(function() {
    var idea1 = "static/img/idea.png";
    var idea2 = "static/img/idea2.png";
    var timeout = null;      
    $("#linksa").hover(function(){
      $("#idea").attr("src",idea2);
      if(timeout!=null){
        clearTimeout(timeout);
      }
      timeout = setTimeout(function() {
        console.log("time");
        $("#idea").attr("src",idea1);
        timeout = null;
      }, 300);        
    });
    
    var router = new Router();
    Backbone.history.start();
  });     
})(jQuery);

