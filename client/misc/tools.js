//Asynchronous HTTP GET

function httpGetAsync(url, callback)
{
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    };

    xmlHttp.open("GET", client.fullAddress+url, true);
    xmlHttp.send(null);
}