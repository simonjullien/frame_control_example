define([
    "jquery",
    "underscore",
    "backbone",
    "config",
    "TimelineData",
    "util/animation/AnimationUtils",
    "util/MathUtils",
    "preloadjs",
    "stats",
    "handlebars",
    "bitmapData",
    "fastBlur"
], function (
    $,
    _,
    Backbone,
    Config,
    TimelineData,
    AnimationUtils,
    MathUtils,
    PreloadJS,
    Stats,
    Handlebars,
    BitmapData,
    FastBlur
) {
  return Backbone.View.extend({

        data: null,

        $window: null,
        dispatcher: null,

        loopInterval: null,
        assets: null,
        loader: null,
        manifest: null,
        canvas: null,
        bitmapData: null,
        ctx: null,

        stats: null,

        currentImage: null,
        previousImage: null,
        currentFrameEase: null,
        targetFrameEase: 0,
        ctVal:null,
        listFrame: null,

        initialize: function(options) {
            this.dispatcher = options.dispatcher;
            this.assets = [];
            _.bindAll(
                this,
                "loopAnimation",
                "touchStartHandler",
                "touchMoveHandler",
                "touchEndHandler",
                "handleFileLoad",
                "handleComplete",
                "mouseMoveHandler"
            );
            this.$window = $(window);
           require(["text!"+Config.BASE_URL+"templates/frameControl.html!strip"], _.bind(this.onTemplateLoaded, this) );
        },

        onTemplateLoaded: function( template ) {

            var templateFunction = Handlebars.compile( template );

            this.$el.append(
                $( templateFunction( { 'title': 'Awesome!', 'time': new Date().toString() } ) )
            );
            this.stats = new Stats();
            this.init();
        },

        init:function(){
            this.manifest = [];
            this.listFrame = [null,null,null,null,null,null,null,null,null,null];
            this.canvas = document.getElementById("canvas-draw");
            this.ctx = this.canvas.getContext('2d');
            var nbImage = 0;
            for (var i = 0; i < 51; i++) {
                if(nbImage < 10){
                    this.manifest.push({src:Config.CDN+'/img/twinshadow_0000'+nbImage+'.jpg', id:"twinshadow"});
                }else{
                    this.manifest.push({src:Config.CDN+'/img/twinshadow_000'+nbImage+'.jpg', id:"twinshadow"});
                }
                nbImage++;
            }
            this.loadAsset();
        },

        initEvents:function(){
            //events
            $(this.canvas).on('touchstart',this.touchStartHandler);
            $(this.canvas).on('touchmove',this.touchMoveHandler);
            $(this.canvas).on('touchend',this.touchEndHandler);

            $(this.canvas).on('mousemove',this.mouseMoveHandler);
        },

        mouseMoveHandler: function(e){

            this.targetFrameEase = (e.pageX / 1280) * this.assets.length;
        },

        loadAsset: function(){
            this.loader = new PreloadJS();
            this.loader.onFileLoad = this.handleFileLoad;
            this.loader.onComplete = this.handleComplete;
            this.loader.onProgress = this.handleProgress;
            this.loader.loadManifest(this.manifest);
        },

        handleFileLoad: function(event) {
            this.assets.push(event.result);
        },

        handleProgress: function(event){
            var progressLoader = parseInt((event.loaded / event.total) * 100,10);
            $('.loader-frame').text(progressLoader+'%');
        },

        handleComplete: function() {
            $('.loader-frame').text('');
            this.currentImage = this.assets[1];
            this.loopInterval = setInterval(this.loopAnimation,1000/60);
            //$('#fps').append( this.stats.domElement );
            this.initEvents();
        },

        touchStartHandler:function(e){
        },

        touchMoveHandler:function(e){
            e.preventDefault();
            this.targetFrameEase = (e.originalEvent.touches[0].pageX / 1280) * this.assets.length;
        },

        touchEndHandler:function(e){
        },

        loopAnimation:function(){
            this.ctVal = MathUtils.clampValue((this.targetFrameEase - this.currentFrameEase)*0.1,-1,1);
            if(this.ctVal > 0 && this.ctVal < 0.25)
                this.ctVal = 0;
            if(this.ctVal < 0 && this.ctVal > -0.25)
                this.ctVal = 0;
            this.currentFrameEase += this.ctVal;
            this.listFrame[0] = this.assets[parseInt(this.currentFrameEase,10)];
            this.stats.begin();
            this.drawImage();
            this.stats.end();
        },

        drawImage: function(img){
            this.ctx.save();
            var nbTrail = 10;
            this.ctx.restore();
            this.ctx.globalAlpha = 1/Math.abs(this.ctVal*20);
            this.ctx.drawImage(this.listFrame[0],0,0);
        },

		render: function() {
            this.$el.append('What an awesome about page!!');
		}
	});
});
