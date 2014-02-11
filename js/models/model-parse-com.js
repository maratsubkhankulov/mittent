Parse.initialize("n13nQ6Xc6nbA1GMydEdUzC5CktBp99yEjws8LVep", "9CKAb8qfYVThFJy1qVd1jQsL8VzULET5MrU0O527");

directory.Day = Parse.Object.extend({
    className: "Day"
});

directory.DayCollection = Parse.Collection.extend({

    model: directory.Day

});

directory.Span = Parse.Object.extend({
    className: "Span"
});