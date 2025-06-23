<template>
  <div class="task-form-container">
    <h2 class="title">{{ isEdit ? 'Editar Tarefa' : 'Nova Tarefa' }}</h2>
    <form @submit.prevent="saveTask" class="task-form">
      <input v-model="task.title" placeholder="Título" class="input-field" required />
      <textarea v-model="task.description" placeholder="Descrição" class="input-field textarea-field" required></textarea>
      <div class="checkbox-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="task.hasReminders" />
          Adicionar um lembrete?
        </label>
      </div>
      <div v-show="task.hasReminders" class="reminder-interval-group">
        <p class="interval-title">Frequência do lembrete:</p>
        <div v-for="interval in reminderIntervals" :key="interval.value" class="checkbox-label">
          <input
            type="checkbox"
            :value="interval.value"
            v-model="selectedInterval"
            @change="updateReminderInterval(interval.value)"
            :checked="task.reminderInterval === interval.value"
          />
          {{ interval.label }}
        </div>
        <p v-if="showIntervalError" class="error-message">Selecione uma frequência de lembrete.</p>
      </div>
      <div class="button-group">
        <button type="button" @click="cancel" class="cancel-btn">Cancelar</button>
        <button type="submit" class="submit-btn">{{ isEdit ? 'Salvar' : 'Criar' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';

export default {
  props: ['id'],
  data() {
    return {
      task: {
        title: '',
        description: '',
        hasReminders: false,
        reminderInterval: null,
      },
      selectedInterval: [],
      isEdit: false,
      toast: null,
      reminderIntervals: [
        { value: 'EVERY_5_MINUTES', label: 'A cada 5 minutos' },
        { value: 'EVERY_15_MINUTES', label: 'A cada 15 minutos' },
        { value: 'EVERY_30_MINUTES', label: 'A cada 30 minutos' },
        { value: 'HOURLY', label: 'A cada hora' },
        { value: 'DAILY', label: 'Diariamente' },
      ],
      showIntervalError: false,
    };
  },
  mounted() {
    this.toast = useToast();
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
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/tasks/${this.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.task = {
          title: response.data.title,
          description: response.data.description,
          hasReminders: response.data.hasReminders,
          reminderInterval: response.data.reminderInterval,
        };
        if (this.task.hasReminders && this.task.reminderInterval) {
          this.selectedInterval = [this.task.reminderInterval];
        }
      } catch (error) {
        console.error('Erro ao buscar tarefa', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        } else {
          this.toast.error('Erro ao carregar a tarefa.');
        }
      }
    },
    updateReminderInterval(value) {
      this.selectedInterval = [value];
      this.task.reminderInterval = value;
      this.showIntervalError = false;
    },
    async saveTask() {
      if (this.task.hasReminders && !this.task.reminderInterval) {
        this.showIntervalError = true;
        this.toast.error('Selecione uma frequência de lembrete.');
        return;
      }
      if (!this.task.hasReminders) {
        this.task.reminderInterval = null;
        this.selectedInterval = [];
      }
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        if (this.isEdit) {
          await axios.patch(`${process.env.VUE_APP_API_URL}/tasks/${this.id}`, this.task, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.toast.success('Tarefa atualizada com sucesso!');
        } else {
          await axios.post(`${process.env.VUE_APP_API_URL}/tasks`, this.task, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.toast.success('Tarefa criada com sucesso!');
        }
        this.$emit('task-saved');
      } catch (error) {
        console.error('Erro ao salvar tarefa', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        } else {
          this.toast.error('Erro ao salvar a tarefa.');
        }
      }
    },
    async deleteTask() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        await axios.delete(`${process.env.VUE_APP_API_URL}/tasks/${this.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.toast.success('Tarefa deletada com sucesso!');
        this.$emit('task-deleted');
      } catch (error) {
        console.error('Erro ao deletar tarefa', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        } else {
          this.toast.error('Erro ao deletar a tarefa.');
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

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.reminder-interval-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-left: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: #2d3748;
}

.checkbox-label input[type="checkbox"] {
  width: 1.2rem;
  height: 1.2rem;
  accent-color: #40e0d0;
}

.interval-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #2d3748;
}

.error-message {
  color: #d32f2f;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
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