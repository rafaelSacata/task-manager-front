<template>
  <router-view />
</template>

<script>

import { useToast } from 'vue-toastification';
import ReminderService from './services/ReminverService';

export default {
  name: 'App',
  setup() {
    const toast = useToast();

    const checkReminders = async () => {
      const reminders = await ReminderService.getPendingReminders();
      reminders.forEach((task) => {
        toast.info(`Lembrete: ${task.title}\n${task.description}`, {
          timeout: 5000,
        });
      });
    };

    setInterval(checkReminders, 60000);
    checkReminders();

    return {};
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
