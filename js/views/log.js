directory.LogView = Backbone.View.extend({
    initialize: function() {
        this.$el.html(this.template());
        this.list = $("#log-list", this.$el);

        this.listenTo(this.model, 'add', this.addOne);
    },
    
    render: function () {
        console.log("LogView render");

        //For use with in-memory model
        /*_.each(this.model.models, function (entry) {
            console.log("Each entry:" + entry);
            this.addOne(entry);
        }, this);*/
        
        return this;
    },

    addOne: function(entry) {
        var view = new directory.LogEntryView({model: entry});
        this.list.append(view.render().el);
    }
});
