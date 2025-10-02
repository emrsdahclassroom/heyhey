var jdx = 0;
var jdy = 0;

function setupJoy(joystick, container) {
  var ljdx = 0;
  var ljdy = 0;
  setInterval(function () {
    if (ljdx !== jdx) {
      ljdx = jdx;
      unityInstance.SendMessage('Player', 'AxisHorizontal', jdx / 39.0);
    }
    if (ljdy !== jdy) {
      ljdy = jdy;
      unityInstance.SendMessage('Player', 'AxisVertical', jdy / 39.0);
    }
  }, 1000 / 20);

  let activeTouchId = null;

  const centerPosX = container.offsetWidth / 2 - joystick.offsetWidth / 2;
  const centerPosY = container.offsetHeight / 2 - joystick.offsetHeight / 2;

  joystick.style.left = centerPosX + 'px';
  joystick.style.top = centerPosY + 'px';
  joystick.style.pointerEvents = 'none';
  container.style.pointerEvents = 'none';

  document.addEventListener('touchstart', startDrag);
  document.addEventListener('touchmove', moveJoystick);
  document.addEventListener('touchend', stopDrag);

  function startDrag(e) {
    const boundingBox = joystick.getBoundingClientRect();

    for (let touch of e.touches) {
      const x = touch.clientX;
      const y = touch.clientY;

      if (
        x >= boundingBox.left &&
        x <= boundingBox.right &&
        y >= boundingBox.top &&
        y <= boundingBox.bottom
      ) {
        activeTouchId = touch.identifier;
        moveJoystick(e);
        break;
      }
    }
  }

  function moveJoystick(e) {
    if (activeTouchId === null) return;

    const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId);
    if (!touch) return;

    e.preventDefault();

    const boundingBox = container.getBoundingClientRect();
    const centerX = boundingBox.width / 2;
    const centerY = boundingBox.height / 2;

    let posX = touch.clientX - boundingBox.left;
    let posY = touch.clientY - boundingBox.top;

    let distance = Math.sqrt((posX - centerX) ** 2 + (posY - centerY) ** 2);
    let angle = Math.atan2(posY - centerY, posX - centerX);
    let maxDistance = boundingBox.width / 2 - joystick.offsetWidth / 2;

    if (distance > maxDistance) {
      distance = maxDistance;
      posX = centerX + distance * Math.cos(angle);
      posY = centerY + distance * Math.sin(angle);
    }

    joystick.style.left = posX - joystick.offsetWidth / 2 + 'px';
    joystick.style.top = posY - joystick.offsetHeight / 2 + 'px';

    jdx = posX - centerX;
    jdy = posY - centerY;
  }

  function stopDrag(e) {
    if (activeTouchId === null) return;

    const touchEnded = Array.from(e.changedTouches).find(t => t.identifier === activeTouchId);
    if (!touchEnded) return;

    activeTouchId = null;

    joystick.style.left = centerPosX + 'px';
    joystick.style.top = centerPosY + 'px';
    jdx = 0;
    jdy = 0;
  }
}
