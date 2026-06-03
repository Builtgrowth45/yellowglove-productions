(function(){
  fetch('projects.json').then(function(r){return r.json();}).then(function(projects){
    var id=new URLSearchParams(window.location.search).get('id');
    var p=projects.find(function(x){return x.id===id;});
    var loading=document.getElementById('loading-state');
    var wrap=document.getElementById('proj-wrap');
    if(!p){
      loading.style.flexDirection='column';
      var h=document.createElement('p');
      h.style.cssText='font-family:Bebas Neue,sans-serif;font-size:2.5rem;color:#FBB038;margin-bottom:24px';
      h.textContent='PROJECT NOT FOUND';
      var a=document.createElement('a');
      a.href='work.html';
      a.style.cssText='color:#888;font-family:Barlow Condensed,sans-serif;font-size:11px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;border:1px solid #333;padding:10px 24px;border-radius:3px';
      a.textContent='Back to Work';
      loading.appendChild(h);loading.appendChild(a);
      return;
    }
    document.title=p.title+' - Yellow Glove Productions';
    document.getElementById('hi').src=p.hero;
    document.getElementById('hi').alt=p.title;
    document.getElementById('pct').textContent=p.type;
    document.getElementById('pt').textContent=p.title;
    document.getElementById('ps').textContent=p.subtitle;
    document.getElementById('pd').textContent=p.desc;
    var mGrid=document.getElementById('pm');
    [['Client',p.client],['Year',p.year],['Type',p.type],['Location',p.location]].forEach(function(m){
      var d=document.createElement('div');d.className='proj-meta-item';
      var lbl=document.createElement('span');lbl.className='proj-meta-label';lbl.textContent=m[0];
      var val=document.createElement('span');val.className='proj-meta-val';val.textContent=m[1];
      d.appendChild(lbl);d.appendChild(val);mGrid.appendChild(d);
    });
    var svcDiv=document.getElementById('psv');
    var svcWrap=document.createElement('div');svcWrap.style.marginBottom='32px';
    p.services.forEach(function(s){var sp=document.createElement('span');sp.className='svc-pill';sp.textContent=s;svcWrap.appendChild(sp);});
    svcDiv.appendChild(svcWrap);
    var gallery=document.getElementById('pg');
    p.gallery.forEach(function(g){
      var d=document.createElement('div');d.className='proj-gallery-item';
      var img=document.createElement('img');img.src=g;img.alt=p.title;img.loading='lazy';
      d.appendChild(img);gallery.appendChild(d);
    });
    var nxt=projects.find(function(x){return x.id===p.next;});
    if(nxt){document.getElementById('pnl').href='project.html?id='+nxt.id;document.getElementById('pnt').textContent=nxt.title;}
    loading.style.display='none';wrap.style.display='block';
  });
})();
