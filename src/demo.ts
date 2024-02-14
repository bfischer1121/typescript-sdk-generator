import { DefaultService as Pokemon } from '../sdks/pokemon/client'

const demo = async () => {
  const pokemon = await Pokemon.getPokemonById(6)
  console.log(`Loaded pokemon ${pokemon.name}`)

  const nature = await Pokemon.getNatureById(1)
  console.log(`Loaded nature ${nature.name}`)

  const stat = await Pokemon.getStatById(6)
  console.log('Loaded a stat')
}

demo()
