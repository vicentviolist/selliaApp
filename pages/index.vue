<template>
  <div>
    <div class="card-mobile">
      <v-row class="sm:d-block md:d-none">
        <v-col v-for="(option, i) in optionsMenu" :key="i" class="">
          <v-card class="flex text-center text-auto-color">
            <v-icon size="25">{{ option.icon }}</v-icon>
            <div class="mt-1">{{ option.label }}</div>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col> <sconversations @userSelect="userSelectEd" /></v-col>
        <v-col> <schat :client="clientUser" /></v-col>
      </v-row>
    </div>
    <div class="md:d-block card-desktop">
      <v-tabs v-model="selectedOption">
        <v-tab
          v-for="(option, i) in optionsMenu"
          :key="i"
          class="text-auto-color"
          :value="option.option"
        >
          <v-icon size="25">{{ option.icon }}</v-icon>
          <span>{{ option.label }}</span>
        </v-tab>
      </v-tabs>

      <component
        :is="optionsMenu[selectedOption].component"
        v-on:userSelect="userSelectEd"
        v-bind:client="clientUser"
        class="m-4"
      />
    </div>
  </div>
</template>

<script>
import Sconversations from "../components/Sconversations.vue";
export default {
  name: "InspirePage",
  components: { Sconversations },
  data() {
    return {
      optionsMenu: [
        {
          label: "Chats",
          icon: "mdi-account-group",
          component: "Sconversations",
          option: 0,
        },
        {
          label: "Conversaciones",
          icon: "mdi-message",
          component: "schat",
          option: 1,
        },
      ],
      selectedOption: 0,
      clientUser: {},
    };
  },
  methods: {
    userSelectEd(user) {
      this.clientUser = user;
    },
    userSelectEdTab(user) {
      this.clientUser = user;
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
/* Estilos para dispositivos móviles */
.card-mobile {
  display: none;
}

/* Estilos para dispositivos no móviles */
@media (min-width: 768px) {
  .card-mobile {
    display: block;
  }
}

.card-desktop {
  display: block;
}

/* Estilos para dispositivos móviles */
@media (min-width: 768px) {
  .card-desktop {
    display: none;
  }
}
</style>
