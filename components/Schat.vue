<template>
  <v-card>
    <v-card-title>{{ client.name }}</v-card-title>
    <div v-if="conversationsMessage" class="containerChat">
      <div v-for="(message, i) in conversationsMessage" :key="i">
        <div v-for="(messageIn, ind) in message" :key="ind">
          <div v-if="messageIn.typeUser == 'Client'" class="text-left">
            <v-card-text
              v-if="messageIn.type == 'text'"
              class="message-client alingGrow chat-bubble"
            >
              <div>
                {{ messageIn.text }}
              </div>
              <div v-if="messageIn.readAt" class="text-overline">
                {{ messageIn.readAt ? formatTime(messageIn.readAt) : "" }}
                <v-list-item-action>
                  <v-icon size="14">mdi-check-all</v-icon>
                </v-list-item-action>
              </div>
            </v-card-text>
            <div
              v-if="messageIn.type == 'image'"
              class="message-client"
              style="
                justify-content: center;
                display: flex;
                justify-items: center;
                align-items: center;
              "
            >
              <v-img
                :src="messageIn.multimedia.thumbnail"
                style="width: 100px; height: 200px"
              ></v-img>
            </div>
            <div
              v-if="messageIn.type == 'video'"
              class="message-client"
              style="
                justify-content: center;
                display: flex;
                justify-items: center;
                align-items: center;
              "
            >
              <video controls :src="messageIn.multimedia.thumbnail"></video>
            </div>
            <!-- <div v-if="messageIn.type == 'document'">
                {{ messageIn.multimedia }}
              </div> -->
          </div>
          <div v-if="messageIn.typeUser == 'UserSystem'" class="text-right">
            <div v-if="messageIn.type == 'text'" class="message-user alingGrow">
              <div>
                {{ messageIn.text }}
              </div>
              <div v-if="messageIn.readAt" class="text-overline">
                {{ messageIn.readAt ? formatTime(messageIn.readAt) : "" }}
                <v-list-item-action>
                  <v-icon size="14">mdi-check-all</v-icon>
                </v-list-item-action>
              </div>
            </div>
            <div
              v-if="messageIn.type == 'image'"
              class="message-user"
              style="
                justify-content: center;
                display: flex;
                justify-items: center;
                align-items: center;
              "
            >
              <v-img
                :src="messageIn.multimedia.thumbnail"
                style="width: 100px; height: 200px"
              ></v-img>
            </div>
            <div
              v-if="messageIn.type == 'video'"
              style="
                justify-content: center;
                display: flex;
                justify-items: center;
                align-items: center;
              "
            >
              <video controls :src="messageIn.multimedia.thumbnail"></video>
            </div>
            <!-- <div v-if="messageIn.type == 'document'">
                {{ messageIn.multimedia }}
              </div> -->
          </div>
        </div>
      </div>
      <v-row class="mx-4 fixed pt-6">
        <v-text-field
          v-model="messageSend"
          label="Escribe tu mensaje"
        ></v-text-field>
        <v-btn color="primary" icon @click="sendMesssage()">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-row>
    </div>
    <v-card v-else class="welcome-card">
      <v-card-title class="headline">¡Bienvenido!</v-card-title>
      <v-card-text>Selecciona un chat y comienza a hablar.</v-card-text>
      <v-card-actions>
        <v-btn text color="primary">
          <v-icon left>mdi-message</v-icon>
          Comenzar a chatear
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbar">
      {{ messageSnack }}

      <template v-slot:actions>
        <v-btn color="success" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
import dummyData from "../layoutMessage/index";
export default {
  data() {
    return {
      messageSend: null,
      snackbar: false,
      messageSnack: "",
    };
  },
  props: {
    client: {
      type: Object,
      default: {},
    },
  },
  watch: {
    client: {
      handler: "getChat",
      immediate: true,
    },
  },
  computed: {
    conversationsMessage() {
      if (this.isOfline) {
        let data = dummyData.filter((msgs) =>
          msgs.some((msg) => msg.client === this.client._id)
        );
        return data[0];
      } else {
        return this.conversantions;
      }
    },
    ...mapState(["conversantions", "isOfline"]),
  },
  created() {
    /* this.$store.commit("SET_OFLINE", true); */
  },
  methods: {
    async getChat() {
      try {
        if (!this.isOfline) {
          let payload = {
            path: this.client._id + ".json",
          };
          let res = await this.$store.dispatch("getConversation", payload);
          console.log(res);
        } else {
          console.log("En modo ofline");
        }
      } catch (error) {
        console.log(error);
      }
    },
    formatTime(hour) {
      const fecha = new Date(hour);
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes();
      const segundos = fecha.getSeconds();
      let hourReat = `${hora}:${minutos}:${segundos}`;
      return hourReat;
    },
    sendMesssage() {
      this.messageSend = null;
      this.snackbar = true;
      this.messageSnack = "Mensale enviado";
    },
  },
};
</script>
<style>
.message-client {
  background: rgb(32, 112, 162);
  border: solid rgb(190, 190, 190) 1px;
  padding: 10px;
  margin: 7px;
  width: 70%;
  min-height: 40px;
  border-radius: 10px;
}
.message-user {
  background: rgb(32, 162, 86);
  border: solid rgb(190, 190, 190) 1px;
  padding: 10px;
  margin: 7px;
  width: 70%;
  min-height: 40px;
  border-radius: 10px;
}
.alingGrow {
  display: flex;
  justify-content: space-between;
}
.chat-bubble {
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
  margin-bottom: 10px;
}

.user-bubble {
  background-color: #2979ff;
  color: white;
  align-self: flex-end;
}
.welcome-card {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
}
.containerChat {
  height: 70vh; /* Altura fija del contenedor de mensajes */
  overflow-y: scroll; /* Scroll vertical */
  display: flex; /* Diseño de columna */
  flex-direction: column;
}
</style>
