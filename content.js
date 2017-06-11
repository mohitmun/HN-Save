
function init(){
  chrome.runtime.sendMessage({key: "saved_ids",action: "getItem"}, function(response) {
    saved_ids = JSON.parse(response);
    setup_save_div(saved_ids)
  });
}
function setup_save_div(saved_ids) {
  $(".pagetop").append(" | ");
  $(".pagetop").append("<a href='?saved=true'> saved</a>");
  $(".subtext").each(function() {
    score_div_id = $(this).find(".score").attr("id")
    if(score_div_id){
      post_id = parseInt(score_div_id.split("_")[1])
      index = $.inArray(post_id, saved_ids)
      if(index == -1){
        saved = false
        text = "save"
      }else{
        saved = true
        text = "unsave"
      }
      save_element = jQuery('<a/>', {
        class: 'save',
        text: text,
        "data-post-id": post_id,
        style: "cursor: pointer;"
      });
      $(this).append(" | ");
      $(this).append(save_element);
    }
  });
}

$(document).on("click", ".save", function() {
  current_element = this
  
  chrome.runtime.sendMessage({key: "saved_ids", action: "getItem"}, function(response) {
    saved_ids = JSON.parse(response);
    post_id = parseInt($(current_element).data("post-id"))
    index = saved_ids.indexOf(post_id)
    if (index > -1) {
      saved_ids.splice(index, 1);
      console.log("saved_ids")
      console.log(saved_ids)
      $(current_element).text("save")
      chrome.runtime.sendMessage({key: post_id, action: "removeItem"}, function(response) {});
    }else{
      saved_ids.push(post_id)
      $(current_element).text("unsave");
      tr_parent = $(current_element).parents("tr")[0]
      tr_up = $(tr_parent).prev().get(0)
      tr_down = $(tr_parent).next().get(0)
      post_html = tr_up.outerHTML + tr_parent.outerHTML + tr_down.outerHTML;
      chrome.runtime.sendMessage({key: post_id, value: post_html, action: "setItem"}, function(response) {});
    }
    chrome.runtime.sendMessage({key: "saved_ids", value: JSON.stringify(saved_ids),action: "setItem"}, function(response) {});
  }); 
});
window.onload = init;
if (window.location.href.indexOf("saved=true") > -1){
  result = ""
  chrome.runtime.sendMessage({key: "saved_ids",action: "getItem"}, function(response) {
    saved_ids = JSON.parse(response);
    for (var i = saved_ids.length - 1; i >= 0; i--) {
      chrome.runtime.sendMessage({key: saved_ids[i],action: "getItem"}, function(response) {
        result = result + response
        $(".itemList").html(result)
      });
    }
  });
}