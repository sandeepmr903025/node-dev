console.log('you are awesome');

const fetchWeather = (location) => {
    document.querySelector('#place').textContent = 'Loading...';
    fetch('http://localhost:3001/weather?address='+location).then((response) => {
        console.log(response.body);
        if (!response) {
            document.querySelector('#place').textContent = 'unable to find location';
            document.querySelector('#temperature').textContent = '';
        } else {
            response.json().then((data) => {
                if (data.error) {
                    document.querySelector('#place').textContent = 'unable to find location';
                    document.querySelector('#temperature').textContent = '';
                }
                else {
                    document.querySelector('#place').textContent = data.place;
                    document.querySelector('#temperature').textContent = data.temperature;
                }
            });
        }
    })
}

const weatherForm = document.querySelector('form');

if (weatherForm) {
    weatherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const location = document.querySelector('input').value;
        fetchWeather(location);
    });
}