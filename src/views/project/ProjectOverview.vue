<template>
  <v-container fluid>
    <v-row align="start" justify="start">
      <v-col cols="12" align="start" justify="start">
        <v-card class="fill-height" max-width="100%" outlined link>
          <v-card-title>
            <div class="headline">{{ project.name }}</div>
          </v-card-title>
          <v-card-subtitle>{{ project.description }}</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Data de Inicio</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ moment(project.startDate).format("DD/MM/YYYY") }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar-end</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Data de Fim</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ moment(project.endDate).format("DD/MM/YYYY") }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="4">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-account-multiple</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title> Participantes </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ project.project_users?.length }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card class="fill-height" outlined link>
          <v-card-title> Progresso do Projeto </v-card-title>
          <v-card-subtitle
            >Porcentagem de atividades finalizadas</v-card-subtitle
          >
          <v-card-text>
            <v-progress-circular
              :value="overview.progress"
              :size="100"
              :rotate="360"
              color="blue"
              class="mb-4"
            >
              {{ overview.progress }}%
            </v-progress-circular>
            <v-row>
              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-check-circle-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      Atividades finalizadas
                    </v-list-item-title>
                    <v-list-item-subtitle>{{
                      overview.completed
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12" md="6">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-timer-sand</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Atividades Pendentes</v-list-item-title>
                    <v-list-item-subtitle>{{
                      overview.pending
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card outlined link class="fill-height">
          <v-card-title> Atualizações Recentes </v-card-title>
          <v-card-subtitle> Últimas atividades finalizadas </v-card-subtitle>
          <v-list>
            <v-list-item-group>
              <v-list-item
                v-for="activity in overview.lastActivities"
                :key="activity.id"
              >
                <v-list-item-icon>
                  <v-icon :style="'color: ' + getActivityColor(activity)">{{
                    getActivityIcon(activity)
                  }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ activity.title }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ activity.description }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card class="fill-height" outlined link>
          <v-card-title> Releases </v-card-title>
          <v-card-subtitle>Nota da última atualização</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-check-circle-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title> Versão </v-list-item-title>
                    <v-list-item-subtitle>{{
                      overview.lastRelease?.version
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Data de lançamento</v-list-item-title>
                    <v-list-item-subtitle>
                      {{
                        moment(overview.lastRelease?.releaseDate).format(
                          "DD/MM/YYYY"
                        )
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-calendar</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Status</v-list-item-title>
                    <v-list-item-subtitle>{{
                      overview.lastRelease?.projectReleaseStatus?.name
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col cols="12">
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-file</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ overview.lastRelease?.description }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-col>
              <v-col> </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    project: Object,
  },

  data() {
    return {
      overview: {},
      projectProgress: {
        percentage: 75,
        completedTasks: 15,
        pendingTasks: 5,
      },
      recentUpdates: [
        {
          id: 1,
          title: "Feature A Completed",
          description: "Feature A was successfully completed.",
        },
        {
          id: 2,
          title: "Bug Fixes",
          description: "Addressed critical bugs from the last release.",
        },
      ],
    };
  },

  methods: {
    async getOverviewReport() {
      const loader = await this.$loading.show();
      try {
        this.overview = await this.$http.get(
          `api/v1/projects/${this.project.id}/overview`
        );
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },

    getActivityIcon(activity) {
      if (activity.cardTypeId == 1) {
        return "fas fa-plus";
      }
      if (activity.cardTypeId == 2) {
        return "fas fa-bug";
      }
      if (activity.cardTypeId == 3) {
        return "fas fa-file";
      }
    },

    getActivityColor(activity) {
      if (activity.cardTypeId == 1) {
        return "#2ba08c";
      }
      if (activity.cardTypeId == 2) {
        return "#bb2124";
      }
      if (activity.cardTypeId == 3) {
        return "#3b97e0";
      }
    },
  },
  mounted() {
    this.getOverviewReport();
  },
};
</script>

<style scoped>
.v-list-item-icon {
  min-width: 40px;
}

.v-card-title {
  font-weight: bold;
}

.v-progress-circular {
  margin: auto;
}

.v-btn {
  text-transform: none;
}
</style>
