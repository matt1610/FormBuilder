

var FormBuilder = angular.module('DataCapture', ['ui.bootstrap','colorpicker.module'])

.controller('MainCtrl', function($scope, $modal, $log, API, Local, APIPATH){

	$scope.Form = {fields : []};
	$scope.ShowBuilder = false;
	$scope.LoggedIn = Local.CheckLogin();
	$scope.Loading = false;
	$scope.APIPATH = APIPATH;

	$scope.Remove = function(ind) {
		$scope.Form.fields.splice(ind, 1);
	}

	$scope.Edit = function(item) {
		var modalInstance = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      resolve: {
	        Element: function() {
	        	return item;
	        }
	      }
	    });

	    modalInstance.result.then(function (element) {
	      console.log(element);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

	$scope.AddElementOptions = function (elem, type) {

	    var modalInstance = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      resolve: {
	        Element: function() {
	        	if (elem == 'radio' || elem == 'select') {
	        		return {elem : elem, type : type, options : [{}]}
	        	} else {
	        		return {elem : elem, type : type};
	        	}
	        	
	        }
	      }
	    });

	    modalInstance.result.then(function (element) {
	      $scope.Form.fields.push(element);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };


	  $scope.SignUpModal = function() {
		var modalInstance = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'signUpForm.html',
	      controller: 'SignUpModalCtrl',
	      resolve: {
	        User: function() {
	        	return {};
	        }
	      }
	    });

	    modalInstance.result.then(function (user) {
	    	$scope.Loading = true;
    		API.NewUser(user).then(function(response) {
				if (response.data.success) {
					$scope.LoggedIn = true;
					$scope.Message = response.data.message;
					Local.Store(user);
				} else {
					console.log(response)
				}
				$scope.Loading = false;
			});
			
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

	$scope.LoginModal = function() {
		var modalInstance = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'loginForm.html',
	      controller: 'LoginModalCtrl',
	      resolve: {
	        User: function() {
	        	return {};
	        }
	      }
	    });

	    modalInstance.result.then(function (user) {
    		$scope.FetchForms(user);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

	$scope.tabActivity=[false,false,false,false,false];

	$scope.EditInBuilder = function(form) {
		$scope.ShowBuilder = true;
		$scope.Form = form;
		for (var i = 0; i < $scope.AllForms.length; i++) {
			$scope.AllForms[i].selected = false;
		};
		form.selected = true;
		$scope.tabActivity[1] = true;
	}

	$scope.NewForm = function() {
		var modalInstance = $modal.open({
	      animation: $scope.animationsEnabled,
	      templateUrl: 'newForm.html',
	      controller: 'NewFormCtrl',
	      resolve: {
	        Form: function() {
	        	return {fields : []};
	        }
	      }
	    });

	    modalInstance.result.then(function (form) {
	      $scope.Loading = true;
	      $scope.ShowBuilder = true;
	      API.CreateNewForm(form).then(function(response) {
	      	if (response.data.message) {
	      		$scope.Form = response.data.form;
	      		if (!$scope.AllForms) {
	      			$scope.AllForms = [];
	      		};
	      		$scope.AllForms.push(response.data.form);
	      	};
	      	$scope.Loading = false;
	      })
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

	$scope.SaveCurrentForm = function() {
		$scope.Loading = true;
		API.SaveForm($scope.Form).then(function(response) {
			if (response.data.success) {
				$scope.Loading = false;
			} else {
				$scope.Error = {message : response.data.message};
			}
		});
	}

	$scope.ToggleLive = function() {
		$scope.Form.isLive = !$scope.Form.isLive;
		$scope.SaveCurrentForm();
	}

	$scope.FetchForms = function(user) {
		$scope.Loading = true;
		API.GetAllUserForms(user).then(function(response) {
			if (response.data.success) {
				$scope.AllForms = response.data.forms;
				Local.Store(user);
				$scope.ShowBuilder = false;
				$scope.LoggedIn = Local.CheckLogin();
			} else {
				$scope.Error = {message : response.data.message};
			}
			$scope.Loading = false;
			// $scope.Form = $scope.AllForms[0];
			// $scope.AllForms[0].selected = true;
			// $scope.ShowBuilder = true;
		});
	}

	$scope.GetMyForms = function() {
		// $scope.SaveCurrentForm();
		var user = Local.GetLogin().user;
		$scope.FetchForms(user);
	}

	if ($scope.LoggedIn) {
		$scope.GetMyForms();
	};

	console.log($scope);
	 

})


.controller('ModalInstanceCtrl', function ($scope, $modalInstance, Element) {

  $scope.Element = Element;

  $scope.ok = function () {
    $modalInstance.close($scope.Element);
  };

  $scope.EditInputName = function() {
  	$scope.Element.name = $scope.Element.label.replace(/[^A-Z0-9]/ig, '');
  }

  $scope.AddOption = function() {
  	$scope.Element.options.push({});
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

})

.controller('SignUpModalCtrl', function ($scope, $modalInstance, User, API) {

  $scope.User = User;

  $scope.CreateAccount = function () {
    $modalInstance.close($scope.User);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

})

.controller('LoginModalCtrl', function ($scope, $modalInstance, User, API) {

  $scope.User = User;

  $scope.LoginUser = function () {
    $modalInstance.close($scope.User);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

})

.controller('NewFormCtrl', function ($scope, $modalInstance, Form) {

  $scope.Form = Form;

  $scope.CreateForm = function () {
    $modalInstance.close($scope.Form);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});