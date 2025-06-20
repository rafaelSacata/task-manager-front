<template>
  <div class="task-form-container">
    <h2 class="title">{{ 'Nova Tarefa' }}</h2>
    <form @submit.prevent="saveTask" class="task-form">
      <input v-model="task.title" placeholder="Título" class="input-field" required />
      <textarea v-model="task.description" placeholder="Descrição" class="input-field textarea-field" required></textarea>
      <div class="button-group">
        <button type="button" @click="cancel" class="cancel-btn">Cancelar</button>
        <button type="submit" class="submit-btn">{{ isEdit ? 'Salvar' : 'Criar' }}</button>
      </div>
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
        const response = await axios.get(`https://task-manager-api.onrender.com/tasks/${this.id}`, {
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
          await axios.put(`https://task-manager-api.onrender.com/tasks/${this.id}`, this.task, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await axios.post('https://task-manager-api.onrender.com/tasks', this.task, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        this.$emit('task-saved');
      } catch (error) {
        console.error('Erro ao salvar tarefa', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      }
    },
    cancel() {
      this.$emit('task-canceled');
    },
  },
};
</script>

<style scoped>
.task-form-container {
  max-width: 400px;
  margin: 10rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px #bdf1ec;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #40e0d0;
  text-align: center;
  margin-bottom: 1.5rem;
}

.task-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-field {
  padding: 0.75rem;
  font-size: 1.4rem;
  color: #2d3748;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #40e0d0;
  box-shadow: 0 0 0 2px rgba(64, 224, 208, 0.2);
}

.input-field::placeholder {
  color: #a0aec0;
}

.textarea-field {
  resize: vertical;
  min-height: 100px;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.submit-btn {
    width: 80px;
  padding: 0.875rem;
  background-color: #40e0d0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background-color: #38a169;
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: translateY(0);
}

.cancel-btn {
    width: 80px;
  padding: 0.875rem;
  background-color: #a0aec0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cancel-btn:hover {
  background-color: #90a4ae;
  transform: translateY(-1px);
}

.cancel-btn:active {
  transform: translateY(0);
}
</style>