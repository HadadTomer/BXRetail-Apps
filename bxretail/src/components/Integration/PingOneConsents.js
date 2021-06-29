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
     * Get user consents.
     * @param {string} token Authorization token. 
     * @returns {object} Entire user data response object. 
     */

    async userGetConsent({ token }) {
        console.info("PingOneConsents.js", "Getting the user consents in PingOne, if any.")
        
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        const requestOptions = {
            method: "GET",
            headers: myHeaders
        };

        const url = this.proxyApiPath + "/users/" + "ad163b7d-d433-495e-973b-c5b239e27080"
        const response = await fetch(url, requestOptions);
        const jsonResponse = await response.json();
        console.log("get consents response", jsonResponse);
        return jsonResponse;
    }
    
    
    /**
     * Update user consent.
     * @param {object} consentPayload Consists of username, AnyTVPartner delivery preferences, and communication preferences.
     * @param {string} token Authorization token.
     * @return {type} something here.
     */

    async userUpdateConsent({ consentPayload, token }) {
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

        const url = this.proxyApiPath + "/users/" + "ad163b7d-d433-495e-973b-c5b239e27080" 
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
    enforceConsent({}) {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJjbGllbnRfaWQiOiIwYjUwMTI3NC0zNmMwLTRjMWYtODcxZi0yNGJjYWJkMGE0NzkiLCJpc3MiOiJodHRwczovL2F1dGgucGluZ29uZS5jb20vNDBmNzQ1ZjYtM2Y5MS00Zjg4LWEzMDUtOTNjMGE0MzY5MjkzL2FzIiwiaWF0IjoxNjIyMDQ4MTI0LCJleHAiOjE2MjIwNTE3MjQsImF1ZCI6WyJodHRwczovL2FwaS5waW5nb25lLmNvbSJdLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwic3ViIjoiZGZlMDlmYmQtZjQxMy00OTA2LTk1N2YtMDcyMjhmNzU1MzA5Iiwic2lkIjoiZDlhZTIzZDYtY2U3MS00OTE0LWFlNGMtMzQxNWRkMGIwMWMzIiwiZW52IjoiNDBmNzQ1ZjYtM2Y5MS00Zjg4LWEzMDUtOTNjMGE0MzY5MjkzIiwib3JnIjoiNGVhZGE1NTAtOTZlYi00NDI1LWE1NDEtMDQ2YWI4YWU3MTBjIn0.E4D0tMzKTxyzB3jC79MSa9PcoSoMEvFT_rkQJVkyTDnLoTU2RqovpQRXtg_BvsyKVqu4M0ooT2y_AjeBVLviK8lC6poOEXhaUlUF8sedAtT4eyFlfKJ2CZkKlWK8YEXnK5ApOrB5B8hMrGJqFo2qhjixJPvduBdZsGJK2QR3XDp2MXyYsCv8jy9Dgb3FNEA7yP87l768x-Oz2BwuuH3m8DMdyaRR9bfuFztds6RLeFKTFEz7hVXzed2rqO3ebW9omnfV0c1WvFQkIahaRqwU5TInjdjpexifT3dEgypub5HitBgdcox2ZO9jNXWxVInlUtoMRx89Q75omMzJpvQCEg");

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'manual'
        };

        fetch("https://pingdatagovernance-bxretail-temp-remz.ping-devops.com/apiPath/users/06e247e7-4b41-4507-abda-0c38aa07586b", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }
}
export default PingOneConsents;