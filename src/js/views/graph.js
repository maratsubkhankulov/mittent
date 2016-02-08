directory.GraphSegmentView = Backbone.View.extend({
    tpl: '<div class="progress-bar progress-bar-<%= style %>" style="width: <%= percentage %>%" id="bar-div"> <span class="sr-only"></span> </div>',

    initialize: function() {
        this.template = _.template(this.tpl);
    },

    render: function() {
        this.$el.html(this.template(this.model));
        return this;
    }
});

directory.GraphBarView = Backbone.View.extend({
    tagName: 'div',
    tpl: '<%= datetime %> <div class="progress" style="height: 20px; margin-bottom: 2px" id="bar-el"> </div>',

    initialize: function() {
        this.template = _.template(this.tpl);
        this.initSegments();
    },

    render: function() {
        this.$el.html(this.template(this.model));
        console.log("render BarView");
        
        for (var i = 0; i < this.segmentViews.length; i++) {
            $('#bar-el', this.$el).append(this.segmentViews[i].render().$el.html());
        }

        return this;
    },

    initSegments: function() {
        // Create 24 neutral segments
        this.segmentViews = [];
        for (var i = 0; i < 24; i++) {
            var segmentView = new directory.GraphSegmentView({
                    model: {
                        style: "success",
                        percentage: "4.1666"
                    }
                });
            this.segmentViews.push(segmentView);
        }
    }
});

directory.GraphView = Backbone.View.extend({
    initialize: function() {
        this.barViews = [];
        this.initBarChart();

        this.listenTo(this.model, 'add',  this.updateGraph);
        this.listenTo(this.model, 'remove', this.updateGraph);
    },

    render: function () {
        this.$el.html(this.template());

        for (var i = 0; i < this.barViews.length; i++) {
            $("#bars-el", this.$el).append(this.barViews[i].render().el);
        }

        this.updateChartData();
        return this;
    },

    updateGraph: function() {
        //this.initialize();
        //this.render();
    },

    initBarChart: function() {
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

        this.barViews = [];
        for (i = 0; i<=numDays; i++) {
            var view = new directory.GraphBarView({
                model: {
                    datetime: date.format('ddd Do MMM')
                }
            });
            this.barViews.push(view);
            date.add(1, 'd');
        }
        return this;
    },

    updateChartData: function() {
        console.log("update chart");

        // Init vars
        var entries = this.model.models;
        if (entries.length == 0) {
            console.log("No log entries to graph");
            return;
        }
        var min = moment(entries[entries.length - 1].get('datetime'));
        var max = moment(entries[0].get('datetime'));
        var numDays = max.diff(min, 'd') + 1;

        // Colour eating slots
        var myself = this;
        _.each(entries, function(entry) {
            var current = moment(entry.get('datetime'));
            var barIdx = current.diff(min,'d');
            var segmentIdx = current.hour();
            myself.colourSlot(barIdx, segmentIdx, 'warning');
        });
    },

    colourSlot: function(barIdx, segmentIdx, style) {
        var segmentView = this.barViews[barIdx].segmentViews[segmentIdx];
        segmentView.model.style = "warning";
        segmentView.render();
        this.barViews[barIdx].render();
    },

    drawGraph: function() {
        this.render();
	}
});