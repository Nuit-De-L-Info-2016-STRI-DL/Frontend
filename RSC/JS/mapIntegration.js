/**
 * Created by Camille on 01/12/2016.
 */

// TODO Fonction qui récupère Lat et Long pour l'API googlE.

function initMap() {
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.600000, lng: 1.433333},
        scrollwheel: false,
        zoom: 8
    });
}

