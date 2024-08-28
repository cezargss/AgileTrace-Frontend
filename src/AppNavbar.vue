<template>
  <v-app class="grey-background font" v-if="project">
    <SideBar class="hiddenDiv" app :project="project"> </SideBar>
    <v-main id="contentDiv">
      <v-card height="100%" class="grey-background" outlined>
        <div class="mx-4 mt-5">
          <transition name="slide" mode="out-in">
            <router-view :project="project" class="px-2 py-0 ma-0" />
          </transition>
        </div>
      </v-card>
      <notifications
        group="app-navbar"
        classes="vue-notification"
        position="top center"
        :max="3"
      />
    </v-main>
  </v-app>
</template>
<script>
import components from "@/components/export.js";
export default {
  data() {
    return {
      project: null,
    };
  },
  components: {
    ...components,
  },
  methods: {
    async getProject() {
      const loader = await this.$loading.show();
      try {
        this.project = await this.$http.get(
          `api/v1/projects/${this.$route.params.id}`
        );
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },
  },
  async mounted() {
    await this.getProject();
  },
};
</script>

<style>
@media print {
  .hiddenDiv {
    display: none !important;
  }
  #contentDiv {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .v-main {
    padding: 0 !important;
  }
  .v-card {
    border: none !important;
    box-shadow: none !important;
  }
}
</style>
