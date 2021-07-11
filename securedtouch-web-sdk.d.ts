declare class _securedTouch {

    static init(startParams: _securedTouchEntities.IStStartParams): Promise<void>;

    static login(userId: string, appSessionId?: string): Promise<void>;

    static logout(newSessionId?: string): Promise<void>;

    static addTag(name: string, value?: string): void;

    static setSessionId(appSessionId: string): void;

    static getSessionId(): string;

    static pauseSecuredTouch(): void;

    static resumeSecuredTouch(): void;

    static pauseBehavioralData(): void;

    static resumeBehavioralData(): void;

    static readonly isRunning: Boolean;

    static isLogEnabled: boolean;

    static flush(): Promise<void>;

    static CHALLENGE: _securedTouchEntities.Challenge;
    static CHECKOUT: _securedTouchEntities.Checkout;
    static PRODUCT: _securedTouchEntities.Product;
    static LOGIN: _securedTouchEntities.Login;
    static ACCOUNT: _securedTouchEntities.Account;
    static REGISTRATION: _securedTouchEntities.Registration;
    static SocialType: typeof _securedTouchEntities.SocialType;
    static ChallengeType: typeof _securedTouchEntities.ChallengeType;
    static PaymentMethod: typeof _securedTouchEntities.PaymentMethod;
}

declare module _securedTouchEntities {

    interface IStStartParams {
        url: string;
        appId: string;
        appSecret: string;
        userId?: string;
        sessionId?: string;
        isDebugMode?: boolean;
        enableLog?: boolean;
        externalLogsEnabled?: boolean;
        isSingleDomain?: boolean;
    }
}

declare module _securedTouchEntities {
    class Challenge {
        challengeInvoked(challengeType: ChallengeType | string): void;

        challengeSuccess(): void;

        challengeFailed(): void;
    }
}
declare module _securedTouchEntities {
    class Product {
        addToCart(): void;

        saveItem(): void;
    }
}
declare module _securedTouchEntities {
    class Account {
        shippingAddressChanged(newAddress: string): void;

        emailAddressChanged(newEmail: string): void;

        notificationChanged(isTurnedOn: boolean, info: string): void;
    }
}
declare module _securedTouchEntities {
    class Login {
        accountCreationTime(epochTimeInSeconds: number): void;

        loginAttemptEmail(email: string): void;

        loginAttempt(loginType: SocialType | string): void;

        loginFailed(): void;
    }
}
declare module _securedTouchEntities {
    class Checkout {
        purchaseAttempt(paymentMethod: PaymentMethod | string): void;

        purchaseSuccess(): void;

        purchaseFailed(): void;
    }
}
declare module _securedTouchEntities {
    class Registration {
        registrationAttemptEmail(email: string): void;

        registrationAttempt(registrationType: SocialType | string): void;

        registrationSuccess(): void;

        registrationFailed(): void;
    }
}
declare module _securedTouchEntities {
    enum SocialType {
        FACEBOOK = "facebook",
        GOOGLE = "google",
        APPLE = "apple",
        TWITTER = "twitter",
        LINKEDIN = "linkedin"
    }

    enum ChallengeType {
        RECAPTCHA = "recaptcha",
        HIDE_BILLING = "hide_billing"
    }

    enum PaymentMethod {
        PAYPAL = "paypal",
        CREDIT_CARD = "credit_card"
    }
}