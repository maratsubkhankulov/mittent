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

        directory.controller.authWithPassword(
            username,
            password,
            function(error) {
                if (error) {
                    console.log("LoginView: show error on login: " + error);
                }
            }
        );
    },

    registerBtnClick: function() {
        var username = $('#inputUsername', this.el).val();
        var password = $('#inputPassword', this.el).val();
        
        directory.controller.createUser(
            username,
            password,
            function(error) {
                if (error) {
                    console.log("LoginView: show error on register: " + error);
                }
            }
        );
    }
});
