var lbc = null;

function showleads(){
  if(window.lb != null){
	if(showleads.showleadsLock)return;
	showleads.showleadsLock = true;
    if(lbc != null){
      showlb(lbc);
      return;
    }

    lb.getLeaderboardEntries('lead', {quantityTop:20}).then(result => {
      lbc = result;
      showlb(lbc);
      setTimeout(()=>{
        window.lbc = null;
      },16000);
    });
  }
}

function showlb(result){
  const lb_data = $('<div class="leaderbord_data_rows">');
  const players = result.entries;

  if(players.length == 0){
    lb_data.html(lang == 'ru' ? "<p><center>Пусто</center></p>" : "<p><center>Empty</center></p>")
  }

  for(let i = 0; i < players.length; i++){
    const p = players[i];

    const avatar = p.player.getAvatarSrc();
    let nick = p.player.publicName;
    if(nick == ''){
      nick = lang == 'ru' ? "Аноним" : "Anonymous";
    }
    const score = p.score;

    lb_data.append(getRow([
      getColumn(['<span>№'+parseInt(i+1)+' </span>']),
	  getColumn("<img src='"+avatar+"'>"),
      getColumn('<span>'+nick+'</span>').css(p.player.uniqueID == playerUID ? {'color':'lime'} : {}),
      getColumn('<span>'+score+'</span>')
    ]));
  }

  const o = getOverlay();
  o.append(
    $('<div class="leaderbords">').append(getCurlb()),
    $('<p>').append(
      $('<button>').text(lang == 'ru' ? "Назад" : "Back").click(function(){
        $('.overlay').remove();
        showleads.showleadsLock = false;
      })
    )
  ).hide().show(200);

  function getCurlb(){
    return $('<div class="leaderbord">').append([
      $('<h3>').text(lang == 'ru' ? leadRu : leadEn),
      $('<div class="leaderbord_data">').append(lb_data)
    ]);
  }

  function getRow(data){
    return $('<div class="row">').append(data);
  }

  function getColumn(data){
    return $('<div class="col">').append(data);
  }
}

var gp = null;
function onGPInit(gp){
	window.gp = gp;
}

function share(n){
  if(gp!=null) gp.socials.share({
    text: lang == 'ru' ? shareRu : shareEn
	});
}

function getOverlay(){
  const overlay = $('<div class="overlay">').css({
    'position': 'fixed',
    'top': 0,
    'left': 0,
    'color':'white',
    'width': '100%',
    'height': '100%',
    'background': 'rgba(0,0,0,0.9)',
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    'z-index': 9999
  });

  const content = $('<div>').css({'text-align':'center'});//блок content, чтобы центрировать

  $('body').append(overlay.append(content));

  return content;
}

function PushSave(json){
  storage.set('main',json);
  storage.push();
}

var advscr = false;

function yabanner(){
	if(advscr)return;

 advscr = true;
 unityInstance.SendMessage('Interop', 'PreBanner');
  ysdk.adv.showFullscreenAdv({callbacks: {onClose: function(){
    unityInstance.SendMessage('Interop', 'PostBanner');

	advscr = false;
	}}});
}

function buyMicrosxeme() {
  if(advscr)return;
  advscr = true;

  if(window.ndk!=null){
    ndk.adv.showRewardedVideo({
      callbacks: {
        onOpen: function(){
          unityInstance.SendMessage('Interop', 'PreBanner');
        },
        onClose: function() {
          advscr = false;
          unityInstance.SendMessage('Interop', 'PostBanner');
        },
        onRewarded: function(){
  		    unityInstance.SendMessage('InAppSys', 'MicrosxemeRecive');
        }
      }
    });
    return;
  }

  ysdk.adv.showRewardedVideo({
    callbacks: {
      onClose: function() {
        advscr = false;
        unityInstance.SendMessage('InAppSys', 'MicrosxemeRecive');
		    unityInstance.SendMessage('Interop', 'PostBanner');
      }
    }
  });
}

function yarbanner() {
  if(advscr)return;
  advscr = true;

  if(window.ndk!=null){
    ndk.adv.showRewardedVideo({
      callbacks: {
        onOpen: function(){
          unityInstance.SendMessage('Interop', 'PreBanner');
        },
        onClose: function() {
          advscr = false;
          unityInstance.SendMessage('Interop', 'PostBanner');
        },
        onRewarded: function(){
  		    unityInstance.SendMessage('Interop', 'REWARDCOMPLITE');
        }
      }
    });
    return;
  }

  ysdk.adv.showRewardedVideo({
    callbacks: {
      onClose: function() {
        advscr = false;
         unityInstance.SendMessage('Interop', 'REWARDCOMPLITE');
		    unityInstance.SendMessage('Interop', 'PostBanner');
      }
    }
  });
}

function WorldLoaded() {

  if(window.ndk!=null){
     ndk.getLeaderboards().then(lb => {
         window.lb = lb;
     });

     ndk.features.LoadingAPI?.ready();
   }

   window.WorldLoaded = function(){

   };
}

function ScoreToLead(score){
	if(window.lb != null) window.lb.setLeaderboardScore('lead', parseInt(score));
}

function SetCursor(cursor){
	$('canvas').css({'cursor':cursor});
}
