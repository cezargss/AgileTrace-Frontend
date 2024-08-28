<template>
  <v-dialog v-model="active" inset persistent width="auto">
    <v-card>
      <v-card-title> Excluir Atividade </v-card-title>

      <v-card-subtitle>
        Deseja mesmo exclui a atividade
        <strong>{{ projectAtivity?.title }}</strong
        >?
      </v-card-subtitle>

      <v-card-actions>
        <v-btn
          color="success lighten-1"
          class="mr-4"
          outlined
          @click="deleteCard()"
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
    projectAtivity: Object,
  },

  methods: {
    updateActive() {
      this.$emit("close-dialog");
    },

    async deleteCard() {
      const loader = await this.$loading.show();
      try {
        await this.$http.delete(
          `api/v1/projects/${this.project.id}/activities/${this.projectAtivity.id}`
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
