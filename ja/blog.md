---
layout: single
title: "ブログ"
permalink: /ja/blog/
lang: ja
sidebar:
  nav: "nav_ja"
---

日本語記事一覧

<div class="blog-list-controls">
  <label for="sort-order-ja">並び順:</label>
  <select id="sort-order-ja">
    <option value="desc">更新日時が新しい順</option>
    <option value="asc">更新日時が古い順</option>
  </select>
  <span id="active-tag-ja" class="blog-active-tag blog-filter-hidden"></span>
  <a id="clear-tag-ja" href="{{ page.url | relative_url }}" class="blog-filter-hidden">タグ絞り込みを解除</a>
</div>

<!-- 追加: 全タグフィルター -->
<div id="tag-filter-ja" class="post-tag-list"></div>

{% assign ja_posts = site.posts | where: "lang", "ja" %}
<div id="post-data-ja" class="blog-post-data">
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
<nav id="pagination-ja" class="blog-pagination"></nav>

<script src="{{ '/assets/js/blog-filter.js' | relative_url }}"></script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    if (!window.initBlogFilter) {
      return;
    }

    window.initBlogFilter({
      perPage: 5,
      sortSelectId: "sort-order-ja",
      listContainerId: "blog-list-ja",
      paginationId: "pagination-ja",
      clearTagId: "clear-tag-ja",
      activeTagId: "active-tag-ja",
      tagFilterId: "tag-filter-ja",
      dataSelector: "#post-data-ja article",
      strings: {
        noPosts: "該当する記事がありません。",
        filterLabel: "タグで絞り込み:",
        updatedLabel: "更新日時",
        tagsLabel: "タグ",
        prevButton: "前へ",
        nextButton: "次へ",
        formatActiveTagText: function (selectedTags, count) {
          return "選択中タグ: " + selectedTags.map(function (tag) {
            return "#" + tag;
          }).join(" / ") + "（" + count + "件）";
        }
      }
    });
  });
</script>
