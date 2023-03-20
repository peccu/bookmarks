export const sample = [
  {
    edit: false,
    key: "https://google.com",
    meta: {
      title: "Google",
      tags: ["Google", "search engine"],
      domain: "google.com",
      comment: "some comment bar",
    },
    ts: "2023-03-04T13:34:52.835Z",
  },
  {
    edit: false,
    key: "https://google.com",
    meta: {
      title: "Google",
      domain: "google.com",
      tags: [],
    },
    ts: "2023-03-04T13:34:52.835Z",
  },
];

export const getListURL = (config) =>
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

export const save = (p, g, b, t, body) => {
  const postbase = `https://${p}${g}`;
  const getbase = `https://${g}${b}`;
  return savePOST(postbase, getbase, t, body);
};

export const fetchItems = (url) => {
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
