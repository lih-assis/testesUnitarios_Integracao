const UserService = require('../../../src/services/user-service')
const User = require('../../../src/schemas/User')
const userMock =require("../../mocks/user-mock")

const createdUserMock = () => ({ id: 1 })


describe('User Service', () => {
    it('Deve retornar um ID para usuários criados', async () => {
        jest.spyOn(User, 'create').mockImplementationOnce(createdUserMock)
        
        const created = await UserService.createUser({
            email: 'any_email@mail.com',
            name: 'Any Name',
            password: '123456'
        })

        expect(created).toHaveProperty('id')
    })

    it('Deve retornar falso se usuário não esta cadastrado', async () => {
        const spy = jest.spyOn(User, 'findOne').mockImplementationOnce(()=>false)
        
        const result = await UserService.userExistsAndCheckPassword({
            email: 'any_email@mail.com',
            password: '123456'
        })

        expect(spy).toHaveBeenCalled()
        expect(result).toBe(false)
    })

    it('Deve retornar erro 400 se a senha não conferir', async () => {
        const spy = jest.spyOn(User, 'findOne').mockImplementationOnce(()=>userMock)
        
        try {
            const result = await UserService.userExistsAndCheckPassword({
                email: 'any_email@mail.com',
                password: '123456'
            })
        } catch (error) {
            expect(spy).toHaveBeenCalled()
            expect(error.status).toBe(400)
            expect(error.message).toBe('As senhas não batem')
        }
    })

    it('Deve retornar true se usuario e senha estiverem okay', async () => {
        const spy = jest.spyOn(User, 'findOne').mockImplementationOnce(()=>userMock)
        
        const result = await UserService.userExistsAndCheckPassword(userMock)

        expect(spy).toHaveBeenCalled()
        expect(result).toBe(true)
    })
})