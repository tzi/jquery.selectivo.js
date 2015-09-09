(function($) {
    'use strict';

    var $openSelectivo;
    var keyCode = {
        enter: '13',
        escape: '27',
        up: '38',
        down: '40'
    };



    // Constructor
    //--------------------
    $.fn.selectivo = function() {
        init(this);
        return this;
    };

    function init($selectList) {

        // Toggle selectivo when the label is clicked
        // Close selectivo & select option when an option is clicked
        $selectList.on('click', '.selectivo__label, .selectivo__option', function() {
            var $target = $(this);
            var $select = $target.parents('.selectivo');
            if ($target.hasClass('selectivo__option')) {
                selectOption($select, $target);
            }

            toggle($select);
        });
    }



    // Toggling
    //--------------------
    function toggle($select, state) {
        if (typeof state === 'undefined') {
            state = !isOpen($select);
        }

        if (state) {
            if ($openSelectivo) {
                close($openSelectivo);
            }

            $openSelectivo = $select;
        } else if ($openSelectivo == $select) {
            $openSelectivo = null;
        }

        $select.toggleClass('selectivo--open', state);
    }

    function isOpen($select) {
        return $select.hasClass('selectivo--open');
    }

    function open($select) {
        toggle($select, true);
    }

    function close($select) {
        toggle($select, false);
    }



    // Selection
    //--------------------
    function selectValue($select, label, value) {
        if (label) {
            if (typeof value == 'undefined') {
                value = label;
            }

            $select
                .find('.selectivo__input')
                .val(value);

            $select
                .find('.selectivo__label')
                .html(label);
        }
    }

    function selectOption($select, $option, event) {
        var label = $option.html();
        var value = $option.val();
        selectValue($select, label, value);
    }
})(jQuery);

