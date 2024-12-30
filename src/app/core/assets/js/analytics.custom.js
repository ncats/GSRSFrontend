var ga4JsLoaderRef=(function ()
	{
    var o = {};
    o.ga4LoadJs = function(args) {
      if(!(typeof args !== 'undefined' && args && args.GTAG_ID && args.GTAG_MGR_ID)) { 
        return o;
      }
      var gtagUrl = 'https://www.googletagmanager.com/gtag/js?id=' + args.GTAG_ID;
      let scriptElement = document.createElement('script');
      scriptElement.setAttribute('src', gtagUrl);
      scriptElement.setAttribute('type', 'text/javascript');
      scriptElement.setAttribute('async', true);
      document.head.appendChild(scriptElement);
      // success event 
      scriptElement.addEventListener('load', () => {
        console.log('Analytics script loaded.');
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());  gtag('config', args.GTAG_ID);
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer', args.GTAG_MGR_ID); 
      });
      // error event
      scriptElement.addEventListener('error', (event) => {
        console.log('Error on loading GA4 remove script', event);
      });
    }
    return o;
  });

// var gsrs_ga4LoadJs_args = {
//   'GTAG_ID': '',
//   'GTAG_MGR_ID': ''
// }

if(typeof gsrs_ga4LoadJs_args !== 'undefined') { 
  gsrs_ga4LoadJs = ga4JsLoaderRef();
  gsrs_ga4LoadJs.ga4LoadJs(gsrs_ga4LoadJs_args); 
}