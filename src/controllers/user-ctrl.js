const UserService = require('../services/user-service')
const Email = require('../utils/email-validator')

class UserController {
    static async create(req, res) {
        try {
            const { name, email, password } = req.body
    
            if(!Email.isValid(email)) {
                throw { status: 400, message: 'Email inválido'}
            }
            
            if(!password) {
                throw { status: 400, message: 'Senha inválida'}
            }
    
            const { id } = await UserService.createUser({ name, email, password })

            return res.status(200).json({ id })
        } catch (error) {
            if(!error.status)
                return res.status(500).json({message:'Server Error'})

            return res.status(error.status).json(error.message)
        }
    }

    static async changePassword(req, res) {
        const { userEmail: email } = req
        
        console.log('Alterando senha...')
        return res.status(200).json({ message: 'ok'})
    }
}

module.exports = UserController