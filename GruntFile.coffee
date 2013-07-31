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
    sass:
      dev:
        files:
          "static/css/lexich.css":"static/css/lexich.scss"

    watch:
      sass:
        files:"static/css/*.scss"
        tasks:["sass:dev"]
        options:
          livereload:true
      template:
        files:["fixtures/template/*","fixtures/data/*.json"]
        tasks:["template:dev"]
        options:
          livereload:true
    
    server: 
      dev:            
        port: 8000
        base: __dirname

  grunt.registerMultiTask "template","site generator",->
    template = grunt.file.read @data.path

    grunt.util._.each @data.languages, (fixture, lang)=>
      data = grunt.file.readJSON fixture
      grunt.util._.extend data, lang_pages:@data.lang_pages        
      
      out = grunt.util._.template(template, data)      

      path = if lang is "default" then "index.html" else "#{lang}.html"
      fullpath = @data.out + path
      grunt.file.write fullpath, out

  grunt.registerMultiTask "server", "Start custom server", ->        
    grunt.log.writeln "Starting web server #{@data.port}."
    express = require('express');
    app = express();
    app.configure =>
      app.use "/", express.static(@data.base)
    app.listen(@data.port)

  grunt.registerTask "default", ["template:dev","sass:dev", "server:dev", "watch"]
  
  grunt.loadNpmTasks "grunt-contrib-sass"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-connect"