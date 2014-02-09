directory.TodayView = Backbone.View.extend({

    endDate: "2014-12-12",

	initialize: function(endDate) {
        this.endDate = endDate;
		//Fetch by snap_id and current day
	},

    render: function () {
    	$('body').css('backgroundImage', 'url(' + this.model.attributes.pic + ')');
    	this.model.attributes.daysLeft = 21;
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});