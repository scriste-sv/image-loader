/**
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
            this._normalizeOptions(options);
            this._img = element;
            this._$img = $(element);
            this._prepareImage();
        },

        _normalizeOptions: function(options) {
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
            placeholderClass = this._options.placeholderClass,
            $img = this._$img,
            wrapper;
            if (placeholder) {
                $img.attr("src", placeholder);
            } else {
                wrapper = $('<div class="image-loader-wrapper"></div>');
                $img.css("visibility", "hidden").wrap(wrapper);
            }
            if (placeholderClass) {
                $img.addClass(placeholderClass);
                if (wrapper) {
                    $img.parent().addClass(placeholderClass);
                }
            }
        },

        _showImage: function() {
            var placeholderClass = this._options.placeholderClass,
            effect = this._options.effect,
            speed = this._options.speed,
            $img = this._$img;

            if (placeholderClass) {
                $img.removeClass(placeholderClass);
            }
            if ($img.parent().hasClass('image-loader-wrapper')) {
                $img.unwrap().css("visibility", "visible");
            }
            if (effect && !!$img[effect]) {
                if (speed) {
                    $img[effect](speed);
                } else {
                    $img[effect]();
                }
            } else {
                $img.show();
            }
        },

        _hideImage: function(prevSrc) {
            var $img = this._$img;
            $img.hide().removeAttr("data-src").data("src", "").data("prevSrc", prevSrc);
        },

        load: function() {
            var image = new Image(),
                $img = this._$img,
                imageSrc = $img.data("src"),
                placeholder = this._options.placeholder,
                errorPlaceholder = this._options.errorPlaceholder;

            image.onload = $.proxy(function() {
                this._hideImage(imageSrc);
                $img.attr("src", imageSrc);
                this._showImage();
                if ($.isFunction(this._options.onImageLoaded)) {
                    this._options.onImageLoaded($img);
                }
                image = null;
            }, this);
            image.onerror = $.proxy(function() {
                this._hideImage(imageSrc);
                if (errorPlaceholder) {
                    $img.attr("src", errorPlaceholder);
                }
                this._showImage();
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
