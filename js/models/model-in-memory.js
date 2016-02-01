directory.Entry = Backbone.Model.extend({
    initialize:function () {
    },

    sync: function(method, model, options) {
        if (method === "create") {
            console.log("Get log entry: " + options.data);
            directory.store.findDayByDateAndSpanId(this.id, function (data) {
                options.success(data);
            });
        }
    }
});

directory.EntryCollection = Backbone.Collection.extend({
    model: directory.Entry,

    sync: function(method, model, options) {
        if (method === "read") {
            options.success(directory.store.logEntries);
        }
    }
});

directory.Day = Backbone.Model.extend({
    initialize:function () {
    },

    sync: function(method, model, options) {
        if (method === "read") {
            console.log("Get day: " + options.data.spanId + " " + options.data.date);
            directory.store.findDayByDateAndSpanId(this.id, function (data) {
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

    this.findDayByDateAndSpanId = function (dateAndSpanId, callback) {
        //console.log("Find day by date, spanId: " + dateAndSpanId[0]);
        var days = this.days;
        var day = null;
        var l = days.length;
        for (var i = 0; i < l; i++) {
            console.log("Comparing spanId: " + days[i].spanId + "=" + dateAndSpanId[0]);
            if (days[i].spanId === dateAndSpanId[0]) {
                //console.log("Comparing date strings: " + days[i].date + "=" + dateAndSpanId[1]);
                var date1 = directory.newDate(directory.formatDateStr(days[i].date));
                var date2 = directory.newDate(dateAndSpanId[1]);
                //console.log("Comparing date: " + date1 + "=" + date2);
                if (date1.getTime() == date2.getTime()) {
                    day = days[i];
                    break;
                }
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

    this.days = [
        {"id": 1, "spanId":"xz5yra", "date": "2014-02-08", "quote": "carpe diem", "author": "Horace", "pic":"img/elder.jpg", "sound":"api.soundcloud.com/tracks/76255568", "viewed":true},
        {"id": 2, "spanId":"xz5yra", "date": "2014-02-09", "quote": "isn't that the whole point?", "author": "Barack Obama", "pic":"img/corfu2.jpg", "sound":"api.soundcloud.com/tracks/28284290", "viewed":false},
        {"id": 3, "spanId":"xz5yra", "date": "2014-02-10", "quote": "I know how hard it is for you to put food on your family.", "author": "George Bush", "pic":"img/cow.jpg", "sound":"api.soundcloud.com/tracks/123450519", "viewed":false},
        {"id": 4, "spanId":"xz5yra", "date": "2014-02-11", "quote": "Imagination is more important than knowledge", "author": "Albert Einstein", "pic":"img/ten.jpg", "sound":"api.soundcloud.com/tracks/20389181", "viewed":false}
    ];

    this.spans = [
        {"id": "xz5yra", "startDate": "2014-01-08", "endDate": "2014-02-11", "publicId":"xz5yra"},
        {"id": "asdfasd", "startDate": "2014-02-03", "endDate": "2014-02-10", "publicId":"asdfasd"},
        {"id": "234dfsd", "startDate": "2014-02-15", "endDate": "2014-02-20", "publicId":"234dfsd"}
    ];

    this.logEntries = [
        {"id": "1", "datetime": "2016-02-01 20:00", "comment": "Papa John's Pizza"},
        {"id": "2", "datetime": "2016-02-01 14:00", "comment": "Mixed grain salad"},
        {"id": "3", "datetime": "2016-02-02 19:00", "comment": "Steamed tofu"}
    ];

    callLater(successCallback);

};

directory.store = new directory.MemoryStore();
