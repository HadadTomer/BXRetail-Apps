/**
Class representing the apps controller methods, marshaling input and events between
the UI and the integration with Ping products and services.

This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
Implements methods to integrate with PingOne authentication-related API endpoints.

@author Michael Sanchez
@see https://apidocs.pingidentity.com/pingone/platform/v1/api/#authentication-apis
*/

// Components
import PingOneAuthZ from '../Integration/PingOneAuthZ'; /* PING INTEGRATION: */
import PingOneRegistration from '../Integration/PingOneRegistration'; /* PING INTEGRATION: */
import PingOneAuthN from '../Integration/PingOneAuthN'; /* PING INTEGRATION: */

class FlowHandler {

    constructor() {
        this.envVars = window._env_;
        this.Ping1AuthZ = new PingOneAuthZ(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
        this.Ping1Reg = new PingOneRegistration(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
        this.Ping1AuthN = new PingOneAuthN(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
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

        this.Ping1AuthZ.authorize({responseType:responseType, clientId:clientId, redirectURI:redirectURI, scopes:scopes});
   }

   /**
    * Parse and prepare a user registration.
    * @param {object} regData state object from user input.
    * @returns {string} the flow status.
    */
   async registerUser({regData}) {
       console.info("FlowHandler.js", "Parsing and preparing user registation data.");

       const rawPayload = JSON.stringify({
           "username": regData.email,
           "email": regData.email,
           "given": regData.firstname,
           "mobilePhone": regData.phone,
           "password": regData.password
       });
       const response = await this.Ping1Reg.userRegister({regPayLoad:rawPayload, flowId:regData.flowId});
       console.log("controller reg response", response);
       const status = await response.status;
       return status; 
   }

    /**
     * Verify the user's registration email code.
     * @param {object} regData state object from user input.
     * @returns {string} the flow status, or response object if there's an error.
     */
    async verifyRegEmailCode({ regEmailCode, flowId }) {
        console.info("FlowHandler.js", "Parsing and preparing user registration verification code.");
        
        const rawPayload = JSON.stringify({
            "verificationCode": regEmailCode
        });

        const response = await this.Ping1Reg.userVerify({ regCodePayload: rawPayload, flowId: flowId });
        //TODO do we want to keep this pattern? return status and resumeUrl if "completed", otherwise entire response? Or just error data?
        console.log("controller code response", response);
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
     * @returns {string} something.
     */
    async loginUser({loginData, flowId}) {
        console.info("FlowHandler.js", "Parsing and preparing username and password for login.");

        let rawPayload = JSON.stringify({
            "username": loginData.username,
            "password": loginData.password
        });
        const response = await this.Ping1AuthN.usernamePasswordCheck({ loginPayload: rawPayload, flowId: flowId});
        const status = await response.status;
        if (status === "COMPLETED") {
            return { status: status, resumeUrl: response.resumeUrl };
        } else {
            return response;
        }
    } 
}
export default FlowHandler;