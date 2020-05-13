const request = require('request');
const geoCode = require('./geoCode');

const weatherForecast = (lat, long, callback) => {
    geoCode.reverseGeoCode(lat, long, (error, {features}) => {
        if (error) {
            return callback(error);
        }

        const place = features[0].place_name;
        const url = 'http://api.weatherstack.com/current?access_key=0cdd2c9a94287394fba8eada249749cb&query='+ place +'&units=m';
        request({url,json:true}, (error, {body}) => {
            if (error) {
                callback('unable to connect to weather service');
            }
            else if (body.error) {
                callback('unable to find location');
            } else {
                callback(null, body);
            }
        })
    });
}

module.exports = {
    weatherForecast
}
