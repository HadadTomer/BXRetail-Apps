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
    tokenEndpoint = "/as/token";

    constructor(authPath, envId, proxyApiPath) {
        this.authPath = authPath;
        this.envId = envId;
        this.proxyApiPath = proxyApiPath;
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

    /**
     * Get OAuth token.
     * @param {string} code authorization code from AS.
     * @param {string} redirectURI App URL user should be redirected to after swap for token.
     * @returns {object} something here.
     */
    async getToken({ code, redirectURI, swaprods }) {
        console.info("PingOneAuthZ.js", "Swapping an authorization code for an access token.");

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic " + swaprods);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "authorization_code"); //grant type should be a param passed in. But in the demos we're only doing auth code.
        urlencoded.append("code", code);
        urlencoded.append("redirect_uri", redirectURI);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'manual'
        };
        const url = this.authPath + "/as/token";
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        return jsonResponse;
    }

    /**
     * Get low priviliged tokens for the management API proxy (DG AKA Authorize AKA PAZ).
     * @see Remy ;-)
     * @param {String} swparods base64 encoded client credentials. 
     * @return {String} JSON web token 
     */
    async getLowPrivilegedToken({ elasticNerd}) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic " + elasticNerd);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let urlencoded = new URLSearchParams();
        urlencoded.append("grant_type", "client_credentials");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'manual'
        };

        const url = this.authPath + this.tokenEndpoint;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        const lowPrivToken = await jsonResponse.access_token;
        return lowPrivToken;
    }

    /**
     * Introspect a token.
     * @see https://apidocs.pingidentity.com/pingone/platform/v1/api/#post-token-introspection-id-token
     * @param {String} token an OAuth token
     * @return {String} JSON web token.
     */
    tokenIntrospect({token}) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        myHeaders.append("Authorization", "Basic MGI1MDEyNzQtMzZjMC00YzFmLTg3MWYtMjRiY2FiZDBhNDc5OkFOOWtQdHdDeUlrRkxNVndtfmVYRDFxeC1CZkRDZkNha0ZOb1hDOHR+QUdFZS1JeVRaYnYuRElSZmVWbHRRTUw=");

        let urlencoded = new URLSearchParams();
        urlencoded.append("token", "eyJpc3MiOiJodHRwczovL2RlbW8tYnhyZXRhaWwtYXV0aC1xYS5waW5nLWRldm9wcy5jb20vYXMiLCJzdWIiOiJhZDE2M2I3ZC1kNDMzLTQ5NWUtOTczYi1jNWIyMzllMjcwODAiLCJhdWQiOiIwYjUwMTI3NC0zNmMwLTRjMWYtODcxZi0yNGJjYWJkMGE0NzkiLCJpYXQiOjE2MjQ1NjgyNzQsImV4cCI6MTYyNDU3MTg3NCwiYWNyIjoiRGVmYXVsdFBvbGljeSIsImFtciI6WyJwd2QiXSwiYXV0aF90aW1lIjoxNjI0NTY0MjkzLCJhdF9oYXNoIjoiLVZTSXktd0RBMjd0bnpkOE5OeUhJdyIsInNpZCI6IjYxZTcyMmEyLWU3ODEtNGQyMy1hMmRjLTIyOTdjYWNhOTBjNyIsImdpdmVuX25hbWUiOiJEYXZpZCIsInpvbmVpbmZvIjoiRXVyb3BlL1BhcmlzIiwiZmFtaWx5X25hbWUiOiJXZWJiIiwiZW1haWwiOiJkYXZpZHdlYmJAbWFpbGluYXRvci5jb20iLCJ1cGRhdGVkX2F0IjoxNjI0NTY1ODA1LCJuaWNrbmFtZSI6Ikphc29uIEJvdXJuZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImRhdmlkd2ViYkBtYWlsaW5hdG9yLmNvbSIsImZpcnN0TmFtZSI6IkRhdmlkIiwibGFzdE5hbWUiOiJXZWJiIiwic3RyZWV0IjoiMTA0IEF2ZW51ZSBLbGViZXIiLCJwb3N0Y29kZSI6Ijc1MTE2IiwiZW52IjoiNDBmNzQ1ZjYtM2Y5MS00Zjg4LWEzMDUtOTNjMGE0MzY5MjkzIiwib3JnIjoiNGVhZGE1NTAtOTZlYi00NDI1LWE1NDEtMDQ2YWI4YWU3MTBjIiwicDEucmVnaW9uIjoiTkEifQ");

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'manual'
        };

        fetch("https://auth.pingone.com/{{envID}}/as/introspect", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
} export default PingOneAuthZ;