(function($){
  $(document).ready(function() {
    var idea1 = "static/img/idea.png";
    var idea2 = "static/img/idea2.png";
    var timeout = null;      
    $("a").hover(function(){
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

    var converter = new Showdown.converter();
    $(".markdown").each(
      function(){
        var text = $(this).find("textarea").text();
        var html = converter.makeHtml(text);
        $(this).html(html);
      }
    );
  });     
})(jQuery);

