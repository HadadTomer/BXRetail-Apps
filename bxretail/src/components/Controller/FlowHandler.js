/**
Class representing the apps controller methods, marshaling input and events between
the UI and the integration with Ping products and services.

This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
Implements methods to integrate with PingOne authentication-related API endpoints.

@author Michael Sanchez
@see https://apidocs.pingidentity.com/pingone/platform/v1/api/#authentication-apis
*/

// Components
import React from 'react';
import PingOneAuthZ from '../Integration/PingOneAuthZ';

class FlowHandler extends React.Component {

    constructor(props) {
        super(props);
        this.envVars = window._env_;
        this.Ping1AuthZ = new PingOneAuthZ(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
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
        if (grantType !== "implicit" && grantType !== "authCode") { throw "Invalid grant type provided.";}

        const responseType = (grantType === "implicit" ? "token" : "code");

        return this.Ping1AuthZ.authorize({responseType:responseType, clientId:clientId, redirectURI:redirectURI, scopes:scopes});
   }

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