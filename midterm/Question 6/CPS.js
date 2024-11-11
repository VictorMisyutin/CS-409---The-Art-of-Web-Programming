var color = 'blue'
function fetchColorAndSetButtonColor(url, ret) {
    const req = new XMLHttpRequest();
    req.addEventListener("load", function () {
        const color = JSON.parse(this.responseText).color;
        ret(color);  
    });
    req.open("GET", url);
    req.send();
}

function setButtonColorWithCPS(color) {
    setButtonColor(color);  
}

fetchColorAndSetButtonColor("/getColor", function(color) {
    setButtonColor(color); 
});
