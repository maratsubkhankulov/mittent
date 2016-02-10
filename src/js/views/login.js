directory.LoginOrRegisterView = Backbone.View.extend({

    events: {
        "click #goBtn":"goBtnClick",
    },

	initialize: function() {
        directory.shellView.hideLogoutBtn();
	},

    render: function () {
        directory.shellView.hideBackArrow();
        directory.shellView.setBackButtonRoute("#");
        this.$el.html(this.template());
        
        return this;
    },

    goBtnClick: function() {
        var user = new Parse.User();
        var username = $('#inputUsername', this.el).val();
        var password = $('#inputPassword', this.el).val();

        user.set("username", username);
        user.set("password", password);
         
        // other fields can be set just like with Parse.Object
        user.set("phone", "415-392-0202"); //Add new span and day collection here
         
        var self = this;
        user.signUp(null, {
            success: function(user) {
                alert("Signup was successful")
                directory.createDefaultSpan({
                    success: function() {
                        console.log("Created default span for " + username);
                        directory.router.navigate('dashboard', {trigger: true});
                    },
                    error: function(message) {
                        alert("Error " + message);
                    }
                });
            },
            error: function(user, error) {
                //alert("Error: " + error.code + " " + error.message);
                if (error.code == 202) {
                    Parse.User.logIn(username, password, {
                        success: function(user) {
                            //alert("Logged in:" + username);
                            directory.router.navigate('dashboard', {trigger: true});
                        },
                        error: function(user, error) {
                            alert("Login failed for this combination of username and password");// The login failed. Check error to see why.
                        }
                    });
                }
            }
        });
    }
});
