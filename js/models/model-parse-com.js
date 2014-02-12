Parse.initialize("n13nQ6Xc6nbA1GMydEdUzC5CktBp99yEjws8LVep", "9CKAb8qfYVThFJy1qVd1jQsL8VzULET5MrU0O527");

directory.Span = Parse.Object.extend({
    className: "Span",

    initialize: function() {
        this.days = new directory.DayCollection();
        this.days.query = new Parse.Query(directory.Day).equalTo("spanId", this.id);
    }
});

directory.Day = Parse.Object.extend({
    className: "Day",

    fetch: function(options, callbacks) {
    	console.log('Fetch Day by spanId and date');
    	if (options.data && options.data.spanId && options.data.date) {
    		console.log('Fetch Day by ' + options.data.spanId + ", " + options.data.date);
            var myQuery = new Parse.Query(directory.Day).equalTo("spanId", options.data.spanId);
            myQuery.equalTo("date", options.data.date);
            myQuery.find({
            	success: function(results) {
            		console.log("Successfully retrieved day");
            		console.log(results);
            		this.attibutes = results[0].attributes;
            		callbacks.success(results[0]);
            	},
            	error: function(error) {
            		console.log("Error " + error.code + " " + error.message);
            	}
            })
            //this.query = myQuery;
        }
        //Parse.Object.prototype.fetch.apply(this, arguments);
    }
});

directory.DayCollection = Parse.Collection.extend({

    model: directory.Day//,

    /*fetch: function(options) {
        console.log('custom fetch');
        if (options.data && options.data.) {
            var firstNameQuery = new Parse.Query(directory.Employee).contains("firstName", options.data.name);
            var lastNameQuery = new Parse.Query(directory.Employee).contains("lastName", options.data.name);
            this.query = Parse.Query.or(firstNameQuery, lastNameQuery);
        }
        Parse.Collection.prototype.fetch.apply(this, arguments);
    }*/

});