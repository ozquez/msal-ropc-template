const { Logger } = require('@azure/msal-node');
const axios = require('axios');
const { promises: fs } = require("fs");
// const { tokenCalls } = require('./app')

// const cachePath = "./data/cache.json"; // Replace this string with the path to your valid cache file.

// async function cacheData(){
//     try{
//        const data = JSON.parse(await fs.readFile(cachePath, "utf-8"));   
//        return data.AccessToken;
//     } catch (error) {
//         console.log(error);
//         return error;
//     }
// }

async function callApi(endpoint, accessToken) {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.default.get(endpoint, options);
        console.log(response.data);
    } catch (error) {
        console.log(error.response.status, error.response.statusText)
        return error;
    }
}


callApi();

