directory.LoginOrRegisterView = Backbone.View.extend({

    events: {
        "click #loginBtn":"loginBtnClick",
        "click #registerBtn":"registerBtnClick"
    },

	initialize: function() {
	},

    render: function () {
        this.$el.html(this.template({ email: directory.controller.getEmail() }));
        
        return this;
    },

    loginBtnClick: function() {
        var username = $('#inputUsername', this.el).val();
        var password = $('#inputPassword', this.el).val();
        var myself = this;

        directory.controller.login(
            username,
            password,
            function(error) {
                if (error) {
                    console.log("LoginView: show error on login: " + error);
                    myself.showFailureAlert("Error during login!", error);
                } else {
                    console.log("LoginView: successful login: " + username);
                    myself.showSuccessAlert("Successfully logged in!", "Loading dashboard.");
                }
            }
        );
    },

    registerBtnClick: function() {
        var username = $('#inputUsername', this.el).val();
        var password = $('#inputPassword', this.el).val();
        var myself = this;

        directory.controller.register(
            username,
            password,
            function(error) {
                if (error) {
                    console.log("LoginView: show error on register: " + error);
                    myself.showFailureAlert("Error during registration!", error);
                } else {
                    myself.showSuccessAlert("Successfully registered!", "Loading dashboard.");
                }
            }
        );
    },

    showFailureAlert(heading, msg) {
        $('#failure-heading', this.el).text(heading);
        $('#failure-msg', this.el).text(msg);
        $('#failure-alert', this.el).show();
        $(function() {
            // setTimeout() function will be fired after page is loaded
            // it will wait for 5 sec. and then will fire
            // $("#successMessage").hide() function
            setTimeout(function() {
                $("#failure-alert").hide()
            }, 5000);
        });
    },

    showSuccessAlert: function(heading, msg) {
        $('#success-heading', this.el).text(heading);
        $('#success-msg', this.el).text(msg);
        $('#success-alert', this.el).show();
        $(function() {
            // setTimeout() function will be fired after page is loaded
            // it will wait for 5 sec. and then will fire
            // $("#successMessage").hide() function
            setTimeout(function() {
                $("#success-alert").hide()
            }, 5000);
        });
    }
});
