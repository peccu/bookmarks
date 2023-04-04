import { bookmarkletcode, bookmarklet } from "../src/bookmarks.js";

export default {
  props: ["config", "setmessage"],
  data() {
    return {
      bookmarklet: "",
    };
  },
  mounted() {
    console.log("mounted");
    // alert("mounted");
    this.setmessage("mounted");
    const that = this;
    bookmarklet(this.config).then((code) => (that.bookmarklet = code));
  },
  computed: {
    code() {
      return bookmarkletcode(
        this.config.base,
        this.config.savepost,
        this.config.saveget,
        this.config.token
      );
    },
  },
  template: `
  <div>
    <h3 class="text-lg" id="bookmarklet">Bookmarklet</h3>
    <div
       class="overflow-x-scroll my-2 rounded-sm"
       >
       Drag this link into bookmark
       <a :href="bookmarklet" class="text-lg text-sky-500 hover:text-sky-600">Save bookmark</a>
    </div>
  </div>
`,
};
