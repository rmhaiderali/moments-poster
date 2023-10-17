var userAgent = navigator.userAgent || navigator.vendor || window.opera
var iOSBridge // Global iOS Bridge

// Definition of iOS JS Bridge initialization code
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge)
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback)
  }
  window.WVJBCallbacks = [callback]
  // window.alert("first")
  var WVJBIframe = document.createElement("iframe")
  WVJBIframe.style.display = "none"
  WVJBIframe.src = "https://__bridge_loaded__"
  document.documentElement.appendChild(WVJBIframe)
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe)
  }, 0)
}

/**
 * iOS initialization and registration of Native callback code
 * parametersJSON: JSON string passed from Unity
 */
if (/iPad|iPhone|iPod|Macintosh/.test(userAgent) && !window.MSStream) {
  // window.alert("iOS device init")
  setupWebViewJavascriptBridge(function (bridge) {
    // window.alert("iOS initialization")
    // Register the Native callback function for calling from Native to JS
    bridge.registerHandler(
      "IMSDKJSHandler",
      function (parametersJSON, responseCallback) {
        // Handle Native calls to JS with parametersJSON, ignore responseCallback
      }
    )
    // window.alert("Unity callback is coming")
    iOSBridge = bridge
  })
}
