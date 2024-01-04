import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPokemonItem } from '../store/items';

const AddItemForm = ({ pokemonId, hideForm }) => {
    const dispatch = useDispatch();
    const [happiness, setHappiness] = useState(0);
    const [price, setPrice] = useState(0);
    const [name, setName] = useState("");

    const updateName = (e) => setName(e.target.value);
    const updateHappiness = (e) => setHappiness(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const item = {
            name: name,
            happiness: happiness,
            price: price
        };

        if (item) {
            dispatch(addPokemonItem({ item, pokemonId }));
            hideForm();
        }
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        hideForm();
    };

    return (
        <section className="edit-form-holder centered middled">
            <form className="item-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={updateName}
                />
                <input
                    type="number"
                    placeholder="Happiness"
                    min="0"
                    max="100"
                    required
                    value={happiness}
                    onChange={updateHappiness}
                />
                <input
                    type="number"
                    placeholder="Price"
                    required
                    value={price}
                    onChange={updatePrice}
                />
                <button type="submit">Add Item</button>
                <button type="button" onClick={handleCancelClick}>Cancel</button>
            </form>
        </section>
    );
};

export default AddItemForm;
