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
    search: "",
    items: [
      {
        key: "https://google.com",
        meta: {
          title: "Google",
        },
      },
      {
        key: "https://google.com",
        meta: {
          title: "Google",
        },
      },
    ],
  },
  mounted() {
    console.log("mounted");
    const that = this;
    const url = `https://${params.a}${params.b}/?token=${params.c}`;
    fetch(url)
      .then((e) => e.json())
      .then((e) => {
        console.log(e);
        if (e.state !== "success") {
          return;
        }
        that.items = e.bookmarks;
      });
  },
  computed: {},
  methods: {
    getItems() {
      console.log("get");
    },
  },
});
