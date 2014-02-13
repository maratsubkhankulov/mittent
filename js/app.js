var directory = {

    views: {},

    models: {},

    loadTemplates: function(views, callback) {

        var deferreds = [];

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
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 1);
        return new Date(newDate);
    },

    decrementDate: function(date) {
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() - 1);
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

    createDefaultSpan: function(callbacks) {
        
        var promisesPhase1, promise = [];

        console.log("Creating default span");

        //XXX: Use current date
        var span = new directory.Span({"startDate": "2014-1-08", "endDate": "2014-2-11"});

        var days = 
        new directory.DayCollection(
            [
            {"date": "2014-2-10", "quote": "carpe diem", "author": "Horace", "pic":"img/elder.jpg", "sound":"api.soundcloud.com/tracks/76255568", "viewed":true},
            {"date": "2014-2-11", "quote": "isn't that the whole point?", "author": "Barack Obama", "pic":"img/corfu2.jpg", "sound":"api.soundcloud.com/tracks/28284290", "viewed":false},
            {"date": "2014-2-12", "quote": "I know how hard it is for you to put food on your family.", "author": "George Bush", "pic":"img/cow.jpg", "sound":"api.soundcloud.com/tracks/123450519", "viewed":false},
            {"date": "2014-2-13", "quote": "Imagination is more important than knowledge", "author": "Albert Einstein", "pic":"img/ten.jpg", "sound":"api.soundcloud.com/tracks/20389181", "viewed":false}
            ]
        );

        promise.push(span.save());

        Parse.Promise.when(promise).then( function() {
            days.each(function(day) {
                day.set("spanId", span.id);
                day.save( null, {
                    success: function(span) {
                        console.log("Day saved");
                    },
                    error: function(day, error) {
                        console.log("failed " + error.code + " " + error.message);
                        callbacks.error("Error: span could not be saved");
                    }
                });
            });
        });

        promise.push(Parse.User.logIn('me@podarok.com', 'password'));

        Parse.Promise.when(promise).then( function() {
            var user = Parse.User.current();
            user.set("spanId", span.id);

            promise.push(user.save());
        });

        Parse.Promise.when(promise).then(function() {
            callbacks.success();
        });
    },

    getCurrentSpanId: function() {
        var user = Parse.User.current();
        var spanId = user.attributes.spanId;
        console.log(spanId);
        return spanId;
    },

    getDayFromSpanByDate: function(span, date, callbacks) {
        console.log("getDayFromSpanByDate");
        console.log(span);
        span.days.fetch( {
            success: function(days) {
                console.log(days);
                var l = days.length;
                console.log("getDayFromSpanByDate from " + l + "days");
                days.each( function(day) {
                    console.log(day);
                    console.log("Comparing date strings: " + day.attributes.date + "=" + date + "?");
                    var date1 = directory.newDate(directory.formatDateStr(day.attributes.date));
                    var date2 = directory.newDate(date);
                    //console.log("Comparing date: " + date1 + "=" + date2);
                    if (date1.getTime() == date2.getTime()) {
                        console.log(day);
                        callbacks.success(day);
                    }
                });
            }
        });
    }
};

directory.Router = Backbone.Router.extend({

    routes: {
        "":                     "loginOrRegister",
        "dashboard":            "dashboard",
        "home":                 "home",
        "view/:spanId":         "today",
        "preview/:spanId/:date":"preview",
        "edit/:spanId/:date":   "edit"
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
    },

    view: function(spanId, date) {
        // Get Day associated with given span on a given day and render it
        console.log ("View day with: " + spanId + ", " + date);
        var span = new directory.Span({id: spanId});
        var self = this;
        span.fetch({
            success: function(data) {
                console.log (data);
                var end = data.attributes.endDate;
                directory.getDayFromSpanByDate(span, date, {
                    success: function(data) {
                        console.log ("Fetched day");
                        console.log (data);
                        console.log("Today is: " + date + "End date is: " + end);
                        directory.todayView = new directory.TodayView({model: data, endDate: end});
                        directory.todayView.endDate = end;
                        $('body').html(directory.todayView.render().el);
                        self.$content = $("#content");
                    }
                });
            }
        });
    },

    today: function(spanId) {
        var previewMode = directory.checkLogin();
        var todaysDate = new Date();
        var today = directory.dateToString(todaysDate);
        this.view(spanId, today);
    },

    dashboard: function() {
        if (!directory.checkLogin()) { alert("Not authenticated please log in"); return; }
        var span = new directory.Span({id: directory.getCurrentSpanId()}); //XXX: with id associated with username
        var self = this;
        span.fetch({
            success: function(data) {
                console.log("Fetched span");
                console.log(data);
                directory.dashboardView = new directory.DashboardView({model: data});
                directory.dashboardView.initialize(directory.getCurrentSpanId());
                self.$content.html(directory.dashboardView.render().el);
            },
            error: function(error) {
                console.log("Error when fetching span " + error.code);
            }
        });
    },

    preview: function(spanId, date) {
        if (!directory.checkLogin()) { alert("Not authenticated please log in"); return; }
        console.log("Preview: " + spanId, date);
        var span = new directory.Span({id: spanId});
        var self = this;
        span.fetch({
            success: function(data) {
                console.log("preview: successfully fetched span");
                console.log (data);
                var end = data.attributes.endDate;
                directory.getDayFromSpanByDate(span, date, {
                    success: function(data) {
                        console.log("preview: successfully fetched day");
                        console.log (data);
                        directory.previewView = new directory.PreviewView({model: data});
                        directory.previewView.endDate = end;
                        self.$content.html(directory.previewView.render().el);
                    }
                });
            }
        });
    },

    edit: function(spanId, date) {
        if (!directory.checkLogin()) { alert("Not authenticated please log in"); return; }
        var self = this;
        var day = new directory.Day();
        day.fetch({data: {spanId: spanId, date: date}}, {
            success: function(data) {
                console.log (data);
                directory.editView = new directory.EditView({model: data});
                self.$content.html(directory.editView.render().el);
            }
        });    
    },

    loginOrRegister: function() {
        if (directory.checkLogin()) {
            console.log("Still logged in");
            this.navigate('#dashboard', {trigger: true}); 
            return;
        }
        directory.loginOrRegisterView = new directory.LoginOrRegisterView();
        this.$content.html(directory.loginOrRegisterView.render().el)
    }
});

$(document).on("ready", function () {
    directory.loadTemplates(["HomeView", "ShellView", "TodayView", "DashboardView", "DayListItemView", "PreviewView", "EditView", "LoginOrRegisterView"],
        function () {
			console.log("ready!");
            directory.router = new directory.Router();
            Backbone.history.start();
        });
});
