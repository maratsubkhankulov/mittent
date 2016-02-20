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
    
    //Count from first mealtime
    //Assume 2 hours digestion
    //Allow overlapping 2 hour periods
    //Compute meals per 24 hours cycle

    computeAverageFast: function(log) {
       /*log.sort();
       min = log[0].get('datetime');
       max = log[log.length-1].get('datetime');

       var numDays = now.startOf(day).diff(min.startOf(day), days);
       var fastingHoursPerDay = [] //size of numDays

       var fastingIndex = 0;
       var logIndex = 1;
       var current = log[logIndex];
       for (var i = 0; i < numDays; i++) {
          // Compute eating blocks
          // Move forward in log until end of days is reached
          var eatingHours = 0;
          for (meal in this day) { 
             
          }
          fastingHoursPerDay[fastingIndex] = 24 - eatingHours;
          current = log[logIndex];
          logIndex += 1;
       }

       // Compute average fast in a 24 hour cycle
       var sum = 0;
       for (var i = 0; i < numDays; i++) {
           sum += fastingHoursPerDay[i];
       }

       // Return average
       return sum/numDays;*/
    },
    

    recomputeStats: function() {
        this.computeStats();
        this.render();
    }
});
