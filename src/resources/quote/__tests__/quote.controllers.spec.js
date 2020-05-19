import { createOne, getOne } from '../quote.controller'
import { User } from '../../user/user.model'
import mongoose, { mongo } from 'mongoose'
import { Character } from '../../character/character.model'
import { Quote } from '../quote.model'

describe('Quote controllers', () => {
  describe('quote createOne', () => {
    test('quote property should be present', async () => {
      const req = { body: {} }
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

    test('character property should be present', async () => {
      const req = { body: { quote: 'test-quote' } }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe('Character property is required.')
        }
      }

      await createOne(req, res)
    })

    test('character id must be valid', async () => {
      const invalidCharacterId = 'blehbluh'
      const req = {
        body: { quote: 'test-quote', character: invalidCharacterId }
      }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character with id ${invalidCharacterId} is not valid.`
          )
        }
      }

      await createOne(req, res)
    })

    test('character must exist', async () => {
      expect.assertions(2)

      const fakeCharacterId = mongoose.Types.ObjectId()
      const req = {
        body: { quote: 'test-quote', character: fakeCharacterId }
      }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character with id ${fakeCharacterId} does not exist.`
          )
        }
      }

      await createOne(req, res)
    })

    test('character is created successfully', async () => {
      expect.assertions(2)

      const user = await User.create({
        email: 'javier@lol.com',
        password: '1234'
      })

      const character = await Character.create({
        name: 'Rick',
        createdBy: user._id
      })
      const req = {
        body: { quote: 'test-quote', character: character._id },
        user
      }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        json(result) {
          expect(result.data.quote).toBe(req.body.quote)
        }
      }

      await createOne(req, res)
    })
  })

  describe('quote get one', () => {
    test('id param must be present', async () => {
      const req = { params: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe('Quote id param is required.')
        }
      }

      await getOne(req, res)
    })

    test('id param must be a valid id', async () => {
      const req = { params: { id: '123' } }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Quote with id ${req.params.id} is not valid.`
          )
        }
      }
      await getOne(req, res)
    })

    test('quote does not exists', async () => {
      const req = { params: { id: mongoose.Types.ObjectId() } }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Quote with id ${req.params.id} does not exist.`
          )
        }
      }
      await getOne(req, res)
    })

    test('gets quote successfully', async () => {
      const quote = await Quote.create({
        quote: 'Wabba labba dubb dubb',
        character: mongoose.Types.ObjectId(),
        createdBy: mongoose.Types.ObjectId()
      })

      const req = { params: { id: quote._id } }
      const res = {
        status(status) {
          expect(status).toBe(201)
          return this
        },
        json(result) {
          expect(result.data._id).toEqual(quote._id)
        }
      }
      await getOne(req, res)
    })
  })

  // describe('quote get many', () => {
  //   // test('character with name provided must exist.', () => {

  //   })
  //   test('quotes are found by name successfully', () => {
      
  //   })
  //   test('quotes are found successfully', () => {
      
  //   })
  //   test('quotes are not found', () => {
      
  //   })

  //   //  TODO: add support for limit query param.
  // })
})