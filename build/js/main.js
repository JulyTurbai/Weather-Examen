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
        this.date;
        this.json;
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

            console.log(informData);
            this.urlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(informData.city)}&appid=e4522bc40bf8ee61bc50b1ef71160e25&lang=ua&units=metric`;
            this.getChooseCity(this.urlCurrent);
            this.urlHourly = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(informData.city)}&appid=e4522bc40bf8ee61bc50b1ef71160e25&lang=ua&units=metric`;
            this.getChooseHourlyWeather(this.urlHourly);
            this.urlAnothers = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(informData.city)}&appid=e4522bc40bf8ee61bc50b1ef71160e25&lang=ua&units=metric`;
            this.getAnotherWeather(this.urlAnothers)
        }
        
    }


    getCurrentWeather() {
         fetch('https://api.openweathermap.org/data/2.5/weather?q=Poltava&appid=e4522bc40bf8ee61bc50b1ef71160e25&lang=ua&units=metric')
        .then(response => response.json())
        .then(response => this.createCurrentWeather(response)) 
    }

    getHourlyWeather() {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=Poltava&appid=e4522bc40bf8ee61bc50b1ef71160e25&lang=ua&units=metric')
        .then(response => response.json())
        .then(response => this.createHourlyWeather(response))
        .then(response => this.createNearlyPlaces())
    }
    
    getAnotherDaysWeather() {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=Poltava&appid=e4522bc40bf8ee61bc50b1ef71160e25&lang=ua&units=metric')
        .then(response => response.json())
        .then(response => this.createAnotherDays(response))
    }

    getChooseCity() {
        fetch(this.urlCurrent)
        .then(response => response.json())
        .then(response => this.createCurrentWeather(response)) 
        console.log(this.url)
    }
    getChooseHourlyWeather() {
        fetch(this.urlHourly)
        .then(response => response.json())
        .then(response => this.createHourlyWeather(response)) 
        
    }
    getAnotherWeather() {
        fetch(this.urlAnothers)
        .then(response => response.json())
        .then(response => this.createAnotherDays(response)) 
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
                        <div class="today active">Сьгодні</div>
                        <div class="another">Наступні 5 днів</div>
                    </div>`
    }

    
    createCurrentWeather(response)  {
        this.getData();
        console.log(response)
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
        console.log(response)
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

    createNearlyPlaces() {
        let str = `<div class="nearby-places">
                        <p class="nearby-places__name">
                            Найближчі міста
                        </p>
                        <div class="block">
                            <div class="nearby-places city">
                                <p class="city__name">Poltava</p>
                                <img src="" alt="">
                                <div class="city__temperature">34</div>   
                            </div>  
                            <div class="nearby-places city">
                                <p class="city__name">Poltava</p>
                                <img src="" alt="">
                                <div class="city__temperature">34</div>   
                            </div>  
                            <div class="nearby-places city">
                                <p class="city__name">Poltava</p>
                                <img src="" alt="">
                                <div class="city__temperature">34</div>   
                            </div>  
                            <div class="nearby-places city">
                                <p class="city__name">Poltava</p>
                                <img src="" alt="">
                                <div class="city__temperature">34</div>   
                            </div> 
                        </div> 
                    </div>  `

        this.today.insertAdjacentHTML('beforeend', str);
    }

    createAnotherDays(response) {
        let data;
        let d = new Date(response.list[0].dt);
        data = d.getDay() + ':' + d.getMonth();
        console.log(data)
        this.anothers.innerHTML = '';
        
        let str = `<div class="anothers days">
                        <div class="days day">
                            <p class="day__data">${response.list[0].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[0].weather[0].main}.png" alt="">
                            <p class="day__temp">${response.list[0].main.temp}&#176</p>
                            <p class="day__status">${response.list[0].weather[0].description}</p>
                        </div>
                        <div class="days day">
                            <p class="day__data">${response.list[8].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[8].weather[0].main}.png" alt="">
                            <p class="day__temp">${response.list[8].main.temp}&#176</p>
                            <p class="day__status">${response.list[8].weather[0].description}</p>
                        </div>
                        <div class="days day">
                            <p class="day__data">${response.list[16].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[16].weather[0].main}.png" alt="">
                            <p class="day__temp">${response.list[16].main.temp}&#176</p>
                            <p class="day__status">${response.list[16].weather[0].description}</p>
                        </div>
                        <div class="days day">
                            <p class="day__data">${response.list[24].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[24].weather[0].main}.png" alt="">
                            <p class="day__temp">${response.list[24].main.temp}&#176</p>
                            <p class="day__status">${response.list[24].weather[0].description}</p>
                        </div>
                        <div class="days day--last">
                            <p class="day__data">${response.list[32].dt_txt.split(' ')[0]}</p>
                            <img src="pic/${response.list[32].weather[0].main}.png" alt="">
                            <p class="day__temp">${response.list[32].main.temp}&#176</p>
                            <p class="day__status">${response.list[32].weather[0].description}</p>
                        </div>
                    </div>`

            this.anothers.insertAdjacentHTML('afterbegin', str);
    }



    init() {
        console.dir(this);
        this.renderHeader();
        this.getCurrentWeather();
        this.getHourlyWeather();
        this.getAnotherDaysWeather();
        this.form.addEventListener('submit', this.createChooseCity.bind(this));
    }
}






