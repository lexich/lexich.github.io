(function($){
  var converter = new Showdown.converter();

  var Router = Backbone.Router.extend({
    SELECTOR: ".ui_panel .content",
    ACTIVE_LINK: "active_link",
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
          var hashbang = location.href.split("#")[1];
          $("." + self.ACTIVE_LINK ).removeClass(self.ACTIVE_LINK)
          if(_.isUndefined(hashbang)) hashbang = "";
          $("*[href='{link}']".replace("{link}", "#"+hashbang)).addClass(self.ACTIVE_LINK);
        });
    },
    event_about: function(){
      return this.event_page("about")
    }
  });

  $(document).ready(function() {
    var idea1 = "static/img/idea.png";
    var idea2 = "static/img/idea2.png";
    var router = new Router();    
    var timeout = null;      
    $("#links a").hover(function(){
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
    /*
    $(".ui_panel .control a").hover(function(){
      router.navigate( $(this).attr("href"),{trigger:true} )
    });*/
    
    Backbone.history.start();
  });     
})(jQuery);

