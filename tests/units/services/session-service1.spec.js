const dotenv = require("dotenv")
const SessionService = require("../../../src/services/session-service")
dotenv.config()


describe('User Service', () => {
    it("Deve retornar om token quando recebe email valido",async() => {
        const result = await SessionService.generateToken({email: 'abc@gmail.com'})
        let tokenRegex = new RegExp(/^[A-Za-z0-9-=]+.[A-Za-z0-9-=]+.?[A-Za-z0-9-_.+/=]*$/)

        expect(result).toMatch(tokenRegex)
    })
})
