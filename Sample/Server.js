"use strict";
const fs=require("fs");
const http=require("http");
const rootPath=process.argv[2]||".";
const mimeType=
{
    ".css":"text/css",
    ".htm":"text/html",
    ".html":"text/html",
    ".js":"text/javascript",
    ".json":"application/json",
    ".pdf":"application/pdf",
    ".svg":"image/svg+xml",
    ".txt":"text/plain",
    ".xml":"text/xml"
}
http.createServer(function(request,response)
{
    let filePath=request.url;
    try
    {
        if(fs.statSync(rootPath+filePath).isDirectory())filePath+="/index.html";
        if(fs.statSync(rootPath+filePath).isFile())
        {
            let contentType=mimeType[filePath.slice(filePath.lastIndexOf(".")).toLowerCase()]||"application/octet-stream";
            response.setHeader("Content-Type",contentType);
            response.writeHead(200);
            fs.createReadStream(rootPath+filePath).pipe(response);
            console.log("File Path:",filePath);
            console.log("Content-Type:",contentType);
        }
        else throw null;
    }
    catch(error)
    {
        response.writeHead(404);
        response.end();
        console.log("[Error]","File Path:",filePath);
    }
}).listen(80);
console.log("http://localhost/");
console.log("Root Path:",rootPath);