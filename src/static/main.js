import CamreaStreamComponent from './camera-stream.js';
            import DoorButtonComponent from './door-button.js';

            let app = Vue.createApp({});
            CamreaStreamComponent(app);
            DoorButtonComponent(app);

            app.mount("#app");