

FormViewer.factory('API', function(APIPATH, $http){
	return {
		GetFormById : function(id) {
			return $http({
				method : 'POST',
				url : APIPATH + '/getFormById',
				data : {id : id},
				headers : {'Content-Type': 'application/json'}
			});
		},
		PostFormResponse : function(id, response) {
			return $http({
				method : 'POST',
				url : APIPATH + '/postFormResponse',
				data : {id : id, response : response},
				headers : {'Content-Type': 'application/json'}
			});
		}
	};
})

.factory('APIPATH', function(){
	// return 'http://localhost:5000';
	return 'http://applififormbuilder.azurewebsites.net/';
})