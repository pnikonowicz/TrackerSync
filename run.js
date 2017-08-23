console.log("starting")

function main_init() {

  var s = document.createElement('script');
  s.src = chrome.extension.getURL('main.js');

  s.onload = function() {
    console.log("loaded")
    var s = document.createElement('script');
    var code = "console.log('running main'); main()"
    s.textContent = code
    s.onload = function() {
      console.log("loaded")
    };
    (document.head || document.documentElement).appendChild(s);
  };
  (document.head || document.documentElement).appendChild(s);
}

main_init()
popup_init()
