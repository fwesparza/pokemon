import { LOAD_ITEMS, REMOVE_ITEM, ADD_ITEM } from './items';

const LOAD = 'pokemon/LOAD';
const LOAD_TYPES = 'pokemon/LOAD_TYPES';
const ADD_ONE = 'pokemon/ADD_ONE';

const load = list => ({
  type: LOAD,
  list
});

const loadTypes = types => ({
  type: LOAD_TYPES,
  types
});

const addOnePokemon = pokemon => ({
  type: ADD_ONE,
  pokemon
});

export const createPokemon = (payload) => async dispatch => {
  const response = await fetch('/api/pokemon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const newPokemon = await response.json();

  try {
    const response = dispatch(addOnePokemon(newPokemon));

    if (!response.ok) {
      let errors = response.pokemon.errors;
      let fieldsWithErrors = Object.keys(errors);

      fieldsWithErrors.forEach(field => {
        throw new Error(`${field} ${errors.field}`);
      })
    }
  } catch (error) {
    console.error(`${error}`)
  }

  return response;

}

export const editPokemon = (payload) => async dispatch => {
  const response = await fetch(`/api/pokemon/${payload.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const newPokemon = await response.json();
    dispatch(addOnePokemon(newPokemon));
    return newPokemon;
  } else {
    return (response);
  }
}

// Phase 2
// getPokemon() is a thunk action creator
// that dispatches the return of the load() action creator
export const getPokemon = () => async dispatch => {
  const response = await fetch(`/api/pokemon`);

  if (response.ok) {
    const list = await response.json();
    dispatch(load(list));
  }
};

export const getPokemonTypes = () => async dispatch => {
  const response = await fetch(`/api/pokemon/types`);

  if (response.ok) {
    const types = await response.json();
    dispatch(loadTypes(types));
  }
};

// Phase 2
// getPokemonDetail is a thunk action creator that
// dispatches the return of the addOnePokemon action creator
export const getPokemonDetail = (id) => async dispatch => {
  const response = await fetch(`/api/pokemon/${id}`);

  if (response.ok) {
    const pokemon = await response.json();
    dispatch(addOnePokemon(pokemon));

    // Bonus 3 - Alert when back end server is not started yet
  } else {
    window.alert(`Error: Start the backend server to access this page.`)
  }

}

const initialState = {
  list: [],
  types: []
};

const sortList = (list) => {
  return list.sort((pokemonA, pokemonB) => {
    return pokemonA.number - pokemonB.number;
  }).map((pokemon) => pokemon.id);
};

const pokemonReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      const allPokemon = {};
      action.list.forEach(pokemon => {
        allPokemon[pokemon.id] = pokemon;
      });
      return {
        ...allPokemon,
        ...state,
        list: sortList(action.list)
      };
    case LOAD_TYPES:
      return {
        ...state,
        types: action.types
      };
    case ADD_ONE:
      if (!state[action.pokemon.id]) {
        const newState = {
          ...state,
          [action.pokemon.id]: action.pokemon
        };
        const pokemonList = newState.list.map(id => newState[id]);
        pokemonList.push(action.pokemon);
        newState.list = sortList(pokemonList);
        return newState;
      }
      return {
        ...state,
        [action.pokemon.id]: {
          ...state[action.pokemon.id],
          ...action.pokemon
        }
      };
    case LOAD_ITEMS:
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: action.items.map(item => item.id)
        }
      };
    case REMOVE_ITEM:
      return {
        ...state,
        [action.pokemonId]: {
          ...state[action.pokemonId],
          items: state[action.pokemonId].items.filter(
            (itemId) => itemId !== action.itemId
          )
        }
      };
    case ADD_ITEM:
      console.log(action.item);
      return {
        ...state,
        [action.item.pokemonId]: {
          ...state[action.item.pokemonId],
          items: [...state[action.item.pokemonId].items, action.item.id]
        }
      };
    default:
      return state;
  }
}

export default pokemonReducer;
