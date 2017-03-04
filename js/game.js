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

    $('.gamelayer').hide();
    $('#gamestartscreen').show();

    game.canvas = $('#gamecanvas')[0];
    game.context = game.canvas.getContext('2d');
  },

  showLevelScreen: function() {
    $('.gamelayer').hide();
    $('#levelselectscreen').show('slow');
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
