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

    this.getCurrentUserId = function() {
        return this._currentUid;
    }

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
            directory.demoView = new directory.HomeView({model: { demo: true, log: demoLogCollection }});
            directory.demoView.render();
        } else {
            console.log('reusing home view');
            directory.demoView.delegateEvents(); // delegate events when the view is recycled
        }
        this.$content.html(directory.demoView.el);
    },

    home: function () {
        if (!directory.controller.isLoggedIn()) {
            directory.router.navigate("#demo", { trigger: true });
            return;
        }

        var newLogPath = directory.firebaseAppUrl + "/logs/" + directory.controller.getCurrentUserId();
        logCollection = new directory.LogCollection([], {url: newLogPath});
        console.log(newLogPath);

        directory.homeView = new directory.HomeView({model: { demo: false, log: logCollection }});
        directory.homeView.render();
            
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
            
            demoLogCollection = new directory.LogCollection([], {url: directory.firebaseAppUrl + "/logs/guest"});
            Backbone.history.start();
        });
});
