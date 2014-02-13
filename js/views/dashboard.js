directory.DashboardView = Backbone.View.extend({

    shellTitle: "Dashboard",

	spanId: 0,

    events: {
        'click #updateBtn':'updateBtnClick'
    },

	initialize: function() {
        //Fetch by snap_id and current day
		this.spanId = this.model.id;
        directory.shellView.setTitle(this.shellTitle);
        directory.shellView.hideBackArrow();
        directory.shellView.setBackButtonRoute("#dashboard");
        directory.shellView.showLogoutBtn();
        //XXX: set shell title to Dashboard
        //Load day collection
	},

    render: function () {
    	console.log("The span id: " + this.model.id);
        this.model.attributes.id = this.model.id;
        this.$el.html(this.template(this.model.attributes));
        this.model.days.fetch({
            success:function (data) {
                console.log(data);    
            }
        });
        $('#days', this.el).append(new directory.DayListView({model:this.model.days}).render().el);
        return this;
    },

    updateBtnClick: function() {
        console.log('DashboardView: Update button click ' + $('#inputStartDate').val() + " " + $('#inputEndDate').val());
        var start = directory.newDate(this.model.attributes.startDate);
        var end = directory.newDate(this.model.attributes.endDate);
        var nStart = directory.newDate($('#inputStartDate').val());
        var nEnd = directory.newDate($('#inputEndDate').val());

        var spanSize = directory.msToDays(end - start) + 1;
        var nSpanSize = directory.msToDays(nEnd - nStart) + 1;

        var spanDifference = nSpanSize - spanSize;
        var startOffset = directory.msToDays(nStart - start);

        var days = this.model.days;
        var shiftedEnd = directory.shiftDate(end, startOffset);

        if (!(start <= end) || !(nStart <= end)) { // Validation
            alert("Invalid dates");
            return;
        }

        if (nSpanSize > directory.spanLimit) {
            alert("Requested span size is too large. Currently allow up to " + directory.spanLimit);
            return;
        }

        if (startOffset != 0) { //Shift
            alert("Start date has shifted " + startOffset + "\n shifting days");
            console.log(days);
            days.each(function(day) {
                day.set("date", directory.dateToString(directory.shiftDate(directory.newDate(day.attributes.date), startOffset)));
                console.log("saving day, new date " + day.attributes.date);
                day.save();
            });
        }

        if (spanDifference > 0 ) { //Create
            console.log("Create " + spanDifference + " days");
            for (var i=1; i <= spanDifference; i++) {
                var date = directory.shiftDate(shiftedEnd, i);
                console.log("Creating day " + i + ":" + date);
                var day = directory.createDefaultDayWithDate(date, this.model.id);
                console.log(day);
                day.save();
                this.model.days.add(day);
            }
        } else if (spanDifference < 0) { //Delete
            console.log("Deleting " + Math.abs(spanDifference) + " days");
            var l = days.length;
            for (var i = 0; i > spanDifference; i--) {
                console.log("Removing day with index " + (l + i));
                var day = this.model.days.at(l + i - 1);
                console.log(day);
                day.destroy();
                this.model.days.remove(day);
            }
        } else { //spanSize has not changed
        }

        this.model.set("startDate", directory.dateToString(nStart));
        this.model.set("endDate", directory.dateToString(nEnd));
        this.model.save();
        /*alert("Updated date\n" + 
                start + " - " + end + "\n " + 
                spanSize + " days \n" +
                nStart + " - " + nEnd + "\n" +
                nSpanSize + " days \n" +
                spanDifference + " difference \n" +
                startOffset + " start offset");*/

        
    }
});

directory.DayListView = Backbone.View.extend({

    tagName:"tbody",

    initialize:function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("remove", this.render, this);
        this.model.on("add", function (day) {
            self.$el.append(new directory.DayListItemView({model:day}).render().el);
        });
    },

    render:function () {
        this.$el.empty();
        _.each(this.model.models, function (day) {
            this.$el.append(new directory.DayListItemView({model:day}).render().el);
        }, this);
        return this;
    }
});

directory.DayListItemView = Backbone.View.extend({

    tagName:"tr",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },

    render:function () {
        // The clone hack here is to support parse.com which doesn't add the id to model.attributes. For all other persistence
        // layers, you can directly pass model.attributes to the template function
        console.log("Render DayListitemView");
        var data = _.clone(this.model.attributes);
        data.id = this.model.id;
        this.$el.html(this.template(data));
        console.log((directory.newDate(this.model.attributes.date)));
        console.log((directory.todaysDate()));
        if ((directory.newDate(this.model.attributes.date)).getTime() == (directory.todaysDate()).getTime()) {
            $('#today', this.el).append('<span class="glyphicon glyphicon-chevron-right"></span>');
        }
        if (this.model.attributes.viewed) {
            $('#viewed', this.el).html('<span class="glyphicon glyphicon-ok-circle" style="color:green"></span>');
        } else {
            $('#viewed', this.el).html('<span class="glyphicon glyphicon-remove-circle style="color:red"></span>');
        }
        return this;
    }

});