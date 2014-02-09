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

    today: function(spanId) {
        var todaysDate = new Date();
        var dd = todaysDate.getDate();
        var mm = todaysDate.getMonth()+1;
        var yyyy = todaysDate.getFullYear();
        todaysDate = yyyy + "-" + mm + "-" + dd;
        view(spanId, todaysDate);
    },

    view: function(spanId, date) {
        // Get spanId associated with publicId, get today's Day id
        console.log ("View day with: " + spanId + ", " + date);
        var span = new directory.Span({id: spanId});
        var self = this;
        span.fetch({
            success: function(data) {
                console.log (data);
                var endDate = data.attributes.endDate;
                console.log("Today is: " + todaysDate);
                var day = new directory.Day({id: [data.attributes.id, date]});
                day.fetch({
                    success: function(data) {
                        console.log ("Fetched day");
                        console.log (data);
                        directory.todayView = new directory.TodayView({model: data});
                        directory.todayView.initialize(endDate);
                        $('body').html(directory.todayView.render().el);
                        self.$content = $("#content");
                    }
                });
            }
        });
    },

    dashboard: function() {
        //XXX: get username and spanId
        var spanId = "span1";
        var span = new directory.Span({id: spanId}); //XXX: with id associated with username
        var self = this;
        span.fetch({
            success: function(data) {
                console.log (data);
                directory.dashboardView = new directory.DashboardView({model: data});
                directory.dashboardView.initialize(spanId);
                self.$content.html(directory.dashboardView.render().el);
            }
        });
    },

    preview: function(spanId, date) {
        console.log("Preview: " + spanId, date)
        var day = new directory.Day({id: [spanId, date]});
        var self = this;
        day.fetch({
            success: function(data) {
                console.log (data);
                directory.previewView = new directory.PreviewView({model: data});
                directory.previewView.initialize();
                self.$content.html(directory.previewView.render().el);
            }
        });
    },

    edit: function(dayId) {
        var day = new directory.Day({id: dayId});
        var self = this;
        day.fetch({
            success: function(data) {
                console.log (data);
                directory.editView = new directory.EditView({model: data});
                directory.editView.initialize(dayId);
                self.$content.html(directory.editView.render().el);
            }
        });    
    },

    loginOrRegister: function() {
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
