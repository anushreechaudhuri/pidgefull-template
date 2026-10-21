import { get, put } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';
import { readFileSync } from 'node:fs';
const manifest=JSON.parse(readFileSync(new URL('../public/card.json',import.meta.url),'utf8'));
const pathname=`cards${manifest.path}.json`;
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method==='GET'){
  try{const result=await get(pathname,{access:'private',useCache:false});if(!result)return res.status(404).json({error:'No published update yet'});return res.status(200).json(JSON.parse(await new Response(result.stream).text()));}
  catch(error){console.error('Published card read failed',error.name);return res.status(503).json({error:'Published card temporarily unavailable'});}
 }
 if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return res.status(405).end();}
 const supplied=Buffer.from((req.headers.authorization||'').replace(/^Bearer /,''));const expected=Buffer.from(process.env.CARD_PUBLISH_KEY||'');
 if(!expected.length||supplied.length!==expected.length||!timingSafeEqual(supplied,expected))return res.status(401).json({error:'Open your private editor link to publish.'});
 let input=req.body;try{if(typeof input==='string')input=JSON.parse(input);}catch{return res.status(400).json({error:'Invalid card'});}
 if(!input||input.schema!==2||!input.captions||typeof input.captions!=='object')return res.status(400).json({error:'Invalid card'});
 const data={schema:2,captionRevision:3,publishedAt:new Date().toISOString(),captions:{}};
 for(const [key,max] of [['front',160],['message',1800],['recipient',80]]){if(typeof input[key]!=='string'||input[key].length>max)return res.status(400).json({error:'Invalid text length'});data[key]=input[key];}
 for(const {id} of manifest.photos){const value=input.captions[id];if(typeof value!=='string'||value.length>220)return res.status(400).json({error:'Every photo needs a caption value (empty is allowed)'});data.captions[id]=value;}
 try{await put(pathname,JSON.stringify(data),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'});return res.status(200).json(data);}
 catch(error){console.error('Card publish failed',error.name);return res.status(503).json({error:'Could not publish. Your browser draft is still saved.'});}
}
