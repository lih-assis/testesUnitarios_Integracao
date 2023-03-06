const{authorizationMock, responseMock} = require("../../mocks/controllers-mocks")
const auth = require("../../../src/middlewares/auth")
const jwt = require('jsonwebtoken')
let next = jest.fn()

describe('[Unit] - auths', () => {
    
    it('Deve retornar status 401 se não houver token', async() => {
        const result = await auth(authorizationMock(''), responseMock, next)

        expect(result.status).toBe(401)
        expect(result.data.message).toBe('Token is not provided')
    })

    it('Se o token for valido, deve permitir que prossiga', async() => {
        let spyemail = jest.spyOn(jwt, 'verify').mockImplementationOnce(() => ({email: 'email@mail.com'}))
        const result = await auth(authorizationMock('123'), responseMock, next)

        expect(spyemail).toHaveBeenCalled()
        expect(next).toHaveBeenCalled()
    })

    it("Should return 401 if the Email is not provided", async() =>{
        const result = await auth(authorizationMock("token"), responseMock, next )
        expect(result.status).toBe(401)
    })
})