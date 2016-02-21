directory.HomeView = Backbone.View.extend({
    notes: ["Meal - and it was good!", "Plate of good food", "Chow - scrumptious"],

    events: {
        "click #logMealBtn":"logMeal",
        "click #randomizeData":"randomizeData",
    },

    initialize: function(model) {
        console.log("Initializing HomeView");

        this.statsView = new directory.StatsView({model: this.model.log});
        this.logView = new directory.LogView({model: this.model.log});
        this.graphView = new directory.GraphView({model: this.model.log});
    },

    render:function() {
        // Populate note
        
        this.$el.html(this.template({
            note: this.notes[Math.floor(Math.random()*this.notes.length)],
            demo: this.model.demo }
            ));

        // Populate donation button
        var donationEls = $(".donation-button", this.$el);
        var id = donationEls[Math.floor(Math.random()*donationEls.length)].id;
        console.log($("#" + id, this.$el));
        $("#" + id, this.$el).css("display","block");

        $('#stats-el', this.$el).append(this.statsView.render().el);
        $('#log-el', this.$el).append(this.logView.render().el);
        $('#graph-el', this.$el).append(this.graphView.render().el);

        return this;
    },

    logMeal: function() {
        console.log("Log meal button pressed");
        var datetime = $("#datetimepicker", this.el).data("DateTimePicker").viewDate();
        var comment = $("#inputComment", this.el).val();
        var diffFromNow = moment(datetime).diff(moment(), 'h');
        if (diffFromNow > 0) {
            console.log("date can't be in the future");
            return;
        } else if (diffFromNow < -24) {
            console.log("date can't more than 24 hours from now");
            return;
        } // else continue

        if (comment === "" || datetime === "") {
            console.log("one or more fields are empty");
            return;
        }
        console.log(datetime.toISOString());
        //Create a new log entry
        var entry = this.model.log.create({"datetime": datetime.toISOString(), "comment": comment});
        //Redraw graph
        this.graphView.updateGraph();
        this.statsView.recomputeStats();
        this.statsView.render();
    }
});
