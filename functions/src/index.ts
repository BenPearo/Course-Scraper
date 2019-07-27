import * as functions from 'firebase-functions';
import * as cors from 'cors';
import * as cheerio from 'cheerio';
import * as getUrls from 'get-urls';
import fetch from 'node-fetch';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
console.log(functions);
console.log(cors);
console.log(cheerio);
console.log(getUrls);
console.log(fetch);

const scrapeHeader = (text: string) => {

    // extracts urls from string
    const urls = Array.from(getUrls(text));

    // create list of requests with url and title from html
    const requests = urls.map(async url => {

        // get
        const res = await fetch(url);

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

export const scraper = functions.https.onRequest(async (request, response) => {

    console.log(request.body);

    try {
        const body = JSON.parse(request.body);
        const data = await scrapeHeader(body.text);
        response.send(data);
    }
    catch (err) {
        console.error("Something went wrong");
        console.log(err);
        response.sendStatus(500)
    }
});