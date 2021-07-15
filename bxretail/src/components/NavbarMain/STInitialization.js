export const asyncInitSecuredTouch = (userId, sessionId) => {

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
            // userId: userId,
            // sessionId: sessionId,
            isSingleDomain: true,
        }).then(function () {
            console.log("SecuredTouchSDK initialized successfully");
        });
    });
};