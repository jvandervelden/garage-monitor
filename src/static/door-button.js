export default (app) => {
    app.component('door-button', {
        data() {
            return {
                ajaxActive: false
            };
        },
        props: {
            doorId: String
        },
        template: `
            <div class="door-button">
                <button ref="doorButton" type="button" class="btn btn-primary door-button" v-bind:disable="ajaxActive" @click="toggleStream" @tap="toggleStream">
                    {{ ajaxActive ?  'Pressing...' : 'Toggle Door' }}
                </button>
            </div>
        `,
        methods: {
            toggleStream() {
                this.ajaxActive = true;
                fetch('/api/v1/doors/' + this.doorId, {
                    method: 'POST',
                    body: ''
                }).catch().then(() => {
                    this.ajaxActive = false;
                });
            }
        }
    });
};