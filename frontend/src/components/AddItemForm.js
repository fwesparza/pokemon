import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPokemonItem } from '../store/items';

const AddItemForm = ({ pokemonId, hideForm }) => {
    const dispatch = useDispatch();

    // Removed from ItemForm.js code
    // let item = useSelector(state => state.items[itemId]);
    // const [happiness, setHappiness] = useState(item.happiness);
    // const [price, setPrice] = useState(item.price);
    // const [name, setName] = useState(item.name);

    const [happiness, setHappiness] = useState(100);
    const [price, setPrice] = useState(100);
    const [name, setName] = useState("Dolphin Stickers");

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
