var Helper = new function() {

  var that = this;

  this.column = function(index) {
    return index % 9;
  };
  this.row = function(index) {
    return (index - index % 9) / 9;
  };
  this.square = function(index) {
    var column = that.column(index),
      row = that.row(index);

    return (row - row % 3) + (column - column % 3) / 3;
  };

  this.getRow = function(number, cells) {
    return cells.slice( number * 9, (number + 1) * 9 );
  };

  this.setRow = function(number,row, cells) {
    for (var i=0; i < 9; i++) {
      cells[ number * 9 + i] = row[i];
    };

    return that;
  };

  this.getColumn = function(number, cells) {
    var column = [];

    for (var i = 0; i < 9; i++) {
      column[i] = cells[ i * 9 + number ];
    };

    return column;
  };

  this.setColumn = function(number,column, cells) {
    for (var i = 0; i < 9; i++) {
      cells[ i * 9 + number ] = column[i];
    };

    return that;
  };

  this.getXY = function(x,y, cells) {
    return cells[ y * 9 + x ];
  };

  this.setXY = function(x,y,cell, cells) {
    cells[ y * 9 + x ] = cell;

    return that;
  };

  this.getSquare = function(number, cells) {
    var square = [],
      shift = (number - number % 3) * 6;

    number = number*3;

    square =
      cells.slice(
        number + shift,
        number + 3 + shift
      ).concat(
        cells.slice(
          number + 9 + shift,
          number + 12 + shift
        ),
        cells.slice(
          number + 18 + shift,
          number + 21 + shift
        )
      );

    return square;
  };

  this.setSquare = function(number, square, cells) {
    var shift = (number - number % 3) * 6;

    number = number*3;

    for (var i = 0; i < 3; i++) {
      cells[ number + shift + i ] = square[i];
      cells[ number + shift + i + 9 ] = square[i + 3];
      cells[ number + shift + i  + 18 ] = square[i + 6];
    };

    return that;
  };

  this.arrayIntersect = function(a, b) {
    var ai=0, bi=0;
    var result = new Array();

    while( ai < a.length && bi < b.length ) {

      if (a[ai] < b[bi] ){
        ai++;
      } else if (a[ai] > b[bi] ){
        bi++;
      } else {
        result.push(a[ai]);
        ai++;
        bi++;
      }

    }

    return result;
  };

  this.arrayCompare = function(a, b) {
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    };

    return true;
  };

  this.arraySubstract = function(a, b) {
    return a.filter(function(i) {return !(b.indexOf(i) > -1);});
  };

  this.arrayDuplicates = function(array, length) {
    var duplicates = [],
      chain = array.slice(0,array.length), //clone ;)
      found,i,i2;

    for (i = 0; i < chain.length - 1; i++) {
      if (chain[i] && (chain[i].length == length)) {

        found = [i];
        for (i2 = i+1; i2 < chain.length; i2++) {
          if (chain[i2] && that.arrayCompare(chain[i], chain[i2])) {
            found.push(i2);
            chain[i2] = false;
          }
        };

        if (found.length > 1) {
          duplicates.push(found);
        }
      }
    };

    return duplicates;
  };

}();