import { cp,rm,readFile,writeFile } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await cp('public','dist',{recursive:true});
const card=JSON.parse(await readFile('public/card.json','utf8'));const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');let html=await readFile('public/index.html','utf8');
const title=esc(card.shareTitle||`Happy birthday ${card.recipient}!`);
html=html.replace('<title>Pidgefull</title>',`<title>${title}</title>`).replaceAll('content="Pidgefull"',`content="${title}"`);
let meta='<meta property="og:type" content="website">\n';
if(card.previewImage){const origin=card.siteUrl||process.env.SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:null);if(origin){const image=esc(new URL(card.previewImage,origin).href);meta+=`<meta property="og:image" content="${image}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="An envelope for ${esc(card.recipient)}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="${image}">\n`;}}
html=html.replace('</head>',meta+'</head>');await writeFile('dist/card-page.html',html);console.log('Built site and card-specific share metadata.');
const stationery=JSON.parse(await readFile('public/stationery-cards.json','utf8'));
for(const item of stationery){
 let page=await readFile('public/stationery.html','utf8');const label=esc(item.title);page=page.replace('<title>Pidgefull</title>','<title>'+label+'</title>').replace('content="A personal card from Pidgefull."','content="'+label+'"');
 let tags='<meta property="og:title" content="'+label+'">\n<meta name="twitter:title" content="'+label+'">\n<meta property="og:type" content="website">\n';
 const origin=item.siteUrl||process.env.SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?'https://'+process.env.VERCEL_PROJECT_PRODUCTION_URL:null);
 if(item.previewImage&&origin){const url=esc(new URL(item.previewImage,origin).href);tags+='<meta property="og:image" content="'+url+'">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="An envelope for '+esc(item.recipient)+'">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="'+url+'">\n';}
 page=page.replace('</head>',tags+'</head>');await writeFile('dist/stationery-'+item.slug+'.html',page);
}
console.log('Built '+stationery.length+' message-and-photo card(s).');
