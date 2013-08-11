define([
    "jquery",
    "config",
    "router",
    "controller/app_controller",
    "view/frameControl/FrameControl",
    "model/app_model"
],function(
    $,
    Config,
    Router,
    AppController,
    FrameControl,
    AppModel
) {

		return {

            $rootNode: $('#rootNode'),
            currentView: null,
            dispatcher: null,

			start: function() {


                AppModel.on("change:page", this.onAppModelPage, this);

                this.dispatcher = _.extend({},Backbone.Events);

                Router.setRoutes( [
                    ["",                        AppModel.PAGES.TIMELINE], //# Base url
                    [/^([0-9]+)\/([0-9]+)$/,    AppModel.PAGES.TIMELINE], //# Regexp example
                    ["timeline/:width/:height", AppModel.PAGES.TIMELINE], //# Variable example
                    ["detail",                  AppModel.PAGES.DETAIL]
                ]);

                Router.start();
                this.currentView = new FrameControl({el:this.$rootNode, dispatcher:this.dispatcher});
            },

            onAppModelPage: function ( model, page ) {

                this.$rootNode.empty();

                if(this.currentView){
                    this.currentView.cleanUp();
                }

                /*switch(page) {

                    case AppModel.PAGES.TIMELINE:

                        this.currentView = new Timeline({el:this.$rootNode, dispatcher:this.dispatcher});

                        break;

                    case AppModel.PAGES.DETAIL:

                        this.currentView = new Detail({el:this.$rootNode});

                        break;

                }*/
            }
		};
});