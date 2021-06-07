"use strict";
const fs=require("fs");
const http=require("http");
const path=require("path");
const defaultMIMEType="";
const indexFiles=["index.htm","index.html"];
const port=+process.argv[2]||+process.argv[3]||80;
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
    ".wasm":"application/wasm",
    ".vtt":"text/vtt",
    ".xml":"text/xml"
};
http.createServer(function(request,response)
{
    const urlPath=decodeURI(request.url);
    let contentType,pathName,queryString="",sliceIndex=urlPath.indexOf("?");
    if(sliceIndex<0)pathName=path.posix.resolve(path.posix.sep,decodeURIComponent(urlPath));
    else
    {
        queryString=decodeURIComponent(urlPath.slice(sliceIndex+1));
        pathName=path.posix.resolve(path.posix.sep,decodeURIComponent(urlPath.slice(0,sliceIndex)));
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
                throws=null;
                pathName=path.posix.join(pathName,appendPath);
                contentType=mimeTypes[path.extname(pathName).toLowerCase()]||defaultMIMEType;
                if(contentType)response.setHeader("Content-Type",contentType);
                response.writeHead(200,http.STATUS_CODES["200"]);
                fs.createReadStream(path.join(rootPath,pathName)).pipe(response);
            }
            if(throws!=null)throw throws;
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
        console.log("-".repeat(64));
        console.log("URL Path:",'"'+urlPath+'"');
        if(pathName!=urlPath)console.log("Path Name:",'"'+pathName+'"');
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