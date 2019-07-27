import * as functions from 'firebase-functions';
import * as cheerio from 'cheerio';
import * as getUrls from 'get-urls';
import fetch from 'node-fetch';
const cors = require('cors');
const express = require('express');

const app = express();

// applies coors to every route
app.use(cors({ origin: true }));

app.get('/cat', (request: any, response: any) => {
    response.send('CAT');
});

app.get('/dog', (request: any, response: any) => {
    response.send('DOG');
});

// so endpoints wil be at /api/dog etc
export const api = functions.https.onRequest(app);

const scrapeHeader = (text: string) => {

    // extracts urls from string
    const urls = Array.from(getUrls(text));

    // create list of requests with url and title from html
    const requests = urls.map(async url => {

        // get response
        const res = await fetch(url);

        // get html from the text
        const html = await res.text();

        const $ = cheerio.load(html);

        return {
            url,
            title: $('h1').first().text()
        }

    });

    // send all resolve then return all?
    return Promise.all(requests);

}

// works but can't get data sent in yet
export const scraper = functions.https.onRequest(async (request, response) => {

    //console.log(request.body);

    try {
        
        const body = JSON.parse(request.body);
        
        // should be a string containing urls
        const data = await scrapeHeader(body.text);
        response.send(data);
    }
    catch (err) {
        console.error("Something went wrong");
        console.log(err);
        response.sendStatus(500)
    }
});