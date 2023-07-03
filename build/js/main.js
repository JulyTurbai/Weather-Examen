'use strict'

class WeatherMaker {
    constructor(wrapper, today) {
        this.wrapper = wrapper;
        this.today = today;

    }

    render() {
        new Weather(this.wrapper, this.today).init();
    }
}

class Weather {
    
    constructor(wrapper, today) {
        if(!wrapper) throw `Element ${wrapper} is not found`
        this.wrapper = document.querySelector(wrapper);
        this.today = document.querySelector(today)
        this.url;
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
    getCurrentWeather() {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Poltava&appid=e4522bc40bf8ee61bc50b1ef71160e25&lang=ua&units=metric`)
        .then(response => response.json())
        .then(response => this.createCurrentWeather(response)) 
    }


    getHourlyWeather() {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=Poltava&appid=e4522bc40bf8ee61bc50b1ef71160e25&lang=ua&units=metric')
        .then(response => response.json())
        .then(response => this.createHourlyWeather(response))
        .then(response => this.createNearlyPlaces())
    }

    renderHeader() {
        let str = ` <div class="header">
                    <div class="logo">Моя Погода</div>
                    <div class="location">
                        <form class="loc" action="">
                            <fieldset name="data">
                                <input class="city-inp" type="text" placeholder="Полтава">
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
                        <div class="today active">Today</div>
                        <div class="another">5-day forecast</div>
                    </div>`
    }

    
    createCurrentWeather(response)  {
        this.getData();
        console.log(response)
        let currentIcon;
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
                                        <img src="pic/${response.list[14].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">09:00</p>
                                        <img src="pic/${response.list[15].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">12:00</p>
                                        <img src="pic/${response.list[16].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">15:00</p>
                                        <img src="pic/${response.list[17].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">18:00</p>
                                        <img src="pic/${response.list[18].weather[0].main}.png" alt="">
                                    </div>
                                    <div class="time__weather">
                                        <p class="time__hour">21:00</p>
                                        <img src="pic/${response.list[19].weather[0].main}.png" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="hourly description">
                            <div class="description forecast">
                                <p class="forecast_name">Прогноз</p>
                                <div class="block">
                                    <p class="forecast_status">${response.list[14].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[15].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[16].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[17].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[18].weather[0].description}</p>
                                    <p class="forecast_status">${response.list[19].weather[0].description}</p>
                                </div>
                            </div>
                            <div class="description temperature">
                                <p class="temperature_name">Темп.</p>
                                <div class="block">
                                    <p class="temperature_degrees">${Math.floor(response.list[14].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[15].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[16].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[17].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[18].main.temp)}&#176</p>
                                    <p class="temperature_degrees">${Math.floor(response.list[19].main.temp)}&#176</p>
                                </div>
                            </div>
                            <div class="description feel">
                                <p class="feel_name">Відчувається</p>
                                <div class="block">
                                    <p class="feel_temp">${Math.floor(response.list[14].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[15].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[16].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[17].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[18].main.feels_like)}&#176</p>
                                    <p class="feel_temp">${Math.floor(response.list[19].main.feels_like)}&#176</p>
                                </div>
                            </div>
                            <div class="description wind">
                                <p class="wind_name">Вітер(км/год)</p>
                                <div class="block">
                                    <p class="wind_km">${Math.floor(response.list[14].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[15].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[16].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[17].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[18].wind.speed)}</p>
                                    <p class="wind_km">${Math.floor(response.list[19].wind.speed)}</p>
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


    init() {
        console.dir(this);
        this.renderHeader();
        this.getCurrentWeather();
        this.getHourlyWeather();
    }
}






