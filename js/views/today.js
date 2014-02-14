directory.TodayView = Backbone.View.extend({

	initialize: function() {
		//Fetch by snap_id and current day
	},

    render: function () {
        console.log("End of this span: " + this.endDate);
        console.log((new Date(this.endDate)).getDate());
        console.log((new Date(this.model.attributes.date)).getDate());

        this.model.attributes.daysLeft = (new Date(this.endDate)).getDate() - (new Date(this.model.attributes.date)).getDate() + 1;

        console.log("Preview mode? " + this.previewMode);
        if (this.previewMode) {
            $('body').css('backgroundImage', 'url(' + this.model.attributes.pic + ')');
            this.$el.html(this.template(this.model.attributes));
            //alert("This is preview mode, page can be viewed many times");
        } else {
            if (!this.model.attributes.viewed) {
                this.$el.html(this.template(this.model.attributes));
                
                alert("A gift for you! (But you can only see it once)");
                $('body').css('backgroundImage', 'url(' + this.model.attributes.pic + ')');
                this.model.set("viewed", true);
                this.model.save();
            } else {
                $('body').css('backgroundImage', 'url("img/ten.jpg")');
                directory['TodayView'].prototype.template = _.template(directory.beenSeenTemplate);
                this.$el.html(this.template(this.model.attributes));
            }
        }
        return this;
    }
});