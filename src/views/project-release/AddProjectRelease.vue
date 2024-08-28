<template>
  <v-dialog v-model="active" inset persistent max-width="1200">
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">Nova Release</div>
        <div>
          <v-btn
            color="success lighten-1"
            class="mr-4"
            outlined
            @click="submitForm()"
          >
            Salvar
          </v-btn>
          <v-btn color="danger lighten-1" outlined @click="updateActive()">
            Fechar
          </v-btn>
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-row dense class="my-8">
          <v-col cols="12" class="pa-0 mt-2" justify="center" align="start">
            <v-form ref="form">
              <v-row>
                <v-col>
                  <v-text-field
                    :rules="rules.field"
                    v-model="formData.version"
                    ref="version"
                    filled
                    dense
                    name="version"
                    label="Versão"
                  ></v-text-field>
                </v-col>

                <v-col>
                  <v-select
                    :rules="rules.field"
                    v-model="formData.projectReleaseStatusId"
                    item-id="id"
                    item-text="name"
                    item-value="id"
                    :items="relaseStatus"
                    label="Status"
                    filled
                  ></v-select>
                </v-col>
                <v-col>
                  <div class="text-h7 dark--text">Data de lançamento</div>
                  <date-picker
                    :rules="rules.field"
                    v-model="formData.releaseDate"
                    type="date"
                    style="width: 100%"
                    format="DD/MM/YYYY"
                  >
                  </date-picker>
                </v-col>
              </v-row>

              <v-textarea
                filled
                auto-grow
                label="Descrição"
                :rules="rules.field"
                v-model="formData.description"
              ></v-textarea>
            </v-form>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";

export default {
  props: {
    active: false,
    project: Object,
  },

  components: {
    DatePicker,
  },

  data() {
    return {
      formData: {},
      rules: {
        field: [(v) => !!v || "Campo obrigatório"],
      },
      relaseStatus: [],
    };
  },

  methods: {
    async listReleaseStatus() {
      try {
        this.relaseStatus = await this.$http.get(`api/v1/release-status`);
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      }
    },

    updateActive() {
      this.$emit("close-dialog");
    },

    async submitForm() {
      if (this.$refs.form.validate()) {
        await this.save();
      } else {
        this.$notify(
          this.$notificationHandler("app").warn(
            this.$translate.FILL_REQUIRED_FIELDS
          )
        );
      }
    },

    async save() {
      const loader = await this.$loading.show();
      try {
        await this.$http.post(
          `api/v1/projects/${this.project.id}/releases`,
          this.formData
        );
        this.$notify(
          this.$notificationHandler("app").success(
            this.$translate.CREATED_SUCCESSFULLY
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
  mounted() {
    this.formData = {};

    this.listReleaseStatus();
  },
};
</script>
