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
    },

    dayNotFoundTemplate: "",

    beenSeenView: "",

    createDefaultSpan: function(callbacks) {
        
        var promisesPhase1, promise = [];

        console.log("Creating default span");

        //XXX: Use current date
        var today = this.todaysDate();
        var end = this.shiftDate(today, 2);
        var span = new directory.Span({"startDate": this.dateToString(today), "endDate": this.dateToString(end)});

        var days = 
        new directory.DayCollection(
            [
            {"date": this.dateToString(this.shiftDate(today, 0)), "quote": "carpe diem", "author": "Horace", "pic":"img/elder.jpg", "sound":"api.soundcloud.com/tracks/76255568", "viewed":false},
            {"date": this.dateToString(this.shiftDate(today, 1)), "quote": "isn't that the whole point?", "author": "Barack Obama", "pic":"img/corfu2.jpg", "sound":"api.soundcloud.com/tracks/28284290", "viewed":false},
            {"date": this.dateToString(this.shiftDate(today, 2)), "quote": "I know how hard it is for you to put food on your family.", "author": "George Bush", "pic":"img/cow.jpg", "sound":"api.soundcloud.com/tracks/123450519", "viewed":false}
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

        //promise.push(Parse.User.logIn('me@podarok.com', 'password'));

        Parse.Promise.when(promise).then( function() {
            var user = Parse.User.current();
            user.set("spanId", span.id);

            promise.push(user.save());
        });

        Parse.Promise.when(promise).then(function() {
            callbacks.success();
        });
    },

    spanLimit: 70,

    createDefaultDayWithDate: function(date, spanId) {
        return new directory.Day({"date": this.dateToString(date), "quote": "carpe diem", "author": "Horace", "pic":"img/elder.jpg", "sound":"api.soundcloud.com/tracks/76255568", "viewed":false, "spanId":spanId});
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
                var found = false;
                days.each( function(day) {
                    console.log(day);
                    console.log("Comparing date strings: " + day.attributes.date + "=" + date + "?");
                    var date1 = directory.newDate(directory.formatDateStr(day.attributes.date));
                    var date2 = directory.newDate(date);
                    //console.log("Comparing date: " + date1 + "=" + date2);
                    if (date1.getTime() == date2.getTime()) {
                        console.log(day);
                        callbacks.success(day);
                        found = true;
                        return;
                    }
                });
                if (!found) { callbacks.error(); }
            },

            error: function() {
                alert("Can't get days of specified span");
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

    view: function(spanId, date, mode) {
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
                        console.log (data);
                        console.log("Today is: " + date + "End date is: " + end);
                        directory.todayView = new directory.TodayView({model: data});
                        directory.todayView.endDate = end;
                        directory.todayView.previewMode = mode;
                        $('body').html(directory.todayView.render().el);
                        self.$content = $("#content");
                    },

                    error: function() {
                        self.$content.html(directory.dayNotFoundTemplate);
                    }
                });
            },

            error: function() {
                alert("Oops! The page you're looking for doesn't exist.");
                self.navigate('', {trigger: true});
                return;
            }
        });
    },

    today: function(spanId) {
        var previewMode = directory.checkLoginToThisSpan(spanId);
        var todaysDate = directory.todaysDate();
        var today = directory.dateToString(todaysDate);
        this.view(spanId, today, previewMode);
    },

    dashboard: function() {
        if (!directory.checkLogin()) { alert("Not authenticated please log in"); directory.router.navigate('', {trigger: true}); return; }
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
        if (!directory.checkLogin()) { alert("Not authenticated please log in"); directory.router.navigate('', {trigger: true}); return; }
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
                    },

                    error: function() {
                        alert("Preview: could not fetch day for this date");
                        window.history.back();
                    }
                });
            }
        });
    },

    edit: function(spanId, date) {
        if (!directory.checkLogin()) { alert("Not authenticated please log in"); directory.router.navigate('', {trigger: true}); return; }
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
            this.navigate('dashboard', {trigger: true}); 
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
