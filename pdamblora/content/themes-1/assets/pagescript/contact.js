var protocol = location.protocol;
var slashes = protocol.concat("//");
var host = slashes.concat(window.location.hostname);

var urlAccess = host + "/--action/maps";

var map;

$.get(urlAccess, function (data) {
  console.log(JSON.parse(data));
  var dataMaps = JSON.parse(data);

  var LatLng = {
    lat: Number(dataMaps.kooridnat[0].lat),
    lng: Number(dataMaps.kooridnat[0].lng),
  };

  var mapsOptions = {
    zoom: 9,
    center: LatLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  map = new google.maps.Map(document.getElementById("map_canvas"), mapsOptions);

  setMarkers(map, dataMaps.kooridnat);

  // clickMarker(1, "-8.483462||115.098575");
});

var arrayInfoWindows = [];
var arrayMarkers = [];

function setMarkers(map, locations) {
  var marker, i;

  for (i = 0; i < locations.length; i++) {
    var lat = locations[i].lat;
    var lng = locations[i].lng;

    latlngset = new google.maps.LatLng(lat, lng);

    var marker = new google.maps.Marker({
      map: map,
      title: locations[i].name,
      position: latlngset,
    });
    // map.setCenter(marker.getPosition())

    var content =
      "<div>" +
      "<h3>" +
      locations[i].name +
      "</h3>" +
      '<div id="bodyContent">' +
      "<p><b>Alamat : </b> " +
      locations[i].alamat +
      "<br>" +
      "<b>Telp</b> : " +
      locations[i].telp +
      "<br>" +
      "<b>Fax</b> : " +
      locations[i].fax +
      "<br>" +
      "<b>Email</b> : " +
      locations[i].email +
      "</p>" +
      "</div>" +
      "</div>";

    var infowindow = new google.maps.InfoWindow({ maxWidth: 400 });

    arrayInfoWindows.push(infowindow);
    //
    google.maps.event.addListener(
      marker,
      "click",
      (function (marker, content, infowindow) {
        return function () {
          clearInfoWindor();
          infowindow.setContent(content);
          infowindow.open(map, marker);
        };
      })(marker, content, infowindow)
    );

    arrayMarkers.push(marker);
  }
}

function clearInfoWindor() {
  for (var i = 0; i < arrayInfoWindows.length; i++) {
    arrayInfoWindows[i].close();
  }
}

$(".checkUnit").click(function () {
  var ind = $(this).attr("data-index");
  var lokasi = $(this).attr("data-koordinat");

  split_koor = lokasi.split("||");
  console.log(split_koor);
  map.setCenter(
    new google.maps.LatLng(parseInt(split_koor[0]), parseInt(split_koor[1]))
  );
  // map.setCenter({lat:parseInt(split_koor[0]), lng:parseInt(split_koor[1])});
  google.maps.event.trigger(arrayMarkers[ind], "click");

  return false;
});

// var LatLng = {lat: -34.397, lng: 150.644};

// // var latlng = new google.maps.LatLng(-34.397, 150.644);
//    var mapsOptions = {
//      zoom: 8,
//      center: LatLng,
//      mapTypeId: google.maps.MapTypeId.ROADMAP
//    };
//    var map = new google.maps.Map(document.getElementById("map_canvas"),mapsOptions);

//    var contentString = '<div id="content">'+
//            '<div id="siteNotice">'+
//            '</div>'+
//            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
//            '<div id="bodyContent">'+
//            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
//            'sandstone rock formation in the southern part of the '+
//            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
//            'south west of the nearest large town, Alice Springs; 450&#160;km '+
//            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
//            'features of the Uluru - Kata Tjuta National Park. Uluru is '+
//            'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
//            'Aboriginal people of the area. It has many springs, waterholes, '+
//            'rock caves and ancient paintings. Uluru is listed as a World '+
//            'Heritage Site.</p>'+
//            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
//            'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
//            '(last visited June 22, 2009).</p>'+
//            '</div>'+
//            '</div>';

//    var infowindow = new google.maps.InfoWindow({
//      content: contentString
//    });

//    var marker = new google.maps.Marker({
//      position: myLatLng,
//      map: map,
//      title: 'Hello World!'
//    });

//    marker.addListener('click', function() {
//      infowindow.open(map, marker);
//    });
