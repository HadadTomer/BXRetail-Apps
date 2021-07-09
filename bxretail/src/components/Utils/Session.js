/**
PING INTEGRATION:
This entire component is Ping-developed.
Implements functions to integrate with the browser
session and local storage API to maintain user state during
an authenticated app session. Also includes a method for 
access rules.

@author Michael Sanchez
@see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage}
*/

class Session {

    /** 
    Protect Page:
    Ensures a user doesn't access pages when unauthenticated or 
    when not the right user type. We are not using Ping Access for a SaaS-first demo.
    This would ideally be done with PA's new SPA support features, but BXR is intended 
    to be an all-SaaS demo. Reality bytes.

    @param {boolean} loggedOut Whether the user is logged in or not.
    @param {string} path Where the user is trying to go.
    @param {string} userType AnyTVPartner, AnyMarketing, or customer. 
    */
    protectPage(loggedOut, path, userType) {
        const partnerAllowedPaths = ["/app/partner", "/app/partner/client"];
        const marketingAllowedPaths = ["/app/any-marketing"];
        const customerAllowedPaths = ["/app/any-tv-partner", "/app/dashboard/settings", "/app/dashboard/settings/profile", "/app/dashboard/settings/communication-preferences", "app/dashboard/settings/privacy-security"];
        const homePaths = ["/app/", "/app", "/app/shop"];
        console.info("Session.js", "Checking access rules for user type " + userType + " at " + path);

        //They have to be logged in to be anywhere other than home or /shop.
        if (loggedOut && (!homePaths.includes(path))) {
            console.info("Access rule", "Attempting to access protected page as unauthenticated user. Redirecting to home.");
            window.location.assign(homePaths[0]); //TODO this needs to be done SPA style. Not an HTTP redirect.
        } else {
            switch (userType) {
                case "AnyTVPartner":
                    if (!partnerAllowedPaths.includes(path)) {
                        console.info("Access Rule", "Attempt to access disallowed resource for user type " + userType + ". Redirecting to default.");
                        window.location.assign(partnerAllowedPaths[0]); //TODO this needs to be done SPA style. Not an HTTP redirect.
                    }
                    break;
                case "AnyMarketing":
                    if (!marketingAllowedPaths.includes(path)) {
                        console.info("Access Rule", "Attempt to access disallowed resource for user type " + userType + ". Redirecting to default.");
                        window.location.assign(marketingAllowedPaths[0]); //TODO this needs to be done SPA style. Not an HTTP redirect.
                    }
                    break;
                case "Customer":
                    if (!customerAllowedPaths.includes(path) && !homePaths.includes(path)) {
                        console.info("Access Rule", "Attempt to access disallowed resource for user type " + userType + ". Redirecting to default.");
                        window.location.assign(homePaths[2]); //Default for a logged in user //TODO this needs to be done SPA style. Not an HTTP redirect.
                    }
                    break;
                default:
                    console.warn("Unknown bxRetailUserType", "Not authenticated yet.");
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
    
    @deprecated Using browser storage going forward for demo apps.
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
