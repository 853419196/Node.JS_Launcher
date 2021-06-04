"use strict";
const fs=require("fs");
const http=require("http");
const path=require("path");
const defaultMIMEType="";
const port=+process.argv[2]||80;
const rootPath=process.argv[3]||".";
const indexFiles=["index.htm","index.html"];
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
    ".xml":"text/xml"
}
http.createServer(function(request,response)
{
    const urlPath=decodeURI(request.url);
    let contentType,pathName=urlPath,queryString="",sliceIndex=urlPath.indexOf("?");
    if(sliceIndex>=0)
    {
        pathName=urlPath.slice(0,sliceIndex);
        queryString=urlPath.slice(sliceIndex+1);
    }
    try
    {
        const filePath=rootPath+pathName;
        if(!fs.existsSync(filePath))throw false;
        else
        {
            let throws,appendPaths=[];
            if(!fs.statSync(filePath).isDirectory())
            {
                throws=true;
                appendPaths.push("");
            }
            else
            {
                throws=false;
                for(const indexFile of indexFiles)
                {
                    if(fs.existsSync(filePath+"/"+indexFile))appendPaths.push("/"+indexFile);
                }
            }
            for(const appendPath of appendPaths)
            {
                if(fs.statSync(filePath+appendPath).isFile())
                {
                    throws=null;
                    pathName+=appendPath;
                    contentType=mimeTypes[path.extname(pathName).toLowerCase()]||defaultMIMEType;
                    if(contentType)response.setHeader("Content-Type",contentType);
                    response.writeHead(200,"OK");
                    fs.createReadStream(filePath+appendPath).pipe(response);
                }
            }
            if(throws!=null)throw throws;
        }
    }
    catch(error)
    {
        if(!error)response.writeHead(404,"Not Found");
        else response.writeHead(500,"Internal Server Error");
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