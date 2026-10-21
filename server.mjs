import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname,resolve} from 'node:path';
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
const card=JSON.parse(await readFile('public/card.json','utf8'));
createServer(async(req,res)=>{try{let pathname=decodeURIComponent(req.url.split('?')[0]);if(pathname==='/'||pathname===card.path||(card.aliases||[]).includes(pathname)||pathname.startsWith('/studio'))pathname='/index.html';const p=resolve('public','.'+pathname);if(!p.startsWith(resolve('public')+'/'))throw Error();const body=await readFile(p);res.setHeader('Content-Type',types[extname(p)]||'application/octet-stream');res.end(body);}catch{res.writeHead(404);res.end('Not found');}}).listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log(`Pidgefull: http://127.0.0.1:${process.env.PORT||4173}${card.path}`));
