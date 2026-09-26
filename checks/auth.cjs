const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes={},storage=new Map();let fields=[];
function node(id){return nodes[id]??=( {id,name:id,value:'',hidden:false,dataset:{},attrs:{},handlers:{},classList:{add(){},remove(){}},focus(){},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},addEventListener(k,f){this.handlers[k]=f},querySelector(s){return node(s)},querySelectorAll(){return fields},reset(){fields.forEach(x=>x.value='')},set innerHTML(v){this.html=v;if(id==='auth-form-container'){fields=[...v.matchAll(/<input id="([^"]+)"/g)].map(m=>{const n=node(m[1]);n.value='';return n})}},get innerHTML(){return this.html||''}});}
const env={document:{getElementById:node,body:node('body')},window:{scrollTo(){}},sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},s:{name:'Miho',coins:456},save(){},render(){},toast(){}};vm.createContext(env);
for(const f of ['auth-service.js','auth.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),env);
function click(button){node('auth-screen').handlers.click({target:{closest:()=>button}})}
const submit=()=>node('auth-form').handlers.submit({preventDefault(){}});
(async()=>{
await submit();assert.equal(node('identifier').attrs['aria-invalid'],'true');
click({dataset:{authMode:'register'}});
Object.entries({displayName:'Miho',email:'bad',password:'123',confirmPassword:'456'}).forEach(([k,v])=>node(k).value=v);
await submit();assert.equal(node('email').attrs['aria-invalid'],'true');assert.equal(node('confirmPassword').attrs['aria-invalid'],'true');
Object.entries({displayName:'Shadow Miho',email:'demo@example.com',password:'example123',confirmPassword:'example123'}).forEach(([k,v])=>node(k).value=v);
await submit();assert.equal(env.s.name,'Shadow Miho');assert.equal(node('game-shell').hidden,false);assert.equal(node('password').value,'');assert.deepEqual([...storage.values()],['1']);
await node('sign-out').handlers.click();assert.equal(node('game-shell').hidden,true);assert.equal(storage.size,0);assert.equal(env.s.coins,456);
node('password').value='not-persisted';click({id:'guest-entry',dataset:{}});assert.equal(node('password').value,'');assert.equal(node('game-shell').hidden,false);
await node('sign-out').handlers.click();node('identifier').value='Another Ninja';node('password').value='example';await submit();assert.equal(env.s.name,'Another Ninja');
console.log('PASS: login/registration validation, demo entry, guest credential clearing, sign-out and progress preservation.');
})().catch(e=>{console.error(e);process.exitCode=1});
