/**
Class representing PingOne authentication API's integration.
This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
Implements methods to integrate with PingOne authentication-related API endpoints.

@author Michael Sanchez
@see https://apidocs.pingidentity.com/pingone/platform/v1/api/#authentication-apis
*/

// Packages
import React from 'react';

// Components
import { uuidv4 } from '../Utils/Utils';

class PingOneAuthN extends React.Component {
    authzEndpoint = "/as/authorize";

    constructor(authPath, envId) {
        super();
        this.authPath = authPath;
        this.envId = envId;
    }

    /**
     * Starts an authorization flow.
     * 
     * @param {String} responseType - The OAuth grant type. Options are "code" and "token".
     * @param {String} clientId - The client ID of the OAuth application.
     * @param {String} redirectURI - The URL to which the OAuth AS should redirect the user with a flowId.
     * @param {String} scopes - The OAuth scopes needed for the given for which the user is being authorized.
     * @return {String} The flowId extracted from the 302 redirect URL.
    */
    async authorize({responseType, clientId, redirectURI, scopes }) {
        console.info("PingOneAuthN.js", "Calling authorize endpoint to start an authN flow and get a flowId.");

        const url = this.authPath + "/" + this.envId + "/as/authorize";

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlEncodedBody = new URLSearchParams();
        urlEncodedBody.append("response_type", responseType);
        urlEncodedBody.append("client_id", clientId);
        urlEncodedBody.append("redirect_uri", redirectURI);
        urlEncodedBody.append("scope", scopes);
        urlEncodedBody.append("nonce", uuidv4());

        var requestOptions = {
            method: 'POST',
            mode: 'no-cors',
            headers: myHeaders,
            body: urlEncodedBody,
            redirect: 'follow',
            credentials: 'include'
        };

        fetch(url, requestOptions)
            .then(response => {
                const flowId = response.url.substring(response.url.search("=") + 1);
                console.log("FLOWID", flowId);
                console.log("HEADERS", response.headers.get("Location"))
                response.text()
            })
            .then(result => console.log("RESULT",result))
            .catch(error => console.log('error', error));
        /* try {
            const response = await fetch(url, requestOptions);
            const jsonData = await response.text();
            console.log("JSONDATA", jsonData);
            const flowId = response.url.substring(response.url.search("=") + 1);
            console.log("FLOWID", flowId);
            console.log("HEADERS", response.headers.get("Location"));
        } catch(e) {
            console.log("CRAP", e.message);
        } */
        /* no cors mode, redirect manual        = jsondata empty, flowid authoirize URL, location header null */
        /* no cors mode, redirect follow        = cors error No 'Access-Control-Allow-Origin' header is present */
        /* cors mode = no-cors, redirect manual =  no-cors/manual error */
        /* cors mode = no-cors, redirect follow =  jsondata empty, flowid empty, location headers null */
        /* cors mode = cors, redirect manual    =  jsondata empty, flowid authorize url, location header null */
        /* cors mode = cors, redirect follow    =  cors error No 'Access-Control-Allow-Origin' header is present */
    }
} export default PingOneAuthN;