import { Test } from '@nestjs/testing'
import { UserRepository } from './user.repository'
import { ConflictException, InternalServerErrorException } from '@nestjs/common'
import { User } from '../entities/user.entity'
import * as bcrypt from 'bcryptjs'

const mockCredentialDto = { username: 'test_user', password: 'Test@123' }
describe('UserRepository', () => {
  let userRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserRepository,
      ]
    }).compile()

    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('signUp', () => {
    let save;

    beforeEach(() => {
      save = jest.fn()
      userRepository.create = jest.fn().mockReturnValue({ save })
    })

    it('successfully signs up the user', () => {
      save.mockResolvedValue(undefined)
      expect(userRepository.signUp(mockCredentialDto)).resolves.not.toThrow()
    })

    // TODO: Fail here
    // it('throws error conflict exception', () => {
    //   save.mockRejectedValue({ code: '23505' })
    //   expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(ConflictException)
    // })

    it('throws error internal server exception', () => {
      save.mockRejectedValue({ code: '132345' })
      expect(userRepository.signUp(mockCredentialDto)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn()

      user = new User()
      user.username = 'test_user'
      user.validatePassword = jest.fn()
    })

    it('returns the username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user)
      user.validatePassword.mockResolvedValue(true)

      const result = await userRepository.validateUserPassword(mockCredentialDto)
      expect(result).toEqual('test_user')
    })

    it('returns null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null)
      const result = await userRepository.validateUserPassword(mockCredentialDto)
      expect(user.validatePassword).not.toBeCalled()
      expect(result).toBeNull()
    })

    it('returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(null)
      user.validatePassword.mockResolvedValue(false)
      const result = await userRepository.validateUserPassword(mockCredentialDto)
      expect(result).toBeNull()
    })
  })

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('hashed')
      const result = await userRepository.hashPassword('Test@123', 'testSalt')
      expect(bcrypt.hash).toHaveBeenCalled()
      expect(result).toEqual('hashed')
    })
  })
})