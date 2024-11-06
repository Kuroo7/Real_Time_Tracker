const socket = io();
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords;
        socket.emit("send-location",{latitude,longitude})
    },(err)=>{
        console.log(err);
        
    },
{
    enableHighAccuracy:true,
    maximumAge:0,
    timeout:5000
});
}

const map = L.map("map").setView([0, 0], 10);
// console.log(map);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marker ={};

socket.on("received-location",(data)=>{
    const {id,latitude,longitude}=data;
map.setView([latitude,longitude],15)
if (marker[id]) {
    marker[id].setLatLng([latitude,longitude])
}
else{
    marker[id]=L.marker([latitude,longitude]).addTo(map)
}
})

socket.on("user-disconnected",(id)=>{
    if (marker[id]) {
        map.removeLayer(markers[id]);
        delete marker[id]
    }
})
