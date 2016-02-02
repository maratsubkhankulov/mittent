directory.HomeView = Backbone.View.extend({
    events: {
        "click #logMealBtn":"logMeal",
    },

    logMeal: function() {
        console.log("Log meal button pressed");
        var datetime = $("#inputTimeAndDate", this.el).val();
        var comment = $("#inputComment", this.el).val();
        if (comment === "" || datetime === "") {
            console.log("one or more fields are empty");
            return;
        }
        console.log("Time and date: " + datetime);
        console.log("Comment: " + comment);
        //Create a new log entry
        var entry = directory.logEntriesCollection.create({"datetime": datetime, "comment": comment});
        console.log(directory.logEntriesCollection);
        //Refresh log table
    },
    
    render:function () {
        this.$el.html(this.template());
        return this;
    }
});
