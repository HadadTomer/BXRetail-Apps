import PingOneRegistration from "../src/components/Integration/PingOneRegistration";

describe('Headers are correct', () => {
    it('knows that requestOptions contain regPayLoad ', () => {
        const options = buildRequestOptions(
            { "regPayLoad":
                {
                    "username": "username",
                    "email": "email@email.com",
                    "password": "2FederateM0re!"
                }
            }
        );
            expect(options.body.username).toBe("username")
    });
  });

function buildRequestOptions ({regPayLoad}) {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/vnd.pingidentity.user.register+json");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: arguments[0]["regPayLoad"],
        redirect: "manual",
        credentials: "include"
    };

    return requestOptions;
}