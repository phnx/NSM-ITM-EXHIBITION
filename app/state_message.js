module.exports = {

	state_1: function(userResponse) {
		var messageTag = 'Please enter zone (A, B, C, D, E, F):';

		if (userResponse == null) {
			return messageTag;
		} else {
			var expected_answer = ['A', 'B', 'C', 'D', 'E', 'F'];

			if(	expected_answer.indexOf(userResponse) != -1 ) 
				return userResponse;
			else 
				return false;

	    }

	}, 
	state_2: function(exhibitList, userResponse) {
		var messageTag = 'Please choose an exhibit from the list:' + exhibitList;

		if (userResponse == null) {
			return messageTag;
		} else {
			var expected_answer = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

			if(	expected_answer.indexOf(userResponse) != -1 ) 
				return userResponse;
			else 
				return false;
	    }
	    
	},
	state_3: function(userResponse) {
		var messageTag = 'Please enter detail information:';

		if (userResponse == null) {
			return messageTag;
		} else {
			if(	userResponse != '') 
				return userResponse;
			else 
				return false;
			
	    }
	    
	},
	state_4: function(userResponse) {
		var messageTag = 'Please enter repair information (if exists):';

		if (userResponse == null) {
			return messageTag;
		} else {
			if(	userResponse != '') 
				return userResponse;
			else 
				return false;
	    }
	    
	},
	state_5: function(userResponse) {
		var messageTag = 'Please enter technician\'s name (if exists):';

		if (userResponse == null) {
			return messageTag;
		} else {
			if(	userResponse != '') 
				return userResponse;
			else 
				return false;
	    }
	    
	},
	state_6: function(userResponse) {
		var messageTag = 'Please review and confirm your report (type Y to confirm):';

		if (userResponse == null) {
			return messageTag;
		} else {
			var expected_answer = ['Y', 'N'];

			if(	expected_answer.indexOf(userResponse) != -1 ) 
				return userResponse;
			else 
				return false;
	    }
	    
	},
	state_7: function(userResponse) {
		var messageTag = 'Do you want to report other exhibit? (type Y to return to menu, N to exit):';

		if (userResponse == null) {
			return messageTag;
		} else {
			var expected_answer = ['Y', 'N'];

			if(	expected_answer.indexOf(userResponse) != -1 ) 
				return userResponse;
			else 
				return false;

	    }
	    
	},

};