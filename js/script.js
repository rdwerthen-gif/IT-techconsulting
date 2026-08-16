(function(){
  var wrap = document.querySelector('.map-img-wrap');
  var img = wrap && wrap.querySelector('img');
  if(!img) return;

  var rect = null;
  var rafId = null;
  var pendingX = 0, pendingY = 0;

  function setOrigin(clientX, clientY){
    if(!rect) rect = wrap.getBoundingClientRect();
    var x = ((clientX - rect.left) / rect.width) * 100;
    var y = ((clientY - rect.top) / rect.height) * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    img.style.setProperty('--ox', x + '%');
    img.style.setProperty('--oy', y + '%');
  }

  function scheduleOrigin(clientX, clientY){
    pendingX = clientX;
    pendingY = clientY;
    if(rafId) return;
    rafId = requestAnimationFrame(function(){
      setOrigin(pendingX, pendingY);
      rafId = null;
    });
  }

  // desktop / laptop: mouse
  wrap.addEventListener('mousemove', function(e){
    setOrigin(e.clientX, e.clientY);
  });
  wrap.addEventListener('mouseenter', function(e){
    rect = wrap.getBoundingClientRect();
    setOrigin(e.clientX, e.clientY);
    img.classList.add('zoomed');
  });
  wrap.addEventListener('mouseleave', function(){
    img.classList.remove('zoomed');
    rect = null;
  });

  // mobile / touch
  wrap.addEventListener('touchstart', function(e){
    rect = wrap.getBoundingClientRect();
    var t = e.touches[0];
    img.style.transition = 'none';
    setOrigin(t.clientX, t.clientY);
    img.classList.add('zoomed');
  }, {passive:true});
  wrap.addEventListener('touchmove', function(e){
    var t = e.touches[0];
    scheduleOrigin(t.clientX, t.clientY);
  }, {passive:true});
  wrap.addEventListener('touchend', function(){
    if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
    img.classList.remove('zoomed');
    img.style.transition = '';
    rect = null;
  });
  wrap.addEventListener('touchcancel', function(){
    if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
    img.classList.remove('zoomed');
    img.style.transition = '';
    rect = null;
  });
})();

(function(){
  // block right-click / long-press context menu on all images
  document.querySelectorAll('img').forEach(function(img){
    img.setAttribute('draggable', 'false');
    img.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    img.addEventListener('dragstart', function(e){ e.preventDefault(); });
  });
})();
