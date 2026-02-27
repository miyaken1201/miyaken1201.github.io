(function (global) {
  function initBlogFilter(options) {
    var config = options || {};
    var perPage = Number(config.perPage || 5);

    var sortSelect = document.getElementById(config.sortSelectId);
    var listContainer = document.getElementById(config.listContainerId);
    var pagination = document.getElementById(config.paginationId);
    var clearTag = document.getElementById(config.clearTagId);
    var activeTag = document.getElementById(config.activeTagId);
    var tagFilter = document.getElementById(config.tagFilterId);
    var dataNodes = Array.prototype.slice.call(document.querySelectorAll(config.dataSelector || ""));

    if (!sortSelect || !listContainer || !pagination || !clearTag || !activeTag || !tagFilter || !dataNodes.length) {
      return;
    }

    var strings = Object.assign(
      {
        activeTagsPrefix: "Active tags: ",
        activeTagsSuffix: "",
        noPosts: "No matching posts found.",
        filterLabel: "Filter by tags:",
        updatedLabel: "Updated",
        tagsLabel: "Tags",
        prevButton: "Previous",
        nextButton: "Next",
        formatActiveTagText: function (selectedTags, count) {
          return strings.activeTagsPrefix + selectedTags.map(function (tag) {
            return "#" + tag;
          }).join(" / ") + " (" + count + ")" + strings.activeTagsSuffix;
        }
      },
      config.strings || {}
    );

    var state = {
      page: 1,
      sort: sortSelect.value || "desc",
      tags: [],
      posts: dataNodes.map(function (node) {
        var tagString = node.getAttribute("data-tags") || "";
        return {
          title: node.getAttribute("data-title") || "",
          url: node.getAttribute("data-url") || "",
          date: Number(node.getAttribute("data-date") || 0),
          dateLabel: node.getAttribute("data-date-label") || "",
          tags: tagString ? tagString.split("|").filter(Boolean) : []
        };
      })
    };

    function collectAllTags() {
      var tagSet = {};
      state.posts.forEach(function (post) {
        post.tags.forEach(function (tag) {
          tagSet[tag] = true;
        });
      });
      return Object.keys(tagSet).sort();
    }

    var allTags = collectAllTags();

    function readTagFromQuery() {
      var params = new URLSearchParams(window.location.search);
      var tags = params.getAll("tag").map(function (tag) {
        return (tag || "").toLowerCase();
      }).filter(Boolean);

      if (!tags.length) {
        var tagsParam = params.get("tags");
        if (tagsParam) {
          tags = tagsParam.split(",").map(function (tag) {
            return tag.trim().toLowerCase();
          }).filter(Boolean);
        }
      }

      state.tags = Array.from(new Set(tags));
    }

    function renderActiveTagUI(count) {
      if (!state.tags.length) {
        activeTag.classList.add("blog-filter-hidden");
        activeTag.textContent = "";
        clearTag.classList.add("blog-filter-hidden");
        return;
      }

      activeTag.classList.remove("blog-filter-hidden");
      if (typeof strings.formatActiveTagText === "function") {
        activeTag.textContent = strings.formatActiveTagText(state.tags, count);
      } else {
        activeTag.textContent = strings.activeTagsPrefix + state.tags.map(function (tag) {
          return "#" + tag;
        }).join(" / ") + " (" + count + ")";
      }
      clearTag.classList.remove("blog-filter-hidden");
    }

    function renderTagFilter() {
      if (!allTags.length) {
        tagFilter.innerHTML = "";
        return;
      }

      tagFilter.innerHTML =
        '<span class="post-tag-list-label">' + strings.filterLabel + '</span>' +
        allTags.map(function (tag) {
          var isActive = state.tags.indexOf(tag) !== -1;
          var activeClass = isActive ? " is-active" : "";
          return '<a href="?tag=' + encodeURIComponent(tag) + '" data-tag="' + tag + '" class="blog-tag-link' + activeClass + '">#' + tag + "</a>";
        }).join(" ");

      bindTagLinks(tagFilter);
    }

    function filteredPosts() {
      var posts = state.posts.slice();
      if (state.tags.length) {
        posts = posts.filter(function (post) {
          return state.tags.every(function (tag) {
            return post.tags.indexOf(tag) !== -1;
          });
        });
      }
      posts.sort(function (a, b) {
        return state.sort === "desc" ? b.date - a.date : a.date - b.date;
      });
      return posts;
    }

    function renderList(posts) {
      if (!posts.length) {
        listContainer.innerHTML = '<p class="blog-list-empty">' + strings.noPosts + "</p>";
        pagination.innerHTML = "";
        return;
      }

      var totalPages = Math.max(1, Math.ceil(posts.length / perPage));
      if (state.page > totalPages) {
        state.page = totalPages;
      }

      var start = (state.page - 1) * perPage;
      var currentItems = posts.slice(start, start + perPage);

      listContainer.innerHTML = currentItems.map(function (post) {
        var tags = post.tags.map(function (tag) {
          var isActive = state.tags.indexOf(tag) !== -1;
          var activeClass = isActive ? " is-active" : "";
          return '<a href="?tag=' + encodeURIComponent(tag) + '" data-tag="' + tag + '" class="blog-tag-link' + activeClass + '">#' + tag + "</a>";
        }).join(" ");

        return '<article class="blog-list-item">' +
          '<h3 class="blog-list-title"><a href="' + post.url + '">' + post.title + "</a></h3>" +
          '<p class="blog-list-meta">' + strings.updatedLabel + ': ' + post.dateLabel + "</p>" +
          (tags ? '<p class="blog-list-tags">' + strings.tagsLabel + ': ' + tags + "</p>" : "") +
          "</article>";
      }).join("");

      bindTagLinks(listContainer);
      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      pagination.innerHTML = "";
      if (totalPages <= 1) {
        return;
      }

      var prev = document.createElement("button");
      prev.type = "button";
      prev.textContent = strings.prevButton;
      prev.disabled = state.page === 1;
      prev.addEventListener("click", function () {
        if (state.page > 1) {
          state.page -= 1;
          render();
        }
      });

      var pageInfo = document.createElement("span");
      pageInfo.textContent = state.page + " / " + totalPages;

      var next = document.createElement("button");
      next.type = "button";
      next.textContent = strings.nextButton;
      next.disabled = state.page === totalPages;
      next.addEventListener("click", function () {
        if (state.page < totalPages) {
          state.page += 1;
          render();
        }
      });

      pagination.appendChild(prev);
      pagination.appendChild(pageInfo);
      pagination.appendChild(next);
    }

    function bindTagLinks(root) {
      var links = (root || document).querySelectorAll(".blog-tag-link");
      Array.prototype.forEach.call(links, function (link) {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          var selectedTag = (link.getAttribute("data-tag") || "").toLowerCase();
          if (!selectedTag) {
            return;
          }

          var index = state.tags.indexOf(selectedTag);
          if (index === -1) {
            state.tags.push(selectedTag);
          } else {
            state.tags.splice(index, 1);
          }

          state.page = 1;
          history.replaceState({}, "", buildTagUrl());
          render();
        });
      });
    }

    function buildTagUrl() {
      if (!state.tags.length) {
        return window.location.pathname;
      }

      var params = new URLSearchParams();
      state.tags.forEach(function (tag) {
        params.append("tag", tag);
      });
      return window.location.pathname + "?" + params.toString();
    }

    function render() {
      var posts = filteredPosts();
      renderActiveTagUI(posts.length);
      renderTagFilter();
      renderList(posts);
    }

    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      state.page = 1;
      render();
    });

    clearTag.addEventListener("click", function (event) {
      event.preventDefault();
      state.tags = [];
      state.page = 1;
      history.replaceState({}, "", window.location.pathname);
      render();
    });

    readTagFromQuery();
    render();
  }

  global.initBlogFilter = initBlogFilter;
})(window);
