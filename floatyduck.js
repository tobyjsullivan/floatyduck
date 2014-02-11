// game engine
function FloatyDuck() {
  this.DEBUG = true;
  this.UPDATES_PER_SECOND = 60;

  this.frameCount = 0;
    
  this.scroll_rate = 1;
  this.size = { w: 320, h: 480 };
  
  this.scroll_size = { w: this.size.w+10, h: this.size.h-2 }
  this.scroll_pos = { t: 0, l: 0 }
}

// Initialize
FloatyDuck.prototype.init = function() {
  if(this.DEBUG) {
    $('#debug_data').css('display', 'block');
  }

  // generate game area
  this.html = $('<div id="play_area"></div>');
  this.scroll = $('<div id="scroll"></div>');
  
  // set structure
  this.html.appendTo($('body'));
  this.scroll.appendTo(this.html);
  
  this.Duck = new Duck();
  this.scroll.append(this.Duck.html);
  
  // position duck in center
  this.Duck.moveX(this.size.w/2);
  this.Duck.moveY(this.size.h/2);
  
  this.Keyboard = new Keyboard();
}

// This method updates the world (i.e., input, physics, etc)
FloatyDuck.prototype.update = function() {

  // update scroll area
  this.scroll_size.w += this.scroll_rate;
  this.scroll_pos.l -= this.scroll_rate;
  
  // update duck pos
  this.Duck.moveX(this.scroll_rate);

  if(this.Keyboard.isUpPressed()) {
    this.Duck.moveY(-1);
  } else if (this.Keyboard.isDownPressed()) {
    this.Duck.moveY(1);
  }
  
}

// This method draws the current scene
FloatyDuck.prototype.render = function() {
  this.Duck.render();
  
  // render play area
  this.html.css('width',this.size.w+'px').css('height',this.size.h+'px');
  
  // render scroll area
  this.scroll.css('width',this.scroll_size.w+'px')
            .css('height',this.scroll_size.h+'px')
            .css('top',this.scroll_pos.t+'px')
            .css('left',this.scroll_pos.l+'px');

  if(this.DEBUG) {
  
    // show duck position
    this.scroll.append($('<div class="duckpos"></div>').css('top',this.Duck.y+'px').css('left',this.Duck.x+'px'));
  
    // Record current frame render for debug
    this.frameCount++;

    // Write out debug data
    $('#frame_count').html(this.frameCount);
    var activeKeys = "";
    if(this.Keyboard.upPressed) {
      activeKeys = activeKeys + "UP, ";
    }
    if(this.Keyboard.downPressed) {
      activeKeys += "DOWN, ";
    }
    $('#active_keys').html(activeKeys);
    // TODO: Duck X and Y
    // TODO: Canvas size
  }
}

FloatyDuck.prototype.run = function() {
  this.init();
  
  var updateEvery = 1000 / this.UPDATES_PER_SECOND;
  var lastUpdate = Date.now();
  
  setInterval(function() {
    this.update();
    
    this.render();
  
  }.bind(this), updateEvery);
}

// Keyboard input manager
Keyboard = function() {
  this.leftPressed = false;
  this.rightPressed = false;
  this.upPressed = false;
  this.downPressed = false;

  $(document).keydown(function(e) {
    switch(e.keyCode) {
      case 37: this.leftPressed = true; break;
      case 38: this.upPressed = true; break;
      case 39: this.rightPressed = true; break;
      case 40: this.downPressed = true; break;
    }
  }.bind(this))

  $(document).keyup(function(e) {
    switch(e.keyCode) {
      case 37: this.leftPressed = false; break;
      case 38: this.upPressed = false; break;
      case 39: this.rightPressed = false; break;
      case 40: this.downPressed = false; break;
    }
  }.bind(this))
}

Keyboard.prototype.isLeftPressed = function() {
  return this.leftPressed;
}

Keyboard.prototype.isRightPressed = function() {
  return this.rightPressed;
}

Keyboard.prototype.isUpPressed = function() {
  return this.upPressed;
}

Keyboard.prototype.isDownPressed = function() {
  return this.downPressed;
}

// duck object
Duck = function() {
  this.x = 0;
  this.y = 0;
  
  this.y_speed = 0;
  this.buoyancy = -0.5;
  
  this.size = { w: 50, h: 50 };
    
  // generate duck
  this.html = $('<div id="duck"></div>');
}
  
Duck.prototype.moveY = function(amount) {
  this.y += amount;
}

Duck.prototype.moveX = function(amount) {
  this.x += amount;
}

Duck.prototype.render = function() {
  this.html.css('width',this.size.w+'px')
          .css('height',this.size.h+'px')
          .css('top',this.getPosY()+'px')
          .css('left',this.getPosX()+'px');
}

// get coordinates for positioning; real x and y are considered centre of duck
Duck.prototype.getPosY = function() {
  real_y = this.y;
  return (real_y - Math.round(this.size.h/2));
}
Duck.prototype.getPosX = function() {
  real_x = this.x;
  return (real_x - Math.round(this.size.w/2));
}