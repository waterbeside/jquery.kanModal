/* globals define */
;(function(factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    // AMD模式
    define(["jquery"], factory);
  } else {
    // 全局模式
    factory(jQuery);
  }
}(function($, undefined) {
  "use strict";
  var pluginName = 'kanModal';

  function Modal(options) {
    $.fn[pluginName].options = this.options = $.extend({}, $.fn[pluginName].defaults, options);
    this.$modal = $(this.options.target).attr('class', 'modal fade').hide();
    var self = this;

    function init() {
      if (self.options.title === '') {
        self.options.title = '&nbsp;';
      }
    }
    init();
  }
  $.extend(Modal.prototype, {
    show: function() {
      var self = this,
        $backdrop;
      if (!this.options.nobackdrop) {
        $backdrop = $('.modal-backdrop');
      }
      if (!this.$modal.length) {
        this.$modal = $('<div class="modal fade" id="' + this.options.target.substr(1) + '"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title"></h4></div><div class="modal-body"></div></div></div></div>').appendTo(this.options.appendTo).hide();
      }
      if (self.options.btns) {
        if (!this.$modal.find('.modal-footer').length) {
          var modal_foot = '<div class="modal-footer"></div>';
          this.$modal.find('.modal-body').after(modal_foot);
        }
        this.$modal.find('.modal-footer').html('');
        if (self.options.btns) {
          $.fn[pluginName].createBtnBar.call(this, self);
        }
      } else {
        this.$modal.find('.modal-footer').remove();
      }
      this.$modal.find('.modal-header .modal-title').html(this.options.title);
      if (this.options.cssclass !== undefined) {
        this.$modal.attr('class', 'modal fade ' + this.options.cssclass);
      }
      var $dialog = this.$modal.find('.modal-dialog');
      $dialog.removeAttr("style");

      if (this.options.width !== undefined) {
        $dialog.width(this.options.width);
      }

      if (this.options.left !== undefined) {
        $dialog.css({
          'left': this.options.left
        });
      }

      if (this.options.height !== undefined) {
        this.$modal.height(this.options.height);
      }

      if (this.options.top !== undefined) {
        $dialog.css({
          'top': this.options.top
        });
      }

      if (this.options.keyboard) {
        this.escape();
      }

      if (!this.options.nobackdrop) {
        if (!$backdrop.length) {
          $backdrop = $('<div class="modal-backdrop fade" />').appendTo(this.options.appendTo);
        }
        //console.log($backdrop[0].offsetWidth);
        $backdrop.addClass('in');
      }
      this.$modal.off('close.' + pluginName).on('close.' + pluginName, function() {
        self.close.call(self);
      });

      if (self.options.remote !== undefined && self.options.remote !== '' && self.options.remote !== '#') {
        self.load();

      } else {
        self.$modal.find('.modal-body').html(self.options.content);
        if (typeof self.options.onLoadSuccess === "function") {
          self.options.onLoadSuccess(self);
        }
      }

      this.$modal.show();
      setTimeout(function() {
        self.$modal.addClass('in');
      }, 200);
      $('body').addClass('modal-open');
      this.$modal.scrollTop(0);

      //拖动
      if (this.options.handle) {
        var $handle = this.$modal.find(this.options.handle);
        if (this.options.draggable) {
          $dialog.addClass('modal-draggable').css({
            'position': 'absolute'
          });
          var oLeft = this.options.left !== undefined ? this.options.left : ($('body').width() - $dialog.width()) / 2;
          $dialog.addClass().css({
            'left': oLeft
          });
          var $modalbox = this.$modal;
          var dragging = false;
          var iX, iY;
          var $modal_draggable = this.$modal.find('.modal-draggable');
          $handle.on({
            mousedown: function(e) {
              if ($modal_draggable.length > 0) {
                dragging = true;
                iX = e.clientX - $modal_draggable.offset().left + parseInt($modal_draggable.css('marginLeft'));
                iY = e.clientY - $modal_draggable.offset().top + parseInt($modal_draggable.css('marginTop')) - $modalbox.scrollTop() + $(document).scrollTop();
                if(this.setCapture){this.setCapture();}
              }
            },
            mousemove: function(e) {
              if ($modal_draggable.length > 0) {
                if (dragging) {
                  e = e || window.event;
                  var oX = e.clientX - iX;
                  var oY = e.clientY - iY;
                  $modal_draggable.css({
                    "left": oX + "px",
                    "top": oY + "px"
                  });
                  return false;
                }
              }
            },
            mouseup: function(e) {
              if ($modal_draggable.length > 0) {
                if (dragging) {
                  dragging = false;
                  if(this.releaseCapture){this.releaseCapture();}
                  e.cancelBubble = true;
                }
              }
            }
          }).addClass('modal-handle');
        } else {

          $dialog.removeClass('modal-draggable');
          $handle.unbind('mousedown').unbind('mousemove').unbind('mouseup').removeClass('modal-handle');
        }
      }

      return this;
    },
    load: function(remote) {
      var self = this;
      remote = remote || self.options.remote;

      $.ajax({
        type: 'get',
        dataType: 'html',
        cache: self.options.cache,
        url: remote,
        data: self.options.data,
        success: function(html) {
          self.$modal.find('.modal-body').html(html);
          if (self.options.cache && typeof self.options.remote_o === "undefined") {
            self.options.content = html;
            self.options.remote_o = self.options.remote;
            delete self.options.remote;
          }

          if (typeof self.options.onLoadSuccess === "function") {
            self.options.onLoadSuccess(self);
          }
        }
      });
    },
    reload: function() {
      var remote = typeof this.options.remote_o !== "undefined" ? this.options.remote_o : typeof this.options.remote !== "undefined" ? this.options.remote : '';
      if (remote !== '') {
        this.load(remote);
      } else if (this.options.content) {
        this.$modal.find('.modal-body').html(this.options.content);
        if (typeof this.options.onLoadSuccess === "function") {
          this.options.onLoadSuccess(this);
        }
      }
    },
    close: function() {
      var modal_lenth = $('.modal:visible').length;
      var $modal = this.$modal;
      this.$modal.removeClass('in').off('.' + pluginName).find('.modal-body').html('');
      setTimeout(function() {
        $modal.hide();
      }, 200);
      if (this.options.cssclass !== undefined) {
        this.$modal.removeClass(this.options.cssclass);
      }
      $(document).off('keyup.' + pluginName);
      if (modal_lenth < 2) {
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
      }
      if (typeof this.options.onClose === 'function') {
        this.options.onClose.call(this, this.options);
      }
      return this;
    },
    destroy: function() {
      this.$modal.remove();
      $(document).off('keyup.' + pluginName);
      $('.modal-backdrop').remove();
      $('body').removeClass('modal-open');
      this.$modal = null;
      return this;
    },
    escape: function() {
      var self = this;
      $(document).on('keyup.' + pluginName, function(e) {
        if (e.which === 27) {
          self.close();
        }
      });
    }
  });
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      var obj;
      if (!(obj = $.data(this, pluginName))) {
        var $this = $(this),
          data = $this.data(),
          opts = $.extend({}, options, data);
        if ($this.attr('href') !== '' && $this.attr('href') !== '#') {
          opts.remote = $this.attr('href');
        }
        obj = new Modal(opts);
        $.data(this, pluginName, obj);
      }
      obj.show();
    });
  };
  $[pluginName] = function(options) {
    return new Modal(options);
  };
  $.fn[pluginName].defaultBtns = function() {
    var defaultBtn = [];
    defaultBtn.submit = {
      id: 'submit',
      title: '提 交',
      icon: 'fa fa-save',
      btnClass: "btn btn-primary modal-btn-submit",
      attrString: 'data-loading-text="提交中.."',
      onclick: function(btn, obj) {
        var $form = $.fn[pluginName].defaultBtnsGetForm(obj);
        if ($form.length > 0) {
          $form.submit();
        } else {
          obj.$modal.trigger('close');
        }
        return false;
      }
    };
    defaultBtn.reset = {
      id: 'reset',
      title: '重置',
      icon: 'fa fa-undo',
      btnClass: "btn  btn-default modal-btn-reset",
      onclick: function(btn, obj) {
        $.fn[pluginName].defaultBtnsGetForm(obj)[0].reset();
      }
    };
    defaultBtn.cancel = {
      id: 'cancel',
      title: '取消',
      icon: 'fa fa-times',
      btnClass: "btn  btn-default modal-btn-close",
      onclick: function(btn, obj) {
        obj.$modal.trigger('close');
      }
    };
    defaultBtn.close = {
      id: 'close',
      title: '關閉',
      icon: 'fa fa-times',
      btnClass: "btn  btn-default modal-btn-close",
      onclick: function(btn, obj) {
        obj.$modal.trigger('close');
      }
    };
    defaultBtn.refresh = {
      id: 'refresh',
      title: '刷新',
      icon: 'fa fa-refresh',
      btnClass: "btn  btn-default modal-btn-refrest",
      onclick: function(btn, obj) {
        obj.reload();
      }
    };
    return defaultBtn;
  };

  $.fn[pluginName].defaultBtnsGetForm = function(obj) {
    var formLen = obj.$modal.find('form').length;
    if (formLen === 1) {
      return $(obj.$modal.find('form'));
    } else if (formLen > 1) {
      var $form1 = obj.$modal.find('.table_edit').find('form');
      if ($form1.length > 0) {
        return $form1;
      } else {
        var $form2 = obj.$modal.find('.form-modal-submit');
        return $form2;
      }

    } else {
      return false;
    }
  };

  $.fn[pluginName].createBtn = function(obj, btnSetting) {
    var defaultSetting = {
      tag: "a",
      btnClass: "btn btn-default",
      icon: "fa fa-arrow-right",
      attrString: ""
    };
    var opt = $.extend({}, defaultSetting, btnSetting);
    var href = opt.tag === 'a' ? ' href="javascript:void(0)"' : '';
    var onclick = typeof opt.onclick === 'string' ? ' onclick="' + opt.onclick + '"' : '';
    var returnHtml = '<' + opt.tag + href + onclick + ' class="' + opt.btnClass + '" ' + opt.attrString + '>';
    returnHtml += '<i class="' + opt.icon + '"></i>&nbsp;&nbsp;' + opt.title;
    returnHtml += '</' + opt.tag + '>';
    var $returnBtn = $(returnHtml);
    if (typeof opt.onclick === 'function') {
      $returnBtn.click(function() {
        opt.onclick(this, obj);
      });
    }
    return $returnBtn;
  };

  $.fn[pluginName].createBtnBar = function(obj) {
    var $footer = obj.$modal.find('.modal-footer');
    if (typeof obj.options.btns === "string") {
      $footer.html(obj.options.btns);
    } else if (typeof obj.options.btns === "object") {
      var btnDefaultNameArray = ['submit', 'reset', 'close', 'cancel', 'refresh'];
      var $strbtn, btnSetting;
      $.each(obj.options.btns, function(i, item) {
        var defaultsBtnList = $.fn[pluginName].defaultBtns();
        if (typeof item === "string") {
          var item_lower = $.trim(item.toLowerCase());
          $strbtn = $("<span>" + item + "</span>");
          //if( item_lower=='submit'||item_lower=='reset'||item_lower=='close'||item_lower=='cancel'||item_lower=='refresh'){
          if ($.inArray(item_lower, btnDefaultNameArray) > -1) {
            btnSetting = defaultsBtnList[item_lower];
            $strbtn = $.fn[pluginName].createBtn(obj, btnSetting);
          }
        } else if (typeof item === "object") {
          var btnName = typeof item.id === "undefined" ? "" : $.trim(item.id.toLowerCase());
          btnSetting = $.inArray(btnName, btnDefaultNameArray) < 0 ? item : $.extend({}, defaultsBtnList[btnName], item);
          $strbtn = $.fn[pluginName].createBtn(obj, btnSetting);
        }
        $footer.append($strbtn);
      });

    }
  };
  $.fn[pluginName].options = {};
  $.fn[pluginName].defaults = {
    title: '&nbsp;',
    target: '#modal',
    content: '',
    appendTo: 'body',
    cache: false,
    keyboard: true,
    nobackdrop: false,
    draggable: false,
    data: '',
    handle: '.modal-header',
    btns: ['refresh', 'cancel', 'submit']
  };
  $(document).on('click.' + pluginName, '[data-trigger="modal"]', function() {
    $(this)[pluginName]();
    if ($(this).is('a')) {
      return false;
    }
  }).on('click.' + pluginName, '[data-dismiss="modal"]', function(e) {
    e.preventDefault();
    $(this).closest('.modal').trigger('close');
  });

}));
