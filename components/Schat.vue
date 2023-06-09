<template>
  <v-card>
    <v-card-title>{{ client.name }}</v-card-title>
    <div v-if="!!conversationsMessage" class="containerChat" ref="card">
      <div
        v-for="(message, i) in conversationsMessage"
        :key="i"
        style="flex-grow: 1"
      >
        <div
          v-for="(messageIn, ind) in message"
          :key="ind"
          class="d-flex justify-space-between"
        >
          <div
            class="mr-auto"
            v-if="
              messageIn.typeUser == 'Client' || messageIn.typeUser == 'client'
            "
          >
            <v-card-text
              v-if="messageIn.type == 'text'"
              class="message-client d-flex align-center justify-space-between p-2"
            >
              <div style="flex: 1 0 40%" class="pl-2">
                {{ messageIn.text }}
              </div>
              <div v-if="messageIn.createdAt" class="text-xs mr-2 mt-n6">
                {{ messageIn.createdAt ? formatTime(messageIn.createdAt) : "" }}
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
              <v-img
                :src="messageIn.multimedia.thumbnail"
                class="size-img"
              ></v-img>
            </div>
          </div>
          <div class="ml-auto" v-if="messageIn.typeUser == 'UserSystem'">
            <v-card-text
              v-if="messageIn.type == 'text'"
              class="message-user d-flex align-center justify-space-between"
            >
              <div
                v-if="messageIn.readAt"
                class="text-xs d-flex align-center mb-n8"
              >
                {{ messageIn.readAt ? formatTime(messageIn.readAt) : "" }}
                <v-list-item-action class="ml-1">
                  <v-icon size="14">mdi-check-all</v-icon>
                </v-list-item-action>
              </div>
              <div
                v-if="messageIn.timeOut"
                class="text-xs d-flex align-center mb-n8"
              >
                {{ messageIn.createdAt ? formatTime(messageIn.createdAt) : "" }}
                <v-list-item-action class="ml-1">
                  <v-icon size="14" style="fill: none !important"
                    >mdi-clock-outline</v-icon
                  >
                </v-list-item-action>
              </div>
              <div v-else class="pl-2"></div>
              <div>
                {{ messageIn.text }}
              </div>

              <div v-if="messageIn.createdAt" class="text-xs mt-n8">
                {{ messageIn.createdAt ? formatTime(messageIn.createdAt) : "" }}
              </div>
            </v-card-text>
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
                class="size-img"
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
              <v-img
                :src="messageIn.multimedia.thumbnail"
                class="size-img"
              ></v-img>
            </div>
          </div>
        </div>
      </div>
      <v-card class="cardTextFile">
        <v-row class="mx-4 mt-2">
          <v-text-field
            label="Escribe tu mensaje"
            v-model="messageSend"
            outlined
            dense
          ></v-text-field>
          <v-btn
            color="primary"
            icon
            @click="sendMessage"
            @keyup.native.enter="sendMessage"
            :disabled="isOfline && messageSend == null"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-row>
      </v-card>
    </div>
    <v-card v-else class="welcome-card card-no-border" outlined>
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
    ...mapState(["conversantions", "isOfline"]),
    conversationsMessage() {
      //Note: la bandera isOfline activa o desactiva las peticiones hechas al backend
      if (this.isOfline) {
        let data = dummyData.filter((msgs) =>
          msgs.some((msg) => msg.client === this.client._id)
        );
        return data[0];
      } else {
        if (this.conversantions) {
          let data;
          if (typeof this.conversantions == "string") {
            data = this.conversantions;
            var jsonString = JSON.stringify(data);
            jsonString = jsonString.replace(/,([\s\r\n]*[}\]])/g, "$1");
            data = JSON.parse(jsonString);
            console.log(data, "data");
          } else {
            data = this.conversantions;
          }
          return data;
        }
      }
    },
  },
  methods: {
    //Note esta funcion traera el chat seleccionado
    async getChat() {
      try {
        if (!this.isOfline) {
          let payload = {
            path: this.client._id + ".json",
          };
          let res = await this.$store.dispatch("getConversation", payload);
        } else {
          console.log("En modo ofline");
        }
      } catch (error) {
        console.log(error);
      }
    },
    //Note esta funcion dara formato a la fecha en los cards de cada message
    formatTime(hour) {
      const fecha = new Date(hour);
      const hora = fecha.getHours();
      const minutos = fecha.getMinutes();
      const segundos = fecha.getSeconds();
      let hourReat = `${hora}:${minutos}:${segundos}`;
      return hourReat;
    },
    //Note esta funcion hara el envio dummy de mensajes que solo funcionara en modo online
    sendMessage() {
      this.snackbar = true;
      this.messageSnack = "Mensale enviado";
      let currentDate = new Date();
      let formattedDate = currentDate.toISOString();
      let add = {
        _id: this.client._id,
        type: "Message",
        client: "629a8125b2d313190810212f",
        message: {
          _id: "62c613961474845f9a14ab28",
          type: "text",
          text: this.messageSend,
          typeUser: "UserSystem",
          user: "629a8125b2d313190810212f",
          errorCode: null,
          createdAt: formattedDate,
          updatedAt: formattedDate,
          timeOut: true,
        },
        createdAt: "2022-07-06T22:58:30.457Z",
      };
      this.conversationsMessage.push(add);
      this.$nextTick(function () {
        var container = this.$refs.card;
        container.scrollTop = container.scrollHeight + 120;
      });
      this.messageSend = null;
    },
  },
};
</script>
<style>
.message-user {
  background: rgb(32, 112, 162);
  border: solid rgb(190, 190, 190) 1px;
  padding: 1px;
  margin: 8px;
  width: 100%;
  min-height: 50px;
  border-radius: 10px;
}
.message-client {
  background: rgb(32, 162, 86);
  border: solid rgb(190, 190, 190) 1px;
  padding: 1px;
  margin: 8px;
  width: 100%;
  min-height: 50px;
  border-radius: 10px;
}
.alingGrow {
  display: flex;
  justify-content: space-between;
}
.chat-bubble {
  padding: 10px;
  border-radius: 10px;
  max-width: 100%;
  margin-bottom: 10px;
}

.user-bubble {
  background-color: #2979ff;
  color: white;
  align-self: flex-end;
  position: relative;
  padding: 10px;
  border-radius: 10px;
}

.user-bubble::before {
  content: "";
  position: absolute;
  bottom: -10px;
  right: 0;
  border-width: 10px 10px 0 0;
  border-style: solid;
  border-color: #2979ff transparent transparent transparent;
}
.welcome-card {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
}
.containerChat {
  display: flex;
  flex-direction: column;
  max-height: 70vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.containerChat::-webkit-scrollbar {
  width: 0.1px;
}

.containerChat::-webkit-scrollbar-track {
  background-color: transparent;
}

.containerChat::-webkit-scrollbar-thumb {
  background-color: transparent;
}
.cardTextFile:-webkit-sticky {
  position: sticky;
}
.cardTextFile {
  position: sticky;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
@media (min-width: 768px) {
  .message-user {
    max-width: 22vw;
  }
}
.size-img {
  max-height: 10vw;
  max-width: 15vw;
}
.theme--light.v-sheet--outlined {
  border: none;
}
.theme--dark.v-card {
  border: none;
}
.text-xs {
  font-size: 10px;
}
</style>
