directory.HomeView = Backbone.View.extend({
    events: {
        "click #logMealBtn":"logMeal",
    },

    initialize: function() {
        this.statsView = new directory.StatsView();
        this.logView = new directory.LogView({model: directory.logEntriesCollection});
        console.log(directory.logEntriesCollection);
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
        this.logView.render();
    },
    
    render:function () {
        this.$el.html(this.template());

        $('#stats-el', this.$el).append(this.statsView.render().el);
        $('#log-el', this.$el).append(this.logView.render().el);
        return this;
    }
});
