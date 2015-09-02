//======================================================================================//
// Global Variables														         		//
//======================================================================================//
var map;

//======================================================================================//
// Map Initialization Code and AppViewModel start										//
//======================================================================================//
//Function to initialize map and kicks off appViewModel at the end
function initializePage() {
	//Defines and initializes the map
	var mapOptions = {
    	center: { lat: 39.091, lng: -94.575}, //coordinates for Kansas City, MO
    	zoom: 10  	
    };
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    //Loads appViewModel
    ko.applyBindings(new appViewModel());
}
   
//On page load, this function is ran to load the Google Maps API asynchronously with a 
//callback to initialize the page  
function loadScript() {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAkjSGsHMm6wKUCnIE6_nIqqzMUZtkciEE&callback=initializePage';
	document.body.appendChild(script);
}

//======================================================================================//
// Application View Model																//
//======================================================================================//
function appViewModel() {
	var self = this;
	
	//Key variables
	this.kcMeetUpsArray = []; //Stores complete list of meetups
	this.displayMeetUps = ko.observableArray([]); //Stores meetups to be displayed in the active list
	this.markersArray = [];  //Stores the map markers of the meetups in the active list
	this.searchInput = ko.observable(); //Search input box
	this.numberOfSearchResults = ko.observable(1); //Stores # of search results used to display msg to user if 0
	
	//Performs API call to get runner meet up information, checks if next event is
	//empty before pushing to the array as some events do not have this property.
	//This function only gathers the MeetUps and stores them   
	function getLocalMeetUps() {
		var meetupRequestTimeOut = setTimeout(function() {
			alert('Failed to load MeetUp resources. Please refresh and try again.');
		}, 5000);
		var meetUpUrl = 'https://api.meetup.com/find/groups?photo-host=public&zip=64101&page=50&sig_id=190627894&radius=25&sig=4f37ad06f508b2b54139e07a6769491ce610e155';
		$.ajax({
			url: meetUpUrl,
    		dataType: 'jsonp',
    		success: function(response) {
				var responseLength = response.data.length;	
				for(var i=0; i<responseLength; i++) {
					if (typeof response.data[i].category != 'undefined') {
						self.kcMeetUpsArray.push({
							Id: response.data[i].id,
							Name: response.data[i].name,
							Link: response.data[i].link,
							Description: response.data[i].description,
							Lat: response.data[i].lat,
							Lon: response.data[i].lon,
							ForWho: response.data[i].who,
							Category: response.data[i].category.name
						}); 
					}
				}
				loadAllMeetUps();
				clearTimeout(meetupRequestTimeOut);
    		}
		});
	}   
	
	//Load all of the meetups and associated map markers to the page for first page load
	//"non filtered" results
	function loadAllMeetUps() {
		var len = self.kcMeetUpsArray.length;
		for(var i=0;i<len; i++) { 
			var location = { lat: self.kcMeetUpsArray[i].Lat, lng: self.kcMeetUpsArray[i].Lon};
			var name = self.kcMeetUpsArray[i].Name;
			var description = self.kcMeetUpsArray[i].Description;
			var who = self.kcMeetUpsArray[i].ForWho;
			var link = self.kcMeetUpsArray[i].Link;
			addMarker(location, name, description, who, link);
			self.displayMeetUps.push(self.kcMeetUpsArray[i]);
		}
	}

//======================================================================================//
// Filtering Controls   																//
//======================================================================================//
	//Function is called when users clicks search to filter results
	this.searchFilter = function() {
		var input = self.searchInput();
		var listArray = self.kcMeetUpsArray;
		var listLen = self.kcMeetUpsArray.length;
		self.numberOfSearchResults(1); //Reset variable to clear 'no results' message
		
		//Ensures input text is not null, blank or whitespace
		if(input != null && input != '' && input.trim() != '') {
			input = input.trim().toLowerCase();
			//Clear display array and active map markers
			self.displayMeetUps.removeAll();
			removeAllMarkers();
			//For loop gathers data based on search input to regenerate active list
			//and active map markers
			for(var i=0;i<listLen;i++){
				var nameLowerCase = listArray[i].Name.toLowerCase();
				//Looks for meetups that start with the search input, those results are
				//then displayed on map and list
				if(nameLowerCase.indexOf(input) == 0){
					var location = { lat: listArray[i].Lat, lng: listArray[i].Lon};
					var name = listArray[i].Name;
					var description = listArray[i].Description;
					var who = listArray[i].ForWho;
					var link = listArray[i].Link;
					self.displayMeetUps.push(listArray[i]);
					addMarker(location, name, description, who, link);
				}
			}
			self.numberOfSearchResults(self.displayMeetUps().length);
		} else {
			alert("Please enter valid search input.");
		}
	}
	
	//Clear all search filter, reset lists and map markers to display all meetups
	this.resetFilter = function() {
		//Clear list, reset input box and clear markers
		removeAllMarkers();
		self.displayMeetUps.removeAll();
		self.searchInput('');
		self.numberOfSearchResults(1); //Reset variable to clear 'no results' message
		
		//Re-populate all meetups to the list and and markers to the page from kcmeetupsarray
		loadAllMeetUps();
	}
//======================================================================================//
// Map Marker Controls    																//
//======================================================================================//
	//Adds single marker to the map and pushes it onto the markersArray
	function addMarker(location, name, description, who, link) {
		//Contains MeetUp info for the map marker info window
		var contentString = '<div id="content">'+
      	'<h1 class="name">' + name + '</h1>'+
      	'<hr>' +
      	'<h4 class="type">MeetUp Type: <span class="typestyle">' + who + '</span></h4>'+
      	'<h4 class="link">MeetUp Link: <span class="linkstyle"><a href="' + link + 
      	'" target="_blank">Click here</a></span></h4>'+
      	'<div class="bodyContent">'+
      	'<p>' + description + '</p>'+
      	'</div>'+
      	'</div>';
		var infowindow = new google.maps.InfoWindow({
    		content: contentString,
    		maxWidth: 400,
    		maxHeight: 400
  		});
		var marker = new google.maps.Marker({
			animation: google.maps.Animation.DROP,
      		position: location,
      		map: map,
      		title: name,
  		});
  		//Listener to display info window when clicked
  		marker.addListener('click', function() {
  			marker.setAnimation(google.maps.Animation.DROP);
    		infowindow.open(map, marker);
  		});
  		self.markersArray.push(marker);
	}
	
	//Remove all markers from map and clears markersArray
	function removeAllMarkers() {
  		var len = self.markersArray.length;
  		for (var i = 0; i < len; i++) {
    		self.markersArray[i].setMap(null);
  		}
  		self.markersArray = [];
	}
	
	//Linked to MeetUp object in the list, click animates marker
	//selected is the associated MeetUp object that is passed to the function
	this.highliteMarker = function(selected) {
		//Get array position in displayMeetUps as the associated map marker is in the 
		//same position in the marker array
		var position = self.displayMeetUps().indexOf(selected);
		var markersLen = self.markersArray.length;
		for(var i=0;i<markersLen;i++) {
			self.markersArray[i].setAnimation(null);
		}
		self.markersArray[position].setAnimation(google.maps.Animation.BOUNCE);
	}
	//Kicks off actions to generate MeetUp data, list and map markers
	getLocalMeetUps();
}

//Kicks off map and data initialization
window.onload = loadScript;
	

						
