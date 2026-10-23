import {get,put} from '@vercel/blob';
import {createHmac,timingSafeEqual} from 'node:crypto';
import {readFileSync} from 'node:fs';
const cards=JSON.parse(readFileSync(new URL('../public/stationery-cards.json',import.meta.url),'utf8'));
const fields=['recipient','sender','front','message','photo','photoAlt'];
function defaults(card){return Object.fromEntries(fields.map(key=>[key,card[key]||'']));}
function validPhoto(value,card){
 if(value===''||value===card.photo)return true;
 const match=/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(value);if(!match||value.length>2400000)return false;
 const b=Buffer.from(match[2],'base64');return match[1]==='jpeg'?b[0]===255&&b[1]===216:match[1]==='png'?b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP';
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 const slug=new URL(req.url,'https://example.invalid').searchParams.get('card');const card=cards.find(item=>item.slug===slug);
 if(!card)return res.status(404).json({error:'This card could not be found.'});
 const pathname='stationery/'+card.slug+'/published.json';
 if(req.method==='GET'){
  try{const result=await get(pathname,{access:'private',useCache:false});if(!result)return res.status(200).json({...defaults(card),schema:1,publishedAt:null});return res.status(200).json(JSON.parse(await new Response(result.stream).text()));}
  catch(error){console.error('Stationery read failed',error.name);return res.status(503).json({error:'The published card could not be loaded. Please try again.'});}
 }
 if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return res.status(405).end();}
 const master=process.env.CARD_PUBLISH_KEY;if(!master)return res.status(503).json({error:'Publishing is not configured.'});
 const expected=Buffer.from(createHmac('sha256',master).update('stationery:'+slug).digest('hex'));const supplied=Buffer.from((req.headers.authorization||'').replace(/^Bearer /,''));
 if(expected.length!==supplied.length||!timingSafeEqual(expected,supplied))return res.status(401).json({error:'Use your private edit link to publish this card.'});
 let input=req.body;try{if(typeof input==='string')input=JSON.parse(input);}catch{return res.status(400).json({error:'Invalid card data.'});}
 if(!input||input.schema!==1)return res.status(400).json({error:'Invalid card data.'});
 const limits={recipient:80,sender:80,front:200,message:6000,photo:2400000,photoAlt:240};const data={schema:1,publishedAt:new Date().toISOString()};
 for(const key of fields){if(typeof input[key]!=='string'||input[key].length>limits[key])return res.status(400).json({error:'Check the length of '+key+'.'});data[key]=input[key];}
 if(!data.recipient.trim()||!data.front.trim())return res.status(400).json({error:'Add a recipient and card-front text.'});
 if(!validPhoto(data.photo,card))return res.status(400).json({error:'Choose a JPEG, PNG or WebP photo.'});
 try{await put(pathname,JSON.stringify(data),{access:'private',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'});return res.status(200).json(data);}
 catch(error){console.error('Stationery publish failed',error.name);return res.status(503).json({error:'The card could not be published. Your draft is still saved here.'});}
}
