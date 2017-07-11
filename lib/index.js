'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pomaceBase = require('pomace-base');

exports.default = function (opt) {
  var cabinet = (0, _pomaceBase.buildDOM)('<div class="cabinet">');

  var autoFixed = function autoFixed(a, b, c) {
    return parseFloat((a / b).toFixed(c));
  };

  var autoColumnWidth = function autoColumnWidth(cols, innerCols) {
    var holdScale = 1;
    var scale = !opt.scale ? [] : opt.scale;
    var last = cols.length - scale.length;

    for (var k = 0; k < scale.length; k++) {
      holdScale -= scale[k];
    }

    for (var i = 0; i < last; i++) {
      scale.push(holdScale / last);
    }

    cols.map(function (col, key) {
      col.$$.css({
        float: 'left',
        width: scale[key] * 100 + '%'
      });

      innerCols[key].$$.css({
        width: '100%'
      });
    });
  };

  var auto = function auto() {
    cabinet.$$.components.map(function (row) {
      if (!row.me.$$.parent) {
        return row;
      }

      row.me.$$.css({
        overflow: 'hidden',
        clear: 'both'
      });

      autoColumnWidth(row.cols, row.innerCols);
    });
  };

  cabinet.$$.addClass(opt.class);

  cabinet.$$.extends({
    option: opt,
    components: [],
    autoWidth: function autoWidth() {
      window.addEventListener('resize', function (e) {
        return auto();
      });
      auto();
    },
    row: function row(no) {
      if (this.components[no]) {
        return this.components[no].me;
      }
    },
    col: function col(rowNo, colNo) {
      if (this.components[rowNo]) {
        if (this.components[rowNo].innerCols) {
          return this.components[rowNo].innerCols[colNo];
        }
      }
    }
  });

  for (var rows = 0; rows < opt.rows; rows++) {
    var row = (0, _pomaceBase.buildDOM)('<div class="pomace-cabinet-row">');
    var cols = [];
    var innerCols = [];

    cabinet.$$.components.push({ me: row, cols: cols, innerCols: innerCols });
    cabinet.$$.last(row);

    for (var c = 0; c < opt.cols; c++) {
      var col = (0, _pomaceBase.buildDOM)('<div class="pomace-cabinet-col">');
      var innerCol = (0, _pomaceBase.buildDOM)('<div class="pomace-cabinet-col-inner">');

      cols.push(col);
      innerCols.push(innerCol);
      row.$$.last(col);
      col.$$.last(innerCol);
    }
  }

  return cabinet;
};