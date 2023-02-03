const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const {response} = require("express")
const app = express()

const newspapers = [
    {
        name: 'Repubblica',
        address: 'https://www.repubblica.it/economia',
        base:''
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/',
        base:'https://www.thetimes.co.uk'
    },
    {
        name: 'MilanoFinanza',
        address: 'https://www.milanofinanza.it/news/business/analisi',
        base:''
    },
    {
        name: 'IlCorriereDellaSera',
        address: 'https://www.corriere.it/economia/',
        base:''
    }
]

const articles = []

newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
        .then(response=> {
            const html= response.data
            const $ = cheerio.load(html)

            $('a:contains("invest")', html).each(function (){      //scorre tutte le a nell html
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url : newspaper.base + url,
                    source : newspaper.name
                })
            })
            $('a:contains("economic")', html).each(function (){      //scorre tutte le a nell html
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url : newspaper.base + url,
                    source : newspaper.name
                })
            })
            $('a:contains("italia ")', html).each(function (){      //scorre tutte le a nell html
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url : newspaper.base + url,
                    source : newspaper.name
                })
            })

            $('a:contains("business")', html).each(function (){      //scorre tutte le a nell html
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url : newspaper.base + url,
                    source : newspaper.name
                })
            })
        })
})

app.get('/', (req,res) => {
    res.json('Welcome to my economics news API')
})

app.get('/news', (req,res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', async (req,res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name === newspaperId)[0].address

    console.log(newspaperAddress)
    axios.get(newspaperAddress)
        .then(response => {
            const html= response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            $('a:contains("inv")', html).each(function (){
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url,
                    source : newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))