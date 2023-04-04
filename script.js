// -*- js-indent-level: 2; -*-
// import {
//   createApp
// } from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";
import {
  createApp
} from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.47/vue.esm-browser.prod.min.js";
import { config } from "./src/config.js";

import BookmarkList from "./components/BookmarkList.js";
import BookmarkletLink from "./components/BookmarkletLink.js";
import ConfigForm from "./components/ConfigForm.js";
import MenuLinks from "./components/MenuLinks.js";

// internet archives
// https://web.archive.org/web/https://brabrabra

const app = createApp({
  components: {
    BookmarkList,
    BookmarkletLink,
    ConfigForm,
    MenuLinks,
  },
  data() {
    return {
      config,
      mes: "",
      page: 'BookmarkList',
    };
  },
  methods: {
    setmessage(mes) {
      this.mes = mes;
    },
    setpage(page){
      this.page = page
    },
  },
});
app.mount("#app");
