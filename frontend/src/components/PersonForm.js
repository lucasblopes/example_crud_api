import React, { useState, useEffect } from 'react';
import { api } from '../api';

// Form component used to create or edit a person
const PersonForm = ({ onRefresh, personToEdit, setPersonToEdit }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [hobbies, setHobbies] = useState('');

    // Fill the form fields when editing an existing person
    useEffect(() => {
        if (personToEdit) {
            setName(personToEdit.person_name);
            setAge(personToEdit.age || '');
            setHobbies(
                Array.isArray(personToEdit.hobbies)
                    ? personToEdit.hobbies.join(', ')
                    : ''
            );
        }
    }, [personToEdit]);

    // Handle form submission for create or update
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convert "a, b, c" string into ["a", "b", "c"] array
        const hobbiesList = hobbies
            .split(',')
            .map(h => h.trim())
            .filter(h => h);

        const payload = {
            person_name: name,
            age: parseInt(age, 10), // Sends as a number
            hobbies: hobbiesList
        };

        try {
            if (personToEdit) {
                // Update existing person
                await api.updatePerson(personToEdit.id, payload);
                setPersonToEdit(null); // Exit edit mode
            } else {
                // Create a new person
                await api.createPerson(payload);
            }

            // Reset form fields
            setName('');
            setAge('');
            setHobbies('');
            onRefresh(); // Refresh the list
        } catch (error) {
            console.error("Error while saving:", error);
            alert("Error while saving person");
        }
    };

    // Cancel editing and reset the form
    const handleCancel = () => {
        setPersonToEdit(null);
        setName('');
        setAge('');
        setHobbies('');
    };

    return (
        <div className="mb-4">
            <h5>{personToEdit ? 'Edit Person' : 'Create Person'}</h5>
            <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    placeholder="Person name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="number"
                    className="form-control"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                <input
                    className="form-control mb-2"
                    placeholder="Hobbies (comma separated, e.g., reading, cycling)"
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                />
                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className={`btn ${personToEdit ? 'btn-warning' : 'btn-primary'}`}
                    >
                        {personToEdit ? 'Update' : 'Create'}
                    </button>
                    {personToEdit && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PersonForm;
