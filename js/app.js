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
        var dd = date.getDate();
        var mm = date.getMonth()+1;
        var yyyy = date.getFullYear();
        var out = yyyy + "-" + mm + "-" + dd;
        return out;
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
        
    },

    getCurrentSpan: function() {
        var user = Parse.User.current();
        console.log(user);
        var spanId = 0;
        var span = user.relation("span").query().find({
            success: function(spans) {
                console.log(spans[0]);
                return spans[0];
            },
            error: function() {
                console.log("query failed");
            }
        });
        return spanId;
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
            if (!Parse.User.current()) {
                alert("logged out");
                //this.navigate('', {trigger: true});
            }
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
        // Get spanId associated with publicId, get today's Day id
        console.log ("View day with: " + spanId + ", " + date);
        var span = new directory.Span({id: spanId});
        var self = this;
        span.fetch({
            success: function(data) {
                console.log (data);
                var end = data.attributes.endDate;
                var day = new directory.Day({id: [data.attributes.id, date]});
                day.fetch({
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
        var todaysDate = new Date();
        today = directory.dateToString(todaysDate);
        this.view(spanId, today);
    },

    dashboard: function() {
        var span = new directory.Span({id: directory.getCurrentSpan()}); //XXX: with id associated with username
        var self = this;
        span.fetch({
            success: function(data) {
                console.log (data);
                directory.dashboardView = new directory.DashboardView({model: data});
                self.$content.html(directory.dashboardView.render().el);
            }
        });
    },

    preview: function(spanId, date) {
        console.log("Preview: " + spanId, date);
        var span = new directory.Span({id: spanId});
        var self = this;
        span.fetch({
            success: function(data) {
                console.log (data);
                var end = data.attributes.endDate;
                var day = new directory.Day({id: [spanId, date]});
                day.fetch({
                    success: function(data) {
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
        var day = new directory.Day({id: [spanId, date]});
        var self = this;
        day.fetch({
            success: function(data) {
                console.log (data);
                directory.editView = new directory.EditView({model: data});
                self.$content.html(directory.editView.render().el);
            }
        });    
    },

    loginOrRegister: function() {
        if (Parse.User.current()) {
            console.log("Still logged in");
            //this.navigate('#dashboard', {trigger: true});
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
