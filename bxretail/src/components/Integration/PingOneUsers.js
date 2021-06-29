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
     * @param {String} apiPath management API host.
     * @param {String} envId PingOne tenant environment ID.
     */
    constructor(proxyApiPath, envId) {
        this.proxyApiPath = proxyApiPath;
        this.envId = envId;
    }

    /**
     * What method does.
     * 
     * @param {type} paramName - Short description.
     * @return {type} What's being returned.
    */
    readUser({ userId, lowPrivToken }) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + lowPrivToken);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'manual'
        };
        const url = this.proxyApiPath + "/users/" + userId;
        fetch(url, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
}
export default PingOneUsers;