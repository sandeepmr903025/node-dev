const express = require('express');
const path = require('path');
const hbs = require('hbs');

// Define paths for Express Config.
const forecastFilePath = path.join(__dirname, '../../weather-app/utils/forecast');
const forecast = require(forecastFilePath);

const geoCodeFilePath = path.join(__dirname, '../../weather-app/utils/geoCode');
const geoCode = require(geoCodeFilePath);

const indexPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


const app = express();
const port = process.env.PORT || 3001;

// Setup handlebars engine and customize views location.
// use handlebar template engine to load dynamic html files.
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve.
// In simple terms, for loading static html, css, js files.
app.use(express.static(indexPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        phone: 501765223
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        about: 'This is an awesome website',
        phone: 501765223
    });
})

// calling route directly
app.get('/help', (req, res) => {
    res.send('Please contact custom service');
})

// Route with key => value (lat=-0.1275, long=51.50722)
// No template engine such as Handlebars, just sending json response.
app.get('/weather', (req, res) => {
    const lat = req.query.lat; // -0.1275
    const long = req.query.long; // 51.50722
    const address = req.query.address;

    if (lat && long) {
        forecast.weatherForecast(lat, long, (error, {location, current} = {}) => {
            // with hbs template
            if (error) {
                res.send({
                    error: error
                });
            } else {
                res.send({
                    error: error,
                    temperature: current.temperature,
                    phone: 501765223,
                    place: location.name,
                    feel: current.weather_descriptions[0]
                });
            }
        });
    }
    else if (address) {
        geoCode.forwardGeoCode(address, (error, {features} = {}) => {
            if (error) {
                return res.send({
                    error: error
                });
            }
            const center = features[0].center;
            if (!center || center.length === 0) {
                return res.send('Please provide a valid address location');
            }
            forecast.weatherForecast(center[0], center[1], (error, {location, current} = {}) => {
                // with hbs template
                if (error) {
                    res.send({
                        error: error
                    });
                } else {
                    res.send({
                        error: error,
                        temperature: current.temperature,
                        phone: 501765223,
                        place: address,
                        feel: current.weather_descriptions[0]
                    });
                }
            })
        });
    }
})

// Route with route params, req.params object has all key value pairs.
app.get('/weather/:lat/:long', (req, res) => {
    const params = req.params;
    const lat = params.lat; // -0.1275
    const long = params.long; // 51.50722
    if (!lat && !long) {
        return res.send('Please provide latitude and longitude');
    }
    forecast.weatherForecast(lat, long, (error, {location, current} = {}) => {
        // with hbs template
        res.render('weather', {
            error: error,
            temperature: current.temperature,
            phone: 501765223,
            place: location.name,
            feel: current.weather_descriptions[0]
        });
    });
})

// Route with route params, req.params object has all key value pairs.
app.get('/weather/:address', (req, res) => {
    const params = req.params;
    const address = params.address;
    if (!address) {
        return res.send('Please provide an address');
    }
    geoCode.forwardGeoCode(address, (error, {features} = {}) => {
        if (error) {
            return res.send(error);
        }
        const center = features[0].center;
        if (!center || center.length === 0) {
            return res.send('Please provide a valid address location');
        }
        forecast.weatherForecast(center[0], center[1], (error, {location, current} = {}) => {
            // with hbs template
            res.render('weather', {
                error: error,
                temperature: current.temperature,
                phone: 501765223,
                place: address,
                feel: current.weather_descriptions[0]
            });
        })
    });
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: 'Help Article Not Found',
        phone: 501765223
    });
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: '404 Not Found',
        phone: 501765223
    });
})

app.listen(port, () => {
    console.log('Server is setup on port 3001');
});