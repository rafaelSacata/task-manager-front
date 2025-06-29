<template>
  <div class="task-container">
    <h2 class="title">Gerenciador de Tarefas</h2>
    <TaskForm v-if="showForm" :id="taskId" @task-canceled="closeForm" @task-saved="fetchTasks" />
    <ul class="task-list" v-if="tasks.length">
      <li v-for="task in tasks" :key="task.taskId" class="task-item">
        <span class="task-title" :class="{ 'completed-task': task.completed }">{{ task.title }}</span>
        <span class="task-description">{{ task.description }}</span>
        <button @click="completeTask(task.taskId)" v-if="!task.completed" class="complete-btn">Concluir</button>
        <button @click="editTask(task.taskId)" v-if="!task.completed" class="edit-btn">Editar</button>
        <button @click="deleteTask(task.taskId)" class="delete-btn">Excluir</button>
      </li>
    </ul>
    <button @click="createTask" class="new-task-btn">Nova Tarefa</button>
    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script>
import axios from 'axios';
import TaskForm from './TaskForm.vue';
import { useToast } from 'vue-toastification';

export default {
  components: { TaskForm },
  data() {
    return {
      tasks: [],
      showForm: false,
      taskId: null,
      toast: null,
    };
  },
  mounted() {
    this.toast = useToast();
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
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.tasks = response.data.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });
        this.showForm = false;
      } catch (error) {
        console.error('Erro ao buscar tarefas', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        } else {
          this.toast.error('Erro ao buscar tarefas.');
        }
      }
    },
    async completeTask(taskId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        await axios.put(`${process.env.VUE_APP_API_URL}/tasks/${taskId}`, { completed: true }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.toast.success('Tarefa concluída com sucesso!');
        this.fetchTasks();
      } catch (error) {
        console.error('Erro ao concluir tarefa', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        } else {
          this.toast.error('Erro ao concluir tarefa.');
        }
      }
    },
    async editTask(taskId) {
      this.taskId = taskId;
      this.showForm = true;
    },
    async deleteTask(taskId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        await axios.delete(`${process.env.VUE_APP_API_URL}/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.toast.success('Tarefa excluída com sucesso!');
        this.fetchTasks();
      } catch (error) {
        console.error('Erro ao excluir tarefa', error);
        if (error.response?.status === 401) {
          this.$router.push('/login');
        } else {
          this.toast.error('Erro ao excluir tarefa.');
        }
      }
    },
    async logout() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await axios.post(`${process.env.VUE_APP_API_URL}/api/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        localStorage.removeItem('token');
        this.$router.push('/login');
      } catch (error) {
        console.error('Erro ao fazer logout', error);
        localStorage.removeItem('token');
        this.$router.push('/login');
      }
    },
    createTask() {
      this.taskId = null;
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
      this.taskId = null;
    },
  },
};
</script>

<style scoped>
.task-container {
  max-width: 800px;
  margin: 18px auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #40e0d0;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: -0.025em;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.task-item {
  display: flex;
  align-items: center;
  background-color: #f7fafc;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.task-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.task-title {
  flex: 1;
  font-size: 1.65rem;
  font-weight: 600;
  color: #006666;
  margin-right: 2rem;
}

.task-description {
  flex: 2;
  font-size: 1.45rem;
  color: #008080;
  line-height: 1.5;
  margin-right: 1rem;
}

.complete-btn {
  background-color: #78bcc0;
  margin-left: 25px;
  color: white;
  border: none;
  padding: 0.8rem 1.25rem;
  border-radius: 6px;
  font-size: 1.32rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.complete-btn:hover {
  background-color: #40e0d0;
  transform: translateY(-1px);
}

.complete-btn:active {
  transform: translateY(0);
}

.edit-btn {
  background-color: #78bcc0;
  margin-left: 5px;
  color: white;
  border: none;
  padding: 0.8rem 1.25rem;
  border-radius: 6px;
  font-size: 1.32rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.edit-btn:hover {
  background-color: #40e0d0;
  transform: translateY(-1px);
}

.edit-btn:active {
  transform: translateY(0);
}

.delete-btn {
  background-color: #008080;
  margin-left: 5px;
  color: white;
  border: none;
  padding: 0.8rem 1.25rem;
  border-radius: 6px;
  font-size: 1.33rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.delete-btn:hover {
  background-color: #c53030;
  transform: translateY(-1px);
}

.delete-btn:active {
  transform: translateY(0);
}

.new-task-btn {
  display: block;
  width: 150px;
  margin: 3rem auto;
  padding: 0.875rem;
  background-color: #40e0d0;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.new-task-btn:hover {
  background-color: #38a169;
  transform: translateY(-1px);
}

.new-task-btn:active {
  transform: translateY(0);
}

.logout-btn {
  display: block;
  width: 150px;
  margin: 1rem auto;
  padding: 0.875rem;
  background-color: #c53030;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.logout-btn:hover {
  background-color: #e53e3e;
  transform: translateY(-1px);
}

.logout-btn:active {
  transform: translateY(0);
}

.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  text-align: center;
  font-size: 0.95rem;
}

.no-tasks {
  text-align: center;
  color: #718096;
  font-size: 1.1rem;
  margin-top: 2rem;
  font-style: italic;
}

.completed-task {
  text-decoration: line-through;
  color: #718096;
}
</style>