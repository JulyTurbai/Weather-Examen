'use strict'


class WeatherMaker {
    constructor(wrapper, today, anothers) {
        this.wrapper = wrapper;
        this.today = today;
        this.anothers = anothers;

    }

    render() {
        new Weather(this.wrapper, this.today, this.anothers).init();
    }
}

class Weather {
    
    constructor(wrapper, today) {
        if(!wrapper) throw `Element ${wrapper} is not found`
        this.wrapper = document.querySelector(wrapper);
        this.today = document.querySelector(today)
        this.anothers = document.querySelector('.anothers');
        
        this.urlCurrent;
        this.urlHourly;
        this.urlAnothers;
        this.urlAnothersHourly;
        this.url;
        this.date;
        this.dataLat;
        this.dataLon;
        this.json;
        this.dataId;
        this.city = 'Полтава';
    }

    getData() {
        const d = new Date();

        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() +1).toString().padStart(2, '0');
        const year = d.getFullYear();

        this.date = `${day}.${month}.${year}`
        
    }

    get form() {
        return document.forms.userLocation;
    }
    get data() {
        return this.form.loc.data;
    }
    get elem() {
        return this.form.data.elements;
    }

    createChooseCity(e) {
        e.preventDefault();

        const informData = {};
        let valid = true;
        
        for(let input of this.elem) {
            this.value = input.value.trim();

            if (!this.value) {
                valid = false;
                return;
            }
            
            informData[input.name] = this.value;

            if(!informData) return;
            this.urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(informData.city)}&appid=514dfb87f2b2c2278e57328fcefedff1&lang=ua&units=metric`;
            this.getChooseCity(this.urlCurrent);
            this.urlHourly = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(informData.city)}&appid=514dfb87f2b2c2278e57328fcefedff1&lang=ua&units=metric`;
            this.getChooseHourlyWeather(this.urlHourly);
            this.getAnotherWeather(this.urlHourly );
            
            fetch(this.urlCurrent)
            .then(response => response.json())
            .then(response => fetch(`https://api.openweathermap.org/data/2.5/find?lat=${response.coord.lat}&lon=${response.coord.lon}&cnt=5&units=metric&appid=514dfb87f2b2c2278e57328fcefedff1&lang=ua`)
            .then(response => response.json())
            .then(response => this.createNearlyPlaces(response)))

            fetch(this.urlCurrent)
            .then(response => response.json())
            .then(response => fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${response.coord.lat}&lon=${response.coord.lon}&exclude=minutely&units=metric&lang=ua&appid=514dfb87f2b2c2278e57328fcefedff1`)
            .then(response => response.json())
            .then(response => this.createAnothersHourlyWeather(response, 2, 3, 4, 5, 6, 7)))
        }
        
    }


    getCurrentWeather() {
         fetch('https://api.openweathermap.org/data/2.5/weather?q=Poltava&appid=514dfb87f2b2c2278e57328fcefedff1&lang=ua&units=metric')
        .then(response => {
            if (response.status < 400) {
                return response.json()
            }
            throw 'щось пішло не так';
        })
        .then(response => this.createCurrentWeather(response))
        .catch(c => console.error(c))
        .finally(() => console.log('все зроблено'));
    }

    getHourlyWeather() {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=Poltava&appid=514dfb87f2b2c2278e57328fcefedff1&lang=ua&units=metric')
        .then(response => response.json())
        .then(response => this.createHourlyWeather(response))
    }
    getNearbyPlacesWeather() {
        setTimeout(() => {
            fetch('https://api.openweathermap.org/data/2.5/find?lat=49.5937&lon=34.5407&cnt=5&units=metric&appid=514dfb87f2b2c2278e57328fcefedff1&lang=ua')
            .then(response => response.json())
            .then(response => this.createNearlyPlaces(response))
        }, 100)
    }
    
    getAnotherDaysWeather() {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=Poltava&appid=514dfb87f2b2c2278e57328fcefedff1&lang=ua&units=metric')
        .then(response => response.json())
        .then(response => this.createAnotherDays(response))
    }

    getAnothersHourlyWeather() {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=Poltava&appid=514dfb87f2b2c2278e57328fcefedff1&lang=ua&units=metric')
        .then(response => response.json())
        .then(response => this.createAnothersHourlyWeather(response, 2, 3, 4, 5, 6, 7))
    }

    getChooseCity() {
        fetch(this.urlCurrent)
        .then(response => {
            if (response.status < 400) {
                this.wrapper.querySelector('.error img').classList.add('hide');
                this.wrapper.querySelector('.weather-block').classList.remove('hide');
                return response.json();
            }
            if (response.status == 404) {
                this.wrapper.querySelector('.weather-block').classList.add('hide');
                this.wrapper.querySelector('.error img').classList.remove('hide');
            } 
         })
        .then(response => this.createCurrentWeather(response)) 
        .catch(c => console.error(c))
        .finally(() => console.log('все зроблено'));
    }
    
    getChooseHourlyWeather() {
        fetch(this.urlHourly)
        .then(response => response.json())
        .then(response => this.createHourlyWeather(response)) 
        
    }
    getAnotherWeather() {
        fetch(this.urlHourly)
        .then(response => response.json())
        .then(response => this.createAnotherDays(response)) 
    }
    getAnothersHourlyDays() {
        fetch('https://api.openweathermap.org/data/2.5/forecast?lat=49.5937&lon=34.5407&exclude=minutely&units=metric&lang=ua&appid=514dfb87f2b2c2278e57328fcefedff1')
        .then(response => response.json())
        .then(response => this.createAnothersHourlyWeather(response, 2, 3, 4, 5, 6, 7)) 
    }
    renderHeader() {
        let str = ` <div class="header">
                    <div class="logo">Моя Погода</div>
                    <div class="location">
                        <form class="loc" name="userLocation">
                            <fieldset name="data">
                                <input class="city-inp" name="city" type="text" placeholder="Полтава">
                            </fieldset>
                            <button type="submit">Пошук</button>
                        </form>
                    </div>
                </div>
                ${this.#renderMenu()}
            `

            this.wrapper.insertAdjacentHTML('afterbegin', str);
    }

    #renderMenu() {
        return `<div class="menu">
                        <div class="today active">Сьогодні</div>
                        <div class="another">Наступні 5 днів</div>
                    </div>`
    }

    
    createCurrentWeather(response)  {
        this.getData();
        let currentTemp;
        let currentFeel;
        let sunrise;
        let sunset;

        
        currentTemp = Math.floor(response.main.temp);
        currentFeel = Math.floor(response.main.feels_like);
        
    
        let d = new Date(response.sys.sunrise * 1000);
        sunrise = d.getHours() + ':' + d.getMinutes();

        let t = new Date(response.sys.sunset * 1000);
        sunset = t.getHours() + ':' + t.getMinutes();
        
        this.today.innerHTML = '';

            let str = `<div class="current">
                            <div class="current main">
                                <h3 class="main__name">Поточна погода</h3>
                                    <span class="main__data">${this.date}</span>
                            </div>
                            <div class="current main__block">
                                <div class="current position">
                                    <div class="position__img">
                                        <img src="pic/${response.weather[0].main}.png" alt="">
                                    </div>
                                    <p class="position__descr">${response.weather[0].description}</p>
                                </div>
                                <div class="current temp">
                                    <span class="temp__deg">${currentTemp}&#176</span>
                                    <p class="temp__feel">Відчувається як: ${currentFeel}&#176</p>
                                </div>
                                <div class="day-descr">
                                    <div class="day-descr sunrise">
                                        <p>Схід сонця:</p>
                                        <span>${sunrise}</span>
                                    </div>
                                    <div class="day-descr sunset">
                                        <p>Захід сонця:</p>
                                        <span>${sunset}</span>
                                    </div>
                                    <div class="day-descr duration">
                                        <p>Тривалість дня:</p>
                                        <span>23 hours</span>
                                    </div>
                                </div>  
                            </div>    
                        </div>`
        
            this.today.insertAdjacentHTML('afterbegin', str);
    } 

    createHourlyWeather(response) {
        let str = `<div class="hourly">
                        <h3 class="hourly__name">Найближчим часом</h3>
                        <div class="hourly info">
                            <div class="info hours">
                                <div class="hours__name">
                                    <p>Сьогодні</p>
                                </div>
                                <div class="hours time">
                                    <div class="time__weather">
                                        <p class="time__hour">06:00</p>
                                        <img src="pic/${response.list[6].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">09:00</p>
                                        <img src="pic/${response.list[7].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">12:00</p>
                                        <img src="pic/${response.list[8].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">15:00</p>
                                        <img src="pic/${response.list[9].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">18:00</p>
                                        <img src="pic/${response.list[10].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">21:00</p>
                                        <img src="pic/${response.list[11].weather[0].main}.png" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="hourly description">
                            <div class="description forecast">
                                <p class="forecast_name">Прогноз</p>
                                <div class="block">
                                    <p class="forecast_status">${response.list[6].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[7].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[8].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[9].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[10].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[11].weather[0].description}</p>
                                </div>
                            </div>
                            <div class="description temperature">
                                <p class="temperature_name">Темп.</p>
                                <div class="block">
                                    <p class="temperature_degrees">${Math.floor(response.list[6].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[7].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[8].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[9].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[10].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[11].main.temp)}&#176</p>
                                </div>
                            </div>
                            <div class="description feel">
                                <p class="feel_name">Відчувається</p>
                                <div class="block">
                                    <p class="feel_temp">${Math.floor(response.list[6].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[7].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[8].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[9].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[10].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[11].main.feels_like)}&#176</p>
                                </div>
                            </div>
                            <div class="description wind">
                                <p class="wind_name">Вітер(км/год)</p>
                                <div class="block">
                                    <p class="wind_km">${Math.floor(response.list[6].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[7].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[8].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[9].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[10].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[11].wind.speed)}</p>
                                </div>
                            </div>   
                        </div>
                    </div>`

        this.today.insertAdjacentHTML('beforeend', str);
    }

    createNearlyPlaces(response) {
        let str = `<div class="nearby-places">
                        <p class="nearby-places__name">
                            Найближчі міста
                        </p>
                        <div class="block">
                            <div class="nearby-places city">
                                <p class="city__name">${response.list[1].name}</p>
                                <img src="pic/${response.list[1].weather[0].main}.png" alt="">
                                <div class="city__temperature">${Math.floor(response.list[1].main.temp)}&#176</div>   
                            </div>  
                            <div class="nearby-places city">
                                <p class="city__name">${response.list[2].name}</p>
                                <img src="pic/${response.list[2].weather[0].main}.png" alt="">
                                <div class="city__temperature">${Math.floor(response.list[2].main.temp)}&#176</div>   
                            </div>  
                            <div class="nearby-places city">
                                <p class="city__name">${response.list[3].name}</p>
                                <img src="pic/${response.list[3].weather[0].main}.png" alt="">
                                <div class="city__temperature">${Math.floor(response.list[3].main.temp)}&#176</div>   
                            </div>  
                            <div class="nearby-places city">
                                <p class="city__name">${response.list[4].name}</p>
                                <img src="pic/${response.list[4].weather[0].main}.png" alt="">
                                <div class="city__temperature">${Math.floor(response.list[4].main.temp)}&#176</div>   
                            </div> 
                        </div> 
                    </div>  `

        this.today.insertAdjacentHTML('beforeend', str);
    }

    createAnotherDays(response) {
        let data;
        let d = new Date(response.list[0].dt);
        data = d.getDay() + ':' + d.getMonth();
        this.anothers.innerHTML = '';
        this.dataId = this.date
        let str = `<div class="anothers days">
                        <div class="days day day--one day-active" data-id="${response.list[0].dt_txt.split(' ')[0]}" data-lat="${response.city.coord.lat}" data-lon="${response.city.coord.lon}"">
                            <p class="day__data">${response.list[0].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[0].weather[0].main}.png" alt="">
                            <p class="day__temp">${Math.floor(response.list[0].main.temp)}&#176</p>
                            <p class="day__status">${response.list[0].weather[0].description}</p>
                        </div>
                        <div class="days day day--two" data-id="${response.list[8].dt_txt.split(' ')[0]}" data-lat="${response.city.coord.lat}" data-lon="${response.city.coord.lon}"">
                            <p class="day__data">${response.list[8].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[8].weather[0].main}.png" alt="">
                            <p class="day__temp">${Math.floor(response.list[8].main.temp)}&#176</p>
                            <p class="day__status">${response.list[8].weather[0].description}</p>
                        </div>
                        <div class="days day day--three" data-id="${response.list[16].dt_txt.split(' ')[0]}" data-lat="${response.city.coord.lat}" data-lon="${response.city.coord.lon}"">
                            <p class="day__data">${response.list[16].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[16].weather[0].main}.png" alt="">
                            <p class="day__temp">${Math.floor(response.list[16].main.temp)}&#176</p>
                            <p class="day__status">${response.list[16].weather[0].description}</p>
                        </div>
                        <div class="days day day--for" data-id="${response.list[24].dt_txt.split(' ')[0]}" data-lat="${response.city.coord.lat}" data-lon="${response.city.coord.lon}"">
                            <p class="day__data">${response.list[24].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[24].weather[0].main}.png" alt="">
                            <p class="day__temp">${Math.floor(response.list[24].main.temp)}&#176</p>
                            <p class="day__status">${response.list[24].weather[0].description}</p>
                        </div>
                        <div class="days day day--five" data-id="${response.list[32].dt_txt.split(' ')[0]}" data-lat="${response.city.coord.lat}" data-lon="${response.city.coord.lon}"">
                            <p class="day__data">${response.list[32].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[32].weather[0].main}.png" alt="">
                            <p class="day__temp">${Math.floor(response.list[32].main.temp)}&#176</p>
                            <p class="day__status">${response.list[32].weather[0].description}</p>
                        </div>
                    </div>
                    <div class="block-hourly"></div>`

            this.anothers.insertAdjacentHTML('afterbegin', str);
    }

    createAnothersHourlyWeather(response, num1, num2, num3, num4, num5, num6) {
        this.anothers.querySelector('.block-hourly').innerHTML = ''; 
       
        let str = `<div class="hourly">
                        <h3 class="hourly__name"></h3>
                        <div class="hourly info">
                            <div class="info hours">
                                <div class="hours__data">
                                    <p>${this.dataId}</p>
                                </div>
                                <div class="hours time">
                                    <div class="time__weather">
                                        <p class="time__hour">06:00</p>
                                        <img src="pic/${response.list[num1].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">09:00</p>
                                        <img src="pic/${response.list[num2].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">12:00</p>
                                        <img src="pic/${response.list[num3].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">15:00</p>
                                        <img src="pic/${response.list[num4].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">18:00</p>
                                        <img src="pic/${response.list[num5].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">21:00</p>
                                        <img src="pic/${response.list[num6].weather[0].main}.png" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="hourly description">
                            <div class="description forecast">
                                <p class="forecast_name">Прогноз</p>
                                <div class="block">
                                    <p class="forecast_status">${response.list[num1].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[num2].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[num3].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[num4].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[num5].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[num6].weather[0].description}</p>
                                </div>
                            </div>
                            <div class="description temperature">
                                <p class="temperature_name">Темп.</p>
                                <div class="block">
                                    <p class="temperature_degrees">${Math.floor(response.list[num1].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[num2].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[num3].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[num4].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[num5].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[num6].main.temp)}&#176</p>
                                </div>
                            </div>
                            <div class="description feel">
                                <p class="feel_name">Відчувається</p>
                                <div class="block">
                                    <p class="feel_temp">${Math.floor(response.list[num1].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[num2].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[num3].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[num4].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[num5].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[num6].main.feels_like)}&#176</p>
                                </div>
                            </div>
                            <div class="description wind">
                                <p class="wind_name">Вітер(км/год)</p>
                                <div class="block">
                                    <p class="wind_km">${Math.floor(response.list[num1].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[num2].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[num3].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[num4].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[num5].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[num6].wind.speed)}</p>
                                </div>
                            </div>   
                        </div>
                    </div>`
            this.anothers.querySelector('.block-hourly').innerHTML = str;        
    }

    showWeather(event) {
        let t = event.target;

        if(t.matches('.another')) {
            this.today.classList.add('hide');
            this.anothers.classList.remove('hide');
            this.wrapper.querySelector('.today').classList.remove('active');
            this.wrapper.querySelector('.another').classList.add('active');
        }
        if(t.matches('.today')) {
            this.today.classList.remove('hide');
            this.anothers.classList.add('hide')
            this.wrapper.querySelector('.another').classList.remove('active');
        }
    }

    showAnothersDaysHourly(event) {
        let t = event.target;
        if(t.matches('.day--one')) {
            this.dataId = t.dataset.id;
            this.dataLat = t.dataset.lat;
            this.dataLon = t.dataset.lon;
            this.wrapper.querySelectorAll('.day').forEach(elem => elem.classList.remove('day-active'))
            t.classList.add('day-active');
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.dataLat}&lon=${this.dataLon}&exclude=minutely&units=metric&lang=ua&appid=514dfb87f2b2c2278e57328fcefedff1`)
            .then(response => response.json())
            .then(response => this.createAnothersHourlyWeather(response, 2, 3, 4, 5, 6, 7))
        }
        if(t.matches('.day--two')) {
            this.dataId = t.dataset.id;
            this.dataLat = t.dataset.lat;
            this.dataLon = t.dataset.lon;
            this.wrapper.querySelectorAll('.day').forEach(elem => elem.classList.remove('day-active'))
            t.classList.add('day-active');
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.dataLat}&lon=${this.dataLon}&exclude=minutely&units=metric&lang=ua&appid=514dfb87f2b2c2278e57328fcefedff1`)
            .then(response => response.json())
            .then(response => this.createAnothersHourlyWeather(response, 10, 11, 12, 13, 14, 15))
        }
        if(t.matches('.day--three')) {
            this.dataId = t.dataset.id;
            this.dataLat = t.dataset.lat;
            this.dataLon = t.dataset.lon;
            this.wrapper.querySelectorAll('.day').forEach(elem => elem.classList.remove('day-active'))
            t.classList.add('day-active');
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.dataLat}&lon=${this.dataLon}&exclude=minutely&units=metric&lang=ua&appid=514dfb87f2b2c2278e57328fcefedff1`)
            .then(response => response.json())
            .then(response => this.createAnothersHourlyWeather(response, 18, 19, 20, 21, 22, 23))
        }
        if(t.matches('.day--for')) {
            this.dataId = t.dataset.id;
            this.dataLat = t.dataset.lat;
            this.dataLon = t.dataset.lon;
            this.wrapper.querySelectorAll('.day').forEach(elem => elem.classList.remove('day-active'))
            t.classList.add('day-active');
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.dataLat}&lon=${this.dataLon}&exclude=minutely&units=metric&lang=ua&appid=514dfb87f2b2c2278e57328fcefedff1`)
            .then(response => response.json())
            .then(response => this.createAnothersHourlyWeather(response, 26, 27, 28, 29, 30, 31))
        }
        if(t.matches('.day--five')) {
            this.dataId = t.dataset.id;
            this.dataLat = t.dataset.lat;
            this.dataLon = t.dataset.lon;
            this.wrapper.querySelectorAll('.day').forEach(elem => elem.classList.remove('day-active'))
            t.classList.add('day-active');
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.dataLat}&lon=${this.dataLon}&exclude=minutely&units=metric&lang=ua&appid=514dfb87f2b2c2278e57328fcefedff1`)
            .then(response => response.json())
            .then(response => this.createAnothersHourlyWeather(response, 34, 35, 36, 37, 38, 39))
        }
    }

    init() {
        this.renderHeader();
        this.getCurrentWeather();
        this.getHourlyWeather();
        this.getAnotherDaysWeather();
        this.getAnothersHourlyWeather();
        this.getNearbyPlacesWeather();
        this.form.addEventListener('submit', this.createChooseCity.bind(this));
        this.wrapper.addEventListener('click', this.showWeather.bind(this));
        this.wrapper.addEventListener('click', this.showAnothersDaysHourly.bind(this))
    }
}































































































