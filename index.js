const request=require('request-promise')
const cheerio=require('cheerio')
const regularrequest=require('request')
const fs=require('fs')
// const Nightmare=require('nightmare')


const sample_data={
    FullName:"roster",
    Followers:345,
    Following:641,
    profile_pic_url:" ",
    profile_pic_url_hd:" "
}

async function instadetailscrapper(instaname){
const username=instaname
const instaurl=`https://www.instagram.com/${username}`

const result= await request.get(instaurl)

const $=await cheerio.load(result)
const script=$('script[type="text/javascript"]').eq(3).html();

const script_regex=/window._sharedData.=(.+);/g.exec(script);

const {entry_data:{ ProfilePage:{[0]:{graphql:{user}}}}}=JSON.parse(script_regex[1])
saveimagetodisk(user)
let user_data={
    FullName:user.full_name,
    Followers:user.edge_followed_by.count,
    Following:user.edge_follow.count,
    profile_pic_url:user. profile_pic_url,
    profile_pic_url_hd:user.profile_pic_url_hd
}

console.log(user_data)

}

async function saveimagetodisk(user)
{
    regularrequest.get(user.profile_pic_url).pipe(fs.createWriteStream(`images/${user.username}_low.png`))
    regularrequest.get(user.profile_pic_url_hd).pipe(fs.createWriteStream(`images/${user.username}_hd.png`))
}


instadetailscrapper("iamsrk")
