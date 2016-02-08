directory.StatsView = Backbone.View.extend({
    statsModel: {
        currentFast: 20,
        averageFast: 15
    },
    
    render:function () {
        this.computeStats(this.model);
        this.$el.html(this.template(this.statsModel));
        return this;
    },

    computeStats: function() {
        // Compute all fasting periods
        // by taking the difference between
        // two consecutive eating periods
    }

});
