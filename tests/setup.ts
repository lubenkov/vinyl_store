process.env.DATABASE_HOST ??= 'localhost';
process.env.DATABASE_PORT ??= '3306';
process.env.DATABASE_USER ??= 'test';
process.env.DATABASE_PASSWORD ??= 'test';
process.env.DATABASE_NAME ??= 'vinyl_store_test';
process.env.JWT_SECRET ??= 'test_jwt_secret';
process.env.STRIPE_SECRET_KEY ??= 'sk_test_dummy';
process.env.EMAIL_SERVICE ??= 'gmail';
process.env.EMAIL_USER ??= 'test@example.com';
process.env.EMAIL_PASS ??= 'test_email_password';
process.env.GOOGLE_CLIENT_ID ??= 'test_google_client_id';
process.env.GOOGLE_CLIENT_SECRET ??= 'test_google_client_secret';
process.env.GOOGLE_CALLBACK_URL ??=
    'http://localhost:3000/auth/google/callback';
process.env.TELEGRAM_BOT_TOKEN ??= 'test_telegram_bot_token';
process.env.TELEGRAM_CHAT_ID ??= 'test_telegram_chat_id';
process.env.DISCOGS_KEY ??= 'test_discogs_key';
process.env.DISCOGS_SECRET ??= 'test_discogs_secret';
