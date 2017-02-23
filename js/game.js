$(window).load(function() {
  game.init();
});

let game = {
  init: function() {
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

    
  }
}
