const SessionController = require("../../../src/controllers/session-ctrl")
const UserController = require("../../../src/controllers/user-ctrl")
const SessionService = require("../../../src/services/session-service")
const UserService = require('../../../src/services/user-service')
const Email = require("../../../src/utils/email-validator")


const {
    requestMock, 
    requestMockWithoutEmail, 
    requestMockWithoutPassword, 
    responseMock,
    requestMockByParam,
} = require('../../mocks/controllers-mocks')

const UserServiceMock = class UserServiceMock {
    static async createUser() {
        return { id: 1 }
    }
}

describe('User Controller', () => {
    it("Deveria retornar status 400 se email for invalido ", async () => {
        let spy = jest.spyOn(Email, 'isValid').mockImplementationOnce(() => false)

        let result = await SessionController.create(requestMock, responseMock)
        expect(spy).toHaveBeenCalled()
        expect(result.status).toBe(400)
        expect(result.data).toBe("Email inválido")
    })

    it("Deveria retornar status 400 se senha for invalida ", async () => {
        let spy = jest.spyOn(Email, 'isValid').mockImplementationOnce(() => true)

        let result = await SessionController.create(requestMockByParam(
            {
                email: 'invalid@email',
                password:''
            }),
            responseMock
        )
        
        expect(spy).toHaveBeenCalled()
        expect(result.status).toBe(400)
        expect(result.data).toBe("Senha inválida")
    })

    it("Deveria retornar status 404 se usuario não existir ou senha for invalida ", async () => {
        let spy = jest.spyOn(Email, 'isValid').mockImplementationOnce(() => true)
        let spy2 = jest.spyOn(UserService, 'userExistsAndCheckPassword').mockImplementationOnce(() => false)

        let result = await SessionController.create(requestMockByParam(
            {
                email: 'invalid@email',
                password:'abc'
            }),
            responseMock
        )
        
        expect(spy).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
        expect(result.status).toBe(404)
        expect(result.data).toBe("Usuário não encontrado")
    })

    it("Deve retornar status 200 se credenciais forem válidas ", async () => {
        let spy = jest.spyOn(Email, 'isValid').mockImplementationOnce(() => true)
        let spy2 = jest.spyOn(UserService, 'userExistsAndCheckPassword').mockImplementationOnce(() => true)
        let spy3 = jest.spyOn(SessionService, 'generateToken').mockImplementationOnce(() => '123')

        let result = await SessionController.create(requestMockByParam(
            {
                email: 'invalid@email',
                password:'abc'
            }),
            responseMock
        )
        
        expect(spy).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
        expect(spy3).toHaveBeenCalled()
        expect(result.status).toBe(200)
        expect(result.data).toHaveProperty('token')
    })

    it("Deve retornar status 500 se ocorrerem outros erros", async () => {
        let spy = jest.spyOn(Email, 'isValid').mockImplementationOnce(() => true)
        let spy2 = jest.spyOn(UserService, 'userExistsAndCheckPassword').mockImplementationOnce(() => true)
        let spy3 = jest.spyOn(SessionService, 'generateToken').mockImplementationOnce(() => {throw new Error})

        let result = await SessionController.create(requestMockByParam(
            {
                email: 'invalid@email',
                password:'abc'
            }),
            responseMock
        )
        
        expect(spy).toHaveBeenCalled()
        expect(spy2).toHaveBeenCalled()
        expect(spy3).toHaveBeenCalled()
        expect(result.status).toBe(500)
        expect(result.data).toBe('Server Error')
    })
})