<template>
  <div>
    <h2>{{ isEdit ? 'Editar Tarefa' : 'Nova Tarefa' }}</h2>
    <form @submit.prevent="saveTask">
      <input v-model="task.title" placeholder="Título" required />
      <textarea v-model="task.description" placeholder="Descrição" required></textarea>
      <button type="submit">{{ isEdit ? 'Salvar' : 'Criar' }}</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      task: { title: '', description: '' },
      isEdit: false,
    };
  },
  mounted() {
    if (this.id) {
      this.isEdit = true;
      this.fetchTask();
    }
  },
  methods: {
    async fetchTask() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        const response = await axios.get(`http://localhost:8080/tasks/${this.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.task = response.data;
      } catch (error) {
        console.error('Erro ao buscar tarefa', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    async saveTask() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        if (this.isEdit) {
          await axios.put(`http://localhost:8080/tasks/${this.id}`, this.task, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await axios.post('http://localhost:8080/tasks', this.task, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        this.$emit('task-saved');
        this.$router.push('/tasks');
      } catch (error) {
        console.error('Erro ao salvar tarefa', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
  },
};
</script>