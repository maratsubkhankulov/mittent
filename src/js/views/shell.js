directory.ShellView = Backbone.View.extend({

    events: {
        'click #logout-nav-btn':'logoutBtnClick',
    },

    initialize: function () {
    },

    render: function () {
        this.$el.html(this.template());
        this.update();

        return this;
    },

    update: function() {
        if (directory.controller.isLoggedIn()) {
            $('#login-nav-btn', this.el).hide();
            $('#logout-nav-btn', this.el).show();
        } else {
            $('#login-nav-btn', this.el).show();
            $('#logout-nav-btn', this.el).hide();
        }
    },

    selectMenuItem: function(menuItem) {
        $('.navbar .nav li').removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    },

    setTitle: function(title) {
        console.log("Set shell title to " + title);
        $('#title').text(title);
    },

    logoutBtnClick: function() {
        console.log("Logout button click");
        directory.controller.logout();
    }

});
