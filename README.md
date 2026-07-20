# Wedding Invitation — Gen & Ayano

結婚式（2026.11.15 アニヴェルセル白壁）の招待サイト。
本体サイト（[m-cla](https://github.com/GeN1219/m-cla)）から切り分けた独立サイトです。

公開URL: https://gen1219.github.io/m-invite/

## 構成

- `index.html` — 招待状（ご挨拶 / カウントダウン / ご案内 / ギャラリー / 出欠フォーム）
- `assets/` — m-cla と共通のデザインシステム
- `pic/hero1〜4.jpg` — ヒーローのスライドショー写真（衣装合わせ・**前撮り後に差し替え予定**）
- `pic/memories/mem01〜12.jpg` — 「ふたりのこと」でランダム表示する思い出写真
- `gas-rsvp.gs` — 出欠フォーム受信用の Google Apps Script

## 出欠フォームの仕組み

フォーム送信 → **Google Apps Script のウェブアプリ** が受け取り、次の3つに振り分けます。

1. Google スプレッドシートに1行追記（＝Excel でダウンロード可）
2. 指定メールアドレスに通知
3. LINE 公式アカウントに通知（友だち追加した全員に届く broadcast）

- 送信先URLは `index.html` の `RSVP_ENDPOINT` に設定
- 受信スクリプトの本体は `gas-rsvp.gs`（スプレッドシートの拡張機能 → Apps Script に貼り付け済み）
- メール宛先・LINEトークンは Apps Script 側の `NOTIFY_EMAIL` / `LINE_TOKEN` に設定

### セキュリティ・プライバシー

- ウェブアプリの公開範囲は「全員（匿名）」。ゲストは送信のみで、回答一覧は閲覧できません
- 回答の確認は、自分の Google スプレッドシート（＝あなたのアカウント内）で行います
- LINE 公式アカウントのIDは**人に教えないこと**（友だち全員にRSVP通知が届くため、二人だけで使う）

## 更新するとき

- **締切日**: `index.html` の `RSVP_DEADLINE_TEXT`
- **ヒーロー写真**: `pic/hero*.jpg` を差し替え、`index.html` の `HERO_SLIDES` を調整
- **思い出写真**: `pic/memories/` に追加し、`index.html` の `MEMORIES` に1行足す
- **フォーム送信先**: `index.html` の `RSVP_ENDPOINT`（GASを再デプロイしてURLが変わった場合）
