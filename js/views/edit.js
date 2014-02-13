directory.EditView = Backbone.View.extend({

    shellTitle: "Edit",

    events: {
        "click #saveBtn":"saveBtnClick",
    },

	initialize: function() {
	},

    render: function () {
        directory.shellView.showLogoutBtn();
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
        var day = this.model;
        day.set("quote", $('#inputQuote', this.el).val());
        day.set("author", $('#inputAuthor', this.el).val());
        day.set("sound", $('#inputSound', this.el).val());
        day.set("pic", $('#inputPic', this.el).val());
        day.set("viewed", $('#inputViewed', this.el).is(':checked'));
        day.save({
            success: function(day) {
                console.log("Saved day" + day.attributes.date);
            },
            error: function(error) {
                console.log("Error saving day " + day.id + " " + day.message);
            }
        });
        //{"date": this.dateToString(date), "quote": "carpe diem", "author": "Horace", "pic":"img/elder.jpg", "sound":"api.soundcloud.com/tracks/76255568", "viewed":false, "spanId":spanId});
    }
});
