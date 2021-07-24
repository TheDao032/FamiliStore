const moment = require('moment');

module.exports = {
    rangeOfPagination: function (numOfPages, current) {
        if (numOfPages <= 5) {
            return new Array(5)
                .fill()
                .map((d, i) => Object({ value: i + 1 <= numOfPages ? i + 1 : -1 }));
        }
        let start = current - 3;
        let end = parseInt(current) + 1;
        if (start < 0) {
            start = 0;
            end = 4;
        } else if (end >= numOfPages) {
            end = numOfPages - 1;
            start = end - 4;
        }
        return new Array(5).fill().map((d, i) => Object({ value: i + start + 1 }));
    }
 
    
}