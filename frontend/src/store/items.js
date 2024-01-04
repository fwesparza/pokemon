import { useParams } from 'react-router-dom';

export const LOAD_ITEMS = "items/LOAD_ITEMS";
export const UPDATE_ITEM = "items/UPDATE_ITEM";
export const REMOVE_ITEM = "items/REMOVE_ITEM";
export const ADD_ITEM = "items/ADD_ITEM";

const load = (items, pokemonId) => ({
  type: LOAD_ITEMS,
  items,
  pokemonId
});

const update = (item) => ({
  type: UPDATE_ITEM,
  item
});

const add = (item) => ({
  type: ADD_ITEM,
  item
});

const remove = (itemId, pokemonId) => ({
  type: REMOVE_ITEM,
  itemId,
  pokemonId
});

const initialState = {};

// Phase 5
export const getPokemonItems = (id) => async dispatch => {
  const response = await fetch(`/api/pokemon/${id}/items`);

  if (response.ok) {
    const items = await response.json();
    dispatch(load(items, id));
  }
}

// Phase 6
export const editPokemonItem = (payload) => async dispatch => {
  const response = await fetch(`/api/items/${payload.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const newItem = await response.json();
    dispatch(update(newItem));
    return newItem;
  } else {
    return (response);
  }
}

// Bonus 1 - Delete an item
export const deletePokemonItem = ({ itemId, pokemonId }) => async dispatch => {
  const response = await fetch(`/api/items/${itemId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(remove(itemId, pokemonId));
  }
}

// Bonus 2
export const addPokemonItem = ({ item, pokemonId }) => async dispatch => {
  const response = await fetch(`/api/pokemon/${pokemonId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });

  if (response.ok) {
    const newItem = await response.json();
    dispatch(add(newItem));
    return newItem;
  } else {
    return (response);
  }
}

const itemsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_ITEMS:
      const newItems = {};
      action.items.forEach(item => {
        newItems[item.id] = item;
      })
      return {
        ...state,
        ...newItems
      }

    case REMOVE_ITEM:
      const newState = { ...state };
      delete newState[action.itemId];
      return newState;

    // Bonus 2
    case ADD_ITEM:
      return {
        ...state,
        [action.item.id]: action.item
      };

    case UPDATE_ITEM:
      return {
        ...state,
        [action.item.id]: action.item
      };

    default:
      return state;
  }
};

export default itemsReducer;
