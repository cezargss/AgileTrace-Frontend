<template>
  <div>
    <v-row dense class="pb-4">
      <v-col col="12" class="headline"> Tarefas do projeto </v-col>
      <v-btn color="secondary lighten-1" @click="exportToExcel()">
        Exportar
      </v-btn>
    </v-row>
    <v-row dense>
      <v-col dense v-for="(board, i) in boards" :key="i">
        <v-card color="primary mb-2" dense>
          <v-card-subtitle class="text-h7 white--text">
            <v-row justify="space-between">
              <v-col>
                {{ board.title }}
              </v-col>
              <v-col cols="3" v-if="board.canAdd">
                <v-icon color="white" @click="addNewCard()">
                  fas fa-plus
                </v-icon>
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-card>

        <draggable
          class="list-group"
          :list="board.cards"
          v-bind="dragOptions"
          group="board"
          @change="updateCardStatus($event, board.id)"
        >
          <v-card
            outlined
            link
            v-for="card in board.cards"
            :key="card.id"
            :class="getCustomBorderColor(card)"
          >
            <v-card-subtitle>
              <v-row align="center" justify="space-between">
                <v-col class="text-h7 black--text">
                  {{ card.id }} - {{ card.title }}
                </v-col>
                <v-col cols="2">
                  <div>
                    <v-row justify="space-between" align="center">
                      <v-icon
                        color="dark"
                        size="medium"
                        @click="confirmDelete(card)"
                      >
                        fas fa-trash
                      </v-icon>

                      <v-icon
                        color="dark"
                        size="medium"
                        @click="editCard(card)"
                      >
                        fas fa-edit
                      </v-icon>
                    </v-row>
                  </div>
                </v-col>
              </v-row>
            </v-card-subtitle>
            <v-card-text>
              <div>
                <span class="black--text">Pontos de função:</span>
                {{ card.points }}
              </div>
              <div>
                <span class="black--text">Responsável:</span>
                {{ card.responsible.name }}
              </div>
              <div>
                <span class="black--text">Data estimada:</span>
                {{ moment(card.estimatedDate).format("DD/MM/YYYY") }}
              </div>
              <div class="text-overflow">
                {{ card.description }}
              </div>
            </v-card-text>
          </v-card>
        </draggable>
        <v-card disabled flat v-if="board.cards.length == 0">
          <v-card-title class="justify-center">
            Nenhum card ainda
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <AddProjectCard
      v-if="activeAddProjectCard"
      :active="activeAddProjectCard"
      :project="project"
      @close-dialog="activeAddProjectCard = false"
      @update-list="listActivities()"
    ></AddProjectCard>

    <EditProjectCard
      v-if="activeEditProjectCard"
      :active="activeEditProjectCard"
      :project="project"
      :projectCard="selectedProjectCard"
      @close-dialog="onCloseEditDialog()"
      @update-list="onEdit()"
    ></EditProjectCard>

    <DeleteProjectCard
      v-if="activeDeleteProjectCard"
      :active="activeDeleteProjectCard"
      :project="project"
      :projectAtivity="selectedProjectCard"
      @close-dialog="onCloseDeleteDialog()"
      @update-list="onDelete()"
    ></DeleteProjectCard>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import AddProjectCard from "../project-card/AddProjectCard.vue";
import DeleteProjectCard from "../project-card/DeleteProjectCard.vue";
import EditProjectCard from "../project-card/EditProjectCard.vue";
import moment from "moment";
export default {
  props: {
    project: Object,
  },
  components: {
    draggable,
    AddProjectCard,
    DeleteProjectCard,
    EditProjectCard,
  },
  data() {
    return {
      activeAddProjectCard: false,
      activeDeleteProjectCard: false,
      activeEditProjectCard: false,
      selectedProjectCard: null,
      cards: [],
      boards: [
        {
          id: 1,
          title: "Backlog",
          cards: [],
          canAdd: true,
        },
        {
          id: 2,
          title: "Desenvolvimento",
          cards: [],
        },
        {
          id: 3,
          title: "Testes",
          cards: [],
        },
        {
          id: 4,
          title: "Pronto",
          cards: [],
        },
      ],
    };
  },
  methods: {
    addNewCard() {
      this.activeAddProjectCard = true;
    },

    async listActivities() {
      this.activeAddProjectCard = false;

      const loader = await this.$loading.show();
      try {
        const cards = await this.$http.get(
          `api/v1/projects/${this.project.id}/activities`
        );
        this.boards.forEach((board) => {
          board.cards = cards.filter((c) => c.statusId == board.id);
        });

        this.cards = cards.map((c) => {
          return {
            ...c,
            responsibleName: c.responsible?.name,
            cardTypeName: c.cardType.name,
            cardStatusName: c.cardStatus.name,
          };
        });

        console.log(this.cards);
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },
    async updateCardStatus(event, statusId) {
      if (event.added == undefined || !event.added.element) {
        return;
      }

      try {
        await this.$http.put(
          `api/v1/projects/${this.project.id}/activities/${event.added.element.id}`,
          { ...event.added.element, statusId: statusId }
        );
      } catch (err) {
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      }
    },

    editCard(item) {
      this.selectedProjectCard = { ...item };
      this.activeEditProjectCard = true;
    },

    onCloseEditDialog() {
      this.activeEditProjectCard = false;
      this.selectedProjectCard = false;
    },

    onEdit() {
      this.onCloseEditDialog();
      this.listActivities();
    },

    confirmDelete(item) {
      this.selectedProjectCard = { ...item };
      this.activeDeleteProjectCard = true;
    },

    onCloseDeleteDialog() {
      this.selectedProjectCard = null;
      this.activeDeleteProjectCard = false;
    },

    onDelete() {
      this.onCloseDeleteDialog();
      this.listActivities();
    },

    getCustomBorderColor(card) {
      if (card.cardTypeId == 1) {
        return "custom-border-green";
      }
      if (card.cardTypeId == 2) {
        return "custom-border-danger";
      }
      if (card.cardTypeId == 3) {
        return "custom-border-info";
      }
    },

    async exportToExcel() {
      const loader = await this.$loading.show();
      try {
        import("@/vendor/Export2Excel").then(async (excel) => {
          let headerTitle = [
            "Responsável",
            "Título",
            "Descrição",
            "Status",
            "Tipo atividade",
            "Data estimada",
            "Pontos de função",
          ];
          let headerVal = [
            "responsibleName",
            "title",
            "description",
            "cardStatusName",
            "cardTypeName",
            "estimatedDate",
            "points",
          ];
          const list = this.cards;
          const data = await this.formatJson(headerVal, list);
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: `${this.project.name}_atividades_${moment(
              new Date()
            ).format("DD/MM/YYYY")}`,
            autoWidth: false,
            bookType: "xlsx",
          });
        });
      } catch (err) {
        console.log(err);
        this.$notify(
          this.$notificationHandler("app").danger(this.$translate.UNKNOWN_ERROR)
        );
      } finally {
        await loader.hide();
      }
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  async mounted() {
    await this.listActivities();
  },
};
</script>
<style lang="scss">
.list-group {
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  min-height: 20px;
  gap: 4px;
  .list-group-item {
    margin-bottom: -1px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.125);
  }
  .list-group-item:first-child {
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }

  .custom-border-green {
    border-left: 4px solid #2ba08c;
  }
  .custom-border-info {
    border-left: 4px solid #3b97e0;
  }
  .custom-border-danger {
    border-left: 4px solid #bb2124;
  }
}

.text-overflow {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* number of lines to show */
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
