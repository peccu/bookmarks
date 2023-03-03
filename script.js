const params = location.search
  .replace(/^\?/, "")
  .split("&")
  .map((e) => e.split("="))
  .reduce((a, e) => {
    a[e[0]] = e[1];
    return a;
  }, {});
const app = new Vue({
  el: "#app",
  data: {
    mes: "",
    search: "",
    items: [
      {
        edit: false,
        key: "https://google.com",
        meta: {
          title: "Google",
          tags: ["Google", "search engine"],
        },
      },
      {
        edit: false,
        key: "https://google.com",
        meta: {
          title: "Google",
        },
      },
    ],
  },
  mounted() {
    console.log("mounted");
    this.mes = "mounted";
    if (!params.a || !params.b || !params.c) {
      this.mes = "no params. demo mode";
      return;
    }
    const that = this;
    const url = `https://${params.a}${params.b}/?token=${params.c}`;
    fetch(url)
      .then((e) => e.json())
      .then((e) => {
        console.log(e);
        if (e.state !== "success") {
          that.mes = e;
          return;
        }
        that.items = e.values.map((i) => {
          i.edit = false;
          return i;
        });
      })
      .catch((e) => {
        that.mes = e;
        return;
      });
  },
  computed: {},
  methods: {
    save(item) {
      item.meta.tags = item.tagtext.split(",");
      item.edit = false;
      console.log(item);
      this.mes = item;
      const body = {
        key: item.key,
        meta: item.meta,
      };
      console.log(body);
      this.mes = body;
      // TODO impl like bookmarklet
    },
    getItems() {
      console.log("get");
    },
  },
});
