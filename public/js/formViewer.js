function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var FormViewer = angular.module('FormViewer', [])

.controller('MainCtrl', function($scope, API){
	$scope.Loading = true;
	API.GetFormById(getParameterByName('formID')).then(function(response) {
		if (response.data.success) {
			if (response.data.forms[0].isLive) {
				$scope.Form = response.data.forms[0];
				$scope.PinMatched = true;
				if ($scope.Form.secured) {
					$scope.PinMatched = false;
				};
			} else {
				$scope.Form = {offline : true, message : 'This form is current offline'};
			}
			$scope.Loading = false;
		} else {
			alert(response.data.message);
		}
	});

	$scope.FormModel = {};
	$scope.form = {};

	$scope.SubmitForm = function() {
		$scope.Loading = true;
		API.PostFormResponse($scope.Form._id, $scope.FormModel).then(function(response) {
			if (response.data.success) {
				alert(response.data.message);
				$scope.Loading = false;
				$scope.FormModel = {};
				$scope.form.UserForm.$setUntouched();
			} else {
				alert('Something went wrong, please try again.');
			}
		});
	}

	$scope.SubmitPIN = function() {
		if ($scope.PIN == $scope.Form.pin) {
			$scope.PinMatched = true;
		} else {
			alert('Incorrect pin');
		}
	}
})