directory.PreviewView = Backbone.View.extend({

    shellTitle: "Preview",

	initialize: function() {
        //Fetch by snap_id and current day
        //XXX: set shell title to Dashboard
        //Load day collection
	},

    render: function () {
    	console.log("The day id: " + this.dayId);
        directory.shellView.setTitle(this.shellTitle + ": Day " + this.model.attributes.id + ": " + this.model.attributes.date);
        directory.shellView.showBackArrow();
        directory.shellView.setBackButtonRoute("#dashboard");
        this.$el.html(this.template(this.model.attributes));
        
        directory.previewTodayView = new directory.TodayView({model: this.model});
        $('#previewContent', this.el).append(directory.previewTodayView.render().el);
        return this;
    },

    onBackButton: function() {
        console.log("Preview back button");

    }
});
