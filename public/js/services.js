


FormBuilder.factory('API', function($http, APIPATH, Local, Base64){
	return {
		NewUser : function(user) {
			// $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(user.username + ':' + user.password);
			return $http({
				method : 'POST',
				url : APIPATH + '/postUsers',
				data : user,
				headers : {'Content-Type': 'application/json'}
			});
		},
		CreateNewForm : function(form) {
			form.ownerEmail = Local.GetLogin().user.email;
			$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(Local.GetLogin().user.email + ':' + Local.GetLogin().user.password);
			return $http({
				method : 'POST',
				url : APIPATH + '/newForm',
				data : form,
				headers : {'Content-Type': 'application/json'}
			});
		},
		SaveForm : function(form) {
			form.ownerEmail = Local.GetLogin().user.email;
			$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(Local.GetLogin().user.email + ':' + Local.GetLogin().user.password);
			return $http({
				method : 'POST',
				url : APIPATH + '/saveForm',
				data : form,
				headers : {'Content-Type': 'application/json'}
			});
		},
		GetAllUserForms : function(user) {
			// $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(user.email + ':' + user.password);
			return $http({
				method : 'POST',
				url : APIPATH + '/getAllUserForms',
				data : user,
				headers : {'Content-Type': 'application/json'}
			});
		}
	};
})

.factory('APIPATH', function(){
	// return 'http://localhost:5000';
    return 'http://applififormbuilder.azurewebsites.net';
})

.factory('Local', function(){
	return {
		Store : function(usr) {
			if (!sessionStorage.AFB) {
				sessionStorage.AFB = '{}'
			};
			var temp = JSON.parse(sessionStorage.AFB);
			temp.user = usr;
			sessionStorage.AFB = JSON.stringify(temp);
		},
		CheckLogin : function() {
			if (sessionStorage.AFB) {
				if (JSON.parse(sessionStorage.AFB).user) {
					return true;
				}
			}
			return false;
			
		},
		GetLogin : function() {
			return JSON.parse(sessionStorage.AFB);
		}
	};
})

.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});