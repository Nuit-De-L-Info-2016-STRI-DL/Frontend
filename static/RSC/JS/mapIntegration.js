/**
 * Created by Camille on 01/12/2016.
 */

// TODO Fonction qui récupère Lat et Long pour l'API googlE.
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Create a map object and specify the DOM element for display.
            var map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: position.coords.latitude, lng: position.coords.longitude},
                scrollwheel: true,
                zoom: 15
            });
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
