---
layout: single
title: "Blog"
permalink: /en/blog/
lang: en
---

English posts

{% assign en_posts = site.posts | where: "lang", "en" %}
{% for post in en_posts %}
- [{{ post.title }}]({{ post.url }})
{% endfor %}
