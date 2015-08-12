function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var FormViewer = angular.module('FormViewer', [])

.controller('MainCtrl', function($scope, API){
	API.GetFormById(getParameterByName('formID')).then(function(response) {
		if (response.data.success) {
			$scope.Form = response.data.forms[0];
			console.log(response);
		} else {
			alert(response.data.message);
		}
	});

	$scope.FormModel = {};

	$scope.ShowModel = function() {
		console.log($scope.FormModel);
	}
})