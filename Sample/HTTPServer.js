"use strict";
const fs=require("fs");
const http=require("http");
const port=+process.argv[2]||80;
const rootPath=process.argv[3]||".";
const mimeType=
{
    ".css":"text/css",
    ".csv":"text/csv",
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
    let contentType;
    const urlPath=decodeURI(request.url);
    let sliceIndex=urlPath.indexOf("?");
    if(sliceIndex<0)sliceIndex=urlPath.length;
    let filePath=urlPath.slice(0,sliceIndex);
    const queryString=urlPath.slice(sliceIndex+1);
    try
    {
        if(fs.statSync(rootPath+filePath).isDirectory())filePath+="/index.html";
        if(fs.statSync(rootPath+filePath).isFile())
        {
            contentType=mimeType[filePath.slice(filePath.lastIndexOf(".")).toLowerCase()];
            if(contentType)response.setHeader("Content-Type",contentType);
            response.writeHead(200,"OK");
            fs.createReadStream(rootPath+filePath).pipe(response);
        }
        else throw null;
    }
    catch(error)
    {
        if(error)response.writeHead(404,"Not Found");
        else response.writeHead(500,"Internal Server Error");
        response.end();
    }
    finally
    {
        console.log("-".repeat(64));
        console.log("URL Path:",'"'+urlPath+'"');
        if(filePath!=urlPath)console.log("File Path:",'"'+filePath+'"');
        if(queryString)console.log("Query String:",'"'+queryString+'"');
        if(contentType)console.log("Content-Type:",'"'+contentType+'"');
        console.log("Status Code:",response.statusCode);
        console.log("Status Message:",'"'+response.statusMessage+'"');
    }
}).listen(port,()=>
{
    console.log("Origin:",port==80?"http://localhost/":"http://localhost:"+port+"/");
    console.log("Root Path:",'"'+rootPath+'"');
});