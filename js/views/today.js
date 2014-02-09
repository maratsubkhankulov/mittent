directory.TodayView = Backbone.View.extend({

	span_id: 0,

	initialize: function(id) {
		this.span_id = id;
		//Fetch by snap_id and current day
	},

    render: function () {
    	console.log("The span id: " + this.span_id);
    	$('body').css('backgroundImage', 'url(' + this.model.attributes.pic + ')');
    	this.model.attributes.daysLeft = 21;
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});