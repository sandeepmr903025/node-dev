const request = require('request');

// forward GeoCoding with address, returns lat and long
const forwardGeoCode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(address) +'.json?access_token=pk.eyJ1Ijoic2FuZGVlcG1yNDAiLCJhIjoiY2s5eWplZndxMDZpYTNscXBuNnM1MXRvciJ9.eGrWLAQhJyuigGB3X_IbTQ&limit=1';
    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback('unable to connect to weather service');
        }
        else if (body.features.length === 0) {
            callback('unable to find location');
        } else {
            callback(null, body);
        }
    })
}

// reverse GeoCoding with lat, long and returns address
const reverseGeoCode = (lat, long, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ lat + ',' + long +'.json?access_token=pk.eyJ1Ijoic2FuZGVlcG1yNDAiLCJhIjoiY2s5eWplZndxMDZpYTNscXBuNnM1MXRvciJ9.eGrWLAQhJyuigGB3X_IbTQ&limit=1';
    request({url, json: true}, (error, {body}) => {
        if (error) {
            callback('unable to connect to weather service');
        }
        else if (body.features.length === 0) {
            callback('unable to find location');
        } else {
            callback(null, body);
        }
    })
}

module.exports = {
    forwardGeoCode,
    reverseGeoCode
}