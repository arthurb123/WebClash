//Asynchronous HTTP GET

function httpGet(url, async, callback)
{
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    };

    xmlHttp.open("GET", client.fullAddress+url, async);
    xmlHttp.send(null);
}

//Clear method that wipes all children
//of a HTML element (superior innerHTML emptying)

HTMLElement.prototype.clear = function () { 
    while (this.firstChild)
        this.removeChild(this.firstChild);
}