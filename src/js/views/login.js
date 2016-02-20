directory.LoginOrRegisterView = Backbone.View.extend({

    events: {
        "click #loginBtn":"loginBtnClick",
        "click #registerBtn":"registerBtnClick"
    },

	initialize: function() {
	},

    render: function () {
        this.$el.html(this.template());
        
        return this;
    },

    loginBtnClick: function() {
        var username = $('#inputUsername', this.el).val();
        var password = $('#inputPassword', this.el).val();

        directory.controller.login(
            username,
            password,
            function(error) {
                if (error) {
                    console.log("LoginView: show error on login: " + error);
                } else {
                    console.log("LoginView: successful login: " + username);
                }
            }
        );
    },

    registerBtnClick: function() {
        var username = $('#inputUsername', this.el).val();
        var password = $('#inputPassword', this.el).val();
        
        directory.controller.register(
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
