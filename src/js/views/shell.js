directory.ShellView = Backbone.View.extend({

    initialize: function () {
        /*if (Parse.User.current()) {
            $('#logoutBtn').show();
        } else {
            $('#logoutBtn').hide();
        }*/
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    events: {
        'click #logoutBtn':'logoutBtnClick',
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

    hideBackArrow: function() {
        console.log("hide back arrow");
        $('#backArrow').hide();
    },

    showBackArrow: function() {
        console.log("Show back arrow");
        $('#backArrow').show();
    },

    setBackButtonRoute: function(route) {
        console.log("Enable shell backbutton: " + route);
        $('#brand').attr('href', route);
    },

    showLogoutBtn: function() {
        $('#logoutBtn', this.el).show();
    },

    hideLogoutBtn: function() {
        $('#logoutBtn', this.el).hide();
    },

    logoutBtnClick: function() {
        directory.logout();
    }

});
