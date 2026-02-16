# miyaken1201.github.io

Jekyll + GitHub Pages で構築した、CV配布とブログを備えた2言語（日本語/英語）ポートフォリオサイトです。

## 技術構成

- Jekyll
- GitHub Pages
- `mmistakes/minimal-mistakes`（`remote_theme`）
- `md-to-pdf`（CV PDF自動生成）

## セットアップ

前提: Jekyll / Bundler はセットアップ済み。

CV PDFをローカル生成する場合は Node.js（npm）も必要です。

Windows向けの導入手順は [docs/windows-nodejs-setup.md](docs/windows-nodejs-setup.md) を参照してください。

最短手順（PowerShell）:

```powershell
winget install OpenJS.NodeJS.LTS
node -v
npm -v
```

`node` / `npm` が認識されない場合は、VS Code とターミナルを再起動して再確認してください。

```bash
bundle install
bundle exec jekyll serve
```

起動後、以下を確認できます。

- ルート: `http://127.0.0.1:4000/`
- 日本語: `http://127.0.0.1:4000/ja/`
- 英語: `http://127.0.0.1:4000/en/`

## ディレクトリ概要

- `_config.yml`: サイト設定・テーマ・プラグイン
- `_data/navigation.yml`: ナビゲーション
- `ja/`, `en/`: 言語別ページ
- `_posts/`: ブログ投稿（`lang: ja` / `lang: en`）
- `assets/cv/`: CV PDF の配置先
- `assets/css/custom.css`: カスタムCSS
- `assets/js/custom.js`: カスタムJavaScript

## CV（PDF）運用

CVの編集元は以下のMarkdownです。

- `ja/cv.md`
- `en/cv.md`

PDFは以下のコマンドで自動生成されます。

```bash
npm install
npm run cv:pdf
```

出力先（GitHub Pagesで配信されるPDF）:

- `cv-ja.pdf`
- `cv-en.pdf`

正確な保存場所は `assets/cv/` です。

CVページは既にリンク済みです。

- `/ja/cv/`
- `/en/cv/`

GitHub上では `.github/workflows/generate-cv-pdf.yml` により、`cv.md` 更新時にPDFを自動再生成してコミットします。

## ブログ運用

`_posts/` に `YYYY-MM-DD-title.md` 形式で投稿を追加します。

必須 front matter 例:

```yaml
---
layout: single
title: "記事タイトル"
date: 2026-02-16 10:00:00 +0900
lang: ja
permalink: /ja/blog/your-slug/
---
```

英語記事は `lang: en` と `/en/blog/...` を使用します。

### front matter 自動雛形

以下で言語別の雛形付き投稿を自動生成できます。

```bash
ruby scripts/new_post.rb --lang ja --title "記事タイトル"
ruby scripts/new_post.rb --lang en --title "Post Title"
```

任意で `--slug` を指定できます。

```bash
ruby scripts/new_post.rb --lang ja --title "記事タイトル" --slug my-custom-slug
```

