const app=document.querySelector('#card-app'),notice=document.querySelector('#notice');
const isEditor=location.pathname.startsWith('/studio/');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let card,state,published,phase,timer,saveTimer,dirty=false,workingPhoto=false;
const keyName=()=> 'pidgefull:stationery:'+card.slug+':key';
const draftName=()=> 'pidgefull:stationery:'+card.slug+':draft';
const endpoint=()=>'/api/stationery?card='+encodeURIComponent(card.slug);
const shareUrl=()=>location.origin+card.path;
const fields=['recipient','sender','front','message','photo','photoAlt'];
function model(){return {schema:1,...Object.fromEntries(fields.map(key=>[key,state[key]||'']))};}
function toast(text){notice.textContent=text;notice.classList.add('show');clearTimeout(notice.timer);notice.timer=setTimeout(()=>notice.classList.remove('show'),4500);}
function defaults(){return {schema:1,...Object.fromEntries(fields.map(key=>[key,card[key]||'']))};}
function apply(data){for(const key of fields)if(typeof data?.[key]==='string')state[key]=data[key];}
function photoMarkup(className){return state.photo?`<img class="${className}" src="${esc(state.photo)}" alt="${esc(state.photoAlt)}">`:'';}
function coverMarkup(isButton=true){return `<${isButton?'button':'div'} class="cover-card" ${isButton?'id="open-card" type="button" aria-label="Open birthday card"':''}><img class="cover-art" src="${esc(card.art)}" alt="Watercolor toast with heart-shaped jam, a butter knife and a jam jar"><span class="cover-copy">${esc(state.front)}</span></${isButton?'button':'div'}>`;}
function toolbar(){return isEditor?'<header class="toolbar"><button class="plain" id="back-editor">Back to editing</button></header>':'';}
function bindEditorReturn(){if(isEditor)document.querySelector('#back-editor').onclick=editor;}
function envelope(showFront=false){
 clearTimeout(timer);phase=showFront?'front':'envelope';
 app.innerHTML=toolbar()+`<main class="stage ${showFront?'is-opening is-front':''}" id="opening"><button class="envelope-button" id="open-envelope" aria-label="Open envelope" ${showFront?'disabled':''}><span class="envelope"><span class="insert"><img src="${esc(card.art)}" alt=""><p>${esc(state.front)}</p></span><span class="fold left"></span><span class="fold right"></span><span class="fold bottom"></span><span class="address">for ${esc(state.recipient)}<small>from ${esc(state.sender)}</small></span><span class="flap"></span><span class="seal" aria-hidden="true"></span></span></button><div class="cover-stage" id="cover-stage" ${showFront?'':'inert'}>${coverMarkup()}</div></main>`;
 bindEditorReturn();window.scrollTo(0,0);
 document.querySelector('#open-envelope').onclick=()=>{if(phase!=='envelope')return;phase='opening';document.querySelector('#open-envelope').disabled=true;document.querySelector('#opening').classList.add('is-opening');timer=setTimeout(()=>{phase='front';document.querySelector('#opening').classList.add('is-front');document.querySelector('#cover-stage').inert=false;document.querySelector('#open-card').focus({preventScroll:true});},reduce?25:1100);};
 document.querySelector('#open-card').onclick=()=>{if(phase!=='front')return;phase='unfolding';document.querySelector('#opening').classList.add('is-unfolding');timer=setTimeout(inside,reduce?25:550);};
}
function inside(){
 clearTimeout(timer);phase='inside';app.innerHTML=toolbar()+`<main class="inside-stage"><article class="open-card ${state.photo?'':'no-photo'}" aria-label="Inside the birthday card" tabindex="-1"><div class="photo-page">${photoMarkup('inside-photo')}</div><div class="message-page"><p class="message ${state.message.trim()?'':'empty-letter'}">${esc(state.message)}</p></div></article><button class="plain cover-return" id="cover-return">Back to cover</button></main>`;
 bindEditorReturn();document.querySelector('#cover-return').onclick=()=>envelope(true);window.scrollTo(0,0);document.querySelector('.open-card').focus({preventScroll:true});
}
function save(){
 dirty=true;clearTimeout(saveTimer);const label=document.querySelector('#save-status');if(label)label.textContent='Saving draft...';
 saveTimer=setTimeout(()=>{try{localStorage.setItem(draftName(),JSON.stringify(model()));if(label?.isConnected)label.textContent='Draft saved on this device';}catch{if(label?.isConnected)label.textContent='Draft not saved on this device';toast('Device storage is full. Publish your changes or download the draft.');}},250);
}
function editor(){
 clearTimeout(timer);phase='editor';
 app.innerHTML=`<main class="editor"><header class="editor-header"><div><h1>A card for ${esc(state.recipient)}</h1><small id="save-status">${dirty?'Draft saved on this device':published?.publishedAt?'Published':'Your card draft'}</small></div><div class="editor-actions"><button class="secondary" id="preview">Preview</button><button class="primary" id="publish">Update share link</button><button class="secondary" id="copy">Copy share link</button></div></header><div class="editor-body"><section class="form-fields" aria-label="Edit card"><div class="field-row"><label>To<input id="recipient" maxlength="80" value="${esc(state.recipient)}"></label><label>From<input id="sender" maxlength="80" value="${esc(state.sender)}"></label></div><label>Card front<textarea id="front" maxlength="200" rows="2">${esc(state.front)}</textarea></label><label>Your message<textarea id="message" maxlength="6000" placeholder="Write your message here..." rows="10">${esc(state.message)}</textarea></label><section class="photo-picker" aria-label="Inside photo"><label>Photo inside<input class="file-input" type="file" id="photo-file" accept="image/*"></label><div class="photo-preview" id="photo-preview" ${state.photo?'':'hidden'}>${photoMarkup('')}</div><p class="photo-caption">One photo, shown in full. You can also paste a photo here.</p><label>Photo description<input id="photoAlt" maxlength="240" value="${esc(state.photoAlt)}"></label><div class="photo-tools"><button class="plain" id="remove-photo" ${state.photo?'':'hidden'}>Remove photo</button><button class="plain" id="backup">Download draft</button></div></section></section><aside class="editor-preview" aria-label="Front preview"><div id="front-preview">${coverMarkup(false)}</div><p class="preview-caption">The front of your card</p></aside></div></main>`;
 window.scrollTo(0,0);
 for(const key of ['recipient','sender','front','message','photoAlt'])document.querySelector('#'+key).addEventListener('input',e=>{state[key]=e.target.value;save();if(key==='front')document.querySelector('#front-preview .cover-copy').textContent=state.front;if(key==='recipient')document.querySelector('h1').textContent='A card for '+state.recipient;});
 document.querySelector('#preview').onclick=()=>envelope();
 document.querySelector('#publish').onclick=publish;
 document.querySelector('#copy').onclick=copyShare;
 document.querySelector('#photo-file').onchange=e=>{if(e.target.files[0])processPhoto(e.target.files[0]);};
 document.querySelector('#remove-photo').onclick=()=>{state.photo='';save();refreshPhoto();};
 document.querySelector('#backup').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(model(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=card.slug+'-draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
function refreshPhoto(){const preview=document.querySelector('#photo-preview');if(!preview)return;preview.hidden=!state.photo;preview.innerHTML=photoMarkup('');document.querySelector('#remove-photo').hidden=!state.photo;}
async function processPhoto(file){
 if(workingPhoto)return;if(file.size>25*1024*1024){toast('Choose a photo smaller than 25 MB.');return;}
 workingPhoto=true;const button=document.querySelector('#publish');if(button)button.disabled=true;toast('Preparing your photo...');const url=URL.createObjectURL(file);
 try{const image=new Image();image.src=url;await image.decode();const scale=Math.min(1,1800/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.round(image.naturalWidth*scale);canvas.height=Math.round(image.naturalHeight*scale);const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);const photo=canvas.toDataURL('image/jpeg',.86);if(photo.length>2400000)throw Error('This photo is still too large. Please choose a smaller copy.');state.photo=photo;save();refreshPhoto();toast('Photo added to your draft.');}
 catch(error){toast(error.message?.startsWith('This photo')?error.message:'That photo could not be opened. Try a JPEG or PNG.');}
 finally{URL.revokeObjectURL(url);workingPhoto=false;if(button?.isConnected)button.disabled=false;}
}
async function publish(){
 const key=localStorage.getItem(keyName());if(!key){toast('Open your private edit link to enable publishing.');return;}if(workingPhoto)return;
 const button=document.querySelector('#publish');button.disabled=true;button.textContent='Publishing...';clearTimeout(saveTimer);
 try{const response=await fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify(model())});const result=await response.json();if(!response.ok)throw Error(result.error||'Could not publish.');published=result;dirty=false;try{localStorage.setItem(draftName(),JSON.stringify(model()));}catch{}document.querySelector('#save-status').textContent='Published';toast('Your share link now opens the updated card.');}
 catch(error){toast(error.message||'Could not publish. Please try again.');}
 finally{button.disabled=false;button.textContent='Update share link';}
}
async function copyShare(){
 if(dirty){toast('Publish your changes first, then copy the share link.');return;}
 try{await navigator.clipboard.writeText(shareUrl());toast('Share link copied.');}catch{const input=document.createElement('input');input.value=shareUrl();input.setAttribute('aria-label','Share link');document.querySelector('.editor-header').append(input);input.select();toast('Copy the selected share link.');}
}
document.addEventListener('paste',e=>{if(phase!=='editor')return;const file=[...(e.clipboardData?.files||[])].find(item=>item.type.startsWith('image/'));if(file){e.preventDefault();processPhoto(file);}});
try{
 const response=await fetch('/stationery-cards.json',{cache:'no-store'});if(!response.ok)throw Error('The card list could not be loaded.');const cards=await response.json();let path=location.pathname.replace(/\/$/,'');if(isEditor)path=path.slice('/studio'.length);card=cards.find(item=>item.path===path);
 if(!card)throw Error('This card could not be found.');state=defaults();document.title=card.title;
 if(isEditor&&location.hash.startsWith('#edit.')){try{localStorage.setItem(keyName(),location.hash.slice(6));history.replaceState(null,'',location.pathname);}catch{throw Error('Allow browser storage to use the private editor.');}}
 try{const result=await fetch(endpoint(),{cache:'no-store'});if(result.ok){published=await result.json();apply(published);}else if(result.status!==404)toast('The published card is temporarily unavailable. Showing the saved card.');}catch{toast('The published card is temporarily unavailable. Showing the saved card.');}
 if(isEditor){try{const stored=localStorage.getItem(draftName());if(stored){apply(JSON.parse(stored));dirty=JSON.stringify(model())!==JSON.stringify({schema:1,...Object.fromEntries(fields.map(key=>[key,published?.[key]??card[key]??'']))});}}catch{toast('The saved draft could not be opened.');}editor();}else envelope();
}catch(error){app.innerHTML=`<main class="error"><h1>The card could not be opened.</h1><p>${esc(error.message)}</p><button class="plain" id="retry">Try again</button></main>`;document.querySelector('#retry').onclick=()=>location.reload();}
