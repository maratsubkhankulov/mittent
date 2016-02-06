directory.HomeView = Backbone.View.extend({
    events: {
        "click #logMealBtn":"logMeal",
        "click #randomizeData":"randomizeData",
    },

    initialize: function() {
        this.statsView = new directory.StatsView();
        this.logView = new directory.LogView({model: directory.logEntriesCollection});
        this.initBarChartData();
        console.log(directory.logEntriesCollection);
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
    
    render:function () {
        this.$el.html(this.template());

        $('#stats-el', this.$el).append(this.statsView.render().el);
        $('#log-el', this.$el).append(this.logView.render().el);
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
            labels : ["January","February","March","April","May","June","July"],
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
                    fillColor : "rgba(151,187,205,0.5)",
                    strokeColor : "rgba(151,187,205,0.8)",
                    highlightFill : "rgba(151,187,205,0.75)",
                    highlightStroke : "rgba(151,187,205,1)",
                    data : [this.randomScalingFactor(),this.randomScalingFactor(),this.randomScalingFactor(),this.randomScalingFactor(),this.randomScalingFactor(),this.randomScalingFactor(),this.randomScalingFactor()]
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

    randomizeData:function(){
        this.barChartData.datasets[0].fillColor = 'rgba(' + this.randomColorFactor() + ',' + this.randomColorFactor() + ',' + this.randomColorFactor() + ',.7)';
        this.barChartData.datasets[0].data = [
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor()
        ];

        this.barChartData.datasets[1].fillColor = 'rgba(' + this.randomColorFactor() + ',' + this.randomColorFactor() + ',' + this.randomColorFactor() + ',.7)';
        this.barChartData.datasets[1].data = [
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor()
        ];

        this.myBar.update();
        console.log("Updated random colour factor");
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
