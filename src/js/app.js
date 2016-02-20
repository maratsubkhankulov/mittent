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
    this._username = "Guest";
    this._currentUid = "guest";

    this.getUsername = function() {
        return this._username;
    }

    this.setUsername = function(username) {
        this._username = username;
    }

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
                myself.setUsername(username);
                myself._currentUid = authData.uid;
                console.log("Authenticated successfully with payload:", authData);
                directory.router.navigate("#home", { trigger: true });
                directory.logCollection.sync();
                directory.homeView.initialize();
                directory.homeView.render();
                directory.shellView.update();
              }
            }
        );
    }

    this.register = function(username, password, callback) {
        var myself = this;
        directory.createUser(
            username,
            password,
            function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                    callback("error");
                } else {
                    myself.login(username, password, callback);
                }
            }
        );
    }

    this.logout = function() {
        this.setLoggedIn(false);
        this.setUsername("Guest");
        directory.shellView.update();
    }
};

directory.Router = Backbone.Router.extend({

    routes: {
        "":                     "landing",
        "login":                "login",
        "demo":                 "demo",
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

    demo: function() {
        // Since the home view never changes, we instantiate it and render it only once
        if (!directory.demoView) {
            directory.demoView = new directory.HomeView({model: { demo: true }});
            directory.demoView.render();
        } else {
            console.log('reusing home view');
            directory.demoView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(directory.demoView.el);
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!directory.homeView) {
            directory.homeView = new directory.HomeView({model: { demo: false }});
            directory.homeView.render();
        } else {
            console.log('reusing home view');
            directory.homeView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(directory.homeView.el);
    }
});

$(document).on("ready", function () {
    directory.controller = new directory.Controller();
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
            directory.logCollection = new directory.LogCollection();
            console.log("Log collection");
            console.log(directory.logCollection);
            Backbone.history.start();
        });
});
