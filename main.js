const readline=require("readline");
const stdio=readline.createInterface({input:process.stdin,output:process.stdout});
stdio.on("line",/** @param {String} read */function(read)
{
    console.log(read);
});
stdio.on("close",function()
{
    console.log("Hello, World!");
});