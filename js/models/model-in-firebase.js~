directory.firebaseAppUrl = "https://mittent.firebaseio.com";

directory.Log = Backbone.Model.extend({
}); 

directory.LogCollection = Backbone.Firebase.Collection.extend({
    model: directory.Log,
    url: directory.firebaseAppUrl + "/logs/guest",

    initialize: function(init, props) {
        this.url = props.url;
    },
    comparator: function(log) {
        return -moment(log.get('datetime'));
    }
});

directory.Signup = Backbone.Model.extend({
}); 

directory.SignupCollection = Backbone.Firebase.Collection.extend({
    model: directory.Signup,
    url: directory.firebaseAppUrl + "/signups",
});


// Firebase specific utils
directory.authWithPassword = function(username, password, callback) {
    var ref = new Firebase(directory.firebaseAppUrl);
    ref.authWithPassword({
      email    : username,
      password : password
    }, callback);
}

directory.createUser = function(username, password, callback) {
    var ref = new Firebase(directory.firebaseAppUrl);
    ref.createUser({
      email    : username,
      password : password
    },
    callback);
}
