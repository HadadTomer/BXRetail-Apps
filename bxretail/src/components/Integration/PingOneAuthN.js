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
     * Get a copy of runtime vars during instantiation. Intitialize state object.
     * No arg constructor.
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
}
export default PingOneAuthN;