(function(){
  fetch('blog-posts.json').then(function(r){return r.json();}).then(function(posts){
    var id=new URLSearchParams(window.location.search).get('id');
    var p=id?posts.find(function(x){return x.id===id;}):posts[0];
    var loading=document.getElementById('bp-loading');
    var wrap=document.getElementById('bp-wrap');
    if(!p){
      var msg=document.createElement('p');
      msg.style.cssText='text-align:center;padding:60px;font-family:Bebas Neue,sans-serif;font-size:2rem;color:#888';
      msg.textContent='Post not found.';
      loading.appendChild(msg);
      return;
    }
    document.title=p.title+' - Yellow Glove Productions';
    document.getElementById('bpimg').src=p.img;
    document.getElementById('bpimg').alt=p.title;
    document.getElementById('bpcatt').textContent=p.category;
    document.getElementById('bptitle').textContent=p.title;
    var fmt=new Date(p.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
    document.getElementById('bpmeta').textContent=fmt+' - '+p.author;
    var body=document.getElementById('bpbody');
    var pp=document.createElement('p');pp.textContent=p.excerpt;body.appendChild(pp);
    var pq=document.createElement('div');pq.className='bp-pullquote';pq.textContent=p.excerpt;body.appendChild(pq);
    var plink=document.createElement('p');
    plink.textContent='This post originally appeared on the Yellow Glove Productions blog. ';
    var a=document.createElement('a');a.href=p.link;a.target='_blank';a.rel='noopener';
    a.style.cssText='color:#FBB038;text-decoration:none';a.textContent='Read the full article.';
    plink.appendChild(a);body.appendChild(plink);
    var rGrid=document.getElementById('bprelated');
    posts.filter(function(x){return x.id!==p.id;}).slice(0,3).forEach(function(r){
      var col=document.createElement('div');col.className='col-md-4';
      var a=document.createElement('a');a.href='blog-post.html?id='+r.id;a.className='related-card';
      var img=document.createElement('img');img.src=r.img;img.alt=r.title;img.loading='lazy';
      var rbody=document.createElement('div');rbody.className='related-card-body';
      var cat=document.createElement('span');
      cat.style.cssText='font-family:Barlow Condensed,sans-serif;font-size:9px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#FBB038';
      cat.textContent=r.category;
      var h3=document.createElement('h3');
      h3.style.cssText='font-family:Bebas Neue,sans-serif;font-size:1.3rem;color:#fff;margin:6px 0;line-height:1.1';
      h3.textContent=r.title;
      rbody.appendChild(cat);rbody.appendChild(h3);
      a.appendChild(img);a.appendChild(rbody);col.appendChild(a);rGrid.appendChild(col);
    });
    loading.style.display='none';wrap.style.display='block';
  });
})();
