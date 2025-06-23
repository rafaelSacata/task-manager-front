import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/reset.css';
import './assets/toast-styles.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);

app.use(router).use(Toast, {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    containerClassName: 'custom-toast-container',
    toastDefaults: {
        info: {
            className: 'custom-toast-info',
        },
        success: {
            className: 'custom-toast-success',
        },
        error: {
            className: 'custom-toast-error',
        },
        warning: {
            className: 'custom-toast-warning',
        },
    },
}).mount('#app');