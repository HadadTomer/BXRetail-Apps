/**
 * Class representing consent management and enforcement.
 * This is done with a custom PingOne schema using JSON attributes and PingAuthorize.
 * 
 * This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
 * Implements methods to integrate with PingOne and PingAuthorize-related API endpoints.
 * 
 * @author Michael Sanchez
 * @see https://apidocs.pingidentity.com/pingone/platform/v1/api/#users
 */

class PingOneConsents {

    constructor(proxyApiPath, envId) {
        this.proxyApiPath = proxyApiPath;
        this.envId = envId;
    }
    
    /**
     * Update user consent.
     * @param {object} consentPayload Consists of username, AnyTVPartner delivery preferences, and communication preferences.
     * @param {string} token Authorization token (lowerpriv token?)
     * @param {string} userId User Id GUID of which to update consents on.
     * @return {type} something here.
     */

    async userUpdateConsent({ consentPayload, token, userId }) {
        console.info("PingOneConsents.js", "Setting the user consents in PingOne.");

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/vnd.pingidentity.user.update+json");
        myHeaders.append("Authorization", "Bearer " + token );

        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            body: consentPayload,
            redirect: "manual"
        };

        const url = this.proxyApiPath + "/users/" + userId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        console.log("update consents response", jsonResponse);
        return jsonResponse;
    }

    /**
     * Enforce consents. 
     * 
     * @param {type} param0 Description
     * @return {type} Name Description
     */

    async enforceConsent({ partnerAccessToken, userId }) {
        console.info("PingOneConsents.js", "Enforcing consents from PingOne.");

        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + partnerAccessToken );

        let requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "manual"
        };

        const url = this.proxyApiPath + "/users/" + userId;
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        console.log("enforce consents response", jsonResponse);
        return jsonResponse;
    }
}
export default PingOneConsents;