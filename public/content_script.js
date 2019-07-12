(function(){
    
    /* Open port on popup file */
    const port = chrome.runtime.connect({
        name: "bookmarkArranger"
    });
    
    /* Listen for messages on the port */
    port.onMessage.addListener(message => {
       console.log(message)
    });

    document.getElementById('sendMessage').addEventListener('click', ()=>{
        /* Send a message through the port */
        port.postMessage({
            code: "getBookMarks"
        });
    })
    



})();




