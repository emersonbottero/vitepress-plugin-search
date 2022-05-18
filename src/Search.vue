<script lang="ts" setup>
import { useData, useRouter } from "vitepress";
import { ref, onMounted, onUnmounted, computed } from "vue";
import data from "../../../lunr_index.js";

const { theme, site, localePath, page } = useData();
const router = useRouter();

// to avoid loading the docsearch js upfront (which is more than 1/3 of the
// payload), we delay initializing it until the user has actually clicked or
// hit the hotkey to invoke it
const metaKey = ref();
const open = ref(false);
const searchTerm = ref();
const origin = ref("");
const input = ref(null);

let LUNR_DATA = data.LUNR_DATA;
let PREVIEW_LOOKUP = data.PREVIEW_LOOKUP;

const result = computed(() => {
  if (searchTerm.value) {
    var idx = lunr.Index.load(LUNR_DATA);
    var searchResults = idx.search(searchTerm.value + "*");

    var search = [];

    for (var i = 0; i < searchResults.length; i++) {
      var id = searchResults[i]["ref"];
      var item = PREVIEW_LOOKUP[id];
      var title = item["t"];
      var preview = item["p"];
      var link = item["l"];
      var anchor = item["a"];
      search.push({ id, link, title, preview, anchor });
    }
    return search;
  }
});

const GroupBy = (array, func) => {
  if (!array || !array.length) return [];

  return array.reduce((acc, value) => {
    // Group initialization
    if (!acc[func(value)]) {
      acc[func(value)] = [];
    }

    // Grouping
    acc[func(value)].push(value);

    return acc;
  }, {});
};

const openSearch = () => {
  setTimeout(() => {
    if (input.value) input.value.focus();
  }, 100);
  cleanSearch();
  open.value = true;
};

const addLunrScriptToHeader = () => {
  const plugin = document.createElement("script");
  plugin.setAttribute("src", "https://unpkg.com/lunr/lunr.min.js");
  plugin.async = true;
  document.head.appendChild(plugin);
};

onMounted(() => {
  addLunrScriptToHeader();

  origin.value = window.location.origin + localePath.value;
  metaKey.value.textContent = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
    ? "⌘"
    : "Ctrl";
  const handleSearchHotKey = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      openSearch();
      // remove();
    }
  };
  const remove = () => {
    window.removeEventListener("keydown", handleSearchHotKey);
  };
  window.addEventListener("keydown", handleSearchHotKey);
  onUnmounted(remove);
});

function cleanSearch() {
  open.value = false;
  searchTerm.value = "";
}
</script>

<template>
  <div v-if="theme.algolia" class="VPNavBarSearch">
    <!-- <SearchBox /> -->
    <Teleport to="body">
      <div v-if="open" class="modal-back" @click="open = false">
        <div class="modal" @click.stop>
          <form class="DocSearch-Form">
            <label
              class="DocSearch-MagnifierLabel"
              for="docsearch-input"
              id="docsearch-label"
              ><svg
                width="20"
                height="20"
                class="DocSearch-Search-Icon"
                viewBox="0 0 20 20"
              >
                <path
                  d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                  stroke="currentColor"
                  fill="none"
                  fill-rule="evenodd"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </label>

            <input
              class="DocSearch-Input"
              aria-autocomplete="both"
              aria-labelledby="docsearch-label"
              id="docsearch-input"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              enterkeyhint="search"
              spellcheck="false"
              autofocus="true"
              v-model="searchTerm"
              placeholder="Search docs"
              maxlength="64"
              type="search"
              ref="input"
            />
          </form>
          <div class="search-list">
            <div
              v-for="(group, groupKey) of GroupBy(result, (x) =>
                x.link.split('/').slice(0, -1).join('-')
              )"
              :key="groupKey"
            >
              {{ groupKey || "home" }}
              <a
                :href="origin + item.link"
                v-for="item in group"
                :key="item.id"
                @click="cleanSearch"
              >
                <div class="search-item">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.preview }}</p>
                  <!-- <span>{{ item.anchor }}</span> -->
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
    <div id="docsearch" @click="openSearch()">
      <button
        type="button"
        class="DocSearch DocSearch-Button"
        aria-label="Search"
      >
        <span class="DocSearch-Button-Container">
          <svg
            width="20"
            height="20"
            class="DocSearch-Search-Icon"
            viewBox="0 0 20 20"
          >
            <path
              d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
              stroke="currentColor"
              fill="none"
              fill-rule="evenodd"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          <span class="DocSearch-Button-Placeholder">Search</span>
        </span>
        <span class="DocSearch-Button-Keys">
          <span class="DocSearch-Button-Key" ref="metaKey">Meta</span>
          <span class="DocSearch-Button-Key">K</span>
        </span>
      </button>
    </div>
  </div>
</template>

<style>
.search-list {
  padding: 1rem;
}

.search-list > div {
  color: var(--c-brand);
  font-weight: bold;
}

.search-item {
  padding: 0rem 2rem;
  margin: 8px 0 0 0;
  border: solid 1px;
  border-radius: 6px;
}

.search-item > h3 {
  margin-top: 16px;
}

.search-item > p {
  margin: 0px;
  font-size: smaller;
  color: var(--c-text-light-3);
}

.search-item:hover {
  color: #fff;
  background: var(--c-brand);
}

.search-item:hover > p {
  color: #fff;
}

/* .dark .search-item > p {
  color: var(--c-text-light-2);
} */

.VPNavBarSearch {
  display: flex;
  align-items: center;
  padding-left: 16px;
}

.DocSearch-MagnifierLabel {
  margin: 16px;
  color: var(--c-brand-light);
}

.DocSearch-Input {
  appearance: none;
  background: #fff;
  border: solid 1px var(--c-brand-light);
  color: var(--docsearch-text-color);
  flex: 1;
  font: inherit;
  font-size: 1.2em;
  height: 100%;
  outline: none;
  padding: 0 0 0 8px;
  width: 80%;
  margin: 8px;
  padding: 8px;
  border-radius: 6px;
}

.dark .DocSearch-Input {
  background: #2f2f2f;
}

.modal-back {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #545454b3;
  position: fixed;
  z-index: 10;
}

.dark .modal {
  background-color: #242424;
}

.modal {
  background-color: #f9f9f9;
  border-radius: 6px;
  box-shadow: none;
  flex-direction: column;
  margin: 80px auto auto;
  max-width: 560px;
  position: relative;
  box-shadow: inset 1px 1px 0 0 hsla(0, 0%, 100%, 0.5), 0 3px 8px 0 #555a64;
}

.DocSearch-Button-Keys {
  display: flex;
  min-width: calc(40px + 0.8em);
}

@media (min-width: 768px) {
  .DocSearch-Button .DocSearch-Button-Key {
    display: inline-block;
  }
}

.dark .DocSearch-Form {
  background-color: var(--vt-c-bg-mute);
}
.DocSearch-Form {
  background-color: #fff;
  border: 1px solid var(--vt-c-brand);
  padding: 6px;
}
.DocSearch-Form {
  align-items: center;
  background: var(--docsearch-searchbox-focus-background);
  border-radius: 4px;
  box-shadow: var(--docsearch-searchbox-shadow);
  display: flex;
  height: var(--docsearch-searchbox-height);
  margin: 0;
  padding: 0 var(--docsearch-spacing);
  position: relative;
  width: 100%;
}
.DocSearch-Container,
.DocSearch-Container * {
  box-sizing: border-box;
}

.DocSearch-Button .DocSearch-Button-Key {
  margin-top: 2px;
  border: 1px solid var(--vt-c-divider);
  border-right: none;
  border-radius: 4px 0 0 4px;
  display: none;
  padding-left: 6px;
  height: 22px;
  line-height: 22px;
  transition: color 0.5s, border-color 0.5s;
  min-width: 0;
}
.DocSearch-Button-Key {
  font-size: 12px;
  font-weight: 500;
  height: 20px;
  margin: 0;
  width: auto;
  color: var(--vt-c-text-3);
  transition: color 0.5s;
  display: inline-block;
  padding: 0 1px;
}
.DocSearch-Button-Key {
  align-items: center;
  background: var(--c-brand-light);
  border-radius: 3px;
  box-shadow: var(--c-brand);
  color: var(--docsearch-muted-color);
  display: flex;
  height: 18px;
  justify-content: center;
  margin-right: 0.4em;
  padding-bottom: 2px;
  position: relative;
  top: -1px;
  width: 20px;
}

body.dark .DocSearch-Button:hover {
  box-shadow: none;
}

.DocSearch {
  --docsearch-primary-color: var(--vt-c-brand);
  --docsearch-highlight-color: var(--docsearch-primary-color);
  --docsearch-text-color: var(--vt-c-text-1);
  --docsearch-muted-color: #ebebeb99;
  --docsearch-searchbox-shadow: none;
  --docsearch-searchbox-focus-background: transparent;
  --docsearch-key-gradient: transparent;
  --docsearch-key-shadow: none;
  --docsearch-modal-background: var(--vt-c-bg-soft);
  --docsearch-footer-background: var(--vt-c-bg);
}

.dark .DocSearch {
  --docsearch-modal-shadow: none;
  --docsearch-footer-shadow: none;
  --docsearch-logo-color: #ebebeb99;
  --docsearch-hit-background: #2f2f2f;
  --docsearch-hit-color: #ebebeb99;
  --docsearch-hit-shadow: none;
}

.dark .DocSearch-Footer {
  border-top: 1px solid var(--vt-c-divider);
}

.DocSearch-Form {
  background-color: white;
  border: 1px solid var(--vt-c-brand);
}

.DocSearch-Button-Container {
  align-items: center;
  display: flex;
}

.DocSearch-Button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  width: 48px;
  height: 55px;
  background: transparent;
  border: none;
}

.DocSearch-Button:hover {
  background: transparent;
}
.DocSearch-Button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color;
}
.DocSearch-Button:focus:not(:focus-visible) {
  outline: none !important;
}

@media (min-width: 768px) {
  .DocSearch-Button {
    justify-content: flex-start;
    width: 100%;
  }
}

.DocSearch-Button .DocSearch-Search-Icon {
  color: #818181;
  transition: color 0.5s;
  fill: currentColor;
  width: 18px;
  height: 18px;
  position: relative;
}

@media (min-width: 768px) {
  .DocSearch-Button .DocSearch-Search-Icon {
    top: 1px;
    margin-right: 10px;
    width: 15px;
    height: 15px;
  }
}

.DocSearch-Button:hover .DocSearch-Search-Icon {
  color: var(--vt-c-text-1);
}

.DocSearch-Button-Placeholder {
  transition: color 0.5s;
  font-size: 13px;
  font-weight: 500;
  color: #66666699;
  display: none;
  padding: 0 10px 0 0;
}

@media (min-width: 960px) {
  .DocSearch-Button-Placeholder {
    display: inline-block;
  }
}

.DocSearch-Button:hover .DocSearch-Button-Placeholder {
  color: var(--vt-c-text-1);
}

.DocSearch-Button .DocSearch-Button-Key {
  margin-top: 2px;
  border: 1px solid var(--vt-c-divider);
  border-right: none;
  border-radius: 4px 0 0 4px;
  display: none;
  padding-left: 6px;
  height: 22px;
  line-height: 22px;
  transition: color 0.5s, border-color 0.5s;
  min-width: 0;
}

.DocSearch-Button .DocSearch-Button-Key + .DocSearch-Button-Key {
  border-right: 1px solid var(--vt-c-divider);
  border-left: none;
  border-radius: 0 4px 4px 0;
  padding-left: 2px;
  padding-right: 6px;
}

.DocSearch-Button:hover .DocSearch-Button-Key {
  /* border-color: var(--vt-c-brand-light); */
  color: var(--vt-c-brand-light);
}

@media (min-width: 768px) {
  .DocSearch-Button .DocSearch-Button-Key {
    display: inline-block;
  }
}

.DocSearch-Button-Key {
  font-size: 12px;
  font-weight: 500;
  height: 20px;
  margin: 0;
  width: auto;
  color: var(--vt-c-text-3);
  transition: color 0.5s;
  display: inline-block;
  padding: 0 1px;
}
</style>
