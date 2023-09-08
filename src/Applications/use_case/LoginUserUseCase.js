const NewAuth = require('../../Domains/authentications/entities/NewAuth')

class LoginUserUseCase {
  constructor({userRepository, authenticationRepository, authenticationTokenManager, passwordHash}) {
    this._userRepository = userRepository
    this._authenticationRepository = authenticationRepository
    this._authenticationTokenManager = authenticationTokenManager
    this._passwordHash = passwordHash
  }

  async execute(useCasePayload) {
    const {username, password} = useCasePayload

    // Get the user's encrypted password
    const encryptedPassword = await this._userRepository.getPasswordByUsername(username)

    // Comparing user's encrypted password and user's password
    await this._passwordHash.comparePassword(password, encryptedPassword)

    // Get the user's id
    const id = await this._userRepository.getIdByUsername(username)

    // Creating token
    const accessToken = await this._authenticationTokenManager.createAccessToken({username, id})
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({username, id})

    const newAuth = new NewAuth({
      accessToken,
      refreshToken
    })

    await this._authenticationRepository.addToken(newAuth.refreshToken)

    return newAuth
  }
}

module.exports = LoginUserUseCase
