// based on https://github.com/dobtco/jquery-resizable-columns
angular.module('ngTableResizableColumns', [])
.directive('ngTableResizableColumns', function() {

    var parseWidth = function(node) {
        return parseFloat(node.style.width.replace('%', ''));
    }, setWidth = function(node, table, width) {
        if(table) {
            table.find('.results-column')[node.cellIndex].style.width = "" + width.toFixed(2) + "%";
        }
        return node.style.width = "" + width.toFixed(2) + "%";
    }, pointerX = function(e) {
        return (e.type.indexOf('touch') === 0) ? (e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]).pageX : e.pageX;
    };

    function ResizableColumns($table, loading) {
        var __bind = function(fn, me){
            return function(){
                return fn.apply(me, arguments);
            };
        };

        this.loading = loading;
      this.pointerdown = __bind(this.pointerdown, this);
      var _this = this;
      this.options = {
        store: window.store,
        rigidSizing: false,
        resizeFromBody: true
        };
      this.$table = $table;
      this.setHeaders();
      this.restoreColumnWidths();
      this.syncHandleWidths();
    }

    ResizableColumns.prototype.getColumnId = function($el) {
      return this.$table.data('resizable-columns-id') + '-' + $el.attr('data-resizable-column-id');
    };

    ResizableColumns.prototype.setHeaders = function() {
      this.$tableHeaders = this.$table.find('thead tr:first th:visible');
      this.assignPercentageWidths();
      return this.createHandles();
    };

    ResizableColumns.prototype.destroy = function() {
      this.$handleContainer.remove();
      this.$table.removeData('resizableColumns');
      return $(window).off('.rc');
    };

    ResizableColumns.prototype.assignPercentageWidths = function() {
      var _this = this;
        var variableWidthHeaders = [];
        var totalWidth = 0;
      return this.$tableHeaders.each(function(i, el) {
        var $el;
        $el = $(el);
          if(!($el[0].attributes.getNamedItem("data-noresize")))
          {
              variableWidthHeaders.push($el);
          }
          var elWidth = $el.outerWidth() / _this.$table.width() * 100;
          totalWidth = totalWidth + (Math.round(elWidth*100)/100);
          if(!_this.loading) {
              if((i === (_this.$tableHeaders.length - 1)) && (totalWidth != 100))
              {
                  if(variableWidthHeaders.length > 0) {
                      var currentWidth = Number(parseWidth(variableWidthHeaders[0][0]));
                      var fixedWidth = currentWidth + (100 - totalWidth);
                      setWidth(variableWidthHeaders[0][0], _this.$table, currentWidth + (100 - totalWidth));
                  }
              }
              return setWidth($el[0], _this.$table, elWidth);
          }
      });
    };

    ResizableColumns.prototype.createHandles = function() {
      var _ref,
        _this = this;
      if ((_ref = this.$handleContainer) != null) {
        _ref.remove();
      }
      this.$table.before((this.$handleContainer = $("<div class='rc-handle-container' />")));
      this.$tableHeaders.each(function(i, el) {
        var $handle;
        if (_this.$tableHeaders.eq(i + 1).length === 0 || (_this.$tableHeaders.eq(i).attr('data-noresize') != null) || (_this.$tableHeaders.eq(i + 1).attr('data-noresize') != null)) {
          return;
        }
        $handle = $("<div class='rc-handle' />");
        $handle.data('th', $(el));
        return $handle.appendTo(_this.$handleContainer);
      });
      return this.$handleContainer.on('mousedown touchstart', '.rc-handle', this.pointerdown);
    };

    ResizableColumns.prototype.syncHandleWidths = function() {
      var _this = this;
      this.setHeaders();

      var theColumns = this.$table.find('.results-column');
      this.$tableHeaders.each(function(i,el){
          var myCol = theColumns[i];
          myCol.style.width = el.style.width;
      });

      return this.$handleContainer.width(this.$table.width()).find('.rc-handle').each(function(_, el) {
        var $el;
        $el = $(el);
        return $el.css({
          left: $el.data('th').outerWidth() + ($el.data('th').offset().left - _this.$handleContainer.offset().left),
          height: _this.options.resizeFromBody ? _this.$table.height() : _this.$table.find('thead').height()
        });
      });
    };

    ResizableColumns.prototype.saveColumnWidths = function() {
      var _this = this;
      return this.$tableHeaders.each(function(_, el) {
        var $el;
        $el = $(el);
        if ($el.attr('data-noresize') == null) {
          if (_this.options.store != null) {
            return _this.options.store.set(_this.getColumnId($el), parseWidth($el[0]));
          }
        }
      });
    };

    ResizableColumns.prototype.restoreColumnWidths = function() {
      var _this = this;
      return this.$tableHeaders.each(function(_, el) {
        var $el, width;
        $el = $(el);
        if ((_this.options.store != null) && (width = _this.options.store.get(_this.getColumnId($el)))) {
          return setWidth($el[0], _this.$table, width);
        }
      });
    };

    ResizableColumns.prototype.totalColumnWidths = function() {
      var total,
        _this = this;
      total = 0;
      this.$tableHeaders.each(function(_, el) {
        return total += parseFloat($(el)[0].style.width.replace('%', ''));
      });
      return total;
    };

    ResizableColumns.prototype.pointerdown = function(e) {
      var $currentGrip, $leftColumn, $rightColumn, startPosition, widths,
        _this = this;
      e.preventDefault();
      startPosition = pointerX(e);
      $currentGrip = $(e.currentTarget);
      $leftColumn = $currentGrip.data('th');
      $rightColumn = this.$tableHeaders.eq(this.$tableHeaders.index($leftColumn) + 1);
      widths = {
        left: parseWidth($leftColumn[0]),
        right: parseWidth($rightColumn[0])
      };
      this.$table.addClass('rc-table-resizing');
      $(document).on('mousemove.rc touchmove.rc', function(e) {
        var difference;
        difference = (pointerX(e) - startPosition) / _this.$table.width() * 100;
        setWidth($rightColumn[0], _this.$table, widths.right - difference);
        return setWidth($leftColumn[0], _this.$table, widths.left + difference);
      });
      return $(document).one('mouseup touchend', function() {
        $(document).off('mousemove.rc touchmove.rc');
        _this.$table.removeClass('rc-table-resizing');
        _this.syncHandleWidths();
        return _this.saveColumnWidths();
      });
    };


    return {
        restrict: 'C',
        priority: 999,
        require: 'ngTable',
        link: function(scope, element, args, ngTable) {
            var data;
            scope.$watch('$data', function() {
                data.destroy();
                data = new ResizableColumns(element);
            });
            scope.$watch(function() {
                return element[0].clientWidth;
            }, function() {
                data.syncHandleWidths();
            });
            data = new ResizableColumns(element, true);
        }
    };

});