directory.ShellView = Backbone.View.extend({

    initialize: function () {
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    events: {
    },

    search: function (event) {
    },

    onkeypress: function (event) {
        if (event.keyCode === 13) { // enter key pressed
            event.preventDefault();
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
    }

});