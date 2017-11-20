/**
 * @license This file is part of LimeSurvey
 * See COPYRIGHT.php for copyright notices and details.
 *
 */

var LSSlider = function(options){
    "use strict";
    var LSvar = window.LSvar || {};
    var debugMode = LSvar.debugMode || 0;
    console.log(LSvar, debugMode);

    //contextual settings and constants
    var 
    qid           = options.qid,
    elementName   = options.element,
    reset         = options.reset || '',
    prefix        = options.prefix || '',
    suffix        = options.suffix || '',
    position      = options.position || '',
    separator     = options.separator || '.',
    setPosition   = options.setPosition || '',
    custom_handle = options.custom_handle  || null,
    settings = {
        value            : options.value || null,
        min              : options.min || '0',
        max              : options.max || '1',
        step             : options.step || '1',
        orientation      : options.orientation || 'horizontal',
        handle           : options.handle || '',
        tooltip          : options.tooltip || '',
        prefix           : options.prefix || '',
        suffix           : options.suffix || '',
        number           : options.number || true,
        integer          : options.integer || true,
        reversed         : options.reversed || ''
    };

    //fillable variables
    var sliderObject  = null, sliderSettings  = null;
    
    //recurringObjects
    var elementObject = $('#answer'+elementName),
        listItemObject =  $('#javatbd'+elementName) ;

    //settingFunctions
    var stringFormatter = function (value) {
        var displayValue = value.toString().replace('.',separator);
        return prefix + displayValue + suffix;
    },
    /**
     * The slide start event triggered when the handle of the slider is touched
     */
    slideStartEvent = function(){
        listItemObject.find('.slider-container').removeClass('slider-untouched').removeClass('slider-reset').addClass('slider-touched');
        listItemObject.find('div.tooltip').show(); // Show the tooltip
        var currentValue = elementObject.val(); // We get the current value of the bootstrapSlider
        var displayValue = currentValue.toString().replace('.',separator); // We format it with the right separator
        elementObject.val(displayValue); // We parse it to the element
        if(debugMode>0){
            console.log('sliderDebug started dragging', elementObject);
            console.log('sliderDebug current value', currentValue);
            console.log('sliderDebug current display value', displayValue);
        }
    },
    /**
     * The slide stop event is triggered when the handle of the slider is stopped dragging
     */
    slideStopEvent = function(newValue){
        //Correct the value to fit the correct decimal separator and trigger em.
        elementObject.val(newValue.toString().replace('.',separator)).trigger('keyup');
        if(debugMode>0){
            console.log('sliderDebug stopped dragging', elementObject);
            console.log('sliderDebug new value', newValue);
        }

    },
    setValue = function(value){
        sliderObject.setValue(position, true, true);
        elementObject.val(newValue.toString().replace('.',separator)).trigger('keyup'); 
    }

    /**
     * Create the settings including the events.
     * This capsulates the methods nicely
     */
    var createSliderSettings = function(){
        sliderSettings = settings;
        sliderSettings.formatter = stringFormatter;
        sliderSettings.slideStart = slideStartEvent;
        sliderSettings.slideStop = slideStopEvent;
    },
    bindResetAction = function(){
        $('#answer' + elementName + '_resetslider').on('click', function(e) {
            e.preventDefault();
            /* Position slider button at position */
            listItemObject.find('.slider-container').removeClass('slider-touched').addClass('slider-reset');
            sliderObject.setValue(position, true, true);
            /* if don't set position : reset to '' */
            if(!setPosition){
                listItemObject.find('div.tooltip').hide();
                elementObject.val('').trigger('keyup');
            } else {
                elementObject.trigger('keyup');
            }
        });
    },
    createSlider = function(){
        if(custom_handle != null){
            document.styleSheets[0].addRule('#'+elementObject.attr('id')+' .slider-handle.custom::before', '{ content: "'+custom_handle+'" }');
        }
        createSliderSettings();
        sliderObject = new Slider(elementObject[0], sliderSettings);

        if(debugMode>0){
            console.log('sliderDebug slider created',  sliderObject);
            console.log('sliderDebug slider settings',  sliderSettings);
            console.log('sliderDebug slider node',  elementObject);
        }

        bindResetAction();
        return sliderObject;
    },
    getSlider = function(force){
        force = force || false;
        if(sliderObject != null || force === true){ 
            sliderObject.destroy();
        }

        createSlider();
        return sliderObject;
    };
    
    /**
     * Return the slider object and some getters and setters to be able to change stuff on runtime
     * The getSlider is a Singleton constructor
     */
    return {
        init : getSlider,
        getSlider : getSlider,
        setValue : setValue,
        getSettings : function(){return $.extend(true, {}, sliderSettings);},
        unsetSlider : function(){ sliderObject.destroy(); sliderObject = null; }
    };
}
