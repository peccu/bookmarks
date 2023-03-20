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

export const parsetagtext = (text) =>
  text
    .split(",")
    .map((e) => e.trim())
    .sort();

const bookmarklet = (base, postbase, getbase, token) => {
  const tagtext = prompt("Input tags separated by commma");
  if (tagtext === null) {
    return;
  }
  const tags = parsetagtext(tagtext);
  tags.push("bookmarklet");
  const comment = prompt("Input comments");
  if (comment === null) {
    return;
  }

  // merged two answers
  // https://stackoverflow.com/a/25293492
  // https://stackoverflow.com/a/13848813
  const _JSON_stringify = JSON.stringify;
  const toStr = function (obj) {
    if (!window.Prototype) {
      return JSON.stringify(obj);
    }
    // escape
    const _Array_tojson = Array.prototype.toJSON;
    const _Object_tojson = Object.prototype.toJSON;
    const _Hash_tojson = Hash.prototype.toJSON;
    const _String_tojson = String.prototype.toJSON;
    const _Date_tojson = Date.prototype.toJSON;
    // delete or set default
    delete Array.prototype.toJSON;
    delete Object.prototype.toJSON;
    delete Hash.prototype.toJSON;
    delete String.prototype.toJSON;
    Date.prototype.toJSON = Date.prototype.toISOString;
    // run stringify
    const r = _JSON_stringify(obj);
    // restore
    Array.prototype.toJSON = _Array_tojson;
    Object.prototype.toJSON = _Object_tojson;
    Hash.prototype.toJSON = _Hash_tojson;
    String.prototype.toJSON = _String_tojson;
    Date.prototype.toJSON = _Date_tojson;
    return r;
  };

  const genmeta = (e) => ({
    name: e.name,
    property: e.getAttribute("property"),
    itemprop: e.getAttribute("itemprop"),
    content: e.content,
  });
  const savepost = (postbase, base, options, saveget) => {
    return fetch(`https://${postbase}${base}`, options)
      .then((response) => response.json())
      .then((data) => alert(toStr(data)))
      .catch(saveget);
  };

  const gensaveget = (url, saveNewWindow) => {
    return (e) => {
      console.log("POST fetch failed: ", e);
      return fetch(url)
        .then((response) => response.json())
        .then((data) => alert(toStr(data)))
        .catch(saveNewWindow);
    };
  };
  const gensaveNewWindow = (url) => {
    return (e) => {
      console.log("GET fetch failed: ", e);
      const fallback = window.open(url, "_blank");
      if (fallback) {
        return;
      }
      alert("Fallback popup has blocked. please try again");
    };
  };
  const genGetUrl = (getbase, base, token, body) => {
    // for url length limit
    delete body.meta.metatags;
    const query = encodeURIComponent(toStr(body));
    return `https://${getbase}${base}/?token=${token}&q=${query}`;
  };

  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  const title = document.title;
  const domain = location.host;
  const metaDOM = document.querySelectorAll("meta");
  const metatags = [...metaDOM].map(genmeta);
  const body = {
    key: location.href,
    meta: {
      metatags,
      tags,
      title,
      comment,
      domain,
    },
    token,
  };
  const options = {
    method: "POST",
    headers,
    mode: "cors",
    body: toStr(body),
  };
  const geturl = genGetUrl(getbase, base, token, body);
  const savenewwindow = gensaveNewWindow(geturl);
  const saveget = gensaveget(geturl, savenewwindow);
  return savepost(postbase, base, options, saveget);
};
