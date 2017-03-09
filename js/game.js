(function() {
  let lastTime = 0;
  let vendors = ['ms', 'moz', 'webkit', 'o'];

  for(let x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callbaack, element) {
      let currTime = new Date().getTime();
      let timeToCall = Math.max(0, 16 - (currTime - lastTime));
      let id = window.setTimeout(function() { callback(currTime + timeToCall); },
    timeToCall);
    lastTime = currTime + timeToCall;
    return id;
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      }
    }
  }
}());

$(window).load(function() {
  game.init();
});

let game = {
  init: function() {
    levels.init();
    loader.init();
    mouse.init();

    $('.gamelayer').hide();
    $('#gamestartscreen').show();

    game.canvas = $('#gamecanvas')[0];
    game.context = game.canvas.getContext('2d');
  },

  showLevelScreen: function() {
    $('.gamelayer').hide();
    $('#levelselectscreen').show('slow');
  },

  mode: 'intro',
  slingshotX: 140,
  slingshotY: 280,

  start: function() {
    $('.gamelayer').hide();
    $('#gamecanvas').show();
    $('#scorescreen').show();

    game.mode = 'intro';
    game.offsetLeft = 0;
    game.ended = false;
    game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
  },

  maxSpeed: 3,
  minOffset: 0,
  maxOffset: 300,
  offsetLeft: 0,
  score: 0,

  panTo: function(newCenter) {
    if(Math.abs(newCenter - game.offsetLeft - game.canvas.width / 4) > 0 && game.offsetLeft <= game.maxOffset && game.offsetLeft >= game.minOffset) {
      let deltaX = Math.round((newCenter - game.offsetLeft - game.canvas.width / 4) / 2);

      if (deltaX && Math.abs(deltaX) > game.maxSpeed) {
        deltaX = game.maxSpeed * Math.abs(deltaX) / (deltaX);
      }

      game.offsetLeft += deltaX;
    }
  }

  handlePanning: function() {
    game.offsetLeft++;
  },

  animate: function() {
    game.handlePanning();

    game.context.drawImage(game.currentLevel.backgroundImage, game.offsetLeft/4, 0, 640, 480, 0, 0, 640, 480);
    game.context.drawImage(game.currentLevel.foregroundImage, game.offsetLeft, 0, 640, 480, 0, 0, 640, 480);
    game.context.drawImage(game.slingshotImage, game.slingshotX-game.offsetLeft, game.slingshotY);
    game.context.drawImage(game.slingshotFrontImage, game.slingshotX-game.offsetLeft, game.slingshotY);

    if(!game.ended) {
      game.animationFrame = window.requestAnimationFrame(game.animate, game.canvas);
    }

  }
}

let levels = {
  data:[
    {
      foreground: 'desert-foreground',
      background: 'clouds-background',
      entities: []
    },
    {
      foreground: 'desert-foreground',
      background: 'clouds-background',
      entities: []
    }
  ],

  init: function() {
    let html = '';

    for(let i = 0; i < levels.data.length; i++) {
      let level = levels.data[i];
      html += '<input type="button" value="'+(i+1)+'">';
    };
    $('#levelselectscreen').html(html);

    $('#levelselectscreen input').click(function() {
      levels.load(this.value - 1);
      $('#levelselectscreen').hide();
    });
  },

  load: function(number) {
    game.currentLevel = {number: number, hero: []};
    game.score = 0;

    $('#score').html('Score: ' + game.score);

    let level = levels.data[number];

    game.currentLevel.backgroundImage = loader.loadImage('images/backgrounds/' + level.background + '.png');
    game.currentLevel.foregroundImage = loader.loadImage('images/backgrounds/' + level.foreground + '.png');
    game.slingshotImage = loader.loadImage('images/slingshot.png');
    game.slingshotFrontImage = loader.loadImage('images/slingshot-front.png');

    if(loader.loaded) {
      game.start()
    } else {
      loader.onload = game.start;
    }
  }
}

let loader = {
  loaded: true,
  loadedCount: 0,
  totalCount: 0,

  init: function() {
    let mp3Support;
    let oggSupport;
    let audio = document.createElement('audio');

    if (audio.canPlayType) {
      mp3Support = '' != audio.canPlayType('audio/mpeg');
      oggSupport = '' != audio.canPlayType('audio/ogg; codecs="vorbis"');
    } else {
      mp3Support = false;
      oggSupport = false;
    }

    loader.soundFileExtn = oggSupport ? '.ogg' : mp3Support ? '.mp3' : undefined;
  },

  loadImage: function(url) {
    this.totalCount++;
    this.loaded = false;

    $('#loadingscreen').show();

    let image = new Image();
    image.src = url;
    image.onload = loader.itemLoaded;
    return image;
  },

  soundFileExtn: '.ogg',

  loadSound: function(url) {
    this.totalCount++;
    this.loaded = false;

    $('#loadingscreen').show();

    let audio = new Audio();
    audio.src = url + loader.soundFileExtn;
    audio.addEventListener('canplaythrough', loader.itemLoaded, false);
    return audio;
  },

  itemLoaded: function() {
    loader.loadedCount++;

    $('#loadingmessage').html('Loaded ' + loader.loadedCount + ' of ' + loader.totalCount);

    if (loader.loadedCount === loader.totalCount) {
      loader.loaded = true;

      $('#loadingscreen').hide();

      if(loader.onload) {
        loader.onload();
        loader.onload = undefined;
      }
    }
  }
}

let mouse = {
  x: 0,
  y: 0,
  down: false,

  init: function() {
    $('#gamecanvas').mousemove(mouse.mousemovehandler);
    $('#gamecanvas').mousedown(mouse.mousedownhandler);
    $('#gamecanvas').mouseup(mouse.mouseuphandler);
    $('#gamecanvas').mouseout(mouse.mousehandler);
  },

  mousemovehandler: function(ev) {
    let offset = $('#gamecanvas').offset();

    mouse.x = ev.pageX - offset.left;
    mouse.y = ev.pageY - offset.top;

    if(mouse.down) {
      mouse.dragging = true;
    }
  },

  mousedownhandler: function(ev) {
    mouse.down = true;
    mouse.downX = mouse.x;
    mouse.downY = mouse.y;
    ev.originalEvent.preventDefault();
  },

  mouseuphandler: function(ev) {
    mouse.down = false;
    mouse.dragging = false;
  }
}
