<template>
  <div class="task-container">
    <h2 class="title">Gerenciador de Tarefas</h2>
    <TaskForm v-if="showForm" :id="selectedTaskId" @task-saved="fetchTasks" />
    <ul class="task-list" v-if="tasks.length">
      <li v-for="task in tasks" :key="task.taskId" class="task-item">
        <span class="task-title" :class="{ 'completed-task': task.completed }">{{ task.title }}</span>
        <span class="task-description" :class="{ 'completed-task': task.completed }">{{ task.description }}</span>
        <button @click="completeTask(task.taskId)" class="complete-btn" :class="{ 'completed': task.completed }">Concluir</button>
        <button @click="deleteTask(task.taskId)" class="delete-btn">Excluir</button>
      </li>
    </ul>
    <button @click="createTask" class="new-task-btn">Nova Tarefa</button>
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
    async completeTask(taskId) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.$router.push('/login');
          return;
        }
        await axios.put(`http://localhost:8080/tasks/${taskId}`, { completed: true }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.fetchTasks(); // Recarrega a lista para refletir o status atualizado
      } catch (error) {
        console.error('Erro ao concluir tarefa', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login');
        }
      }
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

<style scoped>
.task-container {
  max-width: 800px;
  margin: 18rem auto;
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
  background-color: #f5f5f5;
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

.task-actions {
  display: flex;
  gap: 0.75rem;
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

.completed {
    display: none;
}
</style>