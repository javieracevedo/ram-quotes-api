import { createOne } from '../quote.controller'
import { User } from '../../user/user.model'

describe('Quote controllers', () => {
  describe('quote createOne', () => {
    test('quote property should be present', async () => {
      const user = await User.create({
        email: 'test@test.com',
        password: '1233'
      })

      const req = { body: {}, user }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe('Quote property is required.')
        }
      }

      await createOne(req, res)
    })
  })
})
