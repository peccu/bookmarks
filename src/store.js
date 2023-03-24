const getListURL = (config) =>
  `https://${config.getlist}${config.base}/?token=${config.token}`;

const saveGET = (getbase, token, body) => {
  const query = encodeURIComponent(JSON.stringify(body));
  const url = `${getbase}/?token=${token}&q=${query}`;
  return fetch(url).catch((e) => {
    console.log("GET fetch failed: ", e);
    window.open(url, "_blank");
  });
};

const postfallback = (getbase, token, body) => {
  return (e) => {
    console.log("POST fetch failed: ", e);
    return saveGET(getbase, token, body);
  };
};

const savePOST = (postbase, getbase, token, body) => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const options = {
    method: "POST",
    headers,
    mode: "cors",
    body: JSON.stringify(body),
  };
  return fetch(postbase, options).catch(postfallback(getbase, token, body));
};

export const save = (config, body) => {
  const p = config.savepost;
  const g = config.saveget;
  const b = config.base;
  const t = config.token;
  const postbase = `https://${p}${g}`;
  const getbase = `https://${g}${b}`;
  return savePOST(postbase, getbase, t, body);
};

export const fetchItems = (config) => {
  const url = getListURL(config);
  return new Promise((resolve, reject) => {
    return fetch(url)
      .then((e) => e.json())
      .then((e) => {
        console.log(e);
        if (e.state !== "success") {
          reject(e);
        }
        resolve(e);
      });
  });
};
