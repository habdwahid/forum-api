/* istanbul ignore file */

const bcrypt = require('bcrypt')
const {createContainer} = require('instances-container')
const {nanoid} = require('nanoid')
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const PasswordHash = require('../Applications/security/PasswordHash')
const pool = require('./database/postgres/pool')
const UserRepository = require('../Domains/users/UserRepository')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')

// Creating container
const container = createContainer()

// Registering services and repositories
container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {concrete: pool}, {concrete: nanoid}
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {concrete: bcrypt}
      ]
    }
  }
])

// Registering use case
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {name: 'userRepository', internal: UserRepository.name},
        {name: 'passwordHash', internal: PasswordHash.name}
      ]
    }
  }
])

module.exports = container
