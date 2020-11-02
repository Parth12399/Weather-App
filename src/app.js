const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const geoCode = require('./utils/geocode')

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPaths = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPaths)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index.hbs', {
        title: 'Weather App',
        name: 'Parth'
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About me',
        name: 'Parth'
    })
})

app.get('/help', (req, res) => {
    res.render('help.hbs', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Parth'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geoCode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query),
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
       title: 'Error 404',
       name: 'Parth',
       errorMessage: 'Help Article not Found!!'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Parth',
        errorMessage: 'Page not Found!!'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000')
})
