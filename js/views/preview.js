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
        directory.shellView.setTitle(this.shellTitle + ": " + this.model.attributes.date);
        directory.shellView.showBackArrow();
        directory.shellView.setBackButtonRoute("#dashboard");
        this.$el.html(this.template(this.model.attributes));
        
        directory.previewTodayView = new directory.TodayView({model: this.model});
        $('#previewContent', this.el).append(directory.previewTodayView.render().el);
        return this;
    },

    onBackButton: function() {
        console.log("Preview back button");
    },

    prevBtnClick: function() {
        console.log("PrevBtn");
        var prevId = this.model.attributes.id - 1;
        directory.router.navigate('preview/' + prevId, {trigger: true});
    },

    editBtnClick: function() {
        console.log("EditBtn");
        directory.router.navigate('edit/' + this.model.attributes.id, {trigger: true});
    },

    nextBtnClick: function() {
        console.log("NextBtn");
        var nextId = this.model.attributes.id + 1;
        directory.router.navigate('preview/' + nextId, {trigger: true});
    }
});
