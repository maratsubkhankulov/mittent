directory.LogEntryView = Backbone.View.extend({
    
    tagName: "tr",
    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },
    
    render:function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});
