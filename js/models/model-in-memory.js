directory.Day = Backbone.Model.extend({
    initialize:function () {
    },

    sync: function(method, model, options) {
        if (method === "read") {
            directory.store.findById(parseInt(this.id), function (data) {
                options.success(data);
            });
        }
    }
});

directory.DayCollection = Backbone.Collection.extend({

    model: directory.Day,

    sync: function(method, model, options) {
        if (method === "read") {
            directory.store.findDaysBySpanId(this.parent.id, function (data) {
                options.success(data);
            });
        }
    }

});

directory.Span = Backbone.Model.extend({
    initialize:function () {
        this.days = new directory.DayCollection();
        this.days.parent = this;
    },

    sync: function(method, model, options) {
        if (method === "read") {
            directory.store.findSpanById(this.id, function (data) {
                options.success(data);
            });
        }
    }
});

directory.MemoryStore = function (successCallback, errorCallback) {

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

    this.findSpanById = function (id, callback) {
        var spans = this.spans;
        var span = null;
        var l = spans.length;
        for (var i = 0; i < l; i++) {
            if (spans[i].id === id) {
                span = spans[i];
                break;
            }
        }
        callLater(callback, span);
    }

    this.findDaysBySpanId = function (spanId, callback) {
        var days = this.days;
        var dayCollection = this.days.filter(function (element) {
            return spanId === element.spanId;
        });
        callLater(callback, dayCollection);
    }

    // Used to simulate async calls. This is done to provide a consistent interface with stores that use async data access APIs
    var callLater = function (callback, data) {
        if (callback) {
            setTimeout(function () {
                callback(data);
            });
        }
    }

    this.days = [
        {"id": 1, "spanId":"span1", "date": "2014-01-21", "quote": "carpe diem", "author": "Lao Tzu", "pic":"img/elder.jpg", "sound":"api.soundcloud.com/tracks/76255568", "viewed":false},
        {"id": 2, "spanId":"span1", "date": "2014-01-22", "quote": "carpe diem", "author": "Lao Tzu", "pic":"imageurl.jpg", "sound":"soundcloudurl", "viewed":false},
        {"id": 3, "spanId":"span1", "date": "2014-01-23", "quote": "carpe diem", "author": "Lao Tzu", "pic":"imageurl.jpg", "sound":"soundcloudurl", "viewed":false},
        {"id": 4, "spanId":"span2", "date": "2014-01-10", "quote": "carpe diem", "author": "Lao Tzu", "pic":"imageurl.jpg", "sound":"soundcloudurl", "viewed":false}
    ];

    this.spans = [
        {"id": "span1", "startDate": "2014-01-21", "endDate": "2014-02-01", "publicId":"somePublicId"},
        {"id": "span2", "startDate": "2014-02-03", "endDate": "2014-02-10", "publicId":"somePublicId"},
        {"id": "span3", "startDate": "2014-02-15", "endDate": "2014-02-20", "publicId":"somePublicId"}
    ]

    callLater(successCallback);

};

directory.store = new directory.MemoryStore();