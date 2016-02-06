directory.HomeView = Backbone.View.extend({
    events: {
        "click #logMealBtn":"logMeal",
        "click #randomizeData":"randomizeData",
    },

    initialize: function() {
        this.statsView = new directory.StatsView();
        this.logView = new directory.LogView({model: directory.logEntriesCollection});
        this.graphView = new directory.GraphView({model: directory.logEntriesCollection});
        console.log(directory.logEntriesCollection);
    },

    render:function () {
        this.$el.html(this.template());

        $('#stats-el', this.$el).append(this.statsView.render().el);
        $('#log-el', this.$el).append(this.logView.render().el);
        $('#graph-el', this.$el).append(this.graphView.render().el);
        return this;
    },

    logMeal: function() {
        console.log("Log meal button pressed");
        var datetime = $("#inputDatetime", this.el).val();
        console.log(datetime);
        var comment = $("#inputComment", this.el).val();
        if (comment === "" || datetime === "") {
            console.log("one or more fields are empty");
            return;
        }
        //Create a new log entry
        var entry = directory.logEntriesCollection.create({"datetime": datetime, "comment": comment});
        //Refresh log table
        this.logView.render();
    },

    drawGraph: function() {
        this.graphView.drawGraph();
    }
});
