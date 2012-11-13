(function($){    
  
  var WindowHelper = {
    wiw: function(){ return window.innerWidth == undefined ? 1000 : window.innerWidth; },// Internet Explorer doesn't have the "window.innerWidth" and "window.innerHeight" properties
    wih: function(){ return window.innerWidth == undefined ? 700 : window.innerHeight; }// Internet Explorer doesn't have the "window.innerWidth" and "window.innerHeight" properties
  };
  

  var PolaroidView = Backbone.View.extend({
    BORDER: 50,
    BORDER_TOP:30,
    events:{
      "click img": "event_clickImg",
      "mousemove img": "event_hoverImgAnimate"
    },
    initialize:function(options){
      this.selector = options.selector;
      this.router = options.router;
      this.$items = $(this.selector + "__item", this.$el);            
      $(window).bind("resize.app", _.bind(this.render, this));
      this.render();
    },
    render:function(){
      this.colomns = Math.floor(this.$el.width()/this._firstItemWidth()); 
      _.each(this.$items, this._renderItem,this);
    },
    remove: function() {
      $(window).unbind("resize.app");
      Backbone.View.prototype.remove.call(this);
    },
    event_clickImg: function(e){
      var $img = $(e.target);
      var $a = $img.parents(this.selector+"__item").find("a");
      if( $a.length == 1){
        this.router.navigate( $a.attr("href"),{trigger:true} )
      }
    },
    event_hoverImgAnimate: function(e){
      var $item = $(e.target)
      index = $item.data("item-index");
      this._renderItem($item.parents(this.selector + "__item"), index);
    },
    _baseTop:function(){ 
      return this.$el.offset().top ;
    },
    _baseLeft:function(){ 
      return this.$el.offset().left + (this.$el.width() - this._firstItemWidth() * this.colomns)/2;
    },
    _renderItem:function(item, index){      
      var $item = $(item);        
      $item.data("item-index",index)
      var col = index;
      var row = Math.floor(col/this.colomns);
      if( col >= this.colomns ){
        col = col - this.colomns * row;
      }
      var top = this._baseTop() + row * ( $item.height() + this.BORDER_TOP);
      var left =  this._baseLeft() + col * ($item.width() + this.BORDER);   
      var degree = this._degree();
      var ieDegree = Math.ceil(degree);
      var cssObj = { 
        'left' : left, 
        'top' : top,
        '-moz-transform':'rotate('+ degree +'deg)',  // firefox only
        '-webkit-transform' : 'rotate('+ degree +'deg)',  // safari only        
        'tranform' : 'rotate('+ degree +'deg)', // added in case CSS3 is standard
        'filter': 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ieDegree+')'
      };
      $item.css(cssObj);
    },
    
    _$firstItem:function(){ return $(this.selector+"__item:first");},
    _firstItemWidth:function(){ return this._$firstItem().outerWidth() + this.BORDER; },
    _itemHeight:function(){ return this._$firstItem().outerHeight() },
    _degree:function(){ 
        return  Math.round(Math.random()) == 1 ? this._randomXToY(350, 360) : this._randomXToY(0, 10);
     },
     _randomXToY: function(minVal,maxVal,floatVal) {
      var randVal = minVal+(Math.random()*(maxVal-minVal));
      return typeof floatVal=='undefined'?Math.round(randVal):randVal.toFixed(floatVal);
    }
  });

  var MessageBoxView = Backbone.View.extend({
    events:{
      "click .hide":"event_hide"
    },
    initialize:function(options){
      this.$modal = this.$el.modal();
      this.selector = options.selector;
      this.WBORDER = 200;
      this.HBORDER = 100;

    },
    top:function(){
       return 100;
    },
    left:function(){
      return ( WindowHelper.wiw() - this.$el.width() ) / 2;
    },
    show:function(html){      
      /*this.$el.css({        
        top: this.top(),
        left: this.left()
      });*/
      var $content = $( this.selector + "__content" );
      $content.html(html);
      //this.$el.show();
      this.$modal.open({
        onClose: _.bind(this.event_onClose, this)
      });
    },
    event_onClose:function(){
      window.location.href = "#";
    },
    event_hide:function(){
      //this.$el.hide();
      this.$modal.close();
    }
  });

  var converter = new Markdown.Converter();;
  var Router = Backbone.Router.extend({
    initialize:function(options){
      this.msgBox = options.msgBox;
    },    
    ACTIVE_LINK: "active_link",
    routes:{
      "!page/:name":"event_page"      
    },
    event_page: function(name){
      var self = this;
      var url = "/md/{name}.md".replace("{name}",name);
      $.get(url,
        function(d, status, xhr){
          var html = converter.makeHtml(d);
          self.msgBox.show(html);          
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
    
    /*
    $(".ui_panel .control a").hover(function(){
      router.navigate( $(this).attr("href"),{trigger:true} )
    });*/

    var msgBox = new MessageBoxView({
      el: $("#messageBox"),
      selector: ".messageBox"
    });
    
    var router = new Router({
      msgBox:msgBox
    });
    var polaroid = new PolaroidView({
      el: $("#workarea"),
      selector: ".polaroid",
      router:router
    });
    Backbone.history.start();
  });     
})(jQuery);

