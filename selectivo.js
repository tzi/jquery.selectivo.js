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

        // Select the default option when loading the select box
        $selectList.each(function() {
            var $select = $(this);
            var $option = $select.find('.selectivo__option:first-child');
            selectOption($select, $option);
        });

        initToggle($selectList);
        initFocus($selectList);
    }



    // Toggling
    //--------------------
    function initToggle($selectList) {

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
        toggleFocus($select, state);
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

        $select
            .find('.selectivo__option')
            .removeClass('selectivo__option--selected');
        $option
            .addClass('selectivo__option--selected');
    }



    // Focus
    //--------------------
    function initFocus($selectList) {

        // Close selectivo when escape pressed
        // Open selectivo or navigate options when up/down arrows pressed
        $selectList.on('keydown', function(event) {
            if (event.keyCode == keyCode.enter) {
                var $target = $(event.target);
                if ($target.hasClass('.selectivo__option')) {
                    $target.click();
                    return false;
                }
            }

            if (event.keyCode == keyCode.escape) {
                close($(this));
                return ;
            }

            if (event.keyCode == keyCode.up || event.keyCode == keyCode.down) {
                var $select = $(this);
                if (!isOpen($select)) {
                    open($select);
                } else {
                    if (event.keyCode == keyCode.up) {
                        focusPreviousElement($select);
                    } else {
                        focusNextElement($select);
                    }
                }

                return false;
            }
        });

        // Close selectivo when loosing focus
        $(document).on('focusin click', function(event) {
            if ($openSelectivo) {
                if (!$openSelectivo.find(event.target).length) {
                    close($openSelectivo);
                }
            }
        });
    }

    function toggleFocus($select, state) {
        var $label = $select.find('> .selectivo__label');
        if (state) {
            focusCurrentOption($select);
            $label.attr('tabindex', '-1');
        } else {
            $label.removeAttr('tabindex');
            if (isFocusIn($select)) {
                $label.focus()
            }
        }
    }

    function getFocusableElements($select) {
        return $select
            .find('.selectivo__label, .selectivo__option, :focus')
            .not('[tabindex=-1], [disabled], :hidden');
    }

    function focusNextElement($select) {
        var $elementList = getFocusableElements($select);
        $elementList
            .eq($elementList.index($select.find(':focus')) + 1)
            .focus();
    }

    function focusPreviousElement($select) {
        var $elementList = getFocusableElements($select);
        $elementList
            .eq(Math.max(0, $elementList.index($select.find(':focus')) - 1))
            .focus();
    }

    function focusCurrentOption($select) {
        console.log(findOr($select, '.selectivo__option--selected', '.selectivo__option').first());
        findOr($select, '.selectivo__option--selected', '.selectivo__option')
            .first()
            .focus();
    }

    function isFocusIn($select) {
        return !!$select.find(':focus').length;
    }



    // Utils
    //--------------------
    function findOr(context, selector) {
        var selectorList = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < selectorList.length; i++) {
            var $found = $(context).find(selectorList[i]);
            if ($found.length > 0) {
                return $found;
            }
        }

        return $();
    }
})(jQuery);

