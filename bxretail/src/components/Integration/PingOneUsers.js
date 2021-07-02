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
     * Read user Data
     * 
     * @param {string} userId - user ID GUID that you would like to read.
     * @param {string} lowPrivToken - Lower privileged token for Management API.
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
}
export default PingOneUsers;