// Use environment variable for flexibility, defaulting to the docker-compose setup
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

export const api = {
    // Fetch a paginated list of persons
    fetchPersons: async (limit = 10, offset = 0) => {
        const response = await fetch(`${API_BASE_URL}/persons/?limit=${limit}&offset=${offset}`);
        return response.json();
    },

    // Create a new person
    createPerson: async (personData) => {
        const response = await fetch(`${API_BASE_URL}/persons/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personData),
        });
        return response.json();
    },

    // Update an existing person by ID
    updatePerson: async (id, personData) => {
        const response = await fetch(`${API_BASE_URL}/persons/${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(personData),
        });
        return response.json();
    },

    // Delete a person by ID
    deletePerson: async (id) => {
        await fetch(`${API_BASE_URL}/persons/${id}/`, {
            method: 'DELETE',
        });
    },

    // Start a long-running background task
    startLongTask: async () => {
        const response = await fetch(`${API_BASE_URL}/long-task/`, {
            method: 'POST',
        });
        return response.json();
    },

    // Get the status of a long-running task
    getTaskStatus: async (taskId) => {
        const response = await fetch(`${API_BASE_URL}/long-task/${taskId}/`);
        return response.json();
    }
};
