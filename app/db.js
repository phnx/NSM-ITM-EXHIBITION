/*===============================================================*/
/*                      database functions                       */
/*===============================================================*/
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var db_state_table = 'user-state';
var db_master_table = 'exhibit-master';
var db_report_table = 'exhibit-report';

module.exports = {

	insertUserStateEntry: function(db, data, callback) {

		var col = db.collection(db_state_table);

   		col.insertOne({
				    	userID : data.userID,
						stateNumber : data.stateNumber,
						reportData : data.reportData,
						timestamp : data.timestamp
				   }, function(err, result) {

				   		assert.equal(err, null);
					    //console.log('insert new entry for ' + data.userID+' to ' +data.stateNumber);

					    callback(result);
					    db.close();
				   }
	    );

	},

	updateUserStateEntry: function(db, data, callback) {

		var col = db.collection(db_state_table);

   		col.updateOne({
				    	userID : data.userID
				    }, {
						$set: { 
							stateNumber : data.stateNumber,
							reportData : data.reportData,
							timestamp : data.timestamp
						}

 				   	}, function(err, result) {
						
						assert.equal(err, null);
					    //console.log('update entry for ' + data.userID+' to ' +data.stateNumber);

					    callback(result);
					    db.close();
				   }
	    );

                                                      

	},

	getUserState: function(db, data, callback) {
		var col = db.collection(db_state_table);

	    col.find({userID : data.userID}).limit(1).toArray(
	    	function(err, docs) {
							      assert.equal(null, err);
							      assert.ok(docs != null);

							      callback(docs);

							      db.close();
	    	}
	    );
	},

	setExhibitionMaster: function(db, callback) {
		// zone | exhibit_code | exhibit_name | exhibit_zone_code | status
		var col = db.collection(db_master_table);

	    col.insertMany([
	    				{zone : 'A', exhibit_code : 'A1', exhibit_zone_code : '1', exhibit_name : 'Exhibit Name A1', status : 'active' },
	    				{zone : 'A', exhibit_code : 'A2', exhibit_zone_code : '2', exhibit_name : 'Exhibit Name A2', status : 'active' },
	    				{zone : 'B', exhibit_code : 'B1', exhibit_zone_code : '1', exhibit_name : 'Exhibit Name B1', status : 'active' },
	    				{zone : 'B', exhibit_code : 'B2', exhibit_zone_code : '2', exhibit_name : 'Exhibit Name B1', status : 'active' },
	    				{zone : 'C', exhibit_code : 'C1', exhibit_zone_code : '1', exhibit_name : 'Exhibit Name C1', status : 'active' },
	    				{zone : 'C', exhibit_code : 'C2', exhibit_zone_code : '2', exhibit_name : 'Exhibit Name C1', status : 'active' },
	    				{zone : 'D', exhibit_code : 'D1', exhibit_zone_code : '1', exhibit_name : 'Exhibit Name D1', status : 'active' },
	    				{zone : 'D', exhibit_code : 'D2', exhibit_zone_code : '2', exhibit_name : 'Exhibit Name D1', status : 'active' },
	    				{zone : 'E', exhibit_code : 'E1', exhibit_zone_code : '1', exhibit_name : 'Exhibit Name E1', status : 'active' },
	    				{zone : 'E', exhibit_code : 'E2', exhibit_zone_code : '2', exhibit_name : 'Exhibit Name E1', status : 'active' },
	    				{zone : 'F', exhibit_code : 'F1', exhibit_zone_code : '1', exhibit_name : 'Exhibit Name F1', status : 'active' },
	    				{zone : 'F', exhibit_code : 'F2', exhibit_zone_code : '2', exhibit_name : 'Exhibit Name F1', status : 'active' },

	    				]
				   , function(err, result) {

				   		assert.equal(err, null);

					    callback(result);
					    db.close();
				   }
	    );


	},

	getExhibitMaster: function(db, zone, callback) {
		var col = db.collection(db_master_table);

		var criteria = {};
		if(zone != null) {
			criteria = {zone : zone};
		}

	    col.find(criteria).toArray(
	    	function(err, docs) {
							      assert.equal(null, err);
							      assert.ok(docs != null);

							      callback(docs);

							      db.close();
	    	}
	    );
	},

	insertExhibitReport: function(db, data, callback) {

		var col = db.collection(db_report_table);

   		col.insertOne({
				    	zone: data.zone,
				    	exhibit_zone_code: data.exhibit_zone_code,
				    	detail: data.detail,
				    	solution: data.solution,
				    	responsible_person: data.responsible_person,
				    	timestamp: new Date

				   }, function(err, result) {

				   		assert.equal(err, null);

					    callback(result);
					    db.close();
				   }
	    );

	},
	fillInExhibitReport: function(db, id, data, callback) {

		var col = db.collection(db_report_table);

   		col.updateOne({
				    	_id : ObjectId(id)
				    }, 
				    	data
 				   	, function(err, result) {
						
						assert.equal(err, null);

					    callback(result);
					    db.close();
				   }
	    );

   	},
};