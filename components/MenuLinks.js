export default {
  props: ["setpage"],
  template: `
        <div>
          <ul class="flex space-x-3" id="menu">
            <li>
              <a class="text-sky-500 hover:text-sky-600" href="#bookmark"
              @click="setpage('BookmarkList')"
                >Bookmarks</a
              >
            </li>
            <li>
              <a class="text-sky-500 hover:text-sky-600" href="#config"
              @click="setpage('ConfigForm')"
                >Config</a
              >
            </li>
            <li>
              <a class="text-sky-500 hover:text-sky-600" href="#bookmarklet"
              @click="setpage('BookmarkletLink')"
                >Bookmarklet</a
              >
            </li>
          </ul>
        </div>
`,
};
