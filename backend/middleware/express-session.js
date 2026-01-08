app.use(
  session({
    secret: 'super_secret_key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 // 1 oră
    }
  })
);
sessionStore.sync();
