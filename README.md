# Wedding Invitation — Gen & Ayano

結婚式（2026.11.15 アニヴェルセル白壁）の招待サイト。
本体サイト（[m-cla](https://github.com/GeN1219/m-cla)）から切り分けた独立サイトです。

公開URL: https://gen1219.github.io/m-invite/

## 構成

- `index.html` — 招待状（ご挨拶 / カウントダウン / ご案内 / ギャラリー / 出欠フォーム）
- `assets/` — m-cla と共通のデザインシステム
- `pic/hero.jpg` — ヒーロー写真（**前撮り後に差し替え予定**）
- `pic/us1〜3.jpg` — ギャラリー写真（**前撮り後に差し替え予定**）
- `supabase-rsvp-setup.sql` — 出欠テーブル作成SQL

## 出欠フォームのセットアップ（初回のみ）

1. [Supabase](https://supabase.com/) のダッシュボードを開く（お買い物リストで使っていたプロジェクト）
2. SQL Editor で `supabase-rsvp-setup.sql` の内容を実行
3. 以降、回答は Table Editor → `wedding_rsvp` テーブルで確認できます

### セキュリティについて

`index.html` に書かれている anon key は公開して良い設計のキーです。
`wedding_rsvp` テーブルは RLS（Row Level Security）で **INSERT のみ許可**しているため、
ゲストは回答を送信できますが、他の方の回答を閲覧・変更・削除することはできません。
回答一覧は Supabase ダッシュボードからのみ確認できます。

## 更新するとき

- **締切日**: `index.html` の `RSVP_DEADLINE_TEXT`
- **写真**: `pic/` の4枚を差し替え（ファイル名はそのまま）
