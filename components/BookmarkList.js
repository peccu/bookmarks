import { marked } from "https://cdn.jsdelivr.net/npm/marked/+esm";
import { isValidConfig } from "../src/config.js";
import { formatDateTime } from "../src/date.js";
import {
  sample,
  parsetagtext,
  fetchBookmarks,
  saveBookmark,
} from "../src/bookmarks.js";

export default {
  props: ["config", "setmessage"],
  data() {
    return {
      items: sample,
      search: "",
    };
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
  mounted() {
    this.fetchAll();
  },
  methods: {
    mdrender(text) {
      return marked.parse(text);
    },
    datetime(ts) {
      return formatDateTime(ts);
    },
    fetchAll() {
      if (!isValidConfig(this.config)) {
        this.setmessage("no params. demo mode");
        return;
      }
      const setEdit = (item) => {
        item.edit = false;
        return item;
      };
      this.setmessage("fetching...");
      const that = this;
      fetchBookmarks(this.config)
        .then((items) => {
          that.items = items.values.map(setEdit);
        })
        .then(() => {
          this.setmessage("fetched");
          that.$refs.search.focus();
        })
        .catch((e) => {
          that.setmessage(e);
        });
    },
    edit(item, i) {
      item.edit = true;
      item.tagtext = item.meta.tags.join(",");
      item.comment = item.meta.comment;
    },
    save(item) {
      this.setmessage("Saving...");
      item.edit = false;
      if (!isValidConfig(this.config)) {
        this.setmessage("no params nor config. demo mode");
        return;
      }
      const newtags = JSON.stringify(parsetagtext(item.tagtext));
      const oldtags = JSON.stringify(
        item.meta.tags.map((e) => e.trim()).sort()
      );
      if (newtags === oldtags && item.comment === item.meta.comment) {
        this.setmessage("not modified");
        return;
      }
      this.setmessage("modified. Saving...");
      item.meta.tags = parsetagtext(item.tagtext);
      item.meta.comment = item.comment;
      console.log(item);
      this.setmessage(item);
      const that = this;
      saveBookmark(this.config, item).then((e) => {
        that.setmessage("Saved. maybe.");
      });
    },
  },
  template: `
  <div>
        <div class="flex justify-center">
          <div>
            <input
              type="search"
              ref="search"
              class="w-2xl rounded-md border-sky-400"
              placeholder="Search term"
              v-model="search"
              autofocus
            />
            ({{filteredCount}}/{{items.length}})
          </div>
        </div>
            <div class="flex justify-between">
              <div class="text-lg" id="bookmark">Bookmarks</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-6 w-6 flex-none fill-transparent stroke-sky-500 stroke-2 hover:stroke-sky-800"
                @click="fetchAll()"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </div>
            <!-- line -->
            <div class="py-2 text-base leading-7">
              <ul class="space-y-2">
                <li v-for="(item, i) in filteredItems" :key="i">
                  <div class="flex justify-start items-start">
                    <!-- icon -->
                    <svg
                      v-if="!item.edit"
                      class="h-8 w-8 flex-none fill-transparent stroke-sky-500 stroke-2 hover:stroke-sky-800"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      @click="edit(item, i)"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>

                    <svg
                      v-else
                      class="h-8 w-8 flex-none fill-sky-100 stroke-sky-500 stroke-2 hover:stroke-sky-800"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      @click="save(item)"
                    >
                      <circle cx="12" cy="12" r="11" />
                      <path
                        d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"
                        fill="none"
                      />
                    </svg>

                    <div class="ml-1">
                      <!-- link -->
                      <a
                        :href="item.key"
                        target="_blank"
                        class="text-lg text-sky-500 hover:text-sky-600"
                        rel="noreferrer noopener"
                        >{{item.meta.title || 'no title'}}</a
                      >
                      <!-- domain, timestamp -->
                      <div class="">
                        <span
                          class="rounded-md bg-slate-200 px-1 text-xs text-slate-400"
                        >
                          {{ item.meta.domain || (new URL(item.key)).host }}
                        </span>
                        <span class="px-1 text-sm text-slate-400">
                          {{ datetime(item.ts) }}
                        </span>
                        <span>
                          <a
                            :href="'https://web.archive.org/web/'+item.key"
                            target="_blank"
                            class="text-sm text-sky-500 hover:text-sky-600"
                            rel="noreferrer noopener"
                          >
                            Archives
                          </a>
                        </span>
                      </div>
                      <!-- tags -->
                      <div class="space-x-2">
                        <span
                          class="rounded-md bg-sky-300 px-2 py-1 text-xs shadow-md"
                          v-for="(tag, k) in item.meta.tags"
                        >
                          {{tag}}
                        </span>
                      </div>

                      <!-- comment -->
                      <div
                        v-if="item.meta.comment"
                        class="prose prose-zinc bg-slate-100 text-xs mt-1 px-2 py-1 rounded"
                        v-html="mdrender(item.meta.comment)"
                      ></div>
                      <!-- form -->
                      <div v-if="item.edit" class="w-full">
                        <div>
                          <input
                            type="text"
                            placeholder="tags (comma separated)"
                            v-model="item.tagtext"
                            class="mt-2 rounded-md px-1 py-1 text-sm"
                            @keyup.enter.prevent="save(item)"
                          />
                        </div>
                        <div class="w-full">
                          <textarea
                            class="w-full"
                            rows="5"
                            v-model="item.comment"
                          ></textarea>
                        </div>
                        <div
                          class="my-2 rounded-sm bg-gray-100 text-sm text-slate-500"
                        >
                          <pre class="overflow-x-scroll disable-scrollbars">
{{JSON.stringify(item, false, 2)}}</pre
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            </div>
`,
};
