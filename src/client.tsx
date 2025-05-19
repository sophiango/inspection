import {createClient} from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
console.log("Supabase URL", supabaseUrl);
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
// API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Video API functions
 */
export const videoAPI = {
    // Get all videos
    async getAllVideos(): Promise<any[]> {
        try {
            const response = await fetch(`${API_URL}/videos`);
            if (!response.ok) throw new Error('Failed to fetch videos');
            return await response.json();
        } catch (error: any) {
            console.error('Error fetching videos:', error);
            throw error;
        }
    },

    async getVideo(videoId: string): Promise<any> {
        try {
            // Fetch video metadata
            const response = await fetch(`${API_URL}/videos/${videoId}`);
            if (!response.ok) throw new Error('Failed to fetch video');
            const videoData = await response.json();

            // Fetch actual video file
            const videoResponse = await fetch(videoData.url);
            if (!videoResponse.ok) throw new Error('Failed to fetch video file');

            const blob = await videoResponse.blob();

            return {
                ...videoData,
                blob,
                url: URL.createObjectURL(blob)
            };
        } catch (error: any) {
            console.error(`Error fetching video ${videoId}:`, error);
            throw error;
        }
    },

    // Upload a new video
    async uploadVideo(videoFile: File, metadata: { title?: string; description?: string }): Promise<any> {
        try {
            const formData = new FormData();
            formData.append('video', videoFile);

            if (metadata.title) formData.append('title', metadata.title);
            if (metadata.description) formData.append('description', metadata.description);

            const response = await fetch(`${API_URL}/videos/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload video');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error uploading video:', error);
            throw error;
        }
    }
};

/**
 * Issues API functions
 */
export const issuesAPI = {
    // Get all issues for a video
    async getIssuesForVideo(videoId: string): Promise<any[]> {
        try {
            const response = await fetch(`${API_URL}/videos/${videoId}/issues`);
            if (!response.ok) throw new Error('Failed to fetch issues');
            return await response.json();
        } catch (error: any) {
            console.error(`Error fetching issues for video ${videoId}:`, error);
            throw error;
        }
    },

    // Add a new issue
    async addIssue(videoId: string, issueData: any): Promise<any> {  // Type for issueData
        try {
            const response = await fetch(`${API_URL}/videos/${videoId}/issues`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(issueData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add issue');
            }

            return await response.json();
        } catch (error: any) {
            console.error('Error adding issue:', error);
            throw error;
        }
    },

    // Update an issue
    async updateIssue(issueId: string, issueData: any): Promise<any> { // Type for issueData
        try {
            const response = await fetch(`${API_URL}/issues/${issueId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(issueData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update issue');
            }

            return await response.json();
        } catch (error: any) {
            console.error(`Error updating issue ${issueId}:`, error);
            throw error;
        }
    },

    // Delete an issue
    async deleteIssue(issueId: string): Promise<any> {
        try {
            const response = await fetch(`${API_URL}/issues/${issueId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete issue');
            }

            return await response.json();
        } catch (error: any) {
            console.error(`Error deleting issue ${issueId}:`, error);
            throw error;
        }
    }
};

/**
 * Tasks API functions
 */
export const tasksAPI = {
    // Get all tasks
    async getAllTasks(): Promise<any[]> {
        try {
            const response = await fetch(`${API_URL}/tasks`);
            if (!response.ok) throw new Error('Failed to fetch tasks');
            return await response.json();
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    // Mark a task as complete
    async completeTask(taskId: string): Promise<any> {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
                method: 'PUT',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to complete task');
            }

            return await response.json();
        } catch (error: any) {
            console.error(`Error completing task ${taskId}:`, error);
            throw error;
        }
    }
};

export {supabase};
