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

    constructor() {

    }

    /**
     * Update user consent.
     * 
     * @param {type} name Description
     * @return {type} name Description
     */

    userUpdateConsent({}) {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/vnd.pingidentity.user.update+json");
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImRlZmF1bHQifQ.eyJjbGllbnRfaWQiOiI5MTYxMTFjMC00MGI0LTRlMjQtYTkwMi05YWYwN2VjOTQxMzgiLCJpc3MiOiJodHRwczovL2F1dGgucGluZ29uZS5jb20vNDBmNzQ1ZjYtM2Y5MS00Zjg4LWEzMDUtOTNjMGE0MzY5MjkzL2FzIiwiaWF0IjoxNjE5NDc0NTk1LCJleHAiOjE2MTk0NzgxOTUsImF1ZCI6WyJodHRwczovL2FwaS5waW5nb25lLmNvbSJdLCJlbnYiOiI0MGY3NDVmNi0zZjkxLTRmODgtYTMwNS05M2MwYTQzNjkyOTMiLCJvcmciOiI0ZWFkYTU1MC05NmViLTQ0MjUtYTU0MS0wNDZhYjhhZTcxMGMifQ.NAufwTUNwhHFwMj-y5fNeTvxg-tM8EaE_u8FSiYVsLyJNIzuXjeIlTxT1Ak-65QJPEYVVIfH2sXnbtALb7cfiwy_VGEzgXWFz28T4v7ajERBg6npSz98bKYK88YVwZ1gz9RCD5xJrouuE5sJopoFKNluk6KyFU4a4RIgmGOySsdOk4bVlF55cZAyGCrzPFN-uPSpgd5G4jvWiBfuGKbOTuBY0WgoNFoad5YAm1hl9k6JEkPS_KnyUQKkzR7gQNprQ6A-cUVMIg4Gm5aws778ZLpCYCWUXr00hOctZ6P4QhuZ7BAWXHrFsvEFz5U3zNJ9Pj-gc-8yOl2yYXgs-N594Q");

        let raw = JSON.stringify({
            "consent": [
                {
                    "status": "active",
                    "subject": "testUser1",
                    "actor": "testUser1",
                    "audience": "BXRApp",
                    "definition": {
                        "id": "tv-delivery-preferences",
                        "version": "1.0",
                        "locale": "en-us"
                    },
                    "titleText": "Share User Delivery Info",
                    "dataText": "Share User Delivery Info",
                    "purposeText": "Share User Delivery Info",
                    "data": {
                        "email": "true",
                        "mobile": "true"
                    },
                    "consentContext": {}
                }
            ]
        });

        let requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: "manual"
        };

        fetch("https://pingdatagovernance-bxretail-temp-remz.ping-devops.com/apiPath/users/be6feb3b-b708-4a10-b449-7660ee52ed44", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
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