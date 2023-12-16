let map ;
  var markers = [];
  async function getBusLocations(){
      var url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip';	
      var response = await fetch(url);
      var json     = await response.json();
      return json.data;
  }
  
  async function renderBuses(){
      var buses = await getBusLocations();
      buses.forEach(function(bus){
          var marker = markers.find(function(marker){
              return marker.id == bus.id;
          });
          var icon = bus.attributes.direction_id == 0 ? 'Red.jpeg' : 'Black.jpg';
          if (marker){
  
              marker.setIcon(icon);
              // move bus icon to the new location
              marker.setPosition({
                  lat: bus.attributes.latitude,
                  lng: bus.attributes.longitude
              });
          }
          else{
              var newMarker = new google.maps.Marker({
                  position: {
                      lat: bus.attributes.latitude,
                      lng: bus.attributes.longitude
                  },
                  map: map,
                  icon: icon,
                  id: bus.id
              });
              markers.push(newMarker);
          }
  
      });
      // Timer to refresh the bus location every 15 seconds
      setTimeout(renderBuses, 15000);
  }
  
  async function initMap(){
    const { Map } = await google.maps.importLibrary("maps");
      map = new Map(document.getElementById('map'), {
          zoom: 12,
          center: new google.maps.LatLng(42.352271, -71.05524200000001),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        renderBuses();
  }

  window.onload = initMap;