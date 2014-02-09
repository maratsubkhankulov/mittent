directory.EditView = Backbone.View.extend({

    shellTitle: "Edit",

    events: {
        "click #saveBtn":"saveBtnClick",
    },

	initialize: function() {
	},

    render: function () {
    	console.log("The day id: " + this.dayId);
        directory.shellView.setTitle(this.shellTitle + ": Day " + this.model.attributes.id + ": " + this.model.attributes.date);
        directory.shellView.showBackArrow();
        directory.shellView.setBackButtonRoute("#preview/" + this.model.attributes.id);
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
