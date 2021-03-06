import { createOne, getOne, updateOne, deleteOne } from '../quote.controller'
import { User } from '../../user/user.model'
import mongoose from 'mongoose'
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
    test('id param must be a valid id', async () => {
      const req = { query: { character_id: '123' } }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Character id ${req.query.character_id} is not valid.`
          )
        }
      }
      await getOne(req, res)
    })

    test('quote with character id does not exists', async () => {
      const req = { query: { character_id: mongoose.Types.ObjectId() } }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Quote with character id ${req.query.character_id} does not exist.`
          )
        }
      }
      await getOne(req, res)
    })

    test('quote with character name does not exists', async () => {
      const req = { query: { character_name: 'fake-name' } }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Quote with character name ${req.query.character_name} does not exist.`
          )
        }
      }
      await getOne(req, res)
    })

    test('gets quote by character id successfully', async () => {
      expect.assertions(2)

      const character = await Character.create({
        name: 'Rick',
        createdBy: mongoose.Types.ObjectId()
      })

      const quote = await Quote.create({
        quote: 'Wabba labba dubb dubb',
        character: character._id,
        createdBy: mongoose.Types.ObjectId()
      })

      const req = { query: { character_id: quote.character } }
      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(result) {
          expect(result.data.character).toEqual(quote.character)
        }
      }
      await getOne(req, res)
    })

    test('gets quote by character name successfully', async () => {
      expect.assertions(3)


      const character = await Character.create({
        name: 'Rick',
        createdBy: mongoose.Types.ObjectId()
      })

      const quote = await Quote.create({
        quote: 'Wabba labba dubb dubb',
        character: character._id,
        createdBy: mongoose.Types.ObjectId()
      })

      const req = { query: { character_name: character.name } }
      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(result) {
          expect(result.data.character).toEqual(character._id)
          expect(result.data.quote).toEqual(quote.quote)
        }
      }
      await getOne(req, res)
    })
  })

  // describe('quote get many', () => {
  //   test('character id provided must be a valid id.', async () => {
  //     const req = {
  //       query: { character_id: 'bbleh', limit: 5 }
  //     }
  //     const res = {
  //       status(status) {
  //         expect(status).toBe(400)
  //         return this
  //       },
  //       send(result) {
  //         expect(result.message).toBe(
  //           `Character id ${req.query.character_id} is not valid.`
  //         )
  //       }
  //     }

  //     await getMany(req, res)
  //   })

  //   test('character name provided must be a real.', async () => {
  //     const req = {
  //       query: { character_name: 'fake_name' }
  //     }

  //     const res = {
  //       status(status) {
  //         expect(status).toBe(404)
  //         return this
  //       },
  //       send(result) {
  //         expect(typeof result.message).toBe('string')
  //       }
  //     }

  //     await getMany(req, res)
  //   })

  //   test('quotes are found by character id successfully', async () => {
  //     expect.assertions(2)

  //     const character = await Character.create({
  //       name: 'Rick',
  //       createdBy: mongoose.Types.ObjectId()
  //     })

  //     await Quote.create({
  //       quote: 'Some quote.',
  //       character: character._id,
  //       createdBy: mongoose.Types.ObjectId()
  //     })

  //     const req = { query: { character_id: character._id, limit: 5 } }
  //     const res = {
  //       status(status) {
  //         expect(status).toBe(200)
  //         return this
  //       },
  //       json(result) {
  //         expect(result.data).toHaveLength(1)
  //       }
  //     }

  //     await getMany(req, res)
  //   })

  //   test('Quotes are found by character name successfully', async () => {
  //     expect.assertions(2)

  //     const character = await Character.create({
  //       name: 'javier',
  //       createdBy: mongoose.Types.ObjectId()
  //     })

  //     await Quote.create({
  //       quote: 'Some quote.',
  //       character: character._id,
  //       createdBy: character._id
  //     })

  //     const req = { query: { character_name: character.name } }
  //     const res = {
  //       status(status) {
  //         expect(status).toBe(200)
  //         return this
  //       },
  //       json(result) {
  //         const firstQuote = result.data[0]
  //         expect(firstQuote.character.name).toBe(character.name)
  //       }
  //     }
  //     await getMany(req, res)
  //   })

  //   test('quotes are found successfully', async () => {
  //     expect.assertions(2)

  //     const character = await Character.create({
  //       name: 'Rick',
  //       createdBy: mongoose.Types.ObjectId()
  //     })

  //     await Quote.create({
  //       quote: 'Some quote.',
  //       character: character._id,
  //       createdBy: mongoose.Types.ObjectId()
  //     })

  //     const req = { query: { limit: 5 } }
  //     const res = {
  //       status(status) {
  //         expect(status).toBe(200)
  //         return this
  //       },
  //       json(result) {
  //         expect(Array.isArray(result.data)).toBe(true)
  //       }
  //     }

  //     await getMany(req, res)
  //   })

  //   test('amount of quotes returned match limit', async () => {
  //     expect.assertions(2)

  //     const character = await Character.create({
  //       name: 'Rick',
  //       createdBy: mongoose.Types.ObjectId()
  //     })

  //     await Quote.create({
  //       quote: 'Some quote.',
  //       character: character._id,
  //       createdBy: mongoose.Types.ObjectId()
  //     })

  //     await Quote.create({
  //       quote: 'Some quote.',
  //       character: character._id,
  //       createdBy: mongoose.Types.ObjectId()
  //     })

  //     await Quote.create({
  //       quote: 'Some quote.',
  //       character: character._id,
  //       createdBy: mongoose.Types.ObjectId()
  //     })

  //     const req = { query: { limit: 2 } }
  //     const res = {
  //       status(status) {
  //         expect(status).toBe(200)
  //         return this
  //       },
  //       json(result) {
  //         expect(result.data.length).toBe(2)
  //       }
  //     }

  //     await getMany(req, res)
  //   })
  //   //  TODO: add support for limit query param.
  // })

  describe('quote update', () => {
    test('quote id param must be present', async () => {
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

      await updateOne(req, res)
    })
    test('quote id must be valid', async () => {
      const invalidQuoteId = 'blehbluh'
      const req = {
        params: { id: invalidQuoteId }
      }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Quote provided with id ${invalidQuoteId} is not valid.`
          )
        }
      }

      await updateOne(req, res)
    })
    test('quote is updated successfully', async () => {
      expect.assertions(3)
      const quote = await Quote.create({
        quote: 'this is a quote',
        character: mongoose.Types.ObjectId(),
        createdBy: mongoose.Types.ObjectId()
      })

      const req = {
        params: { id: quote._id },
        body: {
          quote: 'this is another quote.',
          character: mongoose.Types.ObjectId()
        }
      }
      const res = {
        status(status) {
          expect(status).toBe(200)
          return this
        },
        json(result) {
          expect(result.data.quote).toBe(req.body.quote)
          expect(result.data.character).toEqual(req.body.character)
        }
      }
      await updateOne(req, res)
    })

    test('quote id provided must be real.', async () => {
      expect.assertions(2)

      const req = {
        params: { id: mongoose.Types.ObjectId() },
        body: {
          quote: 'new quote value',
          character: mongoose.Types.ObjectId()
        }
      }
      const res = {
        status(status) {
          expect(status).toBe(404)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Quote with id ${req.params.id} was not found.`
          )
        }
      }
      await updateOne(req, res)
    })
  })

  describe('quote delete', () => {
    test('quote id must be present', async () => {
      const req = { params: {} }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(`Quote id param is required.`)
        }
      }
      await deleteOne(req, res)
    })

    test('quote id must be valid', async () => {
      const req = { params: { id: 'invalidId' } }
      const res = {
        status(status) {
          expect(status).toBe(400)
          return this
        },
        send(result) {
          expect(result.message).toBe(
            `Quote with id ${req.params.id} is invalid.`
          )
        }
      }
      await deleteOne(req, res)
    })

    test('quote with id param provided must exist.', async () => {
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
      await deleteOne(req, res)
    })

    test('quote is deleted sucessfully', async () => {
      expect.assertions(3)

      const quote = await Quote.create({
        quote: 'this is a nice quote',
        character: mongoose.Types.ObjectId(),
        createdBy: mongoose.Types.ObjectId()
      })

      const req = { params: { id: quote._id } }
      const res = {
        status(status) {
          expect(status).toBe(200)
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
})
