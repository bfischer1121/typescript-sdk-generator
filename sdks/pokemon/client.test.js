import { DefaultService } from './client/services/DefaultService'

describe('DefaultService', () => {
  describe('getPokemonById', () => {
    test('returns a valid pokemon object on success', async () => {
      const pokemonId = 1
      const response = await DefaultService.getPokemonById(pokemonId)
      expect(response).toBeDefined()
      expect(response.id).toBe(pokemonId)
    })

    test('throws an error on failure', async () => {
      const invalidPokemonId = -1
      await expect(DefaultService.getPokemonById(invalidPokemonId)).rejects.toThrow('ApiError')
    })
  })

  describe('getStatById', () => {
    test('returns a valid stat object on success', async () => {
      const statId = 1
      const response = await DefaultService.getStatById(statId)
      expect(response).toBeDefined()
      expect(response.stat.name).toBeDefined()
      expect(response.stat.url).toBeDefined()
    })

    test('throws an error on failure', async () => {
      const invalidStatId = -1
      await expect(DefaultService.getStatById(invalidStatId)).rejects.toThrow('ApiError')
    })
  })

  describe('getNatureById', () => {
    test('returns a valid nature object on success', async () => {
      const natureId = 1
      const response = await DefaultService.getNatureById(natureId)
      expect(response).toBeDefined()
      expect(response.name).toBeDefined()
      expect(response.increased_stat).toBeDefined()
      expect(response.decreased_stat).toBeDefined()
    })

    test('throws an error on failure', async () => {
      const invalidNatureId = -1
      await expect(DefaultService.getNatureById(invalidNatureId)).rejects.toThrow('ApiError')
    })
  })
})
