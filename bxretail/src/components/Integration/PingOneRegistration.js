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
     * @return {type} Name Description
     **/
   async userRegister({regPayload, flowId}) {
       console.info("PingOneRegistration.js", "Registering the user input at PingOne.");

       let myHeaders = new Headers();
       myHeaders.append("Content-Type", "application/vnd.pingidentity.user.register+json");

       const requestOptions = {
           method: 'POST',
           headers: myHeaders,
           body: arguments[0]["regPayLoad"],
           redirect: 'manual'
       };

       const url = this.authPath + "/" + this.envId + "/flows/" + flowId;
       const response = await fetch(url, requestOptions);
       const jsonResponse = await response.json();
       return jsonResponse;
   }

   /**
    * Resend user verification if they didn't receive the orignal verification code in email.
    * @param {type} Name Description
    * @return {type} Name Description
    */
   userSendVerification({}) {
       let myHeaders = new Headers();
       myHeaders.append("Content-Type", "application/vnd.pingidentity.user.sendVerificationCode+json");
       myHeaders.append("Cookie", "ST=f3d863e9-84ec-43f4-8213-0c0bf58532d9; ST-NO-SS=f3d863e9-84ec-43f4-8213-0c0bf58532d9");

       let rawPayload = JSON.stringify({
           "verificationCode": "y1pwj6fl"
       });

       let requestOptions = {
           method: 'POST',
           headers: myHeaders,
           body: rawPayload,
           redirect: 'manual'
       };

       fetch("https://auth.pingone.com/40f745f6-3f91-4f88-a305-93c0a4369293/flows/03e94068-d8fb-43d7-a8f1-e9f6f692ea29", requestOptions)
           .then(response => response.text())
           .then(result => console.log(result))
           .catch(error => console.log('error', error));
   }

   /**
    * Verify the user.
    * @param {type} Name Description
    * @return {type} Name Description
    */
   userVerify({}) {
       let myHeaders = new Headers();
       myHeaders.append("Content-Type", "application/vnd.pingidentity.user.verify+json");
       myHeaders.append("Cookie", "ST=f3d863e9-84ec-43f4-8213-0c0bf58532d9; ST-NO-SS=f3d863e9-84ec-43f4-8213-0c0bf58532d9");

       let rawPayload = JSON.stringify({
           "verificationCode": "w8t0bigb"
       });

       let requestOptions = {
           method: 'POST',
           headers: myHeaders,
           body: rawPayload,
           redirect: 'manual'
       };

       fetch("https://auth.pingone.com/40f745f6-3f91-4f88-a305-93c0a4369293/flows/03e94068-d8fb-43d7-a8f1-e9f6f692ea29", requestOptions)
           .then(response => response.text())
           .then(result => console.log(result))
           .catch(error => console.log('error', error));
   }
}
export default PingOneRegistration;