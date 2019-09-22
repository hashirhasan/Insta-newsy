const request=require('request-promise')
const cheerio=require('cheerio')
const regularrequest=require('request')
const fs=require('fs')

const sample_data={
    FullName:"Shah Rukh Khan",
    Followers:18401545,
    Following:6,
    Profile_Pic_Url_Low:'https://instagram.fdel1-1.fna.fbcdn.net/vp/e04d15fc9246fa9f048c17624907f05a/5E000560/t51.2885-19/11821175_1046879962002756_496959586_a.jpg?_nc_ht=instagram.fdel1-1.fna.fbcdn.net',
    Profile_Pic_Url_Hd: 'https://instagram.fdel1-1.fna.fbcdn.net/vp/e04d15fc9246fa9f048c17624907f05a/5E000560/t51.2885-19/11821175_1046879962002756_496959586_a.jpg?_nc_ht=instagram.fdel1-1.fna.fbcdn.net' 
}

async function instadetailscrapper(insta_username){
const username=insta_username
const instaurl=`https://www.instagram.com/${username}`
try{
const result= await request.get(instaurl)

const $=await cheerio.load(result)
const script=$('script[type="text/javascript"]').eq(3).html();

const script_regex=/window._sharedData.=(.+);/g.exec(script);

const {entry_data:{ ProfilePage:{[0]:{graphql:{user}}}}}=JSON.parse(script_regex[1])
saveimagetodisk(user)
if(user.is_private)
{
    user.is_private ="Private";
}
else{
    user.is_private ="Public";
}
if(user.is_verified)
{
    user.is_verified ="Verified";
}
else{
    user.is_verified ="Not Verified";
}
let user_data={
    Account:user.is_private,
    Public_Figure:user.is_verified,
    FullName:user.full_name,
    Total_Posts:user.edge_owner_to_timeline_media.count,
    Followers:user.edge_followed_by.count,
    Following:user.edge_follow.count,
    Profile_Pic_Url_Low:user.profile_pic_url,
    Profile_Pic_Url_Hd:user.profile_pic_url_hd,
   
}

console.log({user_data})
console.log("\nIMAGES(Low and Hd Quality both) ARE DOWNLOADED TO THE 'images' FOLDER")
}catch(err){
  
  console.log("something went wrong or your username is incorrect")
}
}

async function saveimagetodisk(user)
{
    regularrequest.get(user.profile_pic_url).pipe(fs.createWriteStream(`Insta Profile Images/${user.username}_low.png`))
    regularrequest.get(user.profile_pic_url_hd).pipe(fs.createWriteStream(`Insta Profile Images/${user.username}_hd.png`))
}


instadetailscrapper("iamsrk")
