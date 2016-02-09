directory.StatsView = Backbone.View.extend({
    statsModel: {
        currentFast: "N/A",
        averageFast: "N/A"
    },

    initialize: function() {
        this.listenTo(this.model, 'sync',  this.recomputeStats);
    },
    
    render:function () {
        this.computeStats();
        this.$el.html(this.template(this.statsModel));
        return this;
    },

    computeStats: function() {
        // Compute all fasting periods
        // by taking the difference between
        // two consecutive eating periods
        var entries = this.model.models;
        if (entries.length > 0) {
            var now = moment();
            var max = moment(entries[0].get('datetime'));
            this.statsModel.currentFast = (now.diff(max, 'minutes')/60).toFixed(1);
        }
    },

    recomputeStats: function() {
        this.computeStats();
        this.render();
    }
});
