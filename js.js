var myApp = angular.module('DemoApp', ['firebase','ui.bootstrap']);

// myApp.constant("FIREBASE_URL", "https://codepen-public.firebaseio.com/firebase1demo/codepen/" )
myApp.constant("FIREBASE_URL", "https://4ge2eactions.firebaseio.com/" )

myApp.controller('DemoController', function($scope, $firebase, FIREBASE_URL) {
// Get Stored TODOs
    var todosRef = new Firebase(FIREBASE_URL);
    $scope.todos = $firebase(todosRef);
	
	$scope.persons = [
		"Sandeep", "Muhsin", "Prashanth", "Sudarshan", "Jason", "Wilfred", "Michiel", "Thiru"
	];
	$scope.person = "";
	
	
	// Disable weekend selection
	$scope.disabled = function(date, mode) {
		return( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
	};
	
	$scope.toggleMin = function() {
		$scope.minDate = $scope.minDate ? null : new Date();
	};
	$scope.toggleMin();
	
	$scope.clear = function () {
		$scope.date = null;
	};
	
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};
    // Update the "completed" status
    $scope.changeStatus   = function (item) {

        // Get the Firebase reference of the item
        var itemRef = new  Firebase(FIREBASE_URL + item.id);

        // Firebase : Update the item
        $firebase(itemRef).$set({
            id: item.id,
            name : item.name,
			person: item.person,
			date: item.date,
            completed: !item.completed
        });

    }

    // Remove a Todo
    $scope.removeItem   = function (index, item, event) {

       // Avoid wrong removing
       if (item.id == undefined)return;

       // Firebase: Remove item from the list
       $scope.todos.$remove(item.id);

    }

    // Add new TODO
    $scope.addItem  = function () {

        // Create a unique ID
        var timestamp = new Date().valueOf()

        // Get the Firebase reference of the item
        var itemRef = new Firebase(FIREBASE_URL + timestamp);

        $firebase(itemRef).$set({
            id: timestamp,
            name : $scope.todoName,
			person: $scope.todoPerson,
			date: $scope.todoDate.getTime(),
            completed: false
        });

        $scope.todoName = "";
		$scope.todoPerson = "";
		$scope.todoDate = "";
    }
	
    // ordering the list
	$scope.orderProp = 'person';
	$scope.direction = false;

	$scope.sort = function(column) {
      if ($scope.orderProp === column) {
        $scope.direction = !$scope.direction;
      } else {
        $scope.orderProp = column;
        $scope.direction = false;
      }
    }
});


myApp.filter('toArray', function () {
    'use strict';

    return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }

        return Object.keys(obj).map(function (key) {
            return Object.defineProperty(obj[key], '$key', {__proto__: null, value: key});
        });
    }
})
