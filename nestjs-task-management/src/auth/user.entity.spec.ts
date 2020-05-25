import { Test } from '@nestjs/testing'
import { User } from '../entities/user.entity'
import * as bcrypt from 'bcryptjs'

const testPassword = 'test_password'
const testSalt = 'test_salt'

describe('User entity', () => {
  let user: User
  beforeEach(() => {
    user = new User()
    user.password = testPassword
    user.salt = testSalt
    bcrypt.hash = jest.fn()
  })

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      bcrypt.hash.mockReturnValue(testPassword)

      const result = await user.validatePassword('123456')
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', testSalt)
      expect(result).toEqual(true)
    })
    it('returns false as password is valid', async () => {
      bcrypt.hash.mockReturnValue('wrongPassword')

      const result = await user.validatePassword('123456')
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', testSalt)
      expect(result).toEqual(false)
    })
  })
})