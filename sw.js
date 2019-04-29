importScripts('js/sw-util.js');

const STATIC_CACHE      = 'static-v4';
const DYNAMIC_CACHE     = 'dynamic-v2';
const INMUTABLE_CACHE   = 'inmutable-v1';

// Lo minimo para mi APP
const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-util.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache=>{
            cache.addAll(APP_SHELL);
        });

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache=>{
            cache.addAll(APP_SHELL_INMUTABLE);
        });
    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e =>{
   
    const respuesta = caches.keys()
    .then(keys =>{
    keys.forEach(key =>{
        if(key !== STATIC_CACHE && key.includes('static')){
            return caches.delete(key);
        }
        
        if(key !== DYNAMIC_CACHE && key.includes('dynamic')){
            return caches.delete(key);
        }


        });
    });

   e.waitUntil( respuesta );

});

// 2- Cache with Network Fallback
self.addEventListener(	'fetch',e =>{

    const respuesta = caches.match( e.request )
        .then( res => {
            if ( res ) {
            return res;
            // No existe el archivo
            // tengo que ir a la web
            }else{
            return fetch( e.request ).then( newResp => {
               /*  caches.open( DYNAMIC_CACHE )
                    .then( cache => {
                        cache.put( e.request, newResp );
                        limpiarCache( DYNAMIC_CACHE, 50 );
                    }); */

                return actualizacacheDinamico(DYNAMIC_CACHE,e.request,newResp);
                //newResp.clone();
            });
/*             .catch( err => {

                if(e.request.headers.get('accept').includes('text/html'))
                {
                    return caches.match('/pages/offline.html');
                 }
            }); */
        }
        });

    e.respondWith( respuesta );
});