<template>
  <v-app dark>
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" fixed>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-switch
        v-model="offLine"
        label="Modo offline"
        color="success"
        @click="changeMode"
        hide-details
      ></v-switch>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "DefaultLayout",
  data() {
    return {
      //Se utilizara la configuracion basica del layout de nuxt debido a que es bastante funcional para lo requerido
      //Solo se haran muy pocas modificaicones
      clipped: false,
      drawer: false,
      fixed: false,
      offLine: true,
      miniVariant: false,
      right: false,
      rightDrawer: false,
      title: "Vuetify.js",
    };
  },
  methods: {
    changeMode() {
      this.$store.commit("SET_OFLINE", this.offLine);
      this.getList();
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
  },
  computed: {
    ...mapState(["isOfline"]),
  },
  created() {
    this.$store.commit("SET_OFLINE", this.offLine);
  },
};
</script>
