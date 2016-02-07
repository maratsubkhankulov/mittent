directory.GraphView = Backbone.View.extend({
    
    initialize: function() {
        this.initBarChartData();
    },

    render:function () {
        this.$el.html(this.template());
        return this;
    },

    randomScalingFactor:function() {
        return Math.round(Math.random()*100);
    },

    randomColorFactor:function() {
        return Math.round(Math.random()*255);
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
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor()]
                },
                {
                    fillColor : "rgba(240,73,73,0.5)",
                    strokeColor : "rgba(240,73,73,0.8)",
                    highlightFill : "rgba(240,73,73,0.75)",
                    highlightStroke : "rgba(240,73,73,1)",
                    data : [
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor()
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
