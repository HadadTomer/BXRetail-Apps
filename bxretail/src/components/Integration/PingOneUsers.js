/**
* Class representing users in PingOne Directory.
* 
* This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
* Implements methods to integrate with PingOne via the management APIs.
* 
* @author Michael Sanchez
* @see https://apidocs.pingidentity.com/pingone/platform/v1/api/#management-apis
*/

// Packages
// import React from 'react';

// Components
// import < classNameRef > from '../path/to/js/file';

class PingOneUsers {

    /**
     * What constructor does [optional if nothing done special for instantiation].
     * @param {String} proxyApiPath management API host.
     * @param {String} envId PingOne tenant environment ID.
     */
    constructor(proxyApiPath, envId) {
        this.proxyApiPath = proxyApiPath;
        this.envId = envId;
    }

    /**
     * Read one user's data.
     * 
     * @param {string} userId - user ID GUID that you would like to read.
     * @param {string} lowPrivToken - Lower privileged token for Management API.
     * @param {string} currentSessionId - Current ST Session ID
     * @return {object} jsonResponse - json object of user data.
    */
    async readUser({ userId, lowPrivToken }) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + lowPrivToken);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'manual'
        };
        const url = this.proxyApiPath + "/users/" + userId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();

        return jsonResponse;
    }

    /**
     * Read all users.
     * 
     * @param {String} lowPrivToken A lower privilged token used by DG/PAZ to make mgmt. API calls. 
     * @param {String} limit  Number of records to be returned in search. (Optional)
     * @param {String} filter The query param/value string to search filter results. (Optional)
     * @returns 
     */
    async readUsers({ lowPrivToken, limit="", filter="" }) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + lowPrivToken);

        let requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "manual"
        };
        let url = this.proxyApiPath + "/users";
        if (limit.length) {url += "?limit=" + limit}
        if (filter.length && limit.length) {
            url += "&filter=" + filter
        } else if (filter.length) {
            url += "?filter=" + filter
        }
        console.log("filter", filter);
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();

        return jsonResponse;
    }

    /**
     * Update a user's record.
     * @param {String} userPayload JSON literal of updated user attributes.
     * @return {object} something?
     */
    async updateUser({ userId, lowPrivToken, userPayload }) {
        let myHeaders = new Headers();
        myHeaders.append("content-type", "application/json");
        myHeaders.append("Authorization", "Bearer " + lowPrivToken);

        let requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: userPayload,
            redirect: 'manual'
        };

        const url = this.proxyApiPath + "/users/" + userId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        return jsonResponse;
    }

    /**
     * Update a user's MFA preferences. 
     * @param {}
     * @return
     */

    async toggleMFA({lowPrivToken, userPayload, userId}) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + lowPrivToken);

        let requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: userPayload,
            redirect: "manual"
        };
        console.log("toggle MFA request Options", requestOptions);

        const url = this.proxyApiPath + "/users/" + userId + "/mfaEnabled";
        console.log("toggle MFA url", url);
        
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        console.log("toggle MFA jsonResponse", jsonResponse);

        return jsonResponse;
    }

    // ST integration
    async getSTRiskScore({ currentSessionId, lowPrivToken }) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + lowPrivToken);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'manual'
        };
        const url = this.proxyApiPath.split("/apiPath")[0] + "/sessionRisk/" + currentSessionId; // parsing out the URL path for now
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();

        return jsonResponse;
    }

}
export default PingOneUsers;
