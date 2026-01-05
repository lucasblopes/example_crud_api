import React, { useState, useEffect } from 'react';
import { api } from '../api';

const LongTaskPanel = () => {
    const [taskId, setTaskId] = useState(null);
    const [status, setStatus] = useState(null);
    const [result, setResult] = useState(null);
    const [isPolling, setIsPolling] = useState(false);

    const startTask = async () => {
        setResult(null);
        try {
            const data = await api.startLongTask();
            setTaskId(data.task_id);
            setStatus(data.status);
            setIsPolling(true);
        } catch (error) {
            console.error("Error", error);
        }
    };

    useEffect(() => {
        let interval;
        if (isPolling && taskId) {
            interval = setInterval(async () => {
                try {
                    const data = await api.getTaskStatus(taskId);
                    setStatus(data.state);

                    if (data.state === 'SUCCESS') {
                        setResult(data.result);
                        setIsPolling(false);
                        clearInterval(interval);
                    } else if (data.state === 'FAILURE') {
                        setIsPolling(false);
                        clearInterval(interval);
                    }
                } catch (error) {
                    setIsPolling(false);
                }
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isPolling, taskId]);

    return (
        <div className="mt-5 p-3 border rounded bg-light">
            <h5>Long Async Task (Stats)</h5>

            <button
                className="btn btn-warning mb-3"
                onClick={startTask}
                disabled={isPolling}
            >
                {isPolling ? 'Calculating Stats...' : 'Start Calculation'}
            </button>

            {status && (
                <div>
                    <div>Status: <strong>{status}</strong></div>
                    {result && (
                        <ul className="mt-2 mb-0">
                            <li><strong>Average Age:</strong> {result.average_age?.toFixed(2)}</li>
                            <li><strong>Std Dev:</strong> {result.std_dev_age?.toFixed(2)}</li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default LongTaskPanel;
