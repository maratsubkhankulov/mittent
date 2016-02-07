directory.GraphView = Backbone.View.extend({
    
    initialize: function() {
        this.initBarChartData();

        this.listenTo(this.model, 'add',  this.updateGraph);
        this.listenTo(this.model, 'remove', this.updateGraph);
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    updateGraph: function() {
        console.log("update chart");
        // Build up the dataset
        //
        // 1. Calculate date range - how many days to render?
        var min = this.model.models[0].attributes.datetime;
        // Find min date
        _.each(this.model.models, function(entry) {});
            
        
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
        console.log($("#canvas", this.el)[0]);
        console.log(this.barChartData);
		this.myBar = new Chart(ctx).StackedBar(this.barChartData, {
			responsive : true
		});
	}
});
