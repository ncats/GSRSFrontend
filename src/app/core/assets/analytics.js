var ga4JsLoaderRef=(function ()
	{

    GTAG_ID='G-X1SV8VR8HF';
    GTAG_MGR_ID='GTM-PH5W9VQ8';

    var o = {};

    o.ga4LoadJs = function(FILE_URL, async = true) {
    let scriptEle = document.createElement("script");
    scriptEle.setAttribute("src", FILE_URL);
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("async", async);
    document.head.appendChild(scriptEle);

    // success event 
    scriptEle.addEventListener("load", () => {
      console.log("File loaded");
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());  gtag('config', GTAG_ID);
  
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer', GTAG_MGR_ID); 
    });
     // error event
    scriptEle.addEventListener("error", (ev) => {
      console.log("Error on loading GA4 remove script", ev);
    });
  }
  return o;
});

var _ga4JsLoaderRef = ga4JsLoaderRef();

_ga4JsLoaderRef.ga4LoadJs("https://www.googletagmanager.com/gtag/js?id=G-X1SV8VR8HF", true);