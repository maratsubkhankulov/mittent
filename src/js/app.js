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

directory.Controller = function() {

    this._isLoggedIn = false;

    this.setLoggedIn = function(isLoggedIn) {
        this._isLoggedIn = isLoggedIn;
    }

    this.isLoggedIn = function() {
        return this._isLoggedIn;
    }

    this.login = function(username, password, callback) {
        console.log("Controller: login");
        var myself = this;
        directory.authWithPassword(
            username,
            password,
            function(error, authData) {
              if (error) {
                console.log("Login Failed!", error);
                callback("error");
              } else {
                myself.setLoggedIn(true);
                console.log("Authenticated successfully with payload:", authData);
                directory.router.navigate("#home", { trigger: true });
                //TODO update shell view to hide login button
              }
            }
        );
    }

    this.register = function(username, password, callback) {
        directory.createUser(
            username,
            password,
            function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                    callback("error");
                } else {
                    this.setLoggedIn(true);
                    console.log("Successfully created user account with uid:", userData.uid);
                    directory.router.navigate("#home", { trigger: true });
                }
            }
        );
    }

    this.logout = function() {
    }
};

directory.Router = Backbone.Router.extend({

    routes: {
        "":                     "landing",
        "login":                "login",
        "demo":                 "home",
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
            directory.controller = new directory.Controller();
            directory.logEntriesCollection = new directory.EntryCollection();
            Backbone.history.start();
        });
});
