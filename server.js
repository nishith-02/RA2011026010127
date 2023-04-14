const express=require('express');
const NodeCache = require( "node-cache" );
const axios=require("axios");


const app=express();
const myCache = new NodeCache();

let token;

app.listen(5000,(req,res)=>{
    console.log("Server is running on port 5000");
    console.log(myCache.get("Train Question"));
});

const generateToken=async(companyName)=>{
    try{
        let resp=await axios.post("http://localhost:3000/register",{
            companyName
        })
        // console.log(resp.data);
        let trains=another(companyName,resp.data.clientID,resp.data.clientSecret);
        return trains;
    }
    catch(error){
        console.log("error "+error);
    }
}

const another=async(companyName,clientID,clientSecret)=>{
    try{
        let resp=await axios.post("http://localhost:3000/auth",{
            companyName,
            clientID,
            clientSecret
        })
        // console.log(resp.data);
        let t=resp.data.access_token;
        let expires_in=resp.data.expires_in;
        token={
            t:t,
            expires_in:expires_in
        }
        // console.log(token);

        //cache the token and expires_in
        success=myCache.set(companyName,token);
        let trains=await axios.get("http://localhost:3000/trains",{headers:{
            Authorization:"Bearer "+token.t
        }})
        return trains.data;
        // console.log(success);


        // console.log(myCache.get("Train Question"));
    }
    catch(error){
        console.log("error "+error)
    }
}
// generateToken("Train Question");
app.get("/trains",async(req,res)=>{
    try{
        let date=new Date();
        if(myCache.get("Train Question")===undefined){
            let trains=await generateToken("Train Question");
            console.log("Inside first if")
            console.log(trains)
        let present_time_in_seconds=date.getHours()*3600+date.getMinutes()*60+date.getSeconds();
        let present_time_in_second_plus_30=present_time_in_seconds+30*60;
        trains=trains.filter((train)=>{
            let departure_time_in_seconds=train.departureTime.Minutes*60+train.departureTime.Hours*3600+train.departureTime.Seconds+train.delayedBy*60;
            if(departure_time_in_seconds>present_time_in_second_plus_30){
                return true;
            }
            return false;
        })
        let cl=req.query.cl
        trains=trains.sort((a,b)=>(a.price[cl]-b.price[cl])||(b.seatAvailable[cl]-a.seatAvailable[cl])||((b.departureTime.Minutes*60+b.departureTime.Hours*3600+b.departureTime.Seconds+b.delayedBy*60)-(a.departureTime.Minutes*60+a.departureTime.Hours*3600+a.departureTime.Seconds+a.delayedBy*60)))
            return res.send(trains)
        }
        if(myCache.get("Train Question")?.expires_in<=Math.floor(date.getTime()/1000)){
            let trains=await generateToken("Train Question");
            console.log("Inside second if")
        let present_time_in_seconds=date.getHours()*3600+date.getMinutes()*60+date.getSeconds();
        let present_time_in_second_plus_30=present_time_in_seconds+30*60;
        trains=trains.filter((train)=>{
            let departure_time_in_seconds=train.departureTime.Minutes*60+train.departureTime.Hours*3600+train.departureTime.Seconds+train.delayedBy*60;
            if(departure_time_in_seconds>present_time_in_second_plus_30){
                return true;
            }
            return false;
        })
        let cl=req.query.cl
        trains=trains.sort((a,b)=>(a.price[cl]-b.price[cl])||(b.seatAvailable[cl]-a.seatAvailable[cl])||((b.departureTime.Minutes*60+b.departureTime.Hours*3600+b.departureTime.Seconds+b.delayedBy*60)-(a.departureTime.Minutes*60+a.departureTime.Hours*3600+a.departureTime.Seconds+a.delayedBy*60)))
            return res.send(trains)
        }
        let resp=await axios.get("http://localhost:3000/trains",{headers:{
            Authorization:"Bearer "+myCache.get("Train Question").t
        }})
        console.log(myCache.get("Train Question"));
        let trains=resp.data;
        let present_time_in_seconds=date.getHours()*3600+date.getMinutes()*60+date.getSeconds();
        let present_time_in_second_plus_30=present_time_in_seconds+30*60;
        trains=trains.filter((train)=>{
            let departure_time_in_seconds=train.departureTime.Minutes*60+train.departureTime.Hours*3600+train.departureTime.Seconds+train.delayedBy*60;
            if(departure_time_in_seconds>present_time_in_second_plus_30){
                return true;
            }
            return false;
        })
        let cl=req.query.cl
        trains=trains.sort((a,b)=>(a.price[cl]-b.price[cl])||(b.seatAvailable[cl]-a.seatAvailable[cl])||((b.departureTime.Minutes*60+b.departureTime.Hours*3600+b.departureTime.Seconds+b.delayedBy*60)-(a.departureTime.Minutes*60+a.departureTime.Hours*3600+a.departureTime.Seconds+a.delayedBy*60)))
        res.send(trains);
    }
    catch(error){
        console.log(error)
    }
})
