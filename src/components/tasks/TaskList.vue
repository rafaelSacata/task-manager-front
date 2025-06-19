<template>
  <div>
    <h2>Minhas Tarefas</h2>
    <TaskForm v-if="showForm" :id="selectedTaskId" @task-saved="fetchTasks" />
    <ul>
      <li v-for="task in tasks" :key="task.taskId">
        {{ task.title }} - {{ task.description }}
        <button @click="editTask(task.taskId)">Editar</button>
        <button @click="deleteTask(task.taskId)">Excluir</button>
      </li>
    </ul>
    <button @click="createTask">Nova Tarefa</button>
  </div>
</template>

<script>
import axios from 'axios';
import TaskForm from './TaskForm.vue';

export default {
  components: { TaskForm },
  data() {
    return {
      tasks: [],
      showForm: false,
      selectedTaskId: null,
    };
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        const response = await axios.get('http://localhost:8080/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.tasks = response.data;
        this.showForm = false;
      } catch (error) {
        console.error('Erro ao buscar tarefas', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    editTask(id) {
      this.selectedTaskId = id;
      this.showForm = true;
    },
    async deleteTask(id) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        await axios.delete(`http://localhost:8080/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.fetchTasks();
      } catch (error) {
        console.error('Erro ao excluir tarefa', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    createTask() {
      this.selectedTaskId = null;
      this.showForm = true;
    },
  },
};
</script>