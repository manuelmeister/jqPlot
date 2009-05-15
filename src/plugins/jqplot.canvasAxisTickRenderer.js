(function($) {
    // class: $.jqplot.CanvasAxisTickRenderer
    // A "tick" object showing the value of a tick/gridline on the plot.
    $.jqplot.CanvasAxisTickRenderer = function(options) {
        // Group: Properties
        // have to provide our own element container attributes.
        this._elem;
        this._plotWidth;
        this._plotHeight;
        this._plotDimensions = {height:null, width:null};
        
        // prop: mark
        // tick mark on the axis.  One of 'inside', 'outside', 'cross', '' or null.
        this.mark = 'outside';
        // prop: showMark
        // wether or not to show the mark on the axis.
        this.showMark = true;
        // prop: showGridline
        // wether or not to draw the gridline on the grid at this tick.
        this.showGridline = true;
        // prop: isMinorTick
        // if this is a minor tick.
        this.isMinorTick = false;
        this.size = 4;
        // prop:  markSize
        // Length of the tick marks in pixels.  For 'cross' style, length
        // will be stoked above and below axis, so total length will be twice this.
        this.markSize = 4;
        // prop: show
        // wether or not to show the tick (mark and label).
        this.show = true;
        // prop: showLabel
        // wether or not to show the label.
        this.showLabel = true;
        this.label = '';
        this.value = null;
        this._styles = {};
        // prop: formatter
        // A class of a formatter for the tick text.  sprintf by default.
        this.formatter = $.jqplot.DefaultTickFormatter;
        // prop: formatString
        // string passed to the formatter.
        this.formatString = '';
        // prop: fontFamily
        // css spec for the font-family css attribute.
        this.fontFamily = 'Hershey';
        // prop: fontSize
        // integer font size in points.
        this.fontSize = 12;
        this.fontWeight = 1.0;
        this.fontStretch = 1.0;
        // prop: textColor
        // css spec for the color attribute.
        this.textColor = '#444444';
        // prop: angle
        // angle of text, measured clockwise from x axis.
        this.angle = 0;
        
        $.extend(true, this, options);
        
        var ropts = {fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, strokeStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily};
        
        if (true) {
            this._textRenderer = new $.jqplot.CanvasFontRenderer(ropts);
        }
        else {
            this._textRenderer = new $.jqplot.CanvasTextRenderer(ropts);   
        }
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.init = function(options) {
        $.extend(true, this, options);
        this._textRenderer.init({fontSize:this.fontSize, fontWeight:this.fontWeight, fontStretch:this.fontStretch, strokeStyle:this.textColor, angle:this.getAngleRad(), fontFamily:this.fontFamily});
    };
    
    // return width along the x axis
    // will check first to see if an element exists.
    // if not, will return the computed text box width.
    $.jqplot.CanvasAxisTickRenderer.prototype.getWidth = function(ctx) {
        if (this._elem) {
         return this._elem.outerWidth(true);
        }
     	else {
     	    var tr = this._textRenderer;
	        var l = tr.getWidth(ctx);
	        var h = tr.getHeight(ctx);
	        var w = Math.abs(Math.sin(tr.angle)*h) + Math.abs(Math.cos(tr.angle)*l);
	        return w;
     	}
    };
    
    // return height along the y axis.
    $.jqplot.CanvasAxisTickRenderer.prototype.getHeight = function(ctx) {
        if (this._elem) {
         return this._elem.outerHeight(true);
        }
     	else {
     	    var tr = this._textRenderer;
	        var l = tr.getWidth(ctx);
	        var h = tr.getHeight(ctx);
            var w = Math.abs(Math.cos(tr.angle)*h) + Math.abs(Math.sin(tr.angle)*l);
            return w;
        }
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.getAngleRad = function() {
        var a = this.angle * Math.PI/180;
        return a;
    };
    
    
    $.jqplot.CanvasAxisTickRenderer.prototype.setTick = function(value, axisName, isMinor) {
        this.value = value;
        if (isMinor) {
        	this.isMinorTick = true;
        }
        return this;
    };
    
    $.jqplot.CanvasAxisTickRenderer.prototype.createElem  = function() {
        var domelem = document.createElement('canvas');
        if ($.browser.msie) {
            window.G_vmlCanvasManager.init_(document);
        }
        if ($.browser.msie) {
            domelem = window.G_vmlCanvasManager.initElement(domelem);
        }
		this._domelem = domelem;
        this._elem = $(domelem);
        this._elem.css(this._styles);
        //var cstr = '.jqplot-axis-tick';
        //console.log('axis: %s, cstr: %s, style: %s', this.axis, cstr, $(cstr).css('font-weight'));
        //this._elem.css('border', '1px dotted #dd99bb');
        //ctx.drawText(0, h-h*7/25, this.label);
        this._elem.addClass('jqplot-axis-tick');
        return this._elem;
        
    }
    
    $.jqplot.CanvasAxisTickRenderer.prototype.draw = function() {
        if (!this.label) {
        	this.label = this.formatter(this.formatString, this.value);
        }
        var domelem = document.createElement('canvas');
        if ($.browser.msie) {
            window.G_vmlCanvasManager.init_(document);
        }
        if ($.browser.msie) {
            domelem = window.G_vmlCanvasManager.initElement(domelem);
        }
        var ctx = domelem.getContext("2d");
        this._textRenderer.setText(this.label, ctx);
        var w = this.getWidth(ctx);
        var h = this.getHeight(ctx);
		domelem.width = w;
		domelem.height = h;
		this._domelem = domelem;
        this._elem = $(domelem);
        this._elem.css(this._styles);
        //var cstr = '.jqplot-axis-tick';
        //console.log('axis: %s, cstr: %s, style: %s', this.axis, cstr, $(cstr).css('font-weight'));
        //this._elem.css('border', '1px dotted #dd99bb');
        this._textRenderer.draw(ctx, this.label);
        //ctx.drawText(0, h-h*7/25, this.label);

        this._elem.addClass('jqplot-axis-tick');
        
        return this._elem;
    };    
})(jQuery);