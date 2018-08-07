
class AjaxGrid {

    constructor(table) {
        this.rows = []; // this is a plain array, not a jquery object
        this.cells = []; // this is a plain array holding all AjaxGridCell to prevent them from garbage collection

        this.onSave = function (recordId, fieldName, value) {};

        var $rows = $(table).find('tr'); //
        for (var i = 0; i < $rows.length; i++) {
            var row = $rows[i];
            this.addRow(row);
        }
    }

    /**
     * HTMLElement
     * @param row
     */
    addRow(row) {
        if (!(row instanceof HTMLElement)) {
            alert('AjaxGrid.addRow can accept only HTMLElement objects');
            return;
        }
        var self = this;
        this.rows.push(row);
        var cells = $(row).find('td');

        for (var i = 0; i < cells.length; i++) {
            var cell = $(cells[i]);
            var field = cell.data('field');
            if (field) {
                this.cells.push(new AjaxGridCell(cell, this));
            }
        }
    }

}

class AjaxGridCell {

    constructor(td, grid) {
        var self = this;
        this.grid = grid;
        td = $(td);
        td.attr('contenteditable', 'true');
        td.on('input', function () {
            self.onInput(this);
        });
    }

    onInput(td) {
        var self = this;
        td = $(td);
        td[0].style.backgroundColor = 'lightblue';
        var row = td.parent();
        var recordId = row.data('key');
        var field = td.data('field');

        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(function() {
            td[0].style.backgroundColor = '';
            self.grid && self.grid.onSave && self.grid.onSave(recordId, field, td.text());
        }, 1000);
    }


}