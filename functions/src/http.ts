import * as functions from 'firebase-functions';
import * as cheerio from 'cheerio';
import * as getUrls from 'get-urls';
import fetch from 'node-fetch';
const cors = require('cors')({ origin: true });
// const express = require('express');

// const app = express();

// applies coors to every route
// app.use(cors());

// app.get('/cat', (request: any, response: any) => {
//     response.send('CAT');
// });

// app.get('/dog', (request: any, response: any) => {
//     response.send('DOG');
// });

// so endpoints wil be at /api/dog etc
// export const api = functions.https.onRequest(app);

const scrapeHeader = (text: string) => {

    console.log(`Attempting to scrape header from urls: ${text}`)
    // extracts urls from string
    const urls = Array.from(getUrls(text));

    console.log(`Extracted urls: ${urls}`);

    // create list of requests with url and title from html
    const requests = urls.map(async url => {

        console.log(`Getting header for: ${url}`);

        // get response
        const res = await fetch(url);

        // get html from the text
        const html = await res.text();
        console.log(`Page html: ${html}`);

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
export const scraper = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        console.log("WOWOWWOLWWLOWO");
        try {

            const text = request.body.data.text;
            console.log(`text: ${text}`);

            
            // should be a string containing urls
            const data = await scrapeHeader(text);

            console.log("Data to send:");
            console.log(JSON.stringify(data));
            response.send(data);
        }
        catch (err) {
            console.error("Something went wrong");
            console.log(err);
            response.sendStatus(500) 
        }
    })
});