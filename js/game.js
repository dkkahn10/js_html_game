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

    for(let i = 0; i < level.data.length; i++) {
      let level = level.data[i];
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
