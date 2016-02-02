var directory = {
    
    views: {},

    models: {},

    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.get('tpl/' + "DayNotFoundView" + '.html', function(data) {
            directory.dayNotFoundTemplate = data;
            console.log(data);
        }, 'html');

        $.get('tpl/' + "BeenSeenView" + '.html', function(data) {
            directory.beenSeenTemplate = data;
            console.log(data);
        }, 'html');

        $.each(views, function(index, view) {
            if (directory[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    directory[view].prototype.template = _.template(data);
                }, 'html'));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    dateToString: function(date) {
        return date.toISOString().substring(0, 10);
    },

    incrementDate: function(date) {
        return this.shiftDate(date, 1);
    },

    decrementDate: function(date) {
        return this.shiftDate(date, -1);
    },

    shiftDate: function(date, offset) {
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + offset);
        return new Date(newDate);
    },

    formatDateStr: function(dateStr) {
        return dateStr.replace(/\b0(?=\d)/g, '')
    },

    newDate: function(dateStr) {
        return new Date(directory.formatDateStr(dateStr));
    },

    todaysDate: function() {
        var today = new Date();
        today.setHours(0,0,0,0)
        return today;
    },

    msToDays: function(ms) {
        return Math.round(ms/1000/60/60/24);;
    }
};

directory.Router = Backbone.Router.extend({

    routes: {
        "":                     "home",
        "home":                 "home",
    },

    initialize: function () {
        this.on('all', function(routeEvent) {
            //
        });
        directory.shellView = new directory.ShellView();
        $('body').html(directory.shellView.render().el);
        this.$content = $("#content");
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!directory.homelView) {
            directory.homelView = new directory.HomeView();
            directory.homelView.render();
        } else {
            console.log('reusing home view');
            directory.homelView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(directory.homelView.el);
    }
});

$(document).on("ready", function () {
    directory.loadTemplates(["HomeView", "ShellView"],
        function () {
			console.log("ready!");
            directory.router = new directory.Router();
            directory.logEntriesCollection = new directory.EntryCollection();
            Backbone.history.start();
        });
});
