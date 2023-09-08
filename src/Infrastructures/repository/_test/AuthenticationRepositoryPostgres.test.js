const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres')
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const InvariantError = require('../../../Commons/exceptions/InvariantError')
const pool = require('../../database/postgres/pool')

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addToken function', () => {
    it('should add token into database', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)
      const token = 'token'

      // Action
      await authenticationRepositoryPostgres.addToken(token)

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token)
      expect(tokens).toHaveLength(1)
      expect(tokens[0].token).toBe(token)
    })
  })

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError when token is not available', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)
      const token = 'token'

      // Action and assert
      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token)).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError when token is available', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)
      const token = 'token'
      await AuthenticationsTableTestHelper.addToken(token)

      // Action and assert
      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token)).resolves.not.toThrow(InvariantError)
    })
  })

  describe('deleteToken function', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool)
      const token = 'token'
      await AuthenticationsTableTestHelper.addToken(token)

      // Action
      await authenticationRepositoryPostgres.deleteToken(token)

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token)

      expect(tokens).toHaveLength(0)
    })
  })
})
