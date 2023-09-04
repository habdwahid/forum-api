const InvariantError = require('../../../Commons/exceptions/InvariantError')
const pool = require('../../database/postgres/pool')
const RegisterUser = require('../../../Domains/users/entities/RegisterUser')
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser')
const UserRepositoryPostgres = require('../UserRepositoryPostgres')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username is not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({username: 'dicoding'})
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action and assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError)
    })

    it('should not throw InvariantError when username is available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {})

      // Action and assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError)
    })
  })

  describe('AddUser function', () => {
    it('should persist register user', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
        password: 'secret'
      })
      const fakeIdGenerator = () => '123'
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      await userRepositoryPostgres.addUser(registerUser)

      // Assert
      const user = await UsersTableTestHelper.findUserById('user-123')
      expect(user).toHaveLength(1)
    })

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        fullname: 'Dicoding Indonesia',
        username: 'dicoding',
        password: 'secret'
      })
      const fakeIdGenerator = () => '123'
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator)

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser)

      // Assert
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        fullname: registerUser.fullname,
        username: registerUser.username
      }))
    })
  })
})
