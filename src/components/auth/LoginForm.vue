<template>
    <div class="login-container">
        <h2 class="title">Login</h2>
        <form @submit.prevent="login" class="login-form">
            <input v-model="email" type="email" placeholder="Email" class="input-field" required />
            <input v-model="password" type="password" placeholder="Senha" class="input-field" required />
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <button type="submit" class="submit-btn">Entrar</button>
        </form>
        <p class="register-link">Não tem uma conta? <router-link to="/register">Registre-se</router-link></p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
        };
    },
    methods: {
        async login() {
            try {
                this.errorMessage = '';
                const response = await axios.post(`${process.env.VUE_APP_API_URL}/auth/login`, {
                    email: this.email,
                    password: this.password,
                });
                const token = response.data.token;
                localStorage.setItem('token', token);
                this.$router.push('/tasks');
            } catch (error) {
                console.error('Erro ao fazer login', error);
                this.errorMessage = error.response?.data?.message || 'Erro ao fazer login. Tente novamente.';
            }
        },
    },
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 18rem auto;
    padding: 2rem;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 16px 24px #bdf1ec;
}

.title {
    font-size: 3rem;
    font-weight: 700;
    color: #40e0d0;
    text-align: center;
    margin-bottom: 1.5rem;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.input-field {
    padding: 0.75rem;
    font-size: 2rem;
    color: #2d3748;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.3s ease;
}

.input-field:focus {
    border-color: #40e0d0;
    box-shadow: 0 0 0 2px rgba(72, 187, 120, 0.2);
}

.input-field::placeholder {
    color: #a0aec0;
}

.submit-btn {
    margin: 1.2em auto;
    width: 150px;
    padding: 0.875rem;
    background-color: #008080;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.7rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
    background-color: #40e0d0;
    transform: translateY(-1px);
}

.submit-btn:active {
    transform: translateY(0);
}

.error-message {
    background-color: #fef2f2;
    color: #dc2626;
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
    font-size: 1.2rem;
}

.register-link {
    text-align: center;
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #2d3748;
}

.register-link a {
    color: #40e0d0;
    text-decoration: none;
    font-weight: 500;
}

.register-link a:hover {
    text-decoration: underline;
}
</style>