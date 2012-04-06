var Sudoku = new function() {

  var that = this;

  this.possibilities  = [];
  this.errors         = 0;

  this.init = function() {
    that.inputs = [0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0,
      0,0,0,0,0,0,0,0,0];

    return that.reset();
  };

  this.reset = function() {
    for (var i=0; i < 81; i++) {
      if (that.inputs[i] !== 0 ) {
        that.possibilities[i] = [];
      } else {
        that.possibilities[i] = [1,2,3,4,5,6,7,8,9];
      }
    };
    that.errors = 0;

    return that;
  };

  this.input = function(input) {
    var i,value;

    for (i = 0; i < 81; i++) {
      value = parseInt(input[i]);
      if ( isNaN(value) || (value < 1) || (value > 9) ) {
        value = 0;
      }
      that.inputs[i] = value;
    };

    return that;
  };


  this.scanRow = function(number, cells) {
    var row = Helper.getRow(number, cells),
      scan = [],
      i,s;

    for (i = 1; i < 10; i++) {
      if (row.indexOf(i) === -1) {
        scan.push(i);
      }
      for (s = i; s < 9; s++) {
        if ((row[i-1] != 0) && (row[i-1] == row[s])) {
          that.errors++;
        }
      };
    };

    return scan;
  };
  this.scanColumn = function(number, cells) {
    var column = Helper.getColumn(number, cells),
      scan = [],
      i,s;

    for (i = 1; i < 10; i++) {
      if (column.indexOf(i) === -1) {
        scan.push(i);
      }
      for (s = i; s < 9; s++) {
        if ((column[i-1] != 0) && (column[i-1] == column[s])) {
          that.errors++;
        }
      };
    };

    return scan;
  };
  this.scanSquare = function(number, cells) {
    var square = Helper.getSquare(number, cells),
      scan = [],
      i,s;

    for (i = 1; i < 10; i++) {
      if (square.indexOf(i) === -1) {
        scan.push(i);
      }
      for (s = i; s < 9; s++) {
        if ((square[i-1] != 0) && (square[i-1] == square[s])) {
          that.errors++;
        }
      };
    };

    return scan;
  };

  this.tableScan = function() {
    var rowScans = [], columnScans = [], squareScans = [],
      column,
      row,
      square,
      i,
      i2;

    for (i = 0; i < 9; i++) {
      rowScans[i]     = that.scanRow(i, that.inputs);
      columnScans[i]  = that.scanColumn(i, that.inputs);
      squareScans[i]  = that.scanSquare(i, that.inputs);
    };

    for (i = 0; i < 81; i++) {

      column  = i % 9;
      row     = (i - i % 9) / 9;
      square  = (row - row % 3) + (column - column % 3) / 3;

      if (that.inputs[i] === 0 ) {
        that.possibilities[i] = Helper.arrayIntersect(that.possibilities[i], columnScans[column]);
        that.possibilities[i] = Helper.arrayIntersect(that.possibilities[i], rowScans[row]);
        that.possibilities[i] = Helper.arrayIntersect(that.possibilities[i], squareScans[square]);
        that.possibilities[i].sort( function(a,b){return a - b} );
      }
    };

    return that;
  };

  this.eliminateDuplicates = function() {
    var i, i2, i3, lengths, square, column, row, duplicates;

    for (lengths = 8; lengths > 1; lengths--) {

      for (i = 0; i < 9; i++) {
        square = Helper.getSquare(i, that.possibilities);
        duplicates = Helper.arrayDuplicates(square, lengths);

        for (i2 = 0; i2 < duplicates.length; i2++) {
          if (duplicates[i2].length == lengths) {

            for (i3 = 0; i3 < 9; i3++) {
              if (duplicates[i2].indexOf(i3) === -1) {
                square[i3] = Helper.arraySubstract(square[i3],square[duplicates[i2][0]]);
              }
            };
            Helper.setSquare(i, square, that.possibilities);
          }
        };

      };
    };

    for (lengths = 8; lengths > 1; lengths--) {

      for (i = 0; i < 9; i++) {
        column = Helper.getColumn(i, that.possibilities);
        duplicates = Helper.arrayDuplicates(column, lengths);

        for (i2 = 0; i2 < duplicates.length; i2++) {
          if (duplicates[i2].length == lengths) {

            for (i3 = 0; i3 < 9; i3++) {
              if (duplicates[i2].indexOf(i3) === -1) {
                column[i3] = Helper.arraySubstract(column[i3],column[duplicates[i2][0]]);
              }
            };
            Helper.setColumn(i, column, that.possibilities);
          }
        };

      };
    };

    for (lengths = 8; lengths > 1; lengths--) {

      for (i = 0; i < 9; i++) {
        row = Helper.getRow(i, that.possibilities);
        duplicates = Helper.arrayDuplicates(row, lengths);

        for (i2 = 0; i2 < duplicates.length; i2++) {
          if (duplicates[i2].length == lengths) {

            for (i3 = 0; i3 < 9; i3++) {
              if (duplicates[i2].indexOf(i3) === -1) {
                row[i3] = Helper.arraySubstract(row[i3],row[duplicates[i2][0]]);
              }
            };
            Helper.setRow(i, row, that.possibilities);
          }
        };

      };
    };
  };

  this.fillSingles = function() {
    var i, changed = false;

    for (i = 0; i < 81; i++) {
      if ((that.possibilities[i].length == 1) && (that.inputs[i] == 0)) {
        that.inputs[i] = that.possibilities[i][0];
        changed = true;
      }
    };

    return changed;
  };


  this.solve = function() {
    do {
      that.tableScan();
    } while (that.fillSingles());

    that.eliminateDuplicates();

    return that;
  };



  this.html = function() {
    var inputHtml = '<div class="inputs">',
      textareaHtml = '<textarea class="direct" cols="8" rows="9" maxlength="81">',
      infoHtml = '<div id="info"></div>',
      possibilitiesHtml = '<div class="possibilities">',
      column, row, square, i, number;

    for (i = 0; i < 81; i++) {

      column  = Helper.column(i);
      row     = Helper.row(i);
      square  = Helper.square(i);


      inputHtml += '<div input="' + i + '" class="input" column="' + column + '" row="' + row + '">' +
        '<input type="text" cell="' + i + '" value="' + (that.inputs[i] > 0 ? that.inputs[i] : "") + '" maxlength="1" ' +
          'column="' + column + '" row="' + row + '" square="' + square + '" />' +
        "</div>";


      textareaHtml += that.inputs[i];


      possibilitiesHtml += '<div cell="' + i + '" class="cell" column="' + column + '" row="' + row + '" + square="' + square + '">';
      for (number = 1; number < 10; number++) {
        if ((that.possibilities[i].indexOf(number) !== -1) && (that.inputs[i] === 0)) {
          possibilitiesHtml += '<div number="' + number + '" class="number">' + number + "</div>";
        }
      };
      possibilitiesHtml += "</div>";
    };

    inputHtml += infoHtml + "</div>";
    textareaHtml += "</textarea>";
    possibilitiesHtml += "</div>";

    return possibilitiesHtml + inputHtml + textareaHtml;
  };


  this.paint = function(id) {
    var html = that.html(),
      inputs;

    inputs = $("#"+id).html(html).addClass("sudoku").toggleClass("corrupt", that.errors > 0).find("input");

    inputs.focus(function() {
      var $this = $(this).select(),
        row     = parseInt($this.attr("row")),
        column  = parseInt($this.attr("column")),
        cell    = parseInt($this.attr("cell")),
        square  = parseInt($this.attr("square"));

      $("#"+id + " #info").text("c: " + column + " r: " + row + " s: " + square + " i: " + cell);
    });

    inputs.keyup(function(event) {

      var $this = $(this),
        row     = parseInt($this.attr("row")),
        column  = parseInt($this.attr("column")),
        cell    = parseInt($this.attr("cell"));

      switch(event.which) {
        case 37: //left
          inputs.filter('input[cell="' + (cell < 1 ? 80 : cell - 1) + '"]').focus();
          return false;
          break;

        case 39: //right
          inputs.filter('input[cell="'+ (cell > 79 ? 0 : cell + 1) + '"]').focus();
          return false;
          break;

        case 38: //up
          inputs.filter('input[row="' + (row > 0 ? row - 1 : 8) + '"][column="' + column + '"]').focus();
          return false;
          break;

        case 40: //down
          inputs.filter('input[row="' + (row < 8 ? row + 1 : 0) + '"][column="' + column + '"]').focus();
          return false;
          break;

        case 27:
          that.solve().paint(id);
          $("#"+id).find('input[cell="'+ cell + '"]').focus();
          return false;
          break;
        case 13:
          inputs.each(function(i){

            var value = parseInt($(this).val()),
              cell = parseInt($(this).attr("cell"));

            if ( isNaN(value) || (value < 1) || (value > 9) ) {
              value = 0;
            }
            that.inputs[cell] = value;

          });

          that.reset().tableScan().paint(id);
          $("#"+id).find('input[cell="'+ cell + '"]').focus();
          return false;
          break;
        case 8:
        case 9:
        case 46:
        case 116:
        break;
        default:
          $("#"+id).find('input[cell="'+ (cell > 79 ? 0 : cell + 1) + '"]').focus();
          break;
      }
    });

    $("#" + id + " textarea.direct").change(function() {
      that.input($(this).val()).reset().tableScan().paint(id);
    });

  };

}();

$(function(){
  Sudoku.init().paint("solution");
  $("#solution").find("input").first().focus();
});