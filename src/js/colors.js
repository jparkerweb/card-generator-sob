
//var c = 'red';
//console.log( colors.toRgb(c) + '\n' + colors.toHex(c)) );
String.prototype.padZero = function(len, c){
    var s = this;
    c = c || "0";
    len = len || 2;

    while(s.length < len) {
        s = c + s;
    }

    return s;
};

var colors = {
    colornames : {
        aqua: '#00ffff', black: '#000000', blue: '#0000ff', fuchsia: '#ff00ff',
        gray: '#808080', green: '#008000', lime: '#00ff00', maroon: '#800000',
        navy: '#000080', olive: '#808000', purple: '#800080', red: '#ff0000',
        silver: '#c0c0c0', teal: '#008080', white: '#ffffff', yellow: '#ffff00'
    },

    toRgb : function(c){
        c= '0x'+colors.toHex(c).substring(1);
        c= [(c>> 16)&255, (c>> 8)&255, c&255];
        return 'rgb('+c.join(',')+')';
    },

    toHex : function(c){
        var tem,
            i = 0

        c = c ? c.toString().toLowerCase() : '';

        if(/^#[a-f0-9]{3,6}$/.test(c)) {
            if(c.length< 7) {
                var A = c.split('');
                c = A[0]+A[1]+A[1]+A[2]+A[2]+A[3]+A[3];
            }

            return c;
        }

        if(/^[a-z]+$/.test(c)) {
            return colors.colornames[c] || '';
        }

        c = c.match(/\d+(\.\d+)?%?/g) || [];

        if(c.length<3) {
            return '';
        }

        c = c.slice(0, 3);

        while(i< 3) {
            tem = c[i];
            if(tem.indexOf('%') != -1){
                tem = Math.round(parseFloat(tem) * 2.55);
            }
            else tem = parseInt(tem);
            if(tem < 0 || tem > 255) {
                c.length= 0;
            }
            else {
                c[i++] = tem.toString(16).padZero(2);
            }
        }

        if(c.length== 3) {
            return '#'+c.join('').toLowerCase();
        }

        return '';
    }
};
