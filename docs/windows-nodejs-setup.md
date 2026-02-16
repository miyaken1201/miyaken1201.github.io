# WindowsでのNode.js / npm導入手順

このプロジェクトでは、CV PDFのローカル生成に Node.js と npm を使用します。

## 1) 推奨: wingetでLTS版を導入

PowerShellを「通常ユーザー」または「管理者」で開いて実行します。

```powershell
winget install OpenJS.NodeJS.LTS
```

インストール後、**VS Codeとターミナルを再起動**してバージョン確認します。

```powershell
node -v
npm -v
```

## 2) wingetが使えない場合（公式インストーラー）

1. https://nodejs.org/ にアクセス
2. **LTS版**のWindows Installer（`.msi`）をダウンロード
3. インストーラーを実行（基本はデフォルト設定でOK）
4. VS Codeとターミナルを再起動
5. `node -v` と `npm -v` で確認

## 3) このリポジトリでの利用手順

リポジトリルートで以下を実行します。

```powershell
npm install
npm run cv:pdf
```

生成物:

- `assets/cv/cv-ja.pdf`
- `assets/cv/cv-en.pdf`

## 4) よくあるエラーと対処

### `npm` が認識されない

- いちど全てのターミナルを閉じ、VS Codeを再起動
- それでもだめならPowerShellでPATH確認

```powershell
$env:Path
Get-Command node
Get-Command npm
```

`Get-Command` が見つからない場合は、Node.js再インストール後に再起動してください。

### `npm install` が失敗する

- プロキシ環境の有無を確認
- 企業ネットワークの場合は必要に応じて npm のプロキシ設定を追加

```powershell
npm config set proxy http://<proxy-host>:<port>
npm config set https-proxy http://<proxy-host>:<port>
```

不要な場合は次で解除できます。

```powershell
npm config delete proxy
npm config delete https-proxy
```
