'use strict';
$.fn.datepicker.Constructor.prototype.show = function (e) {
    this.picker.show();
    this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
    this.place();
    $(window).on('resize', $.proxy(this.place, this));
    if (e) {
        e.stopPropagation();
        e.preventDefault();
    }
    var that = this;
    $(document).on('mousedown', function (ev) {
        if ($(ev.target).parent().closest('.datepicker').length === 0) {
            that.hide();
        }
    });
    this.element.on('keydown', function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 9) {
            that.hide();
        }
    });

    this.element.trigger({
        type: 'show',
        date: this.date
    });
};
