directory.HomeView = Backbone.View.extend({
    events: {
        "click #logMealBtn":"logMeal",
    },

    logMeal: function() {
        console.log("Log meal button pressed");
        var datetime = $("#inputTimeAndDate", this.el).val();
        var comment = $("#inputComment", this.el).val();
        console.log("Time and date: " + datetime);
        console.log("Comment: " + comment);
        //Append a new log entry TODO
        directory.store.logEntries += {"datetime": datetime, "comment": comment};
        //directory.store.logEntries.append(
        //Refresh log table, graphs, etc. TODO
    },
    
    render:function () {
        this.$el.html(this.template());
        return this;
    }
});
