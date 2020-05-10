import { newToken } from '../../../utils/auth.js'
import { updateMe } from '../user.controllers'
import mongoose from 'mongoose'

describe('user controllers', () => {
  describe('updateMe', () => {
    test('user_id must be a valid mongoose object id', async () => {
      const req = {
        params: { user_id: '123' },
        body: {}
      }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe('Invalid user object id.')
        }
      }

      await updateMe(req, res)
    })

    test('user with user_id provided must be a real user', async () => {
      const userId = mongoose.Types.ObjectId()
      const token = `Bearer ${newToken({ id: userId })}`

      const req = {
        headers: { authorization: token },
        params: { user_id: userId }
      }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(`User with ${userId} not found.`)
        }
      }
      await updateMe(req, res)
    })
  })
})
