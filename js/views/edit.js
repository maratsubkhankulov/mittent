directory.EditView = Backbone.View.extend({

    shellTitle: "Edit",

    events: {
        "click #saveBtn":"saveBtnClick",
    },

	initialize: function() {
	},

    render: function () {
        directory.shellView.setTitle(this.shellTitle + ": " + this.model.attributes.date);
        directory.shellView.showBackArrow();
        directory.shellView.setBackButtonRoute("#preview/" + this.model.attributes.spanId + "/" + this.model.attributes.date);
        this.$el.html(this.template(this.model.attributes));
        
        return this;
    },

    onBackButton: function() {
        console.log("Edit back button");
    },

    saveBtnClick: function() {
        console.log("SaveBtnClick");
    }
});
