<template>
  <ProjectBoard :project="project" />
</template>
<script>
import components from "@/components/export.js";
import ProjectBoard from "./ProjectBoard.vue";
export default {
  props: {
    project: Object,
  },
  data() {
    return {};
  },
  components: {
    ...components,
    ProjectBoard,
  },
  methods: {},
  async mounted() {},
};
</script>
