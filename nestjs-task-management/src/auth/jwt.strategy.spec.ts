import { Test } from '@nestjs/testing'
import { JwtStrategy } from './jwt.strategy'
import { UserRepository } from './user.repository'
import { User } from '../entities/user.entity'
import { UnauthorizedException } from '@nestjs/common'

const mockUserRepository = () => ({
  findOne: jest.fn()
})

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy
  let userRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository }
      ]
    }).compile()

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy)
    userRepository = await module.get<UserRepository>(UserRepository)
  })

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User()
      const username = 'test_user'
      user.username = username

      userRepository.findOne.mockResolvedValue(user)
      const result = await jwtStrategy.validate({ username })
      expect(userRepository.findOne).toHaveBeenCalledWith({ username })
      expect(result).toEqual(user)
    })

    it('throw unauthorized exception', () => {
      userRepository.findOne.mockResolvedValue(null)
      expect(jwtStrategy.validate({ username: 'test_user' })).rejects.toThrow(UnauthorizedException)
    })
  })
})