/**
Class representing the apps controller methods, marshaling input and events between
the UI and the integration with Ping products and services.

This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
Implements methods to integrate with PingOne authentication-related API endpoints.

@author Michael Sanchez
@see https://apidocs.pingidentity.com/pingone/platform/v1/api/#authentication-apis
*/

// Components
import PingOneAuthZ from '../Integration/PingOneAuthZ';
import PingOneRegistration from '../Integration/PingOneRegistration';

class FlowHandler {

    constructor() {
        this.envVars = window._env_;
        this.Ping1AuthZ = new PingOneAuthZ(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
        this.Ping1Reg = new PingOneRegistration(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
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
       console.log("rawPayload", rawPayload);
       const response = await this.Ping1Reg.userRegister({regPayLoad:rawPayload, flowId:regData.flowId});
       console.log("response", JSON.stringify(response));
       const status = await response.status;
       return status; 
   }

    /**
     * Verify the user's registration email code.
     * @param {object} regData state object from user input.
     * @returns {string} the flow status.
     */
    async verifyRegEmailCode({ regEmailCode, flowId }) {
        console.info("FlowHandler.js", "Parsing and preparing user registration verification code.");
        console.log("regEmailCode", regEmailCode);
        console.log("flowId in FlowHandler", flowId);
        const rawPayload = JSON.stringify({
            "verificationCode": regEmailCode
        });

        const response = await this.Ping1Reg.userVerify({ regCodePayload: rawPayload, flowId: flowId });
        console.log("response", JSON.stringify(response));
        //TODO do we want to keep this pattern? return status and resumeUrl if "completed", otherwise entire response? Or just error data?
        const status = await response.status;
        if (status === "COMPLETED") {
            return {status:status, resumeUrl:response.resumeUrl};
        } else {
            return response.JSON();
        }
    }


//    ####################################
//    NOT SURE IF WE'RE USING THE BELOW METHOD.
//    TAKEN FROM BXF. NOT FEELING LIKE AN IDEAL DESIGN IN CONTROLLER TERMS. TBD.
    /** 
    * Authentication API's flow handler.
    * Handler for different authentication API request and responses.
    * @param {String} flowResponse - The API response object from the previous flow request.
    * @param {String} identifier the userName of the authenticating user.
    * @param {String} swaprods - The user's password if doing password authentication.
    * @param {boolean} rememberMe - Whether the user wants their userName remembered at future visits.
    */
    handleAuthNflow({ flowResponse, identifier, swaprods, rememberMe }) {
        console.info("PingOneAuthZ.js", "Handling flow response from authN API.");

        let payload = '{}';
        if (!flowResponse) { flowResponse = {}; } //This won't exist if we only get a flowId. So create it to let switch/case default kick in.
        console.info("flowResponse.status", flowResponse.status);
        switch (flowResponse.status) {
            case "REGISTRATION_REQUIRED":
                console.info("PingOneAuthZ.js", "REGISTRATION_REQUIRED");
                //TODO can probably remove this case. nothing to do here. app needs to trigger modalRegister.
                break;
            case "IDENTIFIER_REQUIRED":
                console.info("PingOneAuthZ.js", "IDENTIFIER_REQUIRED");
                payload = '{\n  \"identifier\": \"' + identifier + '\"\n}';
                return this.authnAPI({ method: "POST", flowId: flowResponse.id, contentType: "application/vnd.pingidentity.submitIdentifier+json", body: payload });
                break;
            case "USERNAME_PASSWORD_REQUIRED":
                console.info("PingOneAuthZ.js", "USERNAME_PASSWORD_REQUIRED");
                payload = '{\n \"username\": \"' + flowResponse.username + '\", \"password\": \"' + swaprods + '\", \"rememberMyUsername\": \"' + rememberMe + '\", \"captchaResponse\": \"\" \n}';
                return this.authnAPI({ method: "POST", flowId: flowResponse.id, contentType: "application/vnd.pingidentity.checkUsernamePassword+json", body: payload });
                break;
            case "RESUME":
                console.info("PingOneAuthZ.js", "RESUME");
                window.location.assign(flowResponse.resumeUrl);
                break;
            case "FAILED":
                console.info("PingOneAuthZ.js", flowResponse.message);
                return flowResponse;
            default: // Why are we here???
                console.error("PingOneAuthZ.js", "In default case. We shouldn't be here. Whisky tango foxtrot?");
                console.error("Arguments received:", arguments);
        }
    }
}
export default FlowHandler;