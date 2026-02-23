---
layout: single
title: "ブログ"
permalink: /ja/blog/
lang: ja
sidebar:
  nav: "nav_ja"
---

日本語記事一覧

<div class="blog-list-controls" style="display:flex;gap:1rem;flex-wrap:wrap;align-items:center;margin-bottom:1rem;">
  <label for="sort-order-ja">並び順:</label>
  <select id="sort-order-ja">
    <option value="desc">更新日時が新しい順</option>
    <option value="asc">更新日時が古い順</option>
  </select>
  <span id="active-tag-ja" class="blog-active-tag" style="display:none;"></span>
  <a id="clear-tag-ja" href="{{ page.url | relative_url }}" style="display:none;">タグ絞り込みを解除</a>
</div>

{% assign ja_posts = site.posts | where: "lang", "ja" %}
<div id="post-data-ja" style="display:none;">
  {% for post in ja_posts %}
    <article
      data-title="{{ post.title | escape }}"
      data-url="{{ post.url | relative_url }}"
      data-date="{{ post.date | date: '%s' }}"
      data-date-label="{{ post.date | date: '%Y-%m-%d %H:%M' }}"
      data-tags="{% if post.tags %}{% for tag in post.tags %}{{ tag | downcase }}{% unless forloop.last %}|{% endunless %}{% endfor %}{% endif %}">
    </article>
  {% endfor %}
</div>

<div id="blog-list-ja"></div>
<nav id="pagination-ja" style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-top:1rem;"></nav>

<script>
  (function () {
    var PER_PAGE = 5;
    var sortSelect = document.getElementById("sort-order-ja");
    var listContainer = document.getElementById("blog-list-ja");
    var pagination = document.getElementById("pagination-ja");
    var clearTag = document.getElementById("clear-tag-ja");
    var activeTag = document.getElementById("active-tag-ja");
    var dataNodes = Array.prototype.slice.call(document.querySelectorAll("#post-data-ja article"));

    var state = {
      page: 1,
      sort: "desc",
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
        activeTag.style.display = "none";
        activeTag.textContent = "";
        clearTag.style.display = "none";
        return;
      }

      activeTag.style.display = "inline-block";
      activeTag.textContent = "選択中タグ: " + state.tags.map(function (tag) {
        return "#" + tag;
      }).join(" / ") + "（" + count + "件）";
      clearTag.style.display = "inline";
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
        listContainer.innerHTML = "<p>該当する記事がありません。</p>";
        pagination.innerHTML = "";
        return;
      }

      var totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
      if (state.page > totalPages) {
        state.page = totalPages;
      }

      var start = (state.page - 1) * PER_PAGE;
      var currentItems = posts.slice(start, start + PER_PAGE);

      listContainer.innerHTML = currentItems.map(function (post) {
        var tags = post.tags.map(function (tag) {
          var isActive = state.tags.indexOf(tag) !== -1;
          var activeClass = isActive ? " is-active" : "";
          return '<a href="?tag=' + encodeURIComponent(tag) + '" data-tag="' + tag + '" class="blog-tag-link' + activeClass + '">#' + tag + "</a>";
        }).join(" ");

        return '<article style="margin-bottom:1rem;">' +
          '<h3 style="margin-bottom:0.25rem;"><a href="' + post.url + '">' + post.title + "</a></h3>" +
          '<p style="margin:0 0 0.25rem 0;">更新日時: ' + post.dateLabel + "</p>" +
          (tags ? '<p style="margin:0;">タグ: ' + tags + "</p>" : "") +
          "</article>";
      }).join("");

      bindTagLinks();
      renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
      pagination.innerHTML = "";
      if (totalPages <= 1) {
        return;
      }

      var prev = document.createElement("button");
      prev.type = "button";
      prev.textContent = "前へ";
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
      next.textContent = "次へ";
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

    function bindTagLinks() {
      var links = listContainer.querySelectorAll(".blog-tag-link");
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
          var nextUrl = buildTagUrl();
          history.replaceState({}, "", nextUrl);
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
  })();
</script>
