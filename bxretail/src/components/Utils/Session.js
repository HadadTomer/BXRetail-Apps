/**
PING INTEGRATION:
This entire component is Ping-developed.
Implements functions to integrate with the browser
session storage API to maintain user state during
an authenticated session.

@author Michael Sanchez
@see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage}
*/

class Session {

    /** 
    Protect Page:
    Ensures a user doesn't access pages when unauthenticated or 
    when not the right user type. We are not using Ping Access for a SaaS-first demo.

    @param {boolean} loggedOut Whether the user is logged in or not.
    @param {string} path Where the user is trying to go.
    @param {string} userType AnyWealthAdvisor, AnyMarketing, or customer.
    */
    protectPage(loggedOut, path, userType) {
        const advisorAllowedPaths = ["/app/advisor", "/app/advisor/client", "/app/advisor/updates", "/app/advisor/reporting","/app/advisor/other-services"];
        const marketingAllowedPaths = ["/app/any-marketing", "/app/any-marketing/dashboard", "/app/any-marketing/client-profiles", "/app/any-marketing/tracking", "/app/any-marketing/planning-tools"];
        const homePaths = ["/app/", "/app"];
        console.info("Session.js", "Checking access rules for user type " + userType + " at " + path);

        //They have to be logged in to be anywhere other than home.
        if (loggedOut && (!homePaths.includes(path))) {
            console.info("Access rule", "Attempting to access protected page as unauthenticated user. Redirecting to home.");
            window.location.assign(homePaths[0]); //TODO this needs to be done SPA style. Not an HTTP redirect.
        } else {
            switch (userType) {
                case "AnyTVPartner":
                    if (!advisorAllowedPaths.includes(path)) {
                        console.info("Access Rule", "Attempt to access disallowed resource for user type " + userType + ". Redirecting to default.");
                        window.location.assign(advisorAllowedPaths[0]); //TODO this needs to be done SPA style. Not an HTTP redirect.
                    }
                    break;
                case "AnyMarketing":
                    if (!marketingAllowedPaths.includes(path)) {
                        console.info("Access Rule", "Attempt to access disallowed resource for user type " + userType + ". Redirecting to default.");
                        window.location.assign(marketingAllowedPaths[0]); //TODO this needs to be done SPA style. Not an HTTP redirect.
                    }
                    break;
                case "customer":
                    if (advisorAllowedPaths.includes(path) || marketingAllowedPaths.includes(path) || homePaths.includes(path)) {
                        console.info("Access Rule", "Attempt to access disallowed resource for user type " + userType + ". Redirecting to default.");
                        window.location.assign("/app/shop"); //Default for a logged in user //TODO this needs to be done SPA style. Not an HTTP redirect.
                    }
                    break;
                default:
                    console.warn("Unknown bxFinanceUserType", "Not authenticated yet.");
            }
        }
    }

    /** 
    Get Authenticated User Item:
    Gets an item from the current origin's session storage.

    @param {string} key The item name in storage.
    @param {string} type session or local.
    @return {string} DOM String.
    */
    getAuthenticatedUserItem(key, type) {
        console.info("Session.js", "Getting " + key + " from local browser session.");

        if (type === "session") {
            return sessionStorage.getItem(key);
        } else {
             return localStorage.getItem(key);
       }
    }

    /** 
    Set Authenticated User Item:
    Sets an item in the current origin's sessions storage.

    @param {string} key The item name to set in storage.
    @param {string} value The string value of the key.
    @param {string} type session or local.
    @return {void} Undefined.
    @throws {storageFullException} Particularly, in Mobile Safari 
                                (since iOS 5) it always throws when 
                                the user enters private mode. 
                                (Safari sets the quota to 0 bytes in 
                                private mode, unlike other browsers, 
                                which allow storage in private mode 
                                using separate data containers.)
    */
    setAuthenticatedUserItem(key, value, type) {
        console.info("Session.js", "Saving " + key + " into local browser session.");

        if (type === "session") {
            sessionStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, value);
        }
    }

    /** 
    Remove Authenticated User Item:
    Removes an item from the current origin's session storage.

    @param {string} key The item name in storage to remove.
    @param {string} type session or local.
    @return {void} Undefined.
    */
    removeAuthenticatedUserItem(key, type) {
        console.info("Session.js", "Removing " + key + " from local browser session.");

        if (type === "session") {
            sessionStorage.removeItem(key);
        } else {
            localStorage.removeItem(key);
        }
    }

    /** 
    Clears a user's local app session:
    Clears out everything in the current origin's session storage.
    @param {string} type session, local, all.
    @return {void} Undefined.
     */
    clearUserAppSession(type) {
        console.info("Session.js", "Removing local browser session.");

        switch (type) {
            case "session":
                sessionStorage.clear();
                break;
            case "local":
                localStorage.clear();
                break;
            case "all":
                sessionStorage.clear();
                localStorage.clear();
                break;
            default:
                console.error("Storage Error:", "The 'type' param to clearUserAppSession was not recognized or excluded. No storage has been cleared.");
        }
        
    }

    /** 
    Get Cookie:
    We set a cookie when users check "Remember Me" when logging in.
    We need to check for this cookie in a couple different places to set state.
    
    @param {string} cookieName The name of the cookie we want the value of.
    @return {string} Cookie value, or an empty string if not found.
    */
    getCookie(cookieName) {
        console.info("Session.js", "Getting a cookie value from the browser.");

        const name = cookieName + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
};

export default Session;