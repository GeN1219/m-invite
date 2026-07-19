-- =============================================
-- 結婚式 出欠フォーム用 Supabase セットアップSQL
-- （お買い物リストで使っていたのと同じプロジェクトの SQL Editor で実行してください）
-- =============================================

-- 出欠回答テーブル
CREATE TABLE wedding_rsvp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance TEXT NOT NULL,          -- 出席 / 欠席
    guest_side TEXT,                   -- 新郎側 / 新婦側
    name TEXT NOT NULL,                -- お名前
    kana TEXT,                         -- ふりがな
    contact TEXT,                      -- 連絡先
    allergy TEXT,                      -- アレルギー・苦手な食材
    message TEXT,                      -- メッセージ
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS を有効化：ゲスト（anon キー）は「送信のみ」可能
-- 他人の回答の閲覧・変更・削除は一切できない
ALTER TABLE wedding_rsvp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_only" ON wedding_rsvp
    FOR INSERT TO anon
    WITH CHECK (true);

-- ※ SELECT ポリシーは作らないこと（回答の閲覧は Supabase ダッシュボードの
--   Table Editor からのみ行う）
