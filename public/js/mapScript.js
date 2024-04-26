// TO MAKE THE MAP APPEAR YOU MUST
        // ADD YOUR ACCESS TOKEN FROM
        // https://account.mapbox.com
        
        mapboxgl.accessToken = MAP_TOKEN;
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            center: coordinates, // starting position [lng, lat] [east, north]
            zoom: 10 // starting zoom
        });

    
        // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({color: 'red'})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h6><b> ${GivenLocation} </b></h6> <p>Exact location will be provided after booking.</p>`))
    .addTo(map);

