import React, { useState, useEffect } from 'react';
import { api } from './api';
import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import LongTaskPanel from './components/LongTaskPanel';
import './styles.css';

function App() {
    const [persons, setPersons] = useState([]);
    const [pagination, setPagination] = useState({});
    // Tracks the current offset for pagination to fetch the correct page of data
    const [offset, setOffset] = useState(0);
    const [personToEdit, setPersonToEdit] = useState(null);
    // Saves filters for use during pagination.
    const [filters, setFilters] = useState({ startDate: '', endDate: '' });

    const loadPersons = async (startDateArg, endDateArg) => {
        // Uses arguments if provided, otherwise uses the state.
        const currentStart = startDateArg !== undefined ? startDateArg : filters.startDate;
        const currentEnd = endDateArg !== undefined ? endDateArg : filters.endDate;

        // Update state if new filters are added
        if (startDateArg !== undefined) {
            setFilters({ startDate: startDateArg, endDate: endDateArg });
        }
        try {
            const data = await api.fetchPersons(10, offset, currentStart, currentEnd);
            setPersons(data.results);
            setPagination({ next: data.next, previous: data.previous });
        } catch (error) {
            console.error("Error loading persons:", error);
        }
    };

    // Reload the list whenever the 'offset' changes (pagination occurs)
    // or when explicitly called via loadPersons() after a CRUD operation
    useEffect(() => {
        loadPersons();
    }, [offset]);

    return (
        <div className="container mt-4 pb-5">
            <h3>Person CRUD Demo</h3>
            <hr />

            <div className="mb-5">
                <PersonForm
                    onRefresh={() => loadPersons()}
                    personToEdit={personToEdit}
                    setPersonToEdit={setPersonToEdit}
                />

                <PersonList
                    persons={persons}
                    pagination={pagination}
                    onRefresh={loadPersons}
                    onEdit={setPersonToEdit}
                    setOffset={setOffset}
                />
            </div>

            <LongTaskPanel />
        </div>
    );
}

export default App;
