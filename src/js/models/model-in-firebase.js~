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

directory.checkLogin = function() {
    function authDataCallback(authData) {
      if (authData) {
        console.log("User " + authData.uid + " is logged in with " + authData.provider);
        directory.controller.setLoggedIn(true);
        directory.controller.setUsername(authData.password.email);
      } else {
        console.log("User is logged out");
      }
    }

    // Register the callback to be fired every time auth state changes
    var ref = new Firebase(directory.firebaseAppUrl);
    ref.onAuth(authDataCallback); 
}

directory.unauth = function() {
    var ref = new Firebase(directory.firebaseAppUrl);
    ref.unauth();
}

