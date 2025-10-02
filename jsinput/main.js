var joycontfunc = function(s){
	console.log("joycontfunc " + s);
}

function JSInput(){

  const joycont = $('<div class="joystick-container">');
  const joystick = $('<div class="joystick"></div>');
  joycont.append(joystick);

  $(document.body).append(
    joycont
  );
  
  window.joycontfunc = (val) => val == 1 ? joycont.show() : joycont.hide();

  setupJoy(joystick[0], joycont[0]);
  joycont.hide();
  
  let trackedTouchId = null;

  function MouseLoockStart(e) {
    for (let touch of e.touches) {
      if (touch.clientX > window.innerWidth / 2) {
        trackedTouchId = touch.identifier;
		unityInstance.SendMessage('Player', 'SetTouchX', touch.clientX);
        unityInstance.SendMessage('Player', 'SetTouchY', touch.clientY);
        unityInstance.SendMessage('Player', 'TouchStart');        
        break; // отслеживаем только первый подходящий
      }
    }
  }

  function MouseLoockMove(e) {
    for (let touch of e.touches) {
      if (touch.identifier === trackedTouchId) {
        unityInstance.SendMessage('Player', 'SetTouchX', touch.clientX);
        unityInstance.SendMessage('Player', 'SetTouchY', touch.clientY);
      }
    }
  }

  function MouseLoockEnd(e) {
    for (let touch of e.changedTouches) {
      if (touch.identifier === trackedTouchId) {
        unityInstance.SendMessage('Player', 'SetTouchX', touch.clientX);
        unityInstance.SendMessage('Player', 'SetTouchY', touch.clientY);
        unityInstance.SendMessage('Player', 'TouchEnd');
        trackedTouchId = null;
      }
    }
  }

  document.addEventListener('touchstart', MouseLoockStart);
  document.addEventListener('touchmove', MouseLoockMove);
  document.addEventListener('touchend', MouseLoockEnd);
}
