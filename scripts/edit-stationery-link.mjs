import {readFile} from 'node:fs/promises';
import {createHmac} from 'node:crypto';
const cards=JSON.parse(await readFile('public/stationery-cards.json','utf8'));const card=cards.find(item=>item.slug===process.argv[2]);if(!card)throw Error('Pass a known card slug.');
if(!process.env.CARD_PUBLISH_KEY)throw Error('Load CARD_PUBLISH_KEY from your Vercel environment first. Never commit it.');
const key=createHmac('sha256',process.env.CARD_PUBLISH_KEY).update('stationery:'+card.slug).digest('hex');const origin=card.siteUrl||process.env.SITE_URL||'http://localhost:4173';console.log(origin+'/studio'+card.path+'#edit.'+key);
