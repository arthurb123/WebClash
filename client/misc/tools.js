function httpGetAsync(url, callback)
{
    let xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    };

    xmlHttp.open("GET", location.href+url, true);
    xmlHttp.send(null);
}