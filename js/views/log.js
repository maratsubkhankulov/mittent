directory.LogView = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.model, 'add', this.addOne);
    },
    
    render: function () {
        this.$el.html(this.template());

        //For use with in-memory model
        _.each(this.model.models, function (entry) {
            console.log("Each entry:" + entry);
            this.addOne(entry);
        }, this);

        
        return this;
    },

    addOne: function(entry) {
        var view = new directory.LogEntryView({model: entry});
        $("#log-list", this.$el).append(view.render().el);
    }
});
