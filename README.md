Application Description
=======================
The purpose of the neighborhood map project is to display as many as 50 social MeetUp
groups in the Kansas City area. The data comes from a free API from http://www.meetup.com/.
The types of MeetUp social groups vary from all things hiking, gaming, running, etc. The 
information included are name, link, description, latitude, longitude, "for who" and
category.

API Functionality
-----------------
*GoogleMaps API Call* - The GoogleMaps API is loaded after the window.onload event
asynchronously. The callback function (initializePage) then loads the map to the page with 
Kansas City, MO as the central coordinates. The last step of the callback function is to 
kick off the appViewmodel.

*MeetUp API Call* - The API call is done via an ajax call with a setTimeout incorporated 
should the call fail. If successful, the ajax call will check to ensure the MeetUp record 
has a category label before inserting the record into an array. All of the records are 
stored in the KcMeetUpsArray as a reference for the rest of the code.

Code Structure
--------------
Application code is divided up into 3 files: index.html, app.js and maps.css.

*index.html* -  This file is simple and only contains the html, required header information
and libraries, included js files and Knockoutjs bindings.

*app.js* - Controls key functionality for the MeetUp list, searching abilities and marker
manipulation. The code in this file is essentially divided up into 4 sections: 
1-Page Initialization (loads Google API, map and kicks off appViewModel)
2 - Data Load (makes MeetUp API call, stores the data and loads it to the page)
3 - Filtering Controls (handles functionality for searching MeetUp names initiated by the 
search button and reset button)
4 - Map Marker (contains code to add markers to the page, remove markers and animates
markers when list elements are clicked)

*maps.css* - Basic CSS for page styling and formatting. Does contain a break point for 
max-width of 480px for smaller devices (removes the MeetUp list leaving only the search
input field and the 2 buttons).

*libs* - Contains 2 libraries used for development: Knockoutjs and jQuery

User Functionality
------------------
*On Page Load* - At page load, the Meetup list located on the right vertical box will contain
all downloaded MeetUp groups (as many as 50). Each MeetUp will contain the MeetUp name and
category. The associated map markers will drop onto the page.

*The MeetUp List* - The list will contain all available MeetUp groups. At page load it will
display all groups. When filtered, only those meeting the user search criteria will be displayed.
The MeetUp elements will highlight when user hovers over each one. When user clicks on an
element, this will cause the associated map marker to bounce. If user clicks on the list
element again, the marker will stop bouncing. If the user clicks on another list element,
the previous one will stop bouncing and the new map marker will start bouncing.

*Filtering* - The user must enter at least 1 non-blank space character to filter the results.
An error will be displayed to the user otherwise. Once user enters valid search criteria and
clicks 'Search', the MeetUp list will be refreshed with those MeetUps that meet the search
criteria. Specifically, those MeetUp groups where the MeetUp name starts with the entered 
search criteria. Additionally, the map markers will also reflect those MeetUps in the refreshed
MeetUp list. Each 'Search' is done over all of the MeetUp groups. So if you do back to back
searches, it won't be based on the previous search results. Clicking on the 'Reset' button 
will clear the map markers and MeetUp list, then reload all of the MeetUps to the page.

*Map Markers* - Map markers will only be present if the associated MeetUp group is listed on
the MeetUp list. Clicking on the map marker will cause the marker to animate with a 'drop'
followed with the info window popping up. The info window contains the MeetUp group name,
type, link and information passed in the description from the API call.

*Notable Mentions*
1 - Some of the MeetUp groups have the exact same location. As a result, it could appear
that there are fewer map markers than what is in the list. When in fact some of the map
markers are just on top of each other. This can be confirmed by clicking on the list elements
and seeing some of the map markers bounce from the same location.

2 - To accomodate smaller devices, CSS has been added to remove the MeetUp list when the
screen width is smaller than 480px. All of the search functionality will still be
present, however, the results will only be displayed via the map markers.

Acknowledgments
---------------
MeetUp data provided by MeetUp (http://www.meetup.com/) via use of their public and free
API.
