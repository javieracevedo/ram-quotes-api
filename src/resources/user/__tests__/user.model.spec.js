import { User } from '../user.model'
// import mongoose from 'mongoose'

describe('User model', () => {
  describe('schema', () => {
    test('email', () => {
      const email = User.schema.obj.email
      expect(email).toEqual({
        type: String,
        required: true,
        unique: true,
        trim: true
      })
    })

    test('password', () => {
      const password = User.schema.obj.password
      expect(password).toEqual({
        type: String,
        required: true
      })
    })
  })

  describe('methods', () => {
    test('password match', async () => {
      const password = '123'
      const user = await User.create({ email: 'test@gmail.com', password })
      const match = await user.checkPassword(password)
      expect(match).toEqual(true)
    })

    test("password doesn't match", async () => {
      const password = '123'
      const user = await User.create({ email: 'test@gmail.com', password })
      const match = await user.checkPassword('456')
      expect(match).toEqual(false)
    })
  })
})
