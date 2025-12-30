import React, { useState, useEffect } from 'react';
import { api } from '../api';

// Component responsible for starting and monitoring a long-running async task
const LongTaskPanel = () => {
    // Stores the backend task ID
    const [taskId, setTaskId] = useState(null);

    // Stores the current task status (e.g., accepted, SUCCESS, FAILURE)
    const [status, setStatus] = useState(null);

    // Controls whether the frontend should keep polling the backend
    const [isPolling, setIsPolling] = useState(false);

    // Starts the long-running task via the API
    const startTask = async () => {
        try {
            // Call backend endpoint to start the task
            const data = await api.startLongTask();

            // Save task ID returned by the backend
            setTaskId(data.task_id);

            // Initial status returned (usually "accepted")
            setStatus(data.status);

            // Enable polling to monitor task progress
            setIsPolling(true);
        } catch (error) {
            // Handle errors when starting the task
            console.error("Error starting task", error);
        }
    };

    // Effect responsible for polling the task status periodically
    useEffect(() => {
        let interval;

        // Start polling only if polling is enabled and a task ID exists
        if (isPolling && taskId) {
            interval = setInterval(async () => {
                try {
                    // Fetch current task status from the backend
                    const data = await api.getTaskStatus(taskId);

                    // Update task status in the UI
                    setStatus(data.state);

                    // Stop polling if the task has finished
                    if (data.state === 'SUCCESS' || data.state === 'FAILURE') {
                        setIsPolling(false);
                        clearInterval(interval);
                    }
                } catch (error) {
                    // Stop polling on error
                    console.error("Polling error", error);
                    setIsPolling(false);
                }
            }, 2000); // Poll every 2 seconds
        }

        // Cleanup interval when component unmounts or dependencies change
        return () => clearInterval(interval);
    }, [isPolling, taskId]);

    return (
        <div className="mt-5 p-3 border rounded bg-light">
            <h5>Long Async Task</h5>
            <p className="text-muted">Simulates a heavy process via Celery</p>

            {/* Button to start the async task */}
            <button
                className="btn btn-warning mb-3"
                onClick={startTask}
                disabled={isPolling}
            >
                {isPolling ? 'Processing...' : 'Start Task'}
            </button>

            {/* Display task status and ID once available */}
            {status && (
                <div>
                    <div>Status: <strong>{status}</strong></div>
                    {taskId && (
                        <div className="mb-2">
                            <strong>Task ID:</strong><br />
                            <code>{taskId}</code>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LongTaskPanel;
