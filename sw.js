// Family Feed push notifications service worker.
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { /* ignore */ }
  const title = data.title || 'Family Feed';
  const options = {
    body: data.body || '',
    data: { url: data.url || './' },
    tag: data.tag || 'family-feed'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || './', self.registration.scope).href;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        try {
          if (new URL(c.url).origin === new URL(target).origin) {
            if ('navigate' in c) return c.navigate(target).then(cc => cc.focus());
            return c.focus();
          }
        } catch (e) { /* ignore */ }
      }
      return clients.openWindow(target);
    })
  );
});
