import Draw from 'ol/interaction/Draw';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { fromLonLat, transform } from 'ol/proj';
import Overlay from 'ol/Overlay';
import XYZ from 'ol/source/XYZ';

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false; f
};

const source = new VectorSource({ wrapX: false });
const typeSelect = document.getElementById('type');

const raster = new TileLayer({
  source: new OSM(),
});

const vector = new VectorLayer({
  source: source,
});

const map = new Map({

  layers: [
    new TileLayer({
      source: new XYZ({

        tileSize: 512,
      }),
    }), raster, vector
  ],

  overlays: [overlay],
  target: 'map',
  view: new View({
    center: fromLonLat([35.2433, 38.9637]),
    zoom: 6.6,
  }),
});

let draw; // global so we can remove it later
  draw = new Draw({
    source: source,
    type: "Point",
  });
  map.addInteraction(draw);

map.on('singleclick', function (evt) {
  const coordinate = evt.coordinate;
  var lonlat = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
  var lon = lonlat[0];
  var lat = lonlat[1];
  content.innerHTML = '<p>You clicked here:</p><code>' + "lat = " + lat + "<p> </p>" + " lon = " + lon + '</code>';
  overlay.setPosition(coordinate);
});

// POST isteği ile verimizi servera gönderelim  
let deneme = {
  name: "Blog Title",
  x: 2, 
  y:1
}

fetch('https://localhost:7168/api/LocationPgAdmin', {
  method: "POST",
  body: JSON.stringify(deneme),
  headers: {"Content-type": "application/json; charset=UTF-8"},
  /* mode: 'no-cors' */
})
.then(response => response.json()) 
.then(json => console.log(json))
.catch(err => console.log(err));