import { uuidv4 } from "../Utils/UUIDv4";

export const securedTouchSessionId = () => {
    const key = 'stSessionId';
    let sessionId = localStorage.getItem(key);
    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem(key, sessionId);
    }

    return sessionId;
}

export const asyncInitSecuredTouch = (userId) => {
    const onSecuredTouchReady = callback => {
        if (window['_securedTouchReady']) {
            callback();
        } else {
            document.addEventListener('SecuredTouchReadyEvent', callback);
        }
    };

    onSecuredTouchReady(() => {
        window._securedTouch.init({
            url: 'https://ping-retail.securedtouch.com',
            appId: 'ping-retail',
            appSecret: 'EJBgAz1mFeQFveSDqD6eYf6Dgs5T',
            sessionId: securedTouchSessionId(),
            isSingleDomain: true,
        }).then(function () {
            console.log("SecuredTouchSDK initialized successfully");
            if (userId) {
                window._securedTouch.login(userId);
            }
        });
    });
};