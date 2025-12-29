import React from 'react';
import { api } from '../api';

// Component responsible for listing persons with pagination controls
const PersonList = ({ persons, pagination, onRefresh, onEdit, setOffset }) => {

    // Delete a person after user confirmation
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await api.deletePerson(id);
            onRefresh(); // Refresh the list after deletion
        }
    };

    // Go to the previous page using the pagination URL
    const handlePrev = () => {
        if (pagination.previous) {
            // Extract offset value from the previous page URL
            const url = new URL(pagination.previous);
            const newOffset = url.searchParams.get('offset') || 0;
            setOffset(Number(newOffset));
        }
    };

    // Go to the next page using the pagination URL
    const handleNext = () => {
        if (pagination.next) {
            const url = new URL(pagination.next);
            const newOffset = url.searchParams.get('offset');
            setOffset(Number(newOffset));
        }
    };

    return (
        <div className="mb-4">
            <h5>Persons</h5>
            <ul className="list-group mb-3">
                {persons.map(p => (
                    <li
                        key={p.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{p.person_name}</strong><br />
                            <small className="hobbies-text">
                                {JSON.stringify(p.hobbies)}
                            </small>
                        </div>
                        <div>
                            <button
                                className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => onEdit(p)}
                            >
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(p.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
                {/* Display message when no persons are found */}
                {persons.length === 0 && (
                    <li className="list-group-item">No persons found.</li>
                )}
            </ul>

            {/* Pagination controls */}
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-secondary"
                    disabled={!pagination.previous}
                    onClick={handlePrev}
                >
                    Prev
                </button>
                <button
                    className="btn btn-secondary"
                    disabled={!pagination.next}
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PersonList;
