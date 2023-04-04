import { saveConfig } from "../src/config.js";
export default {
  props: ["config", "setmessage"],
  methods: {
    saveconfig(config) {
      console.log("save config");
      // alert("config:" + JSON.stringify(config));
      saveConfig(config);
      this.setmessage("saved");
    },
    reload() {
      window.location.reload();
    },
  },
  template: `
            <div>
              <h3 class="text-lg" id="config">Config</h3>
              <div
                class="overflow-x-scroll my-2 rounded-sm bg-gray-100 text-sm text-slate-500"
              >
                <pre>{{JSON.stringify(config, false, 2)}}</pre>
              </div>
              <ul class="flex flex-col justify-center">
                <li>
                  <div>base domain</div>
                  <input
                    type="text"
                    class="leading-1 w-full p-1 text-sm"
                    placeholder="base domain name"
                    v-model="config.base"
                  />
                </li>
                <li>
                  <div>get list api</div>
                  <input
                    type="text"
                    class="leading-1 w-full p-1 text-sm"
                    placeholder="get list api subdomain"
                    v-model="config.getlist"
                  />
                </li>
                <li>
                  <div>save api (POST)</div>
                  <input
                    type="text"
                    class="leading-1 w-full p-1 text-sm"
                    placeholder="save api (POST) subdomain"
                    v-model="config.savepost"
                  />
                </li>
                <li>
                  <div>save api (GET)</div>
                  <input
                    type="text"
                    class="leading-1 w-full p-1 text-sm"
                    placeholder="save api (GET) subdomain"
                    v-model="config.saveget"
                  />
                </li>
                <li>
                  <div>api token</div>
                  <input
                    type="password"
                    class="leading-1 w-full p-1 text-sm"
                    placeholder="api token"
                    v-model="config.token"
                  />
                </li>
              </ul>
              <div>
                <button
                  class="block w-full rounded-sm text-lg mt-2 px-2 py-1 bg-sky-400 text-slate-100"
                  @click="saveconfig(config)"
                >
                  Save
                </button>

                <button
                  class="block w-full bg-sky-400 text-slate-100 rounded-sm text-lg mt-3 px-2 py-1"
                  @click="reload()"
                >
                  Reload App
                </button>
              </div>
            </div>
`,
};
