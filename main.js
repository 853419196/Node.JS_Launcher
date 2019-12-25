const readline=require("readline").createInterface({input:process.stdin,output:process.stdout});
readline.on("line",/** @param {String} read */function(read)
{
    console.log(read);
});
readline.on("close",function()
{
    console.log("Hello, World!");
});