directory.GraphSegmentView = Backbone.View.extend({
    tpl: '<div class="progress-bar progress-bar-<%= style %> top" title="<%= title %> " style="width: <%= percentage %>%" id="bar-div"> <span class="hidden-xs"><%= hour %></span> </div>',

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

        for (var i = 0; i < this.segmentViews.length; i++) {
            $('#bar-el', this.$el).append(this.segmentViews[i].render().$el.html());
        }
        // Add tooltips to segments
        $(".top").tooltip({
            placement: "top"
        });

        return this;
    },

    initSegments: function() {
        // Create 24 neutral segments
        this.segmentViews = [];
        for (var i = 0; i < 24; i++) {
            var segmentView = new directory.GraphSegmentView({
                    model: {
                        title: "fasting",
                        style: "info",
                        percentage: "4.1666",
                        hour: i+1
                    }
                });
            this.segmentViews.push(segmentView);
        }
    }
});

directory.GraphView = Backbone.View.extend({
    events: {
        "click #draw_graph_btn":"updateGraph"
    },

    initialize: function() {
        this.barViews = [];
        this.initBarChart();

        this.listenTo(this.model, 'sync',  this.updateGraph);
    },

    render: function () {
        this.$el.html(this.template());

        for (var i = this.barViews.length - 1; i >= 0 ; i--) {
            $("#bars-el", this.$el).append(this.barViews[i].render().el);
        }

        this.updateChartData();
        return this;
    },

    updateGraph: function() {
        this.initialize();
        this.render();
    },

    initBarChart: function() {
        // Init vars

        var entries = this.model.models;
        if (entries.length == 0) {
            console.log("No log entries to graph");
            return;
        }
        var now = moment();
        var min = moment(entries[entries.length - 1].get('datetime'));
        var max = moment(entries[0].get('datetime'));
        var numDays = moment(now).startOf('day').diff(moment(min).startOf('day'), 'd') + 1;
        this.numDays = numDays;
        this.min = min;
        this.max = max;

        if (min > now) {
            console.log("Error min entry is after current datetime");
            return;
        }

        // Label days in range
        var date = min;

        this.barViews = [];
        for (i = 0; i < numDays; i++) {
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

        // Init vars
        var entries = this.model.models;
        if (entries.length == 0) {
            console.log("No log entries to graph");
            return;
        }
        var now = moment();
        var min = moment(entries[entries.length - 1].get('datetime'));
        var minDay = moment(min).startOf('day');
        var max = moment(entries[0].get('datetime'));
        var numDays = this.numDays;

        // Update current hour
        var hour = now.hours();
        var currentDay = numDays - 1;
        this.colourSlot(currentDay, hour, "current", "info");
        for (hour++; hour < 24; hour++) {
            this.colourSlot(currentDay, hour, "", "info hidden");
        }

        // Colour eating slots
        var myself = this;
        _.each(entries, function(entry) {
            var current = moment(entry.get('datetime'));
            var currentDay = moment(current).startOf('day');
            var barIdx = currentDay.diff(minDay,'d');
            var segmentIdx = current.hour();
            myself.colourSlot(barIdx, segmentIdx, entry.get('comment'), "warning");
        });

    },

    colourSlot: function(barIdx, segmentIdx, title, style) {
        var segmentView = this.barViews[barIdx].segmentViews[segmentIdx];
        if (segmentView.model.title === "fasting") {
            segmentView.model.title = title;
        } else {
            segmentView.model.title += "; " + title;
        }
        segmentView.model.style = style;
        segmentView.render();
        this.barViews[barIdx].render();
    },

    drawGraph: function() {
        this.render();
	}
});
