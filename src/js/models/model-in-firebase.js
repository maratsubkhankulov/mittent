directory.firebaseAppUrl = "https://mittent.firebaseio.com";

directory.Entry = Backbone.Model.extend({
    defaults: {
        datetime: "2016/02/06 11:12 PM",
        comment: "latte"
    }
});

// Create a Firebase.Collection and set the 'firebase' property
// to the URL of our database
directory.EntryCollection = Backbone.Firebase.Collection.extend({
    model: directory.Entry,

    url: directory.firebaseAppUrl,

    comparator: function(m) {
        return -moment(m.get('datetime'));
    }
});
