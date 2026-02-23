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
});
