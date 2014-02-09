directory.LoginOrRegisterView = Backbone.View.extend({

    shellTitle: "Podarok",

    events: {
        "click #goBtn":"goBtnClick",
    },

	initialize: function() {
	},

    render: function () {
        directory.shellView.setTitle(this.shellTitle);
        directory.shellView.hideBackArrow();
        directory.shellView.setBackButtonRoute("#");
        this.$el.html(this.template());
        
        return this;
    },

    goBtnClick: function() {
        console.log("GoBtnClick");
    }
});
