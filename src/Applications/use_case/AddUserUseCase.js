const RegisterUser = require('../../Domains/users/entities/RegisterUser')

class AddUserUseCase {
  constructor({userRepository, passwordHash}) {
    this._userRepository = userRepository
    this._passwordHash = passwordHash
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload)

    // Verifying username
    await this._userRepository.verifyAvailableUsername(registerUser.username)

    // Hashing password
    registerUser.password = await this._passwordHash.hash(registerUser.password)

    return this._userRepository.addUser(registerUser)
  }
}

module.exports = AddUserUseCase
