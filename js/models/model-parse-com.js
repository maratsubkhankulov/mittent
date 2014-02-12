Parse.initialize("n13nQ6Xc6nbA1GMydEdUzC5CktBp99yEjws8LVep", "9CKAb8qfYVThFJy1qVd1jQsL8VzULET5MrU0O527");

directory.Span = Parse.Object.extend({
    className: "Span",

    initialize: function() {
        this.days = new directory.DayCollection();
        this.days.query = new Parse.Query(directory.Day).equalTo("spanId", this.id);
    }
});

directory.Day = Parse.Object.extend({
    className: "Day"
});

directory.DayCollection = Parse.Collection.extend({

    model: directory.Day//,

    /*fetch: function(options) {
        console.log('custom fetch');
        if (options.data && options.data.name) {
            var firstNameQuery = new Parse.Query(directory.Employee).contains("firstName", options.data.name);
            var lastNameQuery = new Parse.Query(directory.Employee).contains("lastName", options.data.name);
            this.query = Parse.Query.or(firstNameQuery, lastNameQuery);
        }
        Parse.Collection.prototype.fetch.apply(this, arguments);

    }*/

});