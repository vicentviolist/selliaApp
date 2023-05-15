<template>
  <div>
    <v-card>
      <v-list class="pointer">
        <v-list-item
          v-for="(user, i) in usersOptions"
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
    return {};
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapState(["chatsList", "isOfline"]),
    usersOptions() {
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
  },
  methods: {
    avatarUrl(name) {
      //Note: se utilizara esta peticion para traer el icono de cada usuario porque no tienen img
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
          console.log(res);
        } else {
          console.log("Estas en modo offline");
        }
      } catch (error) {
        console.log(error);
      }
    },
    userSet(user) {
      this.$emit("userSelect", user);
    },
  },
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
