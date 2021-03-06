/* eslint-disable max-classes-per-file, no-underscore-dangle */
import $ from 'jquery'
import './zoom.css'

/**
* The zoom object
*/
class Zoom {
  constructor(img) {
    this._fullHeight = null
    this._fullWidth = null
    this._overlay = null
    this._targetImageWrap = null

    this._targetImage = img

    this._$body = $(document.body)
  }

  static OFFSET = 80

  static _MAX_WIDTH = 2560

  static _MAX_HEIGHT = 4096

  zoomImage() {
    const img = document.createElement('img')
    img.onload = () => {
      this._fullHeight = Number(img.height)
      this._fullWidth = Number(img.width)
      this._zoomOriginal()
    }
    img.src = this._targetImage.src
  }

  _zoomOriginal() {
    this._targetImageWrap = document.createElement('div')
    this._targetImageWrap.className = 'zoom-img-wrap'

    this._targetImage.parentNode.insertBefore(this._targetImageWrap, this._targetImage)
    this._targetImageWrap.appendChild(this._targetImage)

    $(this._targetImage)
      .addClass('zoom-img')
      .attr('data-action', 'zoom-out')

    this._overlay = document.createElement('div')
    this._overlay.className = 'zoom-overlay'

    document.body.appendChild(this._overlay)

    this._calculateZoom()
    this._triggerAnimation()
  }

  _calculateZoom() {
    // this._targetImage.offsetWidth // repaint before animating

    const originalFullImageWidth = this._fullWidth
    const originalFullImageHeight = this._fullHeight

    // var scrollTop = $(window).scrollTop()

    const maxScaleFactor = originalFullImageWidth / this._targetImage.width

    const viewportHeight = ($(window).height() - Zoom.OFFSET)
    const viewportWidth = ($(window).width() - Zoom.OFFSET)

    const imageAspectRatio = originalFullImageWidth / originalFullImageHeight
    const viewportAspectRatio = viewportWidth / viewportHeight

    if (originalFullImageWidth < viewportWidth && originalFullImageHeight < viewportHeight) {
      this._imgScaleFactor = maxScaleFactor
    } else if (imageAspectRatio < viewportAspectRatio) {
      this._imgScaleFactor = (viewportHeight / originalFullImageHeight) * maxScaleFactor
    } else {
      this._imgScaleFactor = (viewportWidth / originalFullImageWidth) * maxScaleFactor
    }
  }

  _triggerAnimation() {
    // this._targetImage.offsetWidth // repaint before animating

    const imageOffset = $(this._targetImage).offset()
    const scrollTop = $(window).scrollTop()

    const viewportY = scrollTop + ($(window).height() / 2)
    const viewportX = ($(window).width() / 2)

    const imageCenterY = imageOffset.top + (this._targetImage.height / 2)
    const imageCenterX = imageOffset.left + (this._targetImage.width / 2)

    this._translateY = viewportY - imageCenterY
    this._translateX = viewportX - imageCenterX

    const targetTransform = `scale(${this._imgScaleFactor})`
    let imageWrapTransform = `translate(${this._translateX}px, ${this._translateY}px)`

    imageWrapTransform += ' translateZ(0)'

    $(this._targetImage)
      .css({
        '-webkit-transform': targetTransform,
        '-ms-transform': targetTransform,
        transform: targetTransform,
      })

    $(this._targetImageWrap)
      .css({
        '-webkit-transform': imageWrapTransform,
        '-ms-transform': imageWrapTransform,
        transform: imageWrapTransform,
      })

    this._$body.addClass('zoom-overlay-open')
  }

  close() {
    this._$body
      .removeClass('zoom-overlay-open')
      .addClass('zoom-overlay-transitioning')

    // we use setStyle here so that the correct vender prefix for transform is used
    $(this._targetImage)
      .css({
        '-webkit-transform': '',
        '-ms-transform': '',
        transform: '',
      })

    $(this._targetImageWrap)
      .css({
        '-webkit-transform': '',
        '-ms-transform': '',
        transform: '',
      })

    $(this._targetImage)
      .one('transitionend', $.proxy(this.dispose, this))
      .emulateTransitionEnd(300)
  }

  dispose() {
    if (this._targetImageWrap && this._targetImageWrap.parentNode) {
      $(this._targetImage)
        .removeClass('zoom-img')
        .attr('data-action', 'zoom')

      this._targetImageWrap.parentNode.replaceChild(this._targetImage, this._targetImageWrap)
      this._overlay.parentNode.removeChild(this._overlay)

      this._$body.removeClass('zoom-overlay-transitioning')
    }
  }
}

/**
* The zoom service
*/
export default class ZoomService {
  constructor() {
    this._activeZoom = null
    this._initialScrollPosition = null
    this._initialTouchPosition = null
    this._touchMoveListener = null

    this._$document = $(document)
    this._$window = $(window)
    this._$body = $(document.body)

    this._boundClick = this._clickHandler.bind(this)
  }

  listen(selector = '[data-action="zoom"]') {
    this._selector = selector
    this._$body.on('click', selector, this._zoom.bind(this))
  }

  dispose() {
    // melchor9000: Added to delete the listener
    this._$body.off('click', this._selector)
  }

  _zoom(e) {
    const { target } = e

    if (!target || target.tagName !== 'IMG') {
      return
    }

    if (this._$body.hasClass('zoom-overlay-open')) {
      return
    }

    if (e.metaKey || e.ctrlKey) {
      window.open((e.target.getAttribute('data-original') || e.target.src), '_blank')
      return
    }

    if (target.width >= ($(window).width() - Zoom.OFFSET)) {
      return
    }

    this._activeZoomClose(true)

    this._activeZoom = new Zoom(target)
    this._activeZoom.zoomImage()

    // todo(fat): probably worth throttling this
    this._$window.on('scroll.zoom', this._scrollHandler.bind(this))

    this._$document.on('keyup.zoom', this._keyHandler.bind(this))
    this._$document.on('touchstart.zoom', this._touchStart.bind(this))

    // we use a capturing phase here to prevent unintended js events
    // sadly no useCapture in jquery api (http://bugs.jquery.com/ticket/14953)
    if (document.addEventListener) {
      document.addEventListener('click', this._boundClick, true)
    } else {
      document.attachEvent('onclick', this._boundClick, true)
    }

    if ('bubbles' in e) {
      if (e.bubbles) {
        e.stopPropagation()
      }
    } else {
      // Internet Explorer before version 9
      e.cancelBubble = true
    }
  }

  _activeZoomClose(forceDispose) {
    if (!this._activeZoom) {
      return
    }

    if (forceDispose) {
      this._activeZoom.dispose()
    } else {
      this._activeZoom.close()
    }

    this._$window.off('.zoom')
    this._$document.off('.zoom')

    document.removeEventListener('click', this._boundClick, true)

    this._activeZoom = null
  }

  _scrollHandler() {
    if (this._initialScrollPosition === null) {
      this._initialScrollPosition = $(window).scrollTop()
    }
    const deltaY = this._initialScrollPosition - $(window).scrollTop()
    if (Math.abs(deltaY) >= 40) {
      this._activeZoomClose()
    }
  }

  _keyHandler(e) {
    if (e.keyCode === 27) {
      this._activeZoomClose()
    }
  }

  _clickHandler(e) {
    if (e.preventDefault) {
      e.preventDefault()
    } else {
      e.returnValue = false
    }

    if ('bubbles' in e) {
      if (e.bubbles) {
        e.stopPropagation()
      }
    } else {
      // Internet Explorer before version 9
      e.cancelBubble = true
    }

    this._activeZoomClose()
  }

  _touchStart(e) {
    this._initialTouchPosition = e.touches[0].pageY
    $(e.target).on('touchmove.zoom', $.proxy(this._touchMove, this))
  }

  _touchMove(e) {
    if (Math.abs(e.touches[0].pageY - this._initialTouchPosition) > 10) {
      this._activeZoomClose()
      $(e.target).off('touchmove.zoom')
    }
  }
}
