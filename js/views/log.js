directory.LogView = Backbone.View.extend({
    
    render:function () {
        console.log("LogView render");
        this.$el.html(this.template());

        _.each(this.model.models, function (entry) {
            var entryView = new directory.LogEntryView({model: entry}).render().el;
            $('#content', this.$el).append(entryView);
        }, this);
        
        return this;
    }
});
