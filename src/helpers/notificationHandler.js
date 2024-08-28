const handler = (group, duration = 4000) => {
  const notify = { group, duration };

  function success(title) {
    notify.type = "success";
    notify.title = title;
    return notify;
  }

  function warn(text, title) {
    notify.type = "warning";
    notify.title = title;
    notify.text = text;
    return notify;
  }

  function info(text, title) {
    notify.type = "edit";
    notify.title = title;
    notify.text = text;
    return notify;
  }

  function danger(title, text) {
    notify.type = "danger";
    notify.title = title;
    notify.text = text;
    return notify;
  }

  return {
    success,
    warn,
    info,
    danger,
  };
};

module.exports = handler;
