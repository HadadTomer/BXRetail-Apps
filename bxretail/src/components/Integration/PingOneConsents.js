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
    //TODO need to use partnerAccessToken once we have federated log-in hooked up.
    async enforceConsent({ partnerAccessToken, userId }) {
        console.info("PingOneConsents.js", "Enforcing consents from PingOne.");

        let myHeaders = new Headers();
        // myHeaders.append("Authorization", "Bearer " + partnerAccessToken );
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJjbGllbnRfaWQiOiIwYjUwMTI3NC0zNmMwLTRjMWYtODcxZi0yNGJjYWJkMGE0NzkiLCJpc3MiOiJodHRwczovL2F1dGgucGluZ29uZS5jb20vNDBmNzQ1ZjYtM2Y5MS00Zjg4LWEzMDUtOTNjMGE0MzY5MjkzL2FzIiwiaWF0IjoxNjI1NzY1NzY4LCJleHAiOjE2MjU3NjkzNjgsImF1ZCI6WyJodHRwczovL2FwaS5waW5nb25lLmNvbSJdLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIiwic3ViIjoiNjIyMmRkMjQtYjNjMC00M2ZkLTljYzUtMTBiMTI2M2IxNmY2Iiwic2lkIjoiNDdlZmEyZmMtMTg3Zi00ZDM4LTliM2MtMDhjMTk5YTY3ZDhiIiwiZW52IjoiNDBmNzQ1ZjYtM2Y5MS00Zjg4LWEzMDUtOTNjMGE0MzY5MjkzIiwib3JnIjoiNGVhZGE1NTAtOTZlYi00NDI1LWE1NDEtMDQ2YWI4YWU3MTBjIn0.NgnWJPK9gRzcxfecyrSWLLWKLfEsrE0OWutklDBZtfa6IV2SyhYsKWU4ybqpq-N0FJo-Gk9WL28L7AdcMcKmK2OfIICxWrhSqjXLxBBGmCX3zx8VqzxMXTFHy9iK8oK_aUOJdi4zkpc9ITcv9q24hGITg8r9smMsu0CkJ-WlPH0FRi5iQzmmo9qnyHtqHqoG_TFbkTO_PGKD0hUXmCTejMt5m7eGJoB9AELXvriBUDya0ak22FxZi-mvtQA_pNtJJzbj7CdpRPdnzrVKSOjtp9B-KtVYS20tiSlnh2U47sNG_wqtDNm8zVO65mjByiEwc5f7RhtIu3_FvuYMzc_U7g" );

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