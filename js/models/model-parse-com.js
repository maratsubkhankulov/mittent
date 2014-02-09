Parse.initialize("Rb10KjdAyAAnV0Z4f4ZjCpwIgDbPSp82UKJOhfga", "HxgeIqEaP4wPRHfwnIv1tqbwqRvwff2SEYQWP7TO");

directory.Request = Parse.Object.extend({

    className: "Request"

});

directory.RequestCollection = Parse.Collection.extend(({

    model: directory.Request

}));

directory.Person = Parse.Object.extend({

    className: "Person"

});

directory.PersonCollection = Parse.Collection.extend(({

    model: directory.Person

}));

directory.Request = Parse.Object.extend({

    className: "Employee"

});

directory.Payment = Parse.Object.extend({

	className: "Payment"

});

directory.EmployeeCollection = Parse.Collection.extend(({

    model: directory.Employee

}));

directory.ReportsCollection = Parse.Collection.extend(({

    model: directory.Employee

}));
