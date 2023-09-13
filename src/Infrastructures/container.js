/* istanbul ignore file */

const bcrypt = require('bcrypt')
const {createContainer} = require('instances-container')
const Jwt = require('@hapi/jwt')
const {nanoid} = require('nanoid')
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase')
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase')
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase')
const AuthRepository = require('../Domains/authentications/AuthRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const JwtTokenManager = require('./security/JwtTokenManager')
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase')
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase')
const PasswordHash = require('../Applications/security/PasswordHash')
const pool = require('./database/postgres/pool')
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase')
const ThreadCommentRepository = require('../Domains/thread_comments/ThreadCommentRepository')
const ThreadCommentRepositoryPostgres = require('./repository/ThreadCommentRepositoryPostgres')
const ThreadRepository = require('../Domains/threads/ThreadRepository')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')
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
    key: AuthRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [{concrete: pool}]
    }
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {concrete: pool}, {concrete: nanoid}
      ]
    }
  },
  {
    key: ThreadCommentRepository.name,
    Class: ThreadCommentRepositoryPostgres,
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
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [{concrete: Jwt.token}]
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
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {name: 'userRepository', internal: UserRepository.name},
        {name: 'authenticationRepository', internal: AuthRepository.name},
        {name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name},
        {name: 'passwordHash', internal: PasswordHash.name}
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {name: 'authenticationRepository', internal: AuthRepository.name}
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {name: 'authenticationRepository', internal: AuthRepository.name},
        {name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name}
      ]
    }
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {name: 'threadRepository', internal: ThreadRepository.name}
      ]
    }
  },
  {
    key: AddCommentUseCase.name,
    Class: AddCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {name: 'threadCommentRepository', internal: ThreadCommentRepository.name}
      ]
    }
  }
])

module.exports = container
