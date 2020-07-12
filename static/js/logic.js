// Creating map object
var myMap = L.map("map", {
  center: [40.7, -94.5],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: "pk.eyJ1Ijoic2RldnVsYXBhbGxpIiwiYSI6ImNrYnhwcWxkNzA5cTgyc3FlaG5waXo3ZDYifQ.CiVyDRLhezZM0rF6E-6x8A"
}).addTo(myMap);

var baseUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(baseUrl, function(data) {

function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

function getColor(magnitude) {
  switch (true) {
    case magnitude > 5:
      return "#ff9933";
    case magnitude > 4:
      return "#cc6600";
    case magnitude > 3:
      return "#804000";
    case magnitude > 2:
      return "#4d2600";
    case magnitude > 1:
      return "#1a0d00";
    default:
      return "#fff2e6";
  }
}

function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}

// Add GeoJSON layer to the map once the file is loaded.
L.geoJson(data, {
  //circleMarker on the map.
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng);
  },
  // Ststyle for each circleMarker using our styleInfo function.
  style: styleInfo,
Create popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
  onEachFeature: function (feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
}).addTo(myMap);

var legend = L.control({
  position: "bottomright"
});

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  magnitude = [0, 1, 2, 3, 4, 5]
  colors = ["#fff2e6", "#1a0d00", "#4d2600", "#804000", "#cc6600", "#ff9933"]
  for (var i = 0; i < magnitude.length; i++) {
    div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      magnitude[i] + (magnitude[i + 1] ? "&ndash;" + magnitude[i + 1] + "<br>" : "+");
  }
  return div;
}
legend.addTo(myMap);
})