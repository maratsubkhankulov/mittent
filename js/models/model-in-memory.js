directory.Day = Backbone.Model.extend({
    initialize:function () {
    },

    sync: function(method, model, options) {
        if (method === "read") {
            console.log("Get day: " + this.id[0] + this.id[1]);
            directory.store.findDayByDateAndSpanId(this.id, function (data) {
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
        {"id": 1, "spanId":"span1", "date": "2014-02-08", "quote": "carpe diem", "author": "Horace", "pic":"img/elder.jpg", "sound":"api.soundcloud.com/tracks/76255568", "viewed":true},
        {"id": 2, "spanId":"span1", "date": "2014-02-09", "quote": "isn't that the whole point?", "author": "Barack Obama", "pic":"img/corfu2.jpg", "sound":"api.soundcloud.com/tracks/28284290", "viewed":false},
        {"id": 3, "spanId":"span1", "date": "2014-02-10", "quote": "I know how hard it is for you to put food on your family.", "author": "George Bush", "pic":"img/cow.jpg", "sound":"api.soundcloud.com/tracks/123450519", "viewed":false},
        {"id": 4, "spanId":"span1", "date": "2014-02-11", "quote": "Imagination is more important than knowledge", "author": "Albert Einstein", "pic":"img/ten.jpg", "sound":"api.soundcloud.com/tracks/20389181", "viewed":false}
    ];

    this.spans = [
        {"id": "span1", "startDate": "2014-01-21", "endDate": "2014-02-12", "publicId":"somePublicId"},
        {"id": "span2", "startDate": "2014-02-03", "endDate": "2014-02-10", "publicId":"somePublicId"},
        {"id": "span3", "startDate": "2014-02-15", "endDate": "2014-02-20", "publicId":"somePublicId"}
    ]

    callLater(successCallback);

};

directory.store = new directory.MemoryStore();