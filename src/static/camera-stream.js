let socket = null;

export default (app) => {
    app.component('camera-stream', {
        data() {
            return {
                streaming: false
            };
        },
        template: `
            <div class="camera-stream">
                <canvas ref="picture"></canvas>
                <button ref="playButton" class="play-button" :class="{ streaming: streaming }" @click="toggleStream" @tap="toggleStream">
                    <span v-bind:hidden="streaming" class="material-icons">{{ streaming ? 'pause_circle_outline' : 'play_circle_outline' }}</span>
                </button>
            </div>
        `,
        methods: {
            async toggleStream() {
                this.$refs.playButton.blur();
                if (!this.streaming) {
                    await connect(this.handleStreamFrame.bind(this));
                    this.streaming = true;
                } else if (this.streaming) {
                    socket.close();
                    socket = null;
                    this.streaming = false;
                }
            },
            handleStreamFrame(imageData) {
                this.image.src = imageData;
                return true;
            },
            handleImageLoad() {
                const context = this.$refs.picture.getContext('2d');
                this.$refs.picture.width = this.image.width;
                this.$refs.picture.height = this.image.height;
                context.drawImage(this.image, 0, 0);
            },
            fetchPicture() {
                this.image.src = '/api/v1/camera/picture?_' + Date.now();
            }
        },
        created() {
            this.image = new Image();
            this.image.onload = this.handleImageLoad.bind(this);
        },
        mounted() {
            this.fetchPicture();
        }
    });
}

window.onbeforeunload = function () {
    if (socket)
        socket.close();
}

function connect(imgCb) {
    if (socket) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        socket = new WebSocket("ws://192.168.0.15:3000/api/v1/camera/stream");
 
        socket.onopen = function() {
            resolve();
            //socket.send("Give Me Something");
        }
        
        socket.onerror = function() {
            reject();
        }

        socket.onmessage = async function(event) {
            if (event.data === "started") {
                socket.send("base64");
            } else if (event.data.indexOf("data:image") > -1) {
                const keepGoing = await imgCb(event.data);
                if (keepGoing) {
                    socket.send("base64");
                }
            }
        };
        
        socket.onclose = function(event) {
            socket = null;
        };
    });
}
    

    
// });
