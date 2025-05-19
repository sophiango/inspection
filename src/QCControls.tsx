// src/components/QCControls.tsx

import {useState} from "react";

interface QCControlsProps {
    currentTime: number;
    onAddIssue: (issue: string) => void;
    issues: string[];
}

// @ts-ignore
const QCControls = ({currentTime, onAddIssue, issues}: QCControlsProps) => {
    const [customIssue, setCustomIssue] = useState<string>('');

    const handleAddIssue = (issueType: string) => {
        onAddIssue(issueType);
    };

    const handleCustomIssueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomIssue(e.target.value);
    };

    const handleCustomIssueSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customIssue.trim()) {
            onAddIssue(customIssue);
            setCustomIssue('');
        }
    };

    return (
        <div className="qc-controls">
            <h3>Quality Control</h3>

            <div>
                <button onClick={() => handleAddIssue('Video Glitch')} className="mr-4 px-6 py-2 font-medium tracking-wide text-black capitalize transition-colors duration-300 transform bg-white-600 rounded-lg border hover:bg-red-500 focus:outline focus:ring focus:ring-red-300 focus:ring-opacity-80">
                Video Glitch
                </button>
                <button onClick={() => handleAddIssue('Audio Dropout')} className="mr-4 px-6 py-2 font-medium tracking-wide text-black capitalize transition-colors duration-300 transform bg-white-600 rounded-lg border hover:bg-red-500 focus:outline focus:ring focus:ring-red-300 focus:ring-opacity-80">
                Audio Dropout
                </button>
                <button onClick={() => handleAddIssue('Sync Issue')} className="mr-4 px-6 py-2 font-medium tracking-wide text-black capitalize transition-colors duration-300 transform bg-white-600 rounded-lg border hover:bg-red-500 focus:outline focus:ring focus:ring-red-300 focus:ring-opacity-80">
                Sync Issue
                </button>
                <button onClick={() => handleAddIssue('Color Issue')} className="mr-4 px-6 py-2 font-medium tracking-wide text-black capitalize transition-colors duration-300 transform bg-white-600 rounded-lg border hover:bg-red-500 focus:outline focus:ring focus:ring-red-300 focus:ring-opacity-80">
                Color Issue
                </button>
            </div>

            <form onSubmit={handleCustomIssueSubmit} className="custom-issue-form">
                <input
                    type="text"
                    value={customIssue}
                    onChange={handleCustomIssueChange}
                    placeholder="Custom issue..."
                    className="block  mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-gray-700 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-blue-300"
                />
                <button type="submit"  className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                Add
                </button>
            </form>

            <div className="issues-list">
                <h4>Issues Found:</h4>
                {issues.length > 0 ? (
                    <ul>
                        {issues.map((issue, index) => (
                            <li key={index}>{issue}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No issues reported yet.</p>
                )}
            </div>
        </div>
    );
};

export default QCControls;