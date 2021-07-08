/**
Class representing the apps controller methods, marshaling input and events between
the UI and the integration of Ping products and services.

This demo-specifc class is developed and maintained by PingIdentity Technical Enablement.
Implements methods to interact with integration/model components.

@author Michael Sanchez
*/

// Packages
import jsonwebtoken, { sign } from "jsonwebtoken";

// Components
import PingOneAuthZ from "../Integration/PingOneAuthZ"; /* PING INTEGRATION: */
import PingOneRegistration from "../Integration/PingOneRegistration"; /* PING INTEGRATION: */
import PingOneAuthN from "../Integration/PingOneAuthN"; /* PING INTEGRATION: */
import PingOneUsers from "../Integration/PingOneUsers"; /* PING INTEGRATION: */
import JSONSearch from "../Utils/JSONSearch"; /* PING INTEGRATION: */
import PingOneConsents from "../Integration/PingOneConsents"; /* PING INTEGRATION */
import Session from "../Utils/Session"; /* PING INTEGRATION */
import { uuidv4 } from "../Utils/UUIDv4"; /* PING INTEGRATION: */

class FlowHandler {
    BXF_E = "MTcxNjEwNDctMjkwZi00Yzg4LWI3NzEtMDFhZGM0ZTgxNTY0";
    BXF_C = "MDI4ODg3YmUtNWQ1Ny00Y2I4LWFlYjktODc0YzRmMjAyYWUw";
    BXF_S = "WkRhVXBiNE9qbFZ0N0R5R19NMnB3MVVyWm8uZGQxdzFFT25VbTNkVGo3WThqSWtUaWlCaXg2cExIRUdNSmxyMg==";
    BXF_A = "https://auth.pingone.com/" + atob(this.BXF_E) + "/as";
    BXF_T = "transaction";

    constructor() {
        this.envVars = window._env_;
        this.ping1AuthZ = new PingOneAuthZ(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID, this.envVars.REACT_APP_PROXYAPIPATH);
        this.ping1Reg = new PingOneRegistration(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
        this.ping1AuthN = new PingOneAuthN(this.envVars.REACT_APP_AUTHPATH, this.envVars.REACT_APP_ENVID);
        this.ping1Users = new PingOneUsers(this.envVars.REACT_APP_PROXYAPIPATH, this.envVars.REACT_APP_ENVID);
        this.jsonSearch = new JSONSearch(); /* PING INTEGRATION: */
        this.ping1Consents = new PingOneConsents(this.envVars.REACT_APP_PROXYAPIPATH, this.envVars.REACT_APP_ENVID);
        this.session = new Session();
    }

    /**
    * Initializes the authentication flow.
    * Handler for different authentication API request and responses.
    * @param {String} grantType the OAuth grant type to be used.
    * @param {String} clientId the OAuth client from which you want to authorize.
    * @param {String} redirectURI the URI the OAuth client should send you back to after completing OAuth authZ.
    * @param {String} scopes the app or OIDC scopes being requested by the client.
    */
    initAuthNFlow({ grantType, clientId, redirectURI, scopes }) {
        console.info("FlowHandler.js", "Initializing an authorization flow with PingOne.");

        if (grantType !== "implicit" && grantType !== "authCode") { throw "Invalid grant type provided. Controller.FlowHandler."; }

        const responseType = (grantType === "implicit" ? "token" : "code");

        this.ping1AuthZ.authorize({ responseType: responseType, clientId: clientId, redirectURI: redirectURI, scopes: scopes });
    }

    /**
     * Parse and prepare a user registration.
     * @param {object} regData state object from user input.
     * @returns {string} the flow status.
     */
    async registerUser({ regData }) {
        console.info("FlowHandler.js", "Parsing and preparing user registation data.");
        console.log("regData", regData);
        const rawPayload = JSON.stringify({
            "username": regData.email,
            "email": regData.email,
            "password": regData.password
        });

        const response = await this.ping1Reg.userRegister({ regPayLoad: rawPayload, flowId: regData.flowId });
        const status = await response.status;
        return status;
    }

    /**
     * Verify the user's registration email code.
     * @param {object} regData state object from user input.
     * @param {string} flowId Id for the current authN transaction.
     * @returns {*} the flow status, or response object if there's an error.
     */
    async verifyRegEmailCode({ regEmailCode, flowId }) {
        console.info("FlowHandler.js", "Parsing and preparing user registration verification code.");

        const rawPayload = JSON.stringify({
            "verificationCode": regEmailCode
        });

        const response = await this.ping1Reg.userVerify({ regCodePayload: rawPayload, flowId: flowId });
        //TODO do we want to keep this pattern? return status and resumeUrl if "completed", otherwise entire response? Or just error data?
        const status = await response.status;
        if (status === "COMPLETED") {
            return { status: status, resumeUrl: response.resumeUrl };
        } else {
            return response;
        }
    }

    /**
     * Login the user.
     * @param {object} loginData state object from user input.
     * @param {string} flowId Id for the current authN transaction.
     * @returns {*} Response status, or response object if there's an issue.
     */
    async loginUser({ loginData, flowId }) {
        console.info("FlowHandler.js", "Parsing and preparing username and password for login.");

        let rawPayload = JSON.stringify({
            "username": loginData.username,
            "password": loginData.password
        });
        const response = await this.ping1AuthN.usernamePasswordCheck({ loginPayload: rawPayload, flowId: flowId });
        const status = await response.status;
        if (status === "COMPLETED") {
            return { status: status, resumeUrl: response.resumeUrl };
        } else {
            return response;
        }
    }

    /**
     * Get requested social provider.
     * @param {string} IdP name of the external IdP for which data is needed.
     * @param {string} flowId Id for the current authN transaction.
     * @returns {object} Portion of the response object for a given social provider.
     */
    async getRequestedSocialProvider({ IdP, flowId }) {

        const response = await this.ping1AuthN.readAuthNFlowData({ flowId: flowId });
        console.log("response", JSON.stringify(response));
        const resultsArr = await response._embedded.socialProviders;
        console.log("resultsArr", JSON.stringify(resultsArr));
        const result = resultsArr.find(provider => provider["name"] === IdP);
        console.log("results", result);
        return result._links.authenticate.href;
    }

    /**
     * Swap an authZ code for an authZ and ID token.
     * @param {string} code authorization code from AS.
     * @param {string} redirectURI App URL user should be redirected to after swap for token.
     * @returns {object} something here.
     */
    async swapCodeForToken({ code, redirectURI }) {
        console.info("FlowHandler.js", "Swapping an auth code for an access token.");

        const bauth = this.envVars.REACT_APP_CLIENT + ":" + this.envVars.REACT_APP_RECSET;
        const swaprods = btoa(bauth);
        const response = await this.ping1AuthZ.getToken({ code: code, redirectURI: redirectURI, swaprods: swaprods });
        return response;
    }

    /**
     * Gets a lower privileged token for DG calls that proxy the management APIs.
     * @param {string} code authorization code from AS.
     * @param {string} redirectURI App URL user should be redirected to after swap for token.
     * @returns {object} something here.
     */
    async requestLowPrivToken() {
        console.info("FlowHandler.js", "Requesting a low-privileged access token.");

        const clientCreds = this.envVars.REACT_APP_LOWPRIVCLIENT + ":" + this.envVars.REACT_APP_LOWPRIVRECSET;
        const encodedCreds = btoa(clientCreds);
        const lowPrivToken = await this.ping1AuthZ.getLowPrivilegedToken({ elasticNerd: encodedCreds });
        console.log("lowPrivToken", lowPrivToken);
        return lowPrivToken;
    }

    /**
     * Get a user's profile data.
     * @param {String} IdT OIDC ID JWT token
     * @return {object} JSON object from response.
     */
    async getUserProfile({ IdT }) {
        const sub = this.getTokenValue({ token: IdT, key: "sub" });

        const lowPrivToken = await this.requestLowPrivToken();
        const response = await this.ping1Users.readUser({ userId: sub, lowPrivToken: lowPrivToken });

        return response;
    }

    /**
     * Update a user's profile.
     * @param {object} userState state object from UI.
     * @return {*} something? 
     */
    async updateUserProfile({ IdT, userState }) {

        const rawPayload = JSON.stringify({
            "name": {
                "given": userState.firstname,
                "family": userState.lastname,
                "formatted": userState.fullname
            },
            "address": {
                "streetAddress": userState.street,
                "locality": userState.city,
                "region": userState.city,
                "postalCode": userState.zipcode
            },
            "email": userState.email,
            "mobilePhone": userState.phone,
            "BXRetailCustomAttr1": userState.birthdate
        }); console.log("rawPayload", rawPayload);

        const sub = this.getTokenValue({ token: IdT, key: "sub" });
        const lowPrivToken = await this.requestLowPrivToken();
        const jsonResponse = await this.ping1Users.updateUser({ userId: sub, lowPrivToken: lowPrivToken, userPayload: rawPayload });

        //We got a problem
        if (jsonResponse.code) {
            return jsonResponse;
        } else {
            return { success: true };
        }
    }

    /**
     * Decode and parse a token for a value.
     * @param {String} token OAuth JWT token.
     * @param {String} key the claim needed from within the token, or "all" to get entire payload.
     * @return {String} value for key requested or JSON web token.
     */
    getTokenValue({ token, key }) {
        // Extracting the payload portion of the JWT.
        console.log("token", token);
        const base64Fragment = token.split('.')[1];
        const decodedFragment = JSON.parse(atob(base64Fragment));
        const jwtValue = this.jsonSearch.findValues(decodedFragment, key); //FIXME this can be converted to Javascripts intrinsic .find() function.
        return jwtValue[0];
    }

    /**
     * 
     */
    lookupUser({ userName }) {
        //TODO implement
        // https://api.pingone.com/v1/environments/{{envId}}/users?filter=username eq "user.0" <-- urlEncode
    }

    /**
     * Opt a user in or out of MFA
     * @param {*} param0 
     * @returns 
     */

    async toggleMFA({IdT, toggleState}) {

        const rawPayload = JSON.stringify({
            "mfaEnabled": toggleState
        });
        console.log("toggleMFA rawPayload", rawPayload);

        const lowPrivToken = await this.requestLowPrivToken();
        const userId = this.getTokenValue({ token: IdT, key: "sub" });
        const response = await this.ping1Users.toggleMFA({lowPrivToken: lowPrivToken, userPayload: rawPayload, userId: userId});
        const status = await response.status;
        return status;

    }

    /** 
     * Set consents for a user.
     * @param {object} consentData consists of username, AnyTVPartner delivery preferences, and communication preferences.
     * @returns {} something here.
     */
    async userUpdateConsent({ consentData, IdT }) {
        console.info("Flowhandler.js", "Updating user consents.")
        const user = await this.getUserProfile({ IdT: IdT })
        const userId = this.getTokenValue({ token: IdT, key: "sub" });

        consentData = {
            subject: user.email,
            deliveryEmail: JSON.stringify(consentData.deliveryEmailChecked),
            deliveryPhone: JSON.stringify(consentData.deliveryPhoneChecked),
            commEmail: JSON.stringify(consentData.commEmailChecked),
            commSms: JSON.stringify(consentData.commSmsChecked),
            commMail: JSON.stringify(consentData.commMailChecked)
        };

        let rawPayload = JSON.stringify({
            "consent": [
                {
                    "status": "active",
                    "subject": consentData.subject,
                    "actor": consentData.subject,
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
                        "email": consentData.deliveryEmail,
                        "mobile": consentData.deliveryPhone
                    },
                    "consentContext": {}
                },
                {
                    "status": "active",
                    "subject": consentData.subject,
                    "actor": consentData.subject,
                    "audience": "BXRApp",
                    "definition": {
                        "id": "communication-preferences",
                        "version": "1.0",
                        "locale": "en-us"
                    },
                    "titleText": "Marketing Communication",
                    "dataText": "Marketing Communication",
                    "purposeText": "Marketing Communication",
                    "data": {
                        "email": consentData.commEmail,
                        "sms": consentData.commSms,
                        "mail": consentData.commMail
                    },
                    "consentContext": {}
                }
            ]
        });
        const lowPrivToken = await this.requestLowPrivToken();
        const response = await this.ping1Consents.userUpdateConsent({ consentPayload: rawPayload, token: lowPrivToken, userId: userId });
        const status = await response.status;
        return status;
    }

    /**
     * Generate a JSON web token
     * @param {String} type login or request. Dictates generation of login_hint tokens or request tokens for transaction approval.
     * @return {String} JSON web token
     */
    generateJWT({ type, amount, userName, fullName } = {}) {
        let claims = {};
        if (type === "request") {
            claims = JSON.stringify({
                "aud": this.BXF_A,
                "iss": atob(this.BXF_C),
                "pi.template": {
                    "name": this.BXF_T,
                    "variables": {
                        "sum": amount,
                        "currency": "USD",
                        "recipient": fullName
                    }
                }
            });
        } else if (type === "login") {
            claims = JSON.stringify({
                "iss": atob(this.BXF_C),
                "sub": userName,
                "exp": Math.floor(Date.now() / 1000) + (60 * 5),
                "aud": this.BXF_A
            });
        }
        const signedJWT = jsonwebtoken.sign(claims, atob(this.BXF_S));
        console.log("signedJWT", signedJWT);
        return signedJWT;
    }

    /**
     * 
     * @param {*} param0 
     */
    getTransactionApproval({ IdT, amount }) {
        const sub = this.getTokenValue({token: IdT, key: "sub"});
        const fName = this.getTokenValue({token: IdT, key: "given_name"});
        const lName = this.getTokenValue({token: IdT, key: "family_name"});
        const fullName = this.getTokenValue({ token: IdT, key: "name" });
        const stateValue = uuidv4();
        console.log("uuidv4", uuidv4());
        console.log("stateValue", stateValue);
        console.log("sub", sub);
        console.log("fName", fName);
        console.log("lName", lName);

        const loginToken = this.generateJWT({type: "login", userName: sub});
        const requestToken = this.generateJWT({type: "request", amount: amount, fullName: fullName});
        console.log("full name", fullName);
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let raw = "";

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            body: raw,
            redirect: 'manual'
        };
        this.ping1AuthZ.authorizeBXFTransaction({staeVal: stateValue, loginToken: loginToken, requestToken: requestToken});
           /*  .then(response => response.text())
            .then(result => console.log("result", result))
            .catch(error => console.log('error', error));  */           
    }
}

export default FlowHandler;
