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
        "":                     "home",
        "login":                "login",
        "landing":              "landing",
    },

    initialize: function () {
        this.on('all', function(routeEvent) {
            //
        });
        directory.shellView = new directory.ShellView();
        $('body').html(directory.shellView.render().el);
        this.$content = $("#content");
    },

    landing: function() {
        directory.landingView = new directory.LandingView();
        directory.landingView.render();
        this.$content.html(directory.landingView.el);
    },

    login: function() {
        directory.loginView = new directory.LoginOrRegisterView();
        directory.loginView.render();
        this.$content.html(directory.loginView.el);
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!directory.homeView) {
            directory.homeView = new directory.HomeView();
            directory.homeView.render();
        } else {
            console.log('reusing home view');
            directory.homeView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(directory.homeView.el);
    }
});

$(document).on("ready", function () {
    directory.loadTemplates(
        [
        "HomeView",
        "ShellView",
        "StatsView",
        "LandingView",
        "LogView",
        "LogEntryView",
        "LoginOrRegisterView",
        "GraphView"
        ],
        function () {
			console.log("ready!");
            directory.router = new directory.Router();
            directory.logEntriesCollection = new directory.EntryCollection();
            Backbone.history.start();
        });
});
