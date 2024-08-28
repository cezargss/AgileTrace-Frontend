const breadCrumbs = {
  get(component) {
    switch (component) {
      default:
        return [
          {
            text: "Home",
            disabled: true,
            href: "home",
          },
        ];
    }
  },
};

export default breadCrumbs;
