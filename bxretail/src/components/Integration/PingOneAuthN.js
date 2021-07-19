/**
* Class representing PingOne authentication operations.
* 
* This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
* Implements methods to integrate with PingOne authentication APIs.
* 
* @author Michael Sanchez
* @see https://apidocs.pingidentity.com/pingone/platform/v1/api/#authentication-apis
*/

// Packages

// Components

class PingOneAuthN {

    /**
     * Class constructor
     * @param {String} authPath PingOne auth path for your regions tenant. (For BXR, could be the DG (PAZ) proxy host.)
     * @param {String} envId PingOne environment ID needed for authZ integrations.
     */
    constructor(authPath, envId) {
        this.envVars = window._env_;
        this.authPath = authPath;
        this.envId = envId;
        this.state = {};
    }

    /**
     * Validate a user's userName and password.
     * @see https://apidocs.pingidentity.com/pingone/platform/v1/api/#post-check-usernamepassword
     * @param {string} loginPayload - User input object.
     * @param {string} flowId Id for the current authN transaction.
     * @return {object} JSON formatted response object.
    */
    async usernamePasswordCheck({ loginPayload, flowId }) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/vnd.pingidentity.usernamePassword.check+json");

        let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: loginPayload,
            redirect: "manual",
            credentials: "include"
        };

        const url = this.authPath + "/flows/" + flowId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        return jsonResponse;
    }

    /**
     * Select our only enrolled device (email) for the user. Not based on user input.
     * //TODO this is not needed as login will send an OTP to the one and only enrolled device (only email for right now) without having to select a device.
     * Leaving in here in case we decide to enroll more devices in the future.
     * @param {*} param0 
     * @returns 
     */
    async selectDevice({ devicePayload, flowId }) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/vnd.pingidentity.device.select+json");
    
        let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: devicePayload,
            redirect: "manual",
            credentials: "include"
        };

        const url = this.authPath + "/flows/" + flowId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        return jsonResponse;
    }

    /**
     * OTP Request for users who have opted into MFA.
     * @param {*} param0 
     * @returns 
     */
    async OTPRequest({ otpPayload, flowId }) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/vnd.pingidentity.otp.check+json");

        let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: otpPayload,
            redirect: 'manual',
            credentials: "include"
          };

          const url = this.authPath + "/flows/" + flowId;
          const response = await fetch(url, requestOptions);
          const jsonResponse = await response.json();
          return jsonResponse;
    }

    /**
     * Receives username to start the self-service forgot password flow.
     * @param {string} flowId
     * @param {object} forgotPasswordPayload 
     * @returns 
     */
    async forgotPassword ({ flowId, forgotPasswordPayload }) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/vnd.pingidentity.password.forgot+json");

        let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: forgotPasswordPayload,
            redirect: "manual",
            credentials: "include"
        };

        const url = this.authPath + "/flows/" + flowId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        return jsonResponse;        
    }

    /**
     * Accepts the recovery code and new password for self-service password reset.
     * @param {string} flowId
     * @param {string} recoveryCode
     * @param {string} newPassword
     * @returns response
     */
    async recoverPasscode ({ flowId, recoverPasscodePayload }) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/vnd.pingidentity.password.recover+json");

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: recoverPasscodePayload,
        redirect: "manual",
        credentials: "include"
    };

    const url = this.authPath + "/flows/" + flowId;
    const response = await fetch(url, requestOptions);
    const jsonResponse = await response.json();
    return jsonResponse;        
    }

    /**
     * Read a user's password state.
     * @see // https://apidocs.pingidentity.com/pingone/platform/v1/api/#get-read-password-state
     * @param {*} param0 
     * @returns 
     */
    readPasswordState({}) {
        return true;
    }

    /**
     * Read the user's current authN API flow data.
     * @see https://apidocs.pingidentity.com/pingone/platform/v1/api/#get-read-flow
     * @param {string} flowId Id for the current authN transaction.
     * @return {type} What's being returned.
    */
    async readAuthNFlowData({ flowId }) {
        const requestOptions = {
            method: 'GET',
            redirect: 'manual',
            credentials: "include"
        };

        const url = this.authPath + "/flows/" + flowId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        return jsonResponse;
    }

    /**
     * Read a user's sessions
     * @param {String} lowPrivToken 
     * @param {String} userID The PingOne user ID.
     */
    async readUserSessions({lowPrivToken, userID}) {
        //https://api.pingone.com/v1/environments/40f745f6-3f91-4f88-a305-93c0a4369293/users/ad163b7d-d433-495e-973b-c5b239e27080/sessions

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + lowPrivToken);

        const requestOptions = {
            headers: myHeaders,
            method: "GET",
            redirect: "manual"
        }

        const url = this.authPath + "/users/" + userID + "/sessions";
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        console.log("readUserSessions", JSON.stringify(jsonResponse));
        return jsonResponse._embedded.sessions[0];
    }

    /**
     * Delete a user's sessions
     * @param {String} lowPrivToken
     * @param {String} sessionId The user's session ID of the session to be deleted.
     * @return something
     */
    async userDeleteSession({lowPrivToken, userId, sessionId}) {
        console.log("userDeleteSession called.")

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + lowPrivToken);

        const requestOptions = {
            headers: myHeaders,
            method: "DELETE",
            redirect: "manual"
        }

        const url = this.authPath + "/users/" + userId + "/sessions/" + sessionId;
        const response = await fetch(url, requestOptions);
        const deleteResponse = await response.status;
        console.log("Delete Session status", deleteResponse);
        return deleteResponse;
    }
}
export default PingOneAuthN;