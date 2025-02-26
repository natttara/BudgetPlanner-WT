// PWA support
const CACHE_NAME = 'budget-planner-pwa-cache-v1';
const FILES_TO_CACHE = [
 '/BudgetPlanner-WT/',
 '/BudgetPlanner-WT /index.html',
 '/BudgetPlanner-WT /app.html',
 '/BudgetPlanner-WT /style.css',
 '/BudgetPlanner-WT /index.js',
 '/BudgetPlanner-WT /app.js',
 '/BudgetPlanner-WT /manifest.json',
 '/BudgetPlanner-WT /icons/icon-128.png',
 '/BudgetPlanner-WT /icons/icon-512.png'
];
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(FILES_TO_CACHE))
    );
});
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
});