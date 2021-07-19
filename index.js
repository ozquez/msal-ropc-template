require('dotenv').config();
const axios = require('axios');
const tokenCalls = require('./auth')

const cachePath = require("./data/cache.json");
const accessToken = cachePath.AccessToken[process.env.tokenProperty].secret
const accessTokenExpiresOn = cachePath.AccessToken[process.env.tokenProperty].expires_on
const endpoint = 'https://graph.microsoft.com/beta/';

const callApi = async (endpoint, accessToken) => {
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


const main = async () => {
    if (accessTokenExpiresOn < Math.floor(new Date().getTime() / 1000)) {
        console.log('Se renovara el token..');
        await tokenCalls()
    } else {
        console.log('Todo bien con el token');
    }

    callApi(`${endpoint}/bookingBusinesses/InterviesCalendar@permtest.onmicrosoft.com`, accessToken)
}

main()


