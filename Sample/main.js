"use strict";
const readline=require("readline");
const stdio=readline.createInterface({input:process.stdin,output:process.stdout});
stdio.on("line",/** @param {String} read */read=>
{
    console.log(read);
});
stdio.on("close",()=>
{
    console.log("Hello, World!");
});