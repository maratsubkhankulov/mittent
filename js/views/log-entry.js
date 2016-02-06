directory.LogEntryView = Backbone.View.extend({
    
    tagName: "tr",
    events: {
        "click #removeBtn":"removeEntry"
    },

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
    },
    
    render:function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    
    removeEntry: function() {
        console.log("destroy!");
        this.model.destroy();
    }
});
