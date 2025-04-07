const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// メール送信の設定
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

// メール送信関数
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // 認証チェック
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', '認証が必要です。');
  }

  const { to, subject, text } = data;

  try {
    await transporter.sendMail({
      from: functions.config().email.user,
      to,
      subject,
      text
    });

    return { success: true };
  } catch (error) {
    console.error('メール送信エラー:', error);
    throw new functions.https.HttpsError('internal', 'メール送信に失敗しました。');
  }
}); 