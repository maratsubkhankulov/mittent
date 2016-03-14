directory.LandingView = Backbone.View.extend({
    events: {
        "click #demoBtn":"demoBtnClick",
        "click #get-started-btn":"getStartedBtnClick"
    },

    initialize: function() {
    },
    
    render:function () {
        this.$el.html(this.template());
        return this;
    },

    demoBtnClick: function() {
        console.log("demo button");
        directory.router.navigate("#demo", { trigger: true });
    },

    getStartedBtnClick: function() {
        directory.controller.getStarted($("#email-input", this.el).val());
    }
});
