/*!
 * jQuery imageLoader() plugin
 * https://github.com/scriste-sv/image-loader.git
 *
 * Version 0.0.1 (21 feb 2013)
 * Requires jQuery 1.4 or newer
 *
 * Copyright (c) 2013 Septimiu Criste
 * Licensed under the terms of the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 */
/*global */

'use strict';
(function($) {
    var ImageLoader = function(element, options) {
        this.init(element, options);
    };

    ImageLoader.prototype = $.extend({}, {
        constructor: ImageLoader,
        defaults: {
            effect: '',
            speed: 400,
            placeholder: "",
            errorPlaceholder: "",
            onImageLoaded: null,
            onAllImagesLoaded: null,
            placeholderClass: ""
        },
        init: function(element, options) {
            this._prepareOptions(options);
            this._img = element;
            this._$img = $(element);
            this._prepareImage();
        },

        _prepareOptions: function(options) {
            this._options = $.extend({}, this.defaults, options);
            if (this._options.placeholder && typeof this._options.placeholder !== "string") {
                this._options.placeholder = "";
            }
            if (this._options.errorPlaceholder && typeof this._options.errorPlaceholder !== "string") {
                this._options.errorPlaceholder = "";
            }
            if (this._options.placeholderClass && typeof this._options.placeholderClass !== "string") {
                this._options.placeholderClass = "";
            }
            if (this._options.effect && typeof this._options.effect !== "string") {
                this._options.effect = "";
            }
            if (this._options.speed && !$.isNumeric(this._options.speed)) {
                this._options.speed = 400;
            }
        },

        _prepareImage: function() {
            var placeholder = this._options.placeholder,
            placeholderClass = this._options.placeholderClass;
            this._$img.attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==");
            if (placeholder) {
                this._$img.attr("src", placeholder);
            }
            if (placeholderClass) {
                this._$img.addClass(placeholderClass);
            }
        },

        load: function() {
            var image = new Image(),
                imageSrc = this._$img.data("src"),
                placeholder = this._options.placeholder,
                placeholderClass = this._options.placeholderClass,
                errorPlaceholder = this._options.errorPlaceholder,
                effect = this._options.effect,
                speed = this._options.speed;

            image.onload = $.proxy(function() {
                this._$img.hide().attr("src", imageSrc).removeAttr("data-src").data("prevSrc", imageSrc);
                if (placeholderClass) {
                    this._$img.removeClass(placeholderClass);
                }
                if (effect && !!this._$img[effect]) {
                    if (speed) {
                        this._$img[effect](speed);
                    } else {
                        this._$img[effect]();
                    }
                } else {
                    this._$img.show();
                }
                image = null;
            }, this);
            image.onerror = $.proxy(function() {
                this._$img.hide().removeAttr("data-src").data("prevSrc", imageSrc);
                if (errorPlaceholder) {
                    this._$img.attr("src", errorPlaceholder);
                }
                if (placeholderClass) {
                    this._$img.removeClass(placeholderClass);
                }
                if (effect && !!this._$img[effect]) {
                    if (speed) {
                        this._$img[effect](speed);
                    } else {
                        this._$img[effect]();
                    }
                } else {
                    this._$img.show();
                }
                image = null;
            }, this);
            image.src = imageSrc;
        }
    });

    $.fn.imageLoader = function(option) {
        return this.each(function(){
            var $this = $(this),
            imageLoader, options = {};

            if (this.tagName.toUpperCase() !== "IMG" || !$this.data("src")) {
                return;
            }
            $this = $(this);
            if (typeof option === "object") {
                options = option;
            }
            imageLoader = new ImageLoader(this, options);
            if (typeof option === "string" && option.charAt(0) !== '_') {
                imageLoader[option]();
            } else {
                imageLoader.load();
            }
        });
    };
}(jQuery));
