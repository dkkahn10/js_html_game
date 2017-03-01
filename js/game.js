$(window).load(function() {
  game.init();
});

let game = {
  init: function() {
    levels.init();

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


}
