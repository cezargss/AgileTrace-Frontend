<template>
  <v-row dense justify="space-between">
    <v-col>
      <div class="sys-header">
        <h1 class="primary--text ml-4 mt-1">
          <span
            style="
              font-weight: 1000 !important;
              font-size: 33px;
              text-transform: uppercase;
            "
          >
            Agile Trace.
          </span>
        </h1>
      </div>
    </v-col>
    <v-col align="end" justify="center" dense class="mt-3">
      <v-btn color="danger" dark large outlined @click="logout()">
        <v-icon color="dark" size="medium" class="mr-2">
          fas fa-arrow-left
        </v-icon>
        Logout
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
export default {
  methods: {
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/";
    },
  },
};
</script>
