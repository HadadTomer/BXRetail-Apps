/**
Class representing PingOne registration and profile managemente API's integration.
This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
Implements methods to integrate with PingOne authentication-related API endpoints.

@author Michael Sanchez
@see https://apidocs.pingidentity.com/pingone/platform/v1/api/#management-apis
*/

// Components


class PingOneRegistration {

    constructor(authPath, envId) {
        this.authPath = authPath;
        this.envId = envId;
    }

    /**
     * Register a user with PingOne.
     * 
     * @param {object} regPayload User input object.
     * @param {string} flowId flowId from initial authorize endpoint call.
     * @return {object} jsonResponse API response object in JSON format.
     **/
    async userRegister({ regPayload, flowId }) {
        console.info("PingOneRegistration.js", "Registering the user input at PingOne.");
        
        console.log("regPayload", regPayload);
        console.log("argTest", arguments[0]["regPayLoad"]);
        
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/vnd.pingidentity.user.register+json");

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: arguments[0]["regPayLoad"],
            redirect: "manual",
            credentials: "include"
        };

        const url = this.authPath + "/flows/" + flowId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        console.log("model reg response", jsonResponse);
        return jsonResponse;
    }

    /**
     * Verify the user's registration email code.
     * @param {string} rawPayload JSON of the verificationCode payload to send to the API.
     * @param {string} flowId Id for the current authZ/authN transaction.
     * @return {} something
     */
    async userVerify({ regCodePayload, flowId }) {
        console.log("PingOneRegistration.js", "Sending in user's registration email verification code.")

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/vnd.pingidentity.user.verify+json");

        let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: regCodePayload,
            redirect: "manual",
            credentials: "include"
        };

        const url = this.authPath + "/flows/" + flowId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        console.log("model code response", jsonResponse);
        return jsonResponse;
    }

    /**
     * Resend user verification if they didn't receive the orignal verification code in email.
     * @param {type} Name Description
     * @return {type} Name Description
     */
    //TODO not implemented yet.
    userSendVerification({ regVerifyPayLoad, flowId }) {
        console.log("PingOneRegistration.js", "REsending registration email verification code.")

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/vnd.pingidentity.user.sendVerificationCode+json");

        let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: regVerifyPayLoad,
            redirect: "manual",
            credentials: "include"
        };

        const url = this.authPath + "/flows/" + flowId;
        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
}
export default PingOneRegistration;