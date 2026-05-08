---
layout: single
title: "Blog"
permalink: /en/blog/
lang: en
sidebar:
  nav: "nav_en"
---

English posts

<div class="blog-list-controls">
  <label for="sort-order-en">Sort:</label>
  <select id="sort-order-en">
    <option value="desc">Newest first</option>
    <option value="asc">Oldest first</option>
  </select>
  <span id="active-tag-en" class="blog-active-tag blog-filter-hidden"></span>
  <a id="clear-tag-en" href="{{ page.url | relative_url }}" class="blog-filter-hidden">Clear tag filter</a>
</div>

<div id="tag-filter-en" class="post-tag-list"></div>

{% assign en_posts = site.posts | where: "lang", "en" %}
<div id="post-data-en" class="blog-post-data">
  {% for post in en_posts %}
    <article
      data-title="{{ post.title | escape }}"
      data-url="{{ post.url | relative_url }}"
      data-date="{{ post.date | date: '%s' }}"
      data-date-label="{{ post.date | date: '%Y-%m-%d %H:%M' }}"
      data-tags="{% if post.tags %}{% for tag in post.tags %}{{ tag | downcase }}{% unless forloop.last %}|{% endunless %}{% endfor %}{% endif %}">
    </article>
  {% endfor %}
</div>

<div id="blog-list-en"></div>
<nav id="pagination-en" class="blog-pagination"></nav>

<script src="{{ '/assets/js/blog-filter.js' | relative_url }}"></script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    if (!window.initBlogFilter) {
      return;
    }

    window.initBlogFilter({
      perPage: 5,
      sortSelectId: "sort-order-en",
      listContainerId: "blog-list-en",
      paginationId: "pagination-en",
      clearTagId: "clear-tag-en",
      activeTagId: "active-tag-en",
      tagFilterId: "tag-filter-en",
      dataSelector: "#post-data-en article",
      strings: {
        noPosts: "No matching posts found.",
        filterLabel: "Filter by tags:",
        updatedLabel: "Updated",
        tagsLabel: "Tags",
        prevButton: "Previous",
        nextButton: "Next"
      }
    });
  });
</script>
