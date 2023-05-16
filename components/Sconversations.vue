<template>
  <div>
    <v-card>
      <v-text-field
        v-model="searchQuery"
        label="Busque por nombre de usuario"
        outlined
        dense
      ></v-text-field>
      <v-list class="pointer">
        <v-list-item
          v-for="(user, i) in filteredUsers"
          :key="i"
          class="pointer"
          @click="userSet(user)"
        >
          <v-list-item-avatar>
            <v-img :src="avatarUrl(user.name)" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ user.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ lastMessage(user) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-check-all</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "InspirePage",
  components: {},
  data() {
    return {
      searchQuery: "",
    };
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapState(["chatsList", "isOfline"]),
    usersOptions() {
      //Note: Regresa la lista de usuarios dependiendo si es offLine o no
      if (this.isOfline) {
        let users = [
          {
            _id: "629a8125b2d313190810212f",
            name: "Pedro Naranjo",
            createdAt: "1654292773900",
            updatedAt: "1657150137370",
          },
          {
            _id: "629e39e8b2d31319081e0650",
            name: "Diego O",
            createdAt: "1654617133986",
            updatedAt: "1659028266305",
          },
        ];
        return users;
      } else {
        return this.chatsList;
      }
    },
    filteredUsers() {
      //Note buscador de conversaciones mediante un filter
      return this.usersOptions.filter((user) =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    avatarUrl(name) {
      // Note: se utilizara esta peticion para traer el icono de cada usuario porque no tienen img
      const baseUrl = "https://ui-avatars.com/api/?";
      const params = new URLSearchParams({
        name: name,
        background: "ffffff",
        color: "000000",
        size: "64",
        fontweight: "bold",
      });
      return baseUrl + params.toString();
    },
    lastMessage(user) {
      return "Hola, ¿cómo estás?";
    },
    async getList() {
      try {
        if (!this.isOfline) {
          let payload = {
            path: "clients.json",
          };
          let res = await this.$store.dispatch("getChtasList", payload);
        } else {
          console.log("Estas en modo offline");
        }
      } catch (error) {
        console.log(error);
      }
    },
    userSet(user) {
      // Emite al componente padre el usuario seleccionado para hacer una consulta de conversación basado en el id
      this.$emit("userSelect", user);
    },
  },
  /* mounted() {
    this.$socket.on("chat", (data) => {
      console.log(data, "datadatadata");
    });
  }, */
};
</script>
<style>
.v-list-item__subtitle {
  font-size: 14px;
  color: #9b9b9b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pointer {
  cursor: pointer;
}
</style>
