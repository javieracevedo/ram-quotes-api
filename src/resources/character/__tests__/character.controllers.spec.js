// import { Character } from '../character.model'
import { User } from '../../user/user.model'
import mongoose, { get } from 'mongoose'
import { createOne, getOne } from '../character.controllers'
import { Character } from '../character.model'

describe('Character controllers', () => {
  describe('createOne', () => {
    test('creates character', async () => {
      expect.assertions(2)

      const user = await User.create({
        email: 'javier@gmail.com',
        password: '1234'
      })

      const req = {
        body: { name: 'summer' },
        user
      }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        async json({ data }) {
          expect(req.body.name).toBe(data.name)
        }
      }

      await createOne(req, res)
    })

    test('name property should be present', async () => {
      expect.assertions(2)

      const user = await User.create({
        email: 'javier@gmail.com',
        password: '1234'
      })

      const req = { body: { createdBy: user._id } }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe('name property is required.')
        }
      }

      await createOne(req, res)
    })

    test('provided user must be a real user', async () => {
      expect.assertions(2)

      const req = {
        body: { name: 'mortyyyy' },
        user: { _id: mongoose.Types.ObjectId() }
      }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `User with id ${req.user._id} doesn't exist.`
          )
        }
      }
      await createOne(req, res)
    })

    test('character must be new', async () => {
      expect.assertions(2)

      const userId = mongoose.Types.ObjectId()
      await Character.create({
        name: 'test-char',
        createdBy: userId
      })

      const req = { body: { name: 'test-char', createdBy: userId } }
      const res = {
        status(status) {
          expect(status).toBe(403)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character ${req.body.name} already exists.`
          )
        }
      }

      await createOne(req, res)
    })
  })

  describe('getOne', () => {
    test('either id param or name query param must be present', async () => {
      const req = { params: {}, query: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            'Either id parameter or name query parameter must be present.'
          )
        }
      }
      await getOne(req, res)
    })

    test('id must be a valid mongoose id', async () => {
      const req = { params: { id: 'invalid_id' } }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character id ${req.params.id} is not a valid id.`
          )
        }
      }
      await getOne(req, res)
    })

    test('character with query param name must be real', async () => {
      expect.assertions(2)

      const req = { query: { name: 'fake_character' }, params: {} }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character with name ${req.query.name} doesn't exist.`
          )
        }
      }
      await getOne(req, res)
    })
  })
})
