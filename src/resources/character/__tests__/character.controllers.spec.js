import { User } from '../../user/user.model'
import mongoose from 'mongoose'
import {
  createOne,
  getOne,
  deleteOne,
  updateOne,
  getMany
} from '../character.controllers'
import { Character } from '../character.model'

describe('Character controllers', () => {
  describe('createOne', () => {
    test('name property should be present', async () => {
      expect.assertions(2)

      const user = await User.create({
        email: 'javier@gmail.com',
        password: '1234'
      })

      const req = { body: {}, user }
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

      const user = await User.create({
        email: 'test@gmail.com',
        password: '1234'
      })

      await Character.create({
        name: 'test-char',
        createdBy: user._id
      })

      const req = { body: { name: 'test-char' }, user }
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

    test('character is created successfully', async () => {
      expect.assertions(2)

      const user = await User.create({
        email: 'test@gmail.com',
        password: '1234'
      })

      const req = { body: { name: 'test-char' }, user }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        json(result) {
          expect(result.data.name).toBe(req.body.name)
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

    test('character with provided id must be real', async () => {
      expect.assertions(2)

      const req = { query: {}, params: { id: mongoose.Types.ObjectId() } }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character with id ${req.params.id} doesn't exist.`
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

  describe('getMany', () => {
    test('gets many characters', async () => {
      expect.assertions(2)

      // eslint-disable-next-line no-unused-vars
      const rick = await Character.create({
        name: 'Rick',
        createdBy: mongoose.Types.ObjectId()
      })

      // eslint-disable-next-line no-unused-vars
      const summer = await Character.create({
        name: 'Summer',
        createdBy: mongoose.Types.ObjectId()
      })

      const req = {}
      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(result) {
          expect(result.data).toHaveLength(2)
        }
      }

      await getMany(req, res)
    })
  })

  describe('deleteOne', () => {
    test('id param must be present', async () => {
      const req = { params: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe('Character id must be present')
        }
      }
      await deleteOne(req, res)
    })

    test('id provided must be a valid id', async () => {
      const req = { params: { id: 'invalid_id' } }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character with id ${req.params.id} is not valid.`
          )
        }
      }
      await deleteOne(req, res)
    })

    test('character provided must be real', async () => {
      expect.assertions(2)

      const fakeCharacterId = mongoose.Types.ObjectId()
      const req = { params: { id: fakeCharacterId } }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character with id ${fakeCharacterId} doesn't exist.`
          )
        }
      }
      await deleteOne(req, res)
    })

    test('character is deleted sucessfully', async () => {
      expect.assertions(3)

      const character = await Character.create({
        name: 'test',
        createdBy: mongoose.Types.ObjectId()
      })

      const req = { params: { id: character._id } }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        json(result) {
          expect(result.data.deletedCount).toBe(1)
          expect(result.data.ok).toBe(1)
        }
      }
      await deleteOne(req, res)
    })
  })

  describe('updateOne', () => {
    test('id should be present in params or body', async () => {
      const req = { params: {}, body: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            'Neither param id or id in body is present in request.'
          )
        }
      }
      await updateOne(req, res)
    })

    test('id provided must be a valid id', async () => {
      const req = { params: { id: 'invalid_id' } }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character with id ${req.params.id} is not valid.`
          )
        }
      }
      await updateOne(req, res)
    })

    test('character provided must be real', async () => {
      expect.assertions(2)

      const fakeCharacterId = mongoose.Types.ObjectId()
      const req = { params: { id: fakeCharacterId } }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character with id ${fakeCharacterId} doesn't exist.`
          )
        }
      }
      await updateOne(req, res)
    })

    test('character is updated properly', async () => {
      expect.assertions(2)

      const user = await User.create({
        email: 'test@gmail.com',
        password: '1234'
      })

      const character = await Character.create({
        name: 'test',
        createdBy: user._id
      })

      const req = {
        params: { id: character._id },
        body: { name: 'new_test' },
        user
      }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        json(result) {
          expect(result.data.name).toBe(req.body.name)
        }
      }

      await updateOne(req, res)
    })

    test('character name must be unique', async () => {
      expect.assertions(2)

      const user = await User.create({
        email: 'test@gmail.com',
        password: '1234'
      })

      const dummyCharacter = await Character.create({
        name: 'dummy',
        createdBy: mongoose.Types.ObjectId()
      })

      const dummyCharacterTwo = await Character.create({
        name: 'another dummy',
        createdBy: mongoose.Types.ObjectId()
      })

      const req = {
        body: { ...dummyCharacterTwo },
        params: { id: dummyCharacter._id },
        user
      }
      console.log(dummyCharacterTwo._id)
      const res = {
        status(status) {
          expect(status).toBe(403)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character with name ${req.body.name} already exists.`
          )
        }
      }

      await updateOne(req, res)
    })
  })
})
