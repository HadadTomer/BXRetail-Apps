/**
Class representing the apps controller methods, marshaling input and events between
the UI and the integration of Ping products and services.

This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
Implements methods to interact with integration/model components.

@author Michael Sanchez
*/

// Components
import PingOneAuthZ from "../Integration/PingOneAuthZ"; /* PING INTEGRATION: */
import PingOneRegistration from "../Integration/PingOneRegistration"; /* PING INTEGRATION: */
import PingOneAuthN from "../Integration/PingOneAuthN"; /* PING INTEGRATION: */
import PingOneUsers from "../Integration/PingOneUsers"; /* PING INTEGRATION: */
import JSONSearch from "../Utils/JSONSearch"; /* PING INTEGRATION: */

class FlowHandler {

    constructor() {
        this.envVars = window._env_;
        this.ping1AuthZ = new PingOneAuthZ(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID, this.envVars.REACT_APP_PROXYAPIPATH);
        this.ping1Reg = new PingOneRegistration(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
        this.ping1AuthN = new PingOneAuthN(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
        this.ping1Users = new PingOneUsers(this.envVars.REACT_APP_PROXYAPIPATH, this.envVars.REACT_APP_ENVID);
        this.jsonSearch = new JSONSearch(); /* PING INTEGRATION: */
    }

    /**
    * Initializes the authentication flow.
    * Handler for different authentication API request and responses.
    * @param {String} grantType the OAuth grant type to be used.
    * @param {String} clientId the OAuth client from which you want to authorize.
    * @param {String} redirectURI the URI the OAuth client should send you back to after completing OAuth authZ.
    * @param {String} scopes the app or OIDC scopes being requested by the client.
    */
    initAuthNFlow({ grantType, clientId, redirectURI, scopes }) {
        console.info("FlowHandler.js", "Initializing an authorization flow with PingOne.");

        if (grantType !== "implicit" && grantType !== "authCode") { throw "Invalid grant type provided. Controller.FlowHandler.";}

        const responseType = (grantType === "implicit" ? "token" : "code");

        this.ping1AuthZ.authorize({responseType:responseType, clientId:clientId, redirectURI:redirectURI, scopes:scopes});
   }

   /**
    * Parse and prepare a user registration.
    * @param {object} regData state object from user input.
    * @returns {string} the flow status.
    */
   async registerUser({regData}) {
       console.info("FlowHandler.js", "Parsing and preparing user registation data.");
       console.log("regData", regData);
       const rawPayload = JSON.stringify({
           "username": regData.email,
           "email": regData.email,
           "password": regData.password
       });

       const response = await this.ping1Reg.userRegister({regPayLoad:rawPayload, flowId:regData.flowId});
       const status = await response.status;
       return status; 
   }

    /**
     * Verify the user's registration email code.
     * @param {object} regData state object from user input.
     * @param {string} flowId Id for the current authN transaction.
     * @returns {*} the flow status, or response object if there's an error.
     */
    async verifyRegEmailCode({ regEmailCode, flowId }) {
        console.info("FlowHandler.js", "Parsing and preparing user registration verification code.");
        
        const rawPayload = JSON.stringify({
            "verificationCode": regEmailCode
        });

        const response = await this.ping1Reg.userVerify({ regCodePayload: rawPayload, flowId: flowId });
        //TODO do we want to keep this pattern? return status and resumeUrl if "completed", otherwise entire response? Or just error data?
        const status = await response.status;
        if (status === "COMPLETED") {
            return {status:status, resumeUrl:response.resumeUrl};
        } else {
            return response;
        }
    }

    /**
     * Login the user.
     * @param {object} loginData state object from user input.
     * @param {string} flowId Id for the current authN transaction.
     * @returns {*} Response status, or response object if there's an issue.
     */
    async loginUser({loginData, flowId}) {
        console.info("FlowHandler.js", "Parsing and preparing username and password for login.");

        let rawPayload = JSON.stringify({
            "username": loginData.username,
            "password": loginData.password
        });
        const response = await this.ping1AuthN.usernamePasswordCheck({ loginPayload: rawPayload, flowId: flowId});
        const status = await response.status;
        if (status === "COMPLETED") {
            return { status: status, resumeUrl: response.resumeUrl };
        } else {
            return response;
        }
    }

    /**
     * Get requested social provider.
     * @param {string} IdP name of the external IdP for which data is needed.
     * @param {string} flowId Id for the current authN transaction.
     * @returns {object} Portion of the response object for a given social provider.
     */
    async getRequestedSocialProvider({IdP, flowId}) {

        const response = await this.ping1AuthN.readAuthNFlowData({flowId: flowId});
        console.log("response", JSON.stringify(response));
        const resultsArr = await response._embedded.socialProviders;
        console.log("resultsArr", JSON.stringify(resultsArr));
        const result = resultsArr.find(provider => provider["name"] === IdP);
        console.log("results", result);
        return result._links.authenticate.href;
    }

    /**
     * Swap an authZ code for an authZ and ID token.
     * @param {string} code authorization code from AS.
     * @param {string} redirectURI App URL user should be redirected to after swap for token.
     * @returns {object} something here.
     */
    async swapCodeForToken({code, redirectURI}) {
        console.info("FlowHandler.js", "Swapping an auth code for an access token.");

        const bauth = this.envVars.REACT_APP_CLIENT + ":" + this.envVars.REACT_APP_RECSET;
        const swaprods = btoa(bauth);
        const response = await this.ping1AuthZ.getToken({code:code, redirectURI:redirectURI, swaprods:swaprods});
        return response;
    }

    /**
     * Gets a lower privileged token for DG calls that proxy the management APIs.
     * @param {string} code authorization code from AS.
     * @param {string} redirectURI App URL user should be redirected to after swap for token.
     * @returns {object} something here.
     */
    async requestLowPrivToken() {
        console.info("FlowHandler.js", "Requesting a low-privileged access token.");

        const clientCreds = this.envVars.REACT_APP_LOWPRIVCLIENT + ":" + this.envVars.REACT_APP_LOWPRIVRECSET;
        const encodedCreds = btoa(clientCreds);
        const lowPrivToken = await this.ping1AuthZ.getLowPrivilegedToken({ elasticNerd: encodedCreds});
        console.log("lowPrivToken", lowPrivToken);
        return lowPrivToken;
    }

    /**
     * Get a user's profile data.
     * @param {String} IdT OIDC ID JWT token
     * @return {object} JSON object from response.
     */
    getUserProfile({IdT}) {
        console.log("IdT", IdT);
        const sub = this.getTokenValue({token: IdT, key: "sub"});
        console.log("sub", sub);
        this.requestLowPrivToken()
            .then(lowPrivToken => {
            this.ping1Users.readUser({ userId: sub, lowPrivToken: lowPrivToken})
        });
    }

    /**
     * Decode and parse a token for a value.
     * @param {String} token OAuth JWT token.
     * @param {String} key the claim needed from within the token, or "all" to get entire payload.
     * @return {String} value for key requested or JSON web token.
     */
    getTokenValue({token, key}) {
        console.log("TOKEN to search", token);
        console.log("CLAIM to get", key);
        // Extracting the payload portion of the JWT.
        const base64Fragment = token.split('.')[1];
        const decodedFragment = JSON.parse(atob(base64Fragment));
        console.log("decodedFragment", decodedFragment);
        const jwtValue = this.jsonSearch.findValues(decodedFragment, key);
        console.log("jwtValue", jwtValue[0]);
        return jwtValue[0];
    }

    /**
     * 
     */
    lookupUser({userName}) {
        //TODO implement
        // https://api.pingone.com/v1/environments/{{envId}}/users?filter=username eq "user.0"
    }
}
export default FlowHandler;