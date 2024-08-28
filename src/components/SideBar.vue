<template>
  <v-navigation-drawer app class="side-bar" permanent width="300px">
    <div class="sys-header">
      <h3 class="primary--text mx-4 my-4">
        <v-icon
          style="font-size: 18px; margin-right: 8px"
          class="primary--text"
          @click="goBack()"
        >
          fas fa-arrow-left
        </v-icon>
        <span>{{ project?.name }}</span>
      </h3>
    </div>
    <v-divider></v-divider>
    <v-list nav dense class>
      <div
        v-for="item in items"
        :key="item.name"
        class="sidebar-card"
        :class="isCurrentTab(item) ? 'selected' : ''"
      >
        <v-list-item
          class="py-2 my-1"
          style="font-size: 14px"
          @click="goTo(item.link)"
        >
          <v-icon style="font-size: 18px" :style="'color: ' + item.iconColor">
            {{ item.icon }}
          </v-icon>
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </div>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn
          color="danger"
          dark
          large
          outlined
          @click="logout()"
          style="width: 100%"
        >
          <v-icon color="dark" size="medium" class="mr-2">
            fas fa-arrow-left
          </v-icon>
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    project: Object,
  },
  data: () => ({
    active: 0,
    username: localStorage.getItem("username"),

    items: [
      {
        id: 1,
        name: "Overview",
        icon: "fas fa-coins",
        link: "overview",
        iconColor: "#3B97E0",
        route: "project-overview",
      },
      {
        id: 2,
        name: "Dashboards",
        icon: "fas fa-chart-line",
        link: "dashboards",
        iconColor: "#FF7F27",
        route: "project-dashboards",
      },
      {
        id: 3,
        name: "Board",
        icon: "fas fa-th-list",
        link: "",
        iconColor: "#2BA08C",
        route: "project-board",
      },
      {
        id: 4,
        name: "Releases",
        icon: "fas fa-rocket",
        link: "releases",
        iconColor: "#B600A0",
        route: "project-releases",
      },
      {
        id: 5,
        name: "Participantes",
        icon: "fas fa-user-edit",
        link: "users",
        iconColor: "#4A4A4A",
        route: "project-users",
      },
      {
        id: 6,
        name: "Cargos",
        icon: "fas fa-user-tag",
        link: "roles",
        iconColor: "#003366",
        route: "project-roles",
      },
    ],
    profPic: null,
  }),
  methods: {
    async goTo(link) {
      this.$router.push({ path: `/project/${this.project.id}/${link}` });
    },
    async activate(id) {
      this.active = id;
    },

    goBack() {
      this.$router.push({ path: `/projects` });
    },

    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    },

    isCurrentTab(item) {
      return this.$route.name == item.route;
    },
  },
};
</script>
