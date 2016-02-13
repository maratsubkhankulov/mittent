directory.LoginOrRegisterView = Backbone.View.extend({

    events: {
        "click #loginBtn":"loginBtnClick",
        "click #registerBtn":"registerBtnClick"
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

    loginBtnClick: function() {
        var username = $('#inputUsername', this.el).val();
        var password = $('#inputPassword', this.el).val();

        directory.authWithPassword(
                username,
                password,
                function(error, authData) {
                  if (error) {
                    console.log("Login Failed!", error);
                  } else {
                    console.log("Authenticated successfully with payload:", authData);
                  }
                }
            );

    },

    registerBtnClick: function() {
        var username = $('#inputUsername', this.el).val();
        var password = $('#inputPassword', this.el).val();

        directory.createUser(
            username,
            password,
            function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                }
            }
        );
    }
});
