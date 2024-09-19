const socket = io();

console.log("Hey");

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((postition) => {
        const { latitude, longitude } = postition.coords;
        socket.emit("send-location", { latitude, longitude });
    },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 0,
        }
    );
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "openStreetMap"
}).addTo(map)

const markers = {};

socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude]);
    if (markers[id]) {
        markers[id].setLatLang([latitude, longitude]);
    }
    else {
        markers.id = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }

});