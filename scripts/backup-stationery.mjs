import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const cards=JSON.parse(await readFile('public/stationery-cards.json','utf8'));const requested=process.argv[2];
for(const card of cards.filter(item=>!requested||item.slug===requested)){
 const origin=card.siteUrl||process.env.SITE_URL;if(!origin)throw Error('Set siteUrl for '+card.slug+' before backing it up.');const response=await fetch(origin+'/api/stationery?card='+encodeURIComponent(card.slug),{cache:'no-store'});if(!response.ok)throw Error('Could not back up '+card.slug+' ('+response.status+').');const data=await response.json();
 await mkdir('cards/'+card.slug,{recursive:true});await writeFile('cards/'+card.slug+'/published.json',JSON.stringify(data,null,2)+'\n');
 for(const field of ['recipient','sender','front','message','photo','photoAlt'])if(typeof data[field]==='string')card[field]=data[field];
 const photo=/^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(card.photo);if(photo){const bytes=Buffer.from(photo[2],'base64'),extension=photo[1]==='jpeg'?'jpg':photo[1];const name=card.slug+'-'+createHash('sha256').update(bytes).digest('hex').slice(0,10)+'.'+extension;await writeFile('public/photos/'+name,bytes);card.photo='/photos/'+name;}
 await writeFile('cards/'+card.slug+'/card.json',JSON.stringify(card,null,2)+'\n');console.log('Backed up '+card.slug);
}
await writeFile('public/stationery-cards.json',JSON.stringify(cards,null,2)+'\n');
