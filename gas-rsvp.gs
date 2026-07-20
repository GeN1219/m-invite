/**
 * 結婚式 出欠フォーム — 受信スクリプト（Google Apps Script）
 *
 * 招待サイトのフォームから送信された内容を
 *   ① Googleスプレッドシートに1行追記（＝Excelでダウンロード可）
 *   ② 指定メールアドレスに通知
 *   ③ LINE公式アカウントに通知（友だち全員に届く broadcast）
 * します。
 *
 * ▼ 使い方は同じフォルダの README（出欠通知セクション）を参照。
 *   下の【　】部分だけ自分の値に書き換えてください。
 */

// ① 通知を受け取るメールアドレス（カンマ区切りで複数可）
const NOTIFY_EMAIL = '【あなたのメールアドレス】';

// ② LINEチャネルアクセストークン（LINE公式アカウント > Messaging API で発行）
//    LINEに通知しない場合は空文字 '' のままでOK（メールとシートだけ動きます）
const LINE_TOKEN = '【LINEチャネルアクセストークン】';

// ---- ここから下は編集不要 --------------------------------------------

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('回答');
    if (!sheet) sheet = ss.insertSheet('回答');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['受信日時', '出欠', 'ゲスト区分', 'お名前', 'ふりがな', '連絡先', 'アレルギー', 'メッセージ']);
      sheet.setFrozenRows(1);
    }

    const now = new Date();
    sheet.appendRow([
      now,
      data.attendance || '',
      data.guest_side || '',
      data.name || '',
      data.kana || '',
      data.contact || '',
      data.allergy || '',
      data.message || ''
    ]);

    // ② メール通知
    if (NOTIFY_EMAIL && NOTIFY_EMAIL.indexOf('【') === -1) {
      const subject = '【出欠】' + (data.attendance || '') + '：' + (data.name || '') + ' 様';
      const body = [
        '出欠　　：' + (data.attendance || ''),
        'ゲスト区分：' + (data.guest_side || ''),
        'お名前　：' + (data.name || ''),
        'ふりがな：' + (data.kana || ''),
        '連絡先　：' + (data.contact || ''),
        'アレルギー：' + (data.allergy || ''),
        'メッセージ：' + (data.message || ''),
        '',
        '受信：' + Utilities.formatDate(now, 'Asia/Tokyo', 'yyyy/MM/dd HH:mm')
      ].join('\n');
      MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
    }

    // ③ LINE通知（broadcast：この公式アカウントを友だち追加した全員に届く）
    if (LINE_TOKEN && LINE_TOKEN.indexOf('【') === -1 && LINE_TOKEN !== '') {
      let text = '💌 出欠のご返信\n\n'
        + (data.attendance || '') + '｜' + (data.guest_side || '') + '\n'
        + 'お名前：' + (data.name || '');
      if (data.allergy) text += '\nアレルギー：' + data.allergy;
      if (data.message) text += '\nメッセージ：' + data.message;
      UrlFetchApp.fetch('https://api.line.me/v2/bot/message/broadcast', {
        method: 'post',
        contentType: 'application/json',
        headers: { 'Authorization': 'Bearer ' + LINE_TOKEN },
        payload: JSON.stringify({ messages: [{ type: 'text', text: text }] }),
        muteHttpExceptions: true
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    if (NOTIFY_EMAIL && NOTIFY_EMAIL.indexOf('【') === -1) {
      MailApp.sendEmail(NOTIFY_EMAIL, '【出欠フォーム】エラー発生',
        String(err) + '\n\n' + (e && e.postData ? e.postData.contents : '(no data)'));
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: false }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 動作テスト用：Apps Scriptエディタで実行すると、テスト行が1件入って通知が飛びます
function testSubmit() {
  doPost({ postData: { contents: JSON.stringify({
    attendance: '出席', guest_side: '新郎側', name: 'テスト 太郎',
    kana: 'てすと たろう', contact: 'test@example.com',
    allergy: 'えび（エキスも不可）', message: '楽しみにしています！'
  }) } });
}
