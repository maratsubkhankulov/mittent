directory.Log = Backbone.Model.extend({

    sync: function(method, model, options) {
        if (method === "create") {
            console.log("Create: user in memory: " + model.toJSON());
            directory.store.users.push(model.toJSON());
        }
    }
}); 

directory.LogCollection = Backbone.Collection.extend({
    model: directory.Log,

    initialize: function() {
        directory.store.loadUsers(this);
    },

    sync: function(method, model, options) {
        if (method === "read") {
            options.success(directory.store.users);
        }
    },
});

// Firebase specific utils - mocked
directory.authWithPassword = function(username, password, callback) {
    _.each(directory.userCollection.models, function(user) {
        if (user.get('username') === username) {
            _user = user;
        }
    }); // if nothing found
    if (_user) {
        callback("", { uid : _user.get('uid') });
    } else {
        callback("Mock: unknown username: " + username); 
    }
}

directory.createUser = function(username, password, callback) {
    if (username === "admin") {
        return callback(null, { uid : "user234" });
    } else {
        return callback("Mock: incorrect username"); 
    }
}

directory.MemoryStore = function (successCallback, errorCallback) {

    this.loadEntryCollection = function(log) {
        log.models = [];
        _.each(this.logEntries, function(entry) {
            if (entry["uid"] === directory.controller._currentUid) {
                log.create(entry);
            }
        });
    }

    this.loadUsers = function(users) {
        _.each(this.users, function(user) {
            users.create(user);
        });
    }

    this.findById = function (id, callback) {
        var days = this.days;
        var day = null;
        var l = days.length;
        for (var i = 0; i < l; i++) {
            if (days[i].id === id) {
                day = days[i];
                break;
            }
        }
        callLater(callback, day);
    }
    // Used to simulate async calls. This is done to provide a consistent interface with stores that use async data access APIs
    var callLater = function (callback, data) {
        if (callback) {
            setTimeout(function () {
                callback(data);
            });
        }
    }

    this.logEntries = [
        {"uid": "user123", "id": "11", "datetime": "2016-02-14T20:50:09.056Z", "comment": "Fried tofu"},
        {"uid": "user123", "id": "12", "datetime": "2016-02-13T17:00:09.056Z", "comment": "Eggs benedict"},
        {"uid": "user123", "id": "13", "datetime": "2016-02-14T14:36:09.056Z", "comment": "Poo on a stick"},
        {"uid": "user123", "id": "14", "datetime": "2016-02-13T10:00:09.056Z", "comment": "Kitkat"},
        {"uid": "guest", "id": "4", "datetime": "2016-02-14T20:50:09.056Z", "comment": "Papa John's Pizza"},
        {"uid": "guest", "id": "2", "datetime": "2016-02-15T17:00:09.056Z", "comment": "Steamed tofu"},
        {"uid": "guest", "id": "7", "datetime": "2016-02-14T14:36:09.056Z", "comment": "Mixed grain salad"},
        {"uid": "guest", "id": "5", "datetime": "2016-02-15T10:00:09.056Z", "comment": "Coffee"},
    ];

    this.users = [
        {"uid": "guest", "username": "Guest"},
        {"uid": "user123", "username": "admin"}
    ];

    callLater(successCallback);
};

directory.store = new directory.MemoryStore();
