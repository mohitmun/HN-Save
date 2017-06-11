saved_ids = localStorage.getItem("saved_ids")
if(saved_ids == null){
  console.log("saved_ids")
  localStorage.setItem("saved_ids", "[]")
}
chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.action == "getItem"){
    sendResponse(localStorage.getItem(message.key))
  }else if(message.action == "setItem"){
    localStorage.setItem(message.key, message.value)
  }else if(message.action == "removeItem"){
    localStorage.removeItem(message.key)
  }
});