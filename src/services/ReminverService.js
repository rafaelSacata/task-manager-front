import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;

const ReminderService = {
    async getPendingReminders() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/tasks/reminders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching reminders:', error);
            return [];
        }
    },
};

export default ReminderService;