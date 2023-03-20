const params = window.location.search
  .replace(/^\?/, "")
  .split("&")
  .map((e) => e.split("="))
  .reduce((a, e) => {
    a[e[0]] = e[1];
    return a;
  }, {});

const getConfig = (params) => {
  if (params.a && params.b && params.c && params.d && params.e) {
    return {
      base: params.b,
      getlist: params.a,
      savepost: params.d,
      saveget: params.e,
      token: params.c,
    };
  }
  let config = localStorage.getItem("config");
  if (!config) {
    return {
      base: "",
      getlist: "",
      savepost: "",
      saveget: "",
      token: "",
    };
  }
  try {
    return JSON.parse(config);
  } catch (e) {
    console.error(e);
    return {
      base: "",
      getlist: "",
      savepost: "",
      saveget: "",
      token: "",
    };
  }
};

export const config = getConfig(params);

// alert(JSON.stringify(params))
export const saveConfig = (config) => {
  localStorage.setItem("config", JSON.stringify(config));
};

export const isValidConfig = (config) => {
  if (params.a && params.b && params.c && params.d && params.e) {
    return true;
  }
  if (
    config &&
    config.base &&
    config.getlist &&
    config.savepost &&
    config.saveget &&
    config.token
  ) {
    return true;
  }
  return;
};
