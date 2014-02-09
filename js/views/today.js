directory.TodayView = Backbone.View.extend({

	initialize: function() {
		//Fetch by snap_id and current day
	},

    render: function () {
    	$('body').css('backgroundImage', 'url(' + this.model.attributes.pic + ')');
        console.log("End of this span: " + this.endDate);
        console.log((new Date(this.endDate)).getDate());
        console.log((new Date(this.model.attributes.date)).getDate());
    	this.model.attributes.daysLeft = (new Date(this.endDate)).getDate() - (new Date(this.model.attributes.date)).getDate() + 1;
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});