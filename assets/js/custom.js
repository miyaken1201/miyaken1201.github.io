document.addEventListener("DOMContentLoaded", function () {
  document.documentElement.classList.add("js-ready");

  var mainCss = document.querySelector('link[href*="/assets/css/main.css"]');
  var assetsPrefix = "";
  if (mainCss) {
    var href = mainCss.getAttribute("href") || "";
    var marker = "/assets/css/main.css";
    var index = href.indexOf(marker);
    if (index >= 0) {
      assetsPrefix = href.slice(0, index);
    }
  }

  var languageFlags = [
    { selector: '#site-nav a[href*="/ja"]', src: assetsPrefix + "/assets/img/flags/jp.svg", alt: "Japan flag" },
    { selector: '#site-nav a[href*="/en"]', src: assetsPrefix + "/assets/img/flags/uk.svg", alt: "United Kingdom flag" }
  ];

  languageFlags.forEach(function (item) {
    var links = document.querySelectorAll(item.selector);
    links.forEach(function (link) {
      if (link.querySelector(".lang-flag-icon")) {
        return;
      }
      var img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.className = "lang-flag-icon";
      link.insertBefore(img, link.firstChild);
    });
  });

  var backButton = document.querySelector(".post-pagination-back");
  var pageTitle = document.querySelector(".page__title");

  if (backButton && pageTitle && pageTitle.parentNode) {
    var backTopWrap = document.createElement("div");
    backTopWrap.className = "post-back-top-wrap";
    pageTitle.parentNode.insertBefore(backTopWrap, pageTitle);
    backTopWrap.appendChild(backButton);
  }

  if (document.body && document.body.classList.contains("cv-page")) {
    var toc = document.querySelector(".sidebar__right .toc");
    var tocTitle = toc ? toc.querySelector(".nav__title") : null;
    var tocMenu = toc ? toc.querySelector(".toc__menu") : null;

    if (toc && tocTitle && tocMenu && !toc.classList.contains("cv-toc-ready")) {
      var menuId = tocMenu.id || "cv-toc-menu";
      tocMenu.id = menuId;

      toc.classList.add("cv-toc-ready");
      toc.classList.add("is-collapsed");

      tocTitle.classList.add("cv-toc-trigger");
      tocTitle.setAttribute("role", "button");
      tocTitle.setAttribute("tabindex", "0");
      tocTitle.setAttribute("aria-controls", menuId);
      tocTitle.setAttribute("aria-expanded", "false");

      var toggleToc = function () {
        var isCollapsed = toc.classList.toggle("is-collapsed");
        tocTitle.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
      };

      tocTitle.addEventListener("click", toggleToc);
      tocTitle.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleToc();
        }
      });
    }
  }
});
