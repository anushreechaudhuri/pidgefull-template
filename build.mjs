import { cp,rm,readFile,writeFile } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await cp('public','dist',{recursive:true});
const card=JSON.parse(await readFile('public/card.json','utf8'));const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');let html=await readFile('public/index.html','utf8');
const title=esc(card.shareTitle||`Happy birthday ${card.recipient}!`);
html=html.replace('<title>Pidgefull</title>',`<title>${title}</title>`).replaceAll('content="Pidgefull"',`content="${title}"`);
let meta='<meta property="og:type" content="website">\n';
if(card.previewImage){const origin=card.siteUrl||process.env.SITE_URL||(process.env.VERCEL_PROJECT_PRODUCTION_URL?`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`:null);if(origin){const image=esc(new URL(card.previewImage,origin).href);meta+=`<meta property="og:image" content="${image}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta property="og:image:alt" content="An envelope for ${esc(card.recipient)}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="${image}">\n`;}}
html=html.replace('</head>',meta+'</head>');await writeFile('dist/card-page.html',html);console.log('Built site and card-specific share metadata.');
