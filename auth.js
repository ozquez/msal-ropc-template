const msal = require("@azure/msal-node");
const { promises: fs } = require("fs");
require('dotenv').config();

/**
 * Cache Plugin configuration
 */
const cachePath = "./data/cache.json"; // Replace this string with the path to your valid cache file.

const beforeCacheAccess = async (cacheContext) => {
    cacheContext.tokenCache.deserialize(await fs.readFile(cachePath, "utf-8"));
};

const afterCacheAccess = async (cacheContext) => {
    if (cacheContext.cacheHasChanged) {
        await fs.writeFile(cachePath, cacheContext.tokenCache.serialize());
    }
};

const cachePlugin = {
    beforeCacheAccess,
    afterCacheAccess
};

const msalConfig = {
    auth: {
        clientId: process.env.clientId,
        authority: process.env.authority,
        clientSecret: process.env.clientSecret
    },
    cache: {
        cachePlugin
    }
};

const pca = new msal.PublicClientApplication(msalConfig);
const msalTokenCache = pca.getTokenCache();


const tokenCalls = async () => {

    async function getAccounts() {
        return await msalTokenCache.getAllAccounts();
    };

    const accounts = await getAccounts();

    // Acquire Token Silently if an account is present
    if (accounts.length > 0) {
        const silentRequest = {
            account: accounts[0], // Index must match the account that is trying to acquire token silently
            scopes: [process.env.scope], // user.read also works god
        };

        try {
            await pca.acquireTokenSilent(silentRequest)
            console.log("\nSuccessful silent token acquisition\n");    
        } catch (error) {
            console.log(error);
        }
        // fall back to username password if there is no account
    } else {
        const usernamePasswordRequest = {
            scopes: [process.env.scope], // user.read also works god
            username: process.env.userEmail, // Add your username here
            password: process.env.password, // Add your password here
        };

        try {
            await pca.acquireTokenByUsernamePassword(usernamePasswordRequest)
            console.log("\nAcquired token by password grant\n");
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = tokenCalls

