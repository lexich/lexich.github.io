module.exports = (grunt) ->
  grunt.initConfig 
    template:
      dev:
        languages:
          ru:"fixtures/data/ru.json"        
          default:"fixtures/data/en.json"
        path:"fixtures/template/index.html"
        out:"./"
        lang_pages: 
          "en-us":"http://lexich.ru/index.html"
          "ru":"http://lexich.ru/ru.html"

  grunt.registerMultiTask "template","site generator",->
    template = grunt.file.read @data.path

    grunt.util._.each @data.languages, (fixture, lang)=>
      data = grunt.file.readJSON fixture
      grunt.util._.extend data, lang_pages:@data.lang_pages        
      
      out = grunt.util._.template(template, data)      

      path = if lang is "default" then "index.html" else "#{lang}.html"
      fullpath = @data.out + path
      grunt.file.write fullpath, out