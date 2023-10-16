'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "c69fc5876f9cc96cd0d57ac5df90662c",
"index.html": "6d6b4a0c10031db1b09aba6295f2a761",
"/": "6d6b4a0c10031db1b09aba6295f2a761",
"main.dart.js": "1a61188876049c354efa77eeb11e4d79",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "1e11802e0c2941e03bcf6ebee73ca695",
"assets/AssetManifest.json": "84a64cff2239f193c82117ed32779aa9",
"assets/NOTICES": "102cf8b1d63d6ea837eb52f203920787",
"assets/FontManifest.json": "361811655b42422128d7b17428bbcd07",
"assets/AssetManifest.bin.json": "7b6724c3614464d5215ff5eff1ae1e42",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "c38f77a07f79258f527cf84175dbe95a",
"assets/fonts/MaterialIcons-Regular.otf": "d8155d5928c0dd65b9d11a85607da0b5",
"assets/assets/images/esfj.png": "1b83ff0f73bb007d07178fd2f7b0aca0",
"assets/assets/images/isfj.png": "3155432c2dd7bd85eeb087c86f50fff9",
"assets/assets/images/infj.png": "0f45946b0e3bb52dd30a5d0086d8e699",
"assets/assets/images/enfj.png": "e234f5076295b8b546b5f71010328c96",
"assets/assets/images/intj.png": "860fa7ebceb718ec7ba81c78aa2ac114",
"assets/assets/images/entj.png": "61af02fc4cfc63f89804c2aa9dc08b0f",
"assets/assets/images/estj.png": "2c84310adc7989c7446bdb195dabb91b",
"assets/assets/images/istj.png": "4bc9526c2e028e4964b906c0f20b0e21",
"assets/assets/images/istp.png": "bc73a4d6d467f584433c9bd20057ddb5",
"assets/assets/images/estp.png": "b42f01f55f7fd23b3bb74c2e2ff76c11",
"assets/assets/images/logo.png": "6c9e9a32aa4eb875ce45c464bdd3f603",
"assets/assets/images/entp.png": "0cc5d3cf3ff2b16f611e7ead081caac5",
"assets/assets/images/intp.png": "c95f1aeb57e4d9eaff42876977e04891",
"assets/assets/images/enfp.png": "9ff4f020b3770fea84d3b8d0d3aedee0",
"assets/assets/images/option_bokki.png": "f974c8b15be4dd6a7b8cc77062fdf85a",
"assets/assets/images/infp.png": "80d7a0ffee38a63bbf449bcf9df104d0",
"assets/assets/images/list_icon.png": "e95074ed2515ec02180b1017a4e30c1f",
"assets/assets/images/isfp.png": "fa7899aec86b56c8e370319913d5819e",
"assets/assets/images/esfp.png": "f9d639639940e3403674bd295bf31f4b",
"assets/assets/fonts/Pretendard-Regular.otf": "97b362437880d5cbb01b9305136909ac",
"assets/assets/fonts/Pretendard-Medium.otf": "d88ea6aec529d8945a09a582be9200a2",
"assets/assets/fonts/Pretendard-Light.otf": "7074e726e0701102a10f0843961e28b6",
"assets/assets/fonts/Pretendard-SemiBold.otf": "0bfe99ca0a0e757d2f997561b4b3a020",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "81a4f1b8cca113574cd038a67deef3ae",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "ac6446f753316635b4290bf767d4eb23",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "3b0c5a669e87a380eee13c0fabfa0667",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
