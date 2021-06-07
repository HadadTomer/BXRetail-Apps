/**
Class representing PingOne authorization API's integration.
This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
Implements methods to integrate with PingOne authentication-related API endpoints.

@author Michael Sanchez
@see https://apidocs.pingidentity.com/pingone/platform/v1/api/#authentication-apis
*/

// Packages

// Components
// import { uuidv4 } from '../Utils/Utils';

class PingOneAuthZ {
    authzEndpoint = "/as/authorize";

    constructor(authPath, envId) {
        this.authPath = authPath;
        this.envId = envId;
    }

    /**
     * Start an authorization flow.
     * 
     * @param {String} responseType - The OAuth grant type. Options are "code" and "token".
     * @param {String} clientId - The client ID of the OAuth application.
     * @param {String} redirectURI - The URL to which the OAuth AS should redirect the user with a flowId.
     * @param {String} scopes - The OAuth scopes needed for the given for which the user is being authorized.
     * @return {String} The flowId extracted from the 302 redirect URL.
    */
    async authorize({ responseType, clientId, redirectURI, scopes }) {
        console.info("PingOneAuthZ.js", "Sending user to the authorize endpoint to start an authN flow and get a flowId.");

        const url = this.authPath + "/as/authorize?response_type=" + responseType + "&client_id=" + clientId + "&redirect_uri=" + redirectURI + "&scope=" + scopes;
        
        window.location.assign(url);
    }
} export default PingOneAuthZ;