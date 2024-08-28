<template>
  <v-dialog v-model="active" inset persistent width="auto">
    <v-card>
      <v-card-title> Excluir Cargo </v-card-title>

      <v-card-subtitle>
        Deseja mesmo exclui o cargo <strong>{{ role?.name }}</strong
        >?
      </v-card-subtitle>

      <v-card-actions>
        <v-btn
          color="success lighten-1"
          class="mr-4"
          outlined
          @click="deleteRole()"
        >
          Confirmar
        </v-btn>
        <v-btn color="danger lighten-1" outlined @click="updateActive()">
          Fechar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    active: false,
    project: Object,
    role: Object,
  },

  methods: {
    updateActive() {
      this.$emit("close-dialog");
    },

    async deleteRole() {
      const loader = await this.$loading.show();
      try {
        await this.$http.delete(
          `api/v1/projects/${this.project.id}/roles/${this.role.id}`
        );
        this.$notify(
          this.$notificationHandler("app").success(
            this.$translate.DELETED_SUCCESSFULLY
          )
        );
        this.$emit("update-list");
        this.updateActive();
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },
  },
};
</script>
