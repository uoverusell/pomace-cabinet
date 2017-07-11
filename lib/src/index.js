import {buildDOM} from 'pomace-base';

export default opt => {
  const cabinet = buildDOM('<div class="cabinet">');

  const autoFixed = function(a,b,c){
    return parseFloat((a/b).toFixed(c));
  };

  const autoColumnWidth = function(cols, innerCols){
    let holdScale = 1;
    const scale = !opt.scale? []: opt.scale;
    const last = cols.length - scale.length;

    for(let k = 0;k < scale.length;k++){
      holdScale -= scale[k];
    }

    for(let i = 0;i < last;i++){
      scale.push(holdScale/last);
    }

    cols.map((col,key) => {
      col.$$.css({
        float: 'left',
        width: `${scale[key] * 100}%`,
      });

      innerCols[key].$$.css({
        width: '100%',
      });
    });
  };

  const auto = function(){
    cabinet.$$.components.map(row => {
      if(!row.me.$$.parent){
        return row;
      }

      row.me.$$.css({
        overflow: 'hidden',
        clear: 'both',
      });

      autoColumnWidth(row.cols, row.innerCols);
    });
  };

  cabinet.$$.addClass(opt.class);

  cabinet.$$.extends({
    option: opt,
    components: [],
    autoWidth(open = true){
      if(open){
        window.addEventListener('resize',e => auto());
      }
      auto();
    },
    row(no){
      if(this.components[no]){
        return this.components[no].me;
      }
    },
    col(rowNo,colNo){
      if(this.components[rowNo]){
        if(this.components[rowNo].innerCols){
          return this.components[rowNo].innerCols[colNo];
        }
      }
    }
  });

  for(let rows=0;rows<opt.rows;rows++){
    const row = buildDOM('<div class="pomace-cabinet-row">');
    const cols = [];
    const innerCols = [];

    cabinet.$$.components.push({me:row, cols, innerCols});
    cabinet.$$.last(row);

    for(let c=0;c<opt.cols;c++){
      const col = buildDOM('<div class="pomace-cabinet-col">');
      const innerCol = buildDOM('<div class="pomace-cabinet-col-inner">');

      cols.push(col);
      innerCols.push(innerCol);
      row.$$.last(col);
      col.$$.last(innerCol);
    }
  }

  return cabinet;
};
