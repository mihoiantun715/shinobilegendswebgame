(() => {
  const el=id=>document.getElementById(id);
  const sessionKey='shinobi-legends-demo-entry';
  let mode='login',pending=false;
  const field=(id,label,type,placeholder,autocomplete)=>`<div class="auth-field"><label for="${id}">${label}</label><div class="auth-input-wrap"><input id="${id}" name="${id}" type="${type}" placeholder="${placeholder}" autocomplete="${autocomplete}" ${id==='displayName'?'maxlength="20"':id==='identifier'?'maxlength="254"':type==='password'?'maxlength="128"':'maxlength="254"'} aria-describedby="${id}-error" ${type==='email'?'inputmode="email"':''}>${type==='password'?`<button type="button" class="password-toggle" data-toggle="${id}" aria-label="Show ${label.toLowerCase()}" aria-pressed="false">Show</button>`:''}</div><span class="auth-field-error" id="${id}-error"></span></div>`;
  function screen(next,focus=false){
    if(pending)return;
    mode=next;
    const registration=mode==='register';
    el('auth-form-container').innerHTML=`<div class="auth-heading"><span class="auth-kicker">${registration?'THE FIRST CHAPTER':'WELCOME BACK, SHINOBI'}</span><h2>${registration?'Begin your legend':'Return to the shadows'}</h2><p>${registration?'Choose the name your rivals will remember.':'Your village awaits. Your story continues.'}</p></div><div class="auth-tabs" role="tablist" aria-label="Account screen"><button type="button" role="tab" aria-selected="${!registration}" data-auth-mode="login">Sign in</button><button type="button" role="tab" aria-selected="${registration}" data-auth-mode="register">Register</button></div><form id="auth-form" novalidate>${registration?field('displayName','Shinobi name','text','Choose your shinobi name','username')+field('email','Email address','email','you@example.com','email'):field('identifier','Email address','email','Enter your email address','username')}${field('password','Password','password',registration?'At least 8 characters':'Enter your password',registration?'new-password':'current-password')}${registration?field('confirmPassword','Confirm password','password','Repeat your password','new-password'):''}<div id="auth-error" class="auth-error" role="alert" hidden></div><button type="submit" class="auth-submit">${registration?'Create your shinobi':'Enter the village'}<span aria-hidden="true">→</span></button></form><div class="auth-divider"><span>OR</span></div><button type="button" class="auth-google" id="google-signin"><svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>Sign in with Google</button><button type="button" class="auth-guest" id="guest-entry">Continue as guest <span>↗</span></button><p class="auth-switch">${registration?'Already walking the shinobi path?':'New to the provinces?'} <button type="button" data-auth-mode="${registration?'login':'register'}">${registration?'Sign in':'Create a shinobi'}</button></p>`;
    el('auth-form').addEventListener('submit',submit);
    if(focus)el(registration?'displayName':'identifier').focus();
  }
  function error(id,text){const input=el(id);input.setAttribute('aria-invalid',text?'true':'false');el(id+'-error').textContent=text;}
  function values(){const result={};for(const input of el('auth-form').querySelectorAll('input'))result[input.name]=input.value;return result;}
  function validate(v){
    const errors={};
    if(mode==='register'){
      const name=v.displayName.trim();
      if(name.length<3||name.length>20||! /^[\p{L}\p{N}_ -]+$/u.test(name))errors.displayName='Use 3–20 letters, numbers, spaces, underscores or hyphens.';
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()))errors.email='Enter a valid email address.';
      if(v.password.length<8)errors.password='Use at least 8 characters.';
      if(!v.confirmPassword)errors.confirmPassword='Repeat your password.';
      else if(v.password!==v.confirmPassword)errors.confirmPassword='Your passwords do not match.';
    }else{
      if(!v.identifier.trim())errors.identifier='Enter your email or shinobi name.';
      else if(v.identifier.includes('@')&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.identifier.trim()))errors.identifier='Enter a valid email address.';
      if(!v.password)errors.password='Enter a password to preview sign-in.';
    }
    if(v.password.length>128)errors.password='Use no more than 128 characters.';
    for(const input of el('auth-form').querySelectorAll('input'))error(input.id,errors[input.id]||'');
    const first=Object.keys(errors)[0];if(first)el(first).focus();
    return !first;
  }
  async function submit(event){
    event.preventDefault();if(pending)return;
    const data=values();if(!validate(data))return;
    pending=true;
    el('auth-error').hidden=true;
    const button=el('auth-form').querySelector('[type="submit"]');button.disabled=true;button.textContent=mode==='register'?'Preparing your shinobi…':'Entering the village…';
    el('auth-form').setAttribute('aria-busy','true');
    try{
      const result=await (mode==='register'?window.ShinobiAuthService.register(data):window.ShinobiAuthService.login(data));
      el('auth-form').reset();
      await enter(result.displayName,result.uid);
    }catch(err){
      el('auth-error').textContent=err.message || 'Could not enter the game. Please try again.';el('auth-error').hidden=false;
      button.innerHTML=(mode==='register'?'Create your shinobi':'Enter the village')+'<span aria-hidden="true">→</span>';
    }finally{pending=false;button.disabled=false;el('auth-form').removeAttribute('aria-busy');}
  }
  async function enter(name,uid){
    el('auth-form').reset();
    if(window.ShinobiFirestore && uid){
      const cloudData=await window.ShinobiFirestore.loadPlayerData(uid);
      if(cloudData){s={...s,...cloudData};save();render();}
      else if(name){await window.ShinobiFirestore.migrateLocalSave(uid);}
      window.ShinobiFirestore.enableAutoSave(uid,()=>s);
    }
    if(name){s.name=name.slice(0,20);save();render();}
    try{sessionStorage.setItem(sessionKey,'1')}catch{}
    el('auth-screen').hidden=true;el('game-shell').hidden=false;document.body.classList.remove('auth-open');
    document.title='Shinobi Legends';window.scrollTo({top:0,behavior:'instant'});
    el('game-shell').querySelector('.brand').focus({preventScroll:true});
    toast('Welcome back, '+s.name+'!');
  }
  async function signOut(){
    if(pending)return;
    await window.ShinobiAuthService.signOut();
    try{sessionStorage.removeItem(sessionKey)}catch{}
    el('game-shell').hidden=true;el('auth-screen').hidden=false;document.body.classList.add('auth-open');
    if(el('modal').open)el('modal').close();screen('login',true);
    window.scrollTo({top:0,behavior:'instant'});
  }
  el('auth-screen').addEventListener('click',async e=>{
    const button=e.target.closest('button');if(!button||pending)return;
    if(button.dataset.authMode){screen(button.dataset.authMode,true);return;}
    if(button.dataset.toggle){const input=el(button.dataset.toggle),show=input.type==='password';input.type=show?'text':'password';button.textContent=show?'Hide':'Show';button.setAttribute('aria-pressed',String(show));button.setAttribute('aria-label',(show?'Hide ':'Show ')+(input.id==='confirmPassword'?'confirm password':'password'));return;}
    if(button.id==='google-signin'){
      if(pending)return;
      pending=true;
      el('auth-error').hidden=true;
      button.disabled=true;
      button.textContent='Signing in with Google...';
      try{
        const result=await window.ShinobiAuthService.signInWithGoogle();
        await enter(result.displayName,result.uid);
      }catch(err){
        el('auth-error').textContent=err.message||'Google sign-in failed.';
        el('auth-error').hidden=false;
        button.innerHTML='<svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/><path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>Sign in with Google';
      }finally{pending=false;button.disabled=false;}
      return;
    }
    if(button.id==='guest-entry')await enter();
  });
  el('auth-screen').addEventListener('input',e=>{if(e.target.matches('input'))error(e.target.id,'')});
  el('sign-out').addEventListener('click',signOut);
  el('auth-screen').querySelector('.auth-logo').addEventListener('click',e=>{e.preventDefault();screen('login',true)});
  screen('login');
  // This marker only skips the demo welcome screen; it is NOT authentication.
  let remembered=false;try{remembered=sessionStorage.getItem(sessionKey)==='1'}catch{}
  if(remembered){el('auth-screen').hidden=true;el('game-shell').hidden=false;document.body.classList.remove('auth-open');}
})();
