directory.GraphView = Backbone.View.extend({
    
    eatingIdx : 0,
    fastingIdx : 1,

    initialize: function() {
        //this.initBarChartData();

        this.listenTo(this.model, 'add',  this.updateGraph);
        this.listenTo(this.model, 'remove', this.updateGraph);
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    updateChartData: function() {
        console.log("update chart");
        // Init chart data
        var b_data = {
            labels: [],
            datasets: []
        }
        // Init vars
        var entries = this.model.models;
        if (entries.length == 0) {
            console.log("No log entries to graph");
            return;
        }
        var min = moment(entries[entries.length - 1].get('datetime'));
        var max = moment(entries[0].get('datetime'));
        var numDays = max.diff(min, 'd') + 1;

        // Label days in range
        var date = min;
        for (i = 0; i<=numDays; i++) {
            b_data.labels.push(date.format('DD/MM/YY'));
            min.add(1, 'd');
        }

        // Create data grid

        // Init data 24 hours x nDays
        var hour_array = [];
        // Init
        for (var i = 0; i < 24; i++) {
            // Place an array at index i
            hour_array.push([]);
            for (var j = 0; j <= numDays; j++) {
                // Place 1-hour increments
                hour_array[i].push(1);
            }
        }

        // Count number of meals per day
        /*
        var date = min;
        _.each(entries, function(entry) {
            var current = moment(entry.get('datetime'));
            var idx = min.diff(current,'d') - 1;
            console.log("idx: " + idx + ", val: " + eat_data[idx]); 
            eat_data[idx] += 3;
        });*/

        // Push fasting data
        /*
        var fast_data = [];
        for (var i = 0; i<=numDays; i++) {
            fast_data.push(24 - eat_data[i]);
        }
        */

        // Init graph data
        for (var i = 0; i < 24; i++) {
            b_data.datasets.push(       
                {
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data : []
                }
            );
            var size = numDays.valueOf();
            while(size--) b_data.datasets[i].data.push(1);
        }

        // Colour eating slots
        /*_.each(entries. function(entry) {
            var current = moment(entry.get('datetime'));
            var i = current.hour();
            var j = min.diff(current,'d') - 1;
            b_data.datasets[i].
        });*/

        this.barChartData = b_data;
    },

    initBarChartData:function() {
        this.barChartData = {
            labels : ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            datasets : [
                {
                    fillColor : "rgba(220,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data : [
                        2,
                        2,
                        2,
                        2,
                        2,
                        0,
                        2
                    ]
                },
                {
                    fillColor : "rgba(0,220,220,0.5)",
                    strokeColor : "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data : [
                        23,
                        23,
                        23,
                        23,
                        23,
                        25,
                        23
                    ]
                },
                {
                    fillColor : "rgba(240,73,73,0.5)",
                    strokeColor : "rgba(240,73,73,0.8)",
                    highlightFill : "rgba(240,73,73,0.75)",
                    highlightStroke : "rgba(240,73,73,1)",
                    data : [
                        1,
                        1,
                        1,
                        1,
                        1,
                        1,
                        1
                    ]
                }
            ]
        };
    },

    drawGraph: function() {
		var ctx = $("#canvas", this.el)[0].getContext("2d");
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(0,0,150,75);
        this.updateChartData();
		this.myBar = new Chart(ctx).StackedBar(this.barChartData, {
			responsive : true
		});
	}
});
