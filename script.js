// -*- js-indent-level: 2; -*-
import Vue from "https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.esm.browser.js";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/+esm";
import { formatDateTime } from "./src/date.js";
import { getListURL, fetchItems, save } from "./src/store.js";
import { config, saveConfig, isValidConfig } from "./src/config.js";
import { sample, parsetagtext } from "./src/bookmarks.js";

// internet archives
// https://web.archive.org/web/https://brabrabra

const app = new Vue({
  el: "#app",
  data: {
    mes: "",
    config,
    search: "",
    items: sample,
  },
  mounted() {
    console.log("mounted");
    this.mes = "mounted";
    this.fetchAll();
  },
  computed: {
    filteredItems() {
      return this.items?.filter((item) => {
        // search without filter implementation
        const val = JSON.stringify(item);
        return (
          this.search === "" ||
          val.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
    filteredCount() {
      return this.filteredItems?.length;
    },
  },
  methods: {
    mdrender(text) {
      return marked.parse(text);
    },
    datetime(ts) {
      return formatDateTime(ts);
    },
    saveconfig(config) {
      console.log("save config");
      saveConfig(config);
      this.mes = "saved";
    },
    fetchAll() {
      if (!isValidConfig(this.config)) {
        this.mes = "no params. demo mode";
        return;
      }
      const setEdit = (item) => {
        item.edit = false;
        return item;
      };
      this.mes = "fetching...";
      const that = this;
      const url = getListURL(this.config);
      fetchItems(url)
        .then((items) => {
          that.items = items.values.map(setEdit);
        })
        .then(() => {
          that.mes = "fetched";
          that.$refs.search.focus();
        })
        .catch((e) => {
          that.mes = e;
        });
    },
    edit(item, i) {
      item.edit = true;
      item.tagtext = item.meta.tags.join(",");
      item.comment = item.meta.comment;
    },
    save(item) {
      this.mes = "Saving...";
      item.edit = false;
      if (!isValidConfig(this.config)) {
        this.mes = "no params nor config. demo mode";
        return;
      }
      const newtags = JSON.stringify(parsetagtext(item.tagtext));
      const oldtags = JSON.stringify(
        item.meta.tags.map((e) => e.trim()).sort()
      );
      if (newtags === oldtags && item.comment === item.meta.comment) {
        this.mes = "not modified";
        return;
      }
      this.mes = "modified. Saving...";
      item.meta.tags = parsetagtext(item.tagtext);
      item.meta.comment = item.comment;
      console.log(item);
      this.mes = item;
      const body = {
        key: item.key,
        meta: item.meta,
        token: this.config.token,
      };
      console.log(body);
      this.mes = body;
      const that = this;
      save(this.config, body).then((e) => {
        that.mes = "Saved. maybe.";
      });
    },
  },
});
