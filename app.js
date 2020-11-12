const express = require("express")
const https = require("https")
const http = require("http")
const bodyParser = require("body-parser")

const app = express()

//use to enable ejs documents as files. Has to be in views folder
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("Public"))

app.get("/", function(req, res) {

    res.render("start") //starting site. App starts here
})

app.post("/", function(req, res) {

    //variables
    let city = req.body.cityName
    let weather_url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=5dc42d57d74136740a3ba22b431d4730&units=metric"
    let time_url
    let temp
    let icon
    let long
    let lat
    let time
    let flag
    let country

    https.get(weather_url, function(response) {
        response.on("data", function(data){
            const weatherData = JSON.parse(data)
            if (response.statusCode === 200) { //checks to see if the api exists and there is no error with the city name
                temp = weatherData.main.temp
                icon = weatherData.weather[0].icon
                long = weatherData.coord.lon
                lat = weatherData.coord.lat 
                time_url = "http://api.timezonedb.com/v2.1/get-time-zone?key=7ACBEMP4TQ6F&format=json&by=position&lat=" + lat + "&lng=" + long 
    
                http.get(time_url, function(response) {
                    response.on("data", function(data) {
                        const timeData = JSON.parse(data)
                        time = timeData.formatted 
                        country = timeData.countryCode
                        flag = "https://www.countryflags.io/" + country + "/shiny/64.png"

                        res.render("weather",{city: city, temp: temp, icon: icon, time: time, flag: flag}) 
                    })
                }) 
            } else {
                res.render("start")
            }     
        })
    })
})


app.listen(process.env.PORT || 3000, function(){
    console.log("app is running on port 3000")    
})