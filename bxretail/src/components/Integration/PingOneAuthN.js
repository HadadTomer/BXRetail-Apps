/**
Class representing PingOne authN integration.
This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
Implements methods to integrate with PingOne authentication-related API endpoints.

@author Michael Sanchez
@see https://apidocs.pingidentity.com/pingone/platform/v1/api/#authentication-apis
*/

// Components
import { uuidv4 } from '../Utils/Utils';

class PingOneAuthN {

    constructor(authPath, envId) {
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

        var urlencoded = new URLSearchParams();
        urlencoded.append("response_type", responseType);
        urlencoded.append("client_id", clientId);
        urlencoded.append("redirect_uri", redirectURI);
        urlencoded.append("scope", scopes);
        urlencoded.append("nonce", uuidv4());

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        // const response = await fetch(url, requestOptions);
        // const flowId = response.url.substring(response.url.search("=") + 1);;
        // return flowId;
    }

    /** 
    * AuthN API endpoint
    * @param {String} method - The HTTP request verb.
    * @param {String} flowId - The flowId from the initiated authN API response.
    * @param {String} contentType - The content type required for the submitted payload.
    * @param {String} body - The payload to send in the HTTP body in JSON format
    * @return {object} An HTTP response object.
    */
    authnAPI({ verb, flowId, contentType, body }) {
        console.info("PingOneAuthN.js", "Making call to AuthN API.");

        // let headers = new Headers();
        // headers.append('Accept', 'application/json');
        // headers.append('X-XSRF-Header', 'PingFederate');
        // if (contentType !== undefined) { headers.append('Content-Type', contentType) };

        // const requestOptions = {
        //     headers: headers,
        //     method: verb,
        //     body: body,
        //     credentials: 'include'
        // }
        // const url = PingEndpoints.pingFederate.pfAuthnAPIURI + flowId;
        // return fetch(url, requestOptions);
    }

    /** 
    * AuthN API flow handler.
    * Handler for different authN API flows. UI components shouldn't deal with these 
    * API calls or payload formatting. They just need to know about the user and what their next move is.
    * @param {String} flowResponse - The API response object from the previous flow request.
    * @param {String} identifier the userName of the authenticating user.
    * @param {String} swaprods - The user's password if doing password authentication.
    * @param {boolean} rememberMe - Whether the user wants their userName remembered at future visits.
    */
    handleAuthNflow({ flowResponse, identifier, swaprods, rememberMe }) {
        console.info("PingOneAuthN.js", "Handling flow response from authN API.");

        let payload = '{}';
        if (!flowResponse) { flowResponse = {}; } //This won't exist if we only get a flowId. So create it to let switch/case default kick in.
        console.info("flowResponse.status", flowResponse.status);
        switch (flowResponse.status) {
            case "REGISTRATION_REQUIRED":
                console.info("PingOneAuthN.js", "REGISTRATION_REQUIRED");
                //TODO can probably remove this case. nothing to do here. app needs to trigger modalRegister.
                break;
            case "IDENTIFIER_REQUIRED":
                console.info("PingOneAuthN.js", "IDENTIFIER_REQUIRED");
                payload = '{\n  \"identifier\": \"' + identifier + '\"\n}';
                return this.authnAPI({ method: "POST", flowId: flowResponse.id, contentType: "application/vnd.pingidentity.submitIdentifier+json", body: payload });
                break;
            case "USERNAME_PASSWORD_REQUIRED":
                console.info("PingOneAuthN.js", "USERNAME_PASSWORD_REQUIRED");
                payload = '{\n \"username\": \"' + flowResponse.username + '\", \"password\": \"' + swaprods + '\", \"rememberMyUsername\": \"' + rememberMe + '\", \"captchaResponse\": \"\" \n}';
                return this.authnAPI({ method: "POST", flowId: flowResponse.id, contentType: "application/vnd.pingidentity.checkUsernamePassword+json", body: payload });
                break;
            case "RESUME":
                console.info("PingOneAuthN.js", "RESUME");
                window.location.assign(flowResponse.resumeUrl);
                break;
            case "FAILED":
                console.info("PingOneAuthN.js", flowResponse.message);
                return flowResponse;
            default: // Why are we here???
                console.error("PingOneAuthN.js", "In default case. We shouldn't be here. Whisky tango foxtrot?");
                console.error("Arguments received:", arguments)
        }
    }

    //TODO we are not using AIK in BXH. This should method should be removed if we're 100% certain we don't need it.
    /** 
    * Agentless Integration Kit endpoint.
    * Currently only using the pickup endpoint. SP use case.
    * @deprecated Agentless use case was dropped for full OIDC authN/authZ.
    * @param {String} REF - The ref Id returned with the authenticated user.
    * @return {object} An HTTP response object.
    */
    pickUpAPI(REF, adapter) {
        console.info("PingOneAuthN.js", "Attribute pickup from Agentless IK.");

        const refId = REF;
        const myHeaders = new Headers();
        myHeaders.append("ping.instanceid", adapter);
        myHeaders.append("Authorization", "Basic cmVhY3QtdXNlcjoyRmVkZXJhdGVNMHJl"); /* TODO should we obfuscate somehow? Just a demo app, butt still. */

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            credentials: 'include'
        };

        const url = this.pfPickupURI + refId

        return fetch(url, requestOptions);
    }
} export default PingOneAuthN;



var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

var urlencoded = new URLSearchParams();
urlencoded.append("response_type", "token");
urlencoded.append("client_id", "{{appID}}");
urlencoded.append("redirect_uri", "https://example.com");
urlencoded.append("scope", "openid profile p1:read:user");
urlencoded.append("nonce", "123");

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
};

fetch("https://auth.pingone.com/{{envID}}/as/authorize", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));