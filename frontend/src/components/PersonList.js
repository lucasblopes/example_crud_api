import React, { useState } from 'react';
import { api } from '../api';

const PersonList = ({ persons, pagination, onRefresh, onEdit, setOffset }) => {
    // Estados para o filtro
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await api.deletePerson(id);
            onRefresh(); // Simple refresh (keeps filters if they are in the App state, or resets them)
        }
    };

    const handlePrev = () => {
        if (pagination.previous) {
            const url = new URL(pagination.previous);
            const newOffset = url.searchParams.get('offset') || 0;
            setOffset(Number(newOffset));
        }
    };

    const handleNext = () => {
        if (pagination.next) {
            const url = new URL(pagination.next);
            const newOffset = url.searchParams.get('offset');
            setOffset(Number(newOffset));
        }
    };

    // Function to apply filter
    const handleFilter = () => {
        setOffset(0);
        onRefresh(startDate, endDate);
    };

    return (
        <div className="mb-4">
            // Filter and Data inputs
            <div className="d-flex gap-2 mb-3 align-items-end">
                <div>
                    <label className="form-label small mb-0">From</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label className="form-label small mb-0">To</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>
                <button className="btn btn-sm btn-info text-white" onClick={handleFilter}>
                    Filter
                </button>
            </div>

            <h5>Persons</h5>
            <ul className="list-group mb-3">
                {persons.map(p => (
                    <li
                        key={p.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <div>
                            <strong>{p.person_name}</strong> <span className="badge bg-light text-dark border ms-1">{p.age}y</span><br />
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
