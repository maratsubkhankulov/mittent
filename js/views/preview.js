directory.PreviewView = Backbone.View.extend({

    shellTitle: "Preview",

    events: {
        "click #prevBtn":"prevBtnClick",
        "click #editBtn":"editBtnClick",
        "click #nextBtn":"nextBtnClick"
    },

	initialize: function() {
        //Fetch by snap_id and current day
        //XXX: set shell title to Dashboard
        //Load day collection
	},

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        directory.shellView.showLogoutBtn();
        directory.shellView.setTitle(this.shellTitle + ": " + this.model.attributes.date);
        directory.shellView.showBackArrow();
        directory.shellView.setBackButtonRoute("#dashboard");
        
        directory.previewTodayView = new directory.TodayView({model: this.model});
        directory.previewTodayView.endDate = this.endDate;
        directory.previewTodayView.previewMode = true;
        $('#previewContent', this.el).append(directory.previewTodayView.render().el);
        return this;
    },

    onBackButton: function() {
        console.log("Preview back button");
    },

    prevBtnClick: function() {
        console.log("PrevBtn");
        var prevDate = directory.dateToString(directory.decrementDate(directory.newDate(this.model.attributes.date)));
        directory.router.navigate('preview/' + this.model.attributes.spanId + "/" + prevDate, {trigger: true});
    },

    editBtnClick: function() {
        console.log("EditBtn");
        directory.router.navigate('edit/' + this.model.attributes.spanId + "/" + this.model.attributes.date, {trigger: true});
    },

    nextBtnClick: function() {
        console.log("NextBtn");
        var nextDate = directory.dateToString(directory.incrementDate(directory.newDate(this.model.attributes.date)));
        directory.router.navigate('preview/' + this.model.attributes.spanId + "/" + nextDate, {trigger: true});
    }
});
