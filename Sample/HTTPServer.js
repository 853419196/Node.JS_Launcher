"use strict";
const fs=require("fs");
const http=require("http");
const path=require("path");
const indexFiles=["index.htm","index.html"];
const port=+process.argv[2]||+process.argv[3]||80;
const defaultMIMEType="";//"application/octet-stream";
const rootPath=path.resolve(path.join((+process.argv[2]?process.argv[3]:process.argv[2])||".",path.sep));
const mimeTypes=
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
    ".vtt":"text/vtt",
    ".wasm":"application/wasm",
    ".xml":"text/xml"
};
http.createServer((message,response)=>
{
    const urlPath=decodeURI(message.url);
    const searchIndex=urlPath.indexOf("?");
    let contentType,pathName,queryString="";
    if(searchIndex<0)pathName=path.posix.resolve(path.posix.sep,decodeURIComponent(urlPath));
    else
    {
        queryString=urlPath.slice(searchIndex+1);
        pathName=path.posix.resolve(path.posix.sep,decodeURIComponent(urlPath.slice(0,searchIndex)));
    }
    try
    {
        const basePath=path.join(rootPath,pathName);
        if(!fs.existsSync(basePath))throw false;
        else
        {
            let appendPath,appendPaths=[""],throws=true;
            if(fs.statSync(basePath).isDirectory())
            {
                throws=false;
                appendPaths=indexFiles.filter(indexFile=>fs.existsSync(path.join(basePath,indexFile)));
            }
            if((appendPath=appendPaths.find(appendPath=>fs.statSync(path.join(basePath,appendPath)).isFile()))!=null)
            {
                pathName=path.posix.join(pathName,appendPath);
                if(contentType=mimeTypes[path.extname(pathName).toLowerCase()]||defaultMIMEType)response.setHeader("Content-Type",contentType);
                response.writeHead(200,http.STATUS_CODES["200"]);
                fs.createReadStream(path.join(rootPath,pathName)).pipe(response);
            }
            else throw throws;
        }
    }
    catch(error)
    {
        if(!error)response.writeHead(404,http.STATUS_CODES["404"]);
        else response.writeHead(500,http.STATUS_CODES["500"]);
        response.end();
    }
    finally
    {
        console.log("Method:",`"${message.method}"`);
        console.log("URL Path:",`"${urlPath}"`);
        if(pathName!=urlPath)console.log("Path Name:",`"${pathName}"`);
        if(queryString)console.log("Query String:",`"${queryString}"`);
        if(response.headersSent)
        {
            console.log("-".repeat(32));
            console.log("Status Code:",response.statusCode);
            console.log("Status Message:",`"${response.statusMessage}"`);
            if(contentType=response.getHeader("Content-Type"))console.log("Content-Type:",`"${contentType}"`);
        }
        console.log("-".repeat(64));
    }
}).listen(port,()=>
{
    console.log("Origin:",port==80?"http://localhost/":`http://localhost:${port}/`);
    console.log("Root Path:",`"${rootPath}"`);
    console.log("-".repeat(64));
});