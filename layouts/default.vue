<template>
  <v-app dark>
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" fixed>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <!-- <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(55,236,186,.7), rgba(25,32,72,.7)"
        ></v-img>
      </template> -->
      <!-- <img src="../images/SelliaLogoFooter.png" class="size-img m-12" /> -->
      <img src="../images/SelliaLogoFooter.png" style="width: 200px" />
      <v-spacer></v-spacer>
      <v-switch
        v-model="theme"
        label="Cambiar tema"
        color="primary"
        @click="changueTheme"
        hide-details
        class="mr-6"
      ></v-switch>
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
import logo from "../images/SelliaLogoFooter.png";
export default {
  name: "DefaultLayout",
  components: {
    logo,
  },
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
      theme: true,
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
        } else {
          console.log("Estas en modo offline");
        }
      } catch (error) {
        console.log(error);
      }
    },
    changueTheme() {
      this.$nuxt.$vuetify.theme.dark = this.theme;
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
