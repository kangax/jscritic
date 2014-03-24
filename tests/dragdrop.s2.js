var Droppables = {
    drops: [],
    remove: function (a) {
        this.drops = this.drops.reject(function (b) {
            return b.element == $(a)
        })
    },
    add: function (b) {
        b = $(b);
        var a = Object.extend({
            greedy: true,
            hoverclass: null,
            tree: false
        }, arguments[1] || {});
        if (a.containment) {
            a._containers = [];
            var c = a.containment;
            if (Object.isArray(c)) {
                c.each(function (d) {
                    a._containers.push($(d))
                })
            } else {
                a._containers.push($(c))
            }
        }
        if (a.accept) {
            a.accept = [a.accept].flatten()
        }
        Element.makePositioned(b);
        a.element = b;
        this.drops.push(a)
    },
    findDeepestChild: function (a) {
        deepest = a[0];
        for (i = 1; i < a.length; ++i) {
            if (Element.isParent(a[i].element, deepest.element)) {
                deepest = a[i]
            }
        }
        return deepest
    },
    isContained: function (b, a) {
        var c;
        if (a.tree) {
            c = b.treeNode
        } else {
            c = b.parentNode
        }
        return a._containers.detect(function (d) {
            return c == d
        })
    },
    isAffected: function (a, c, b) {
        return ((b.element != c) && ((!b._containers) || this.isContained(c, b)) && ((!b.accept) || (Element.classNames(c).detect(function (d) {
            return b.accept.include(d)
        }))) && Position.within(b.element, a[0], a[1]))
    },
    deactivate: function (a) {
        if (a.hoverclass) {
            Element.removeClassName(a.element, a.hoverclass)
        }
        this.last_active = null
    },
    activate: function (a) {
        if (a.hoverclass) {
            Element.addClassName(a.element, a.hoverclass)
        }
        this.last_active = a
    },
    show: function (a, c) {
        if (!this.drops.length) {
            return
        }
        var b, d = [];
        this.drops.each(function (e) {
            if (Droppables.isAffected(a, c, e)) {
                d.push(e)
            }
        });
        if (d.length > 0) {
            b = Droppables.findDeepestChild(d)
        }
        if (this.last_active && this.last_active != b) {
            this.deactivate(this.last_active)
        }
        if (b) {
            Position.within(b.element, a[0], a[1]);
            if (b.onHover) {
                b.onHover(c, b.element, Position.overlap(b.overlap, b.element))
            }
            if (b != this.last_active) {
                Droppables.activate(b)
            }
        }
    },
    fire: function (b, a) {
        if (!this.last_active) {
            return
        }
        Position.prepare();
        if (this.isAffected([Event.pointerX(b), Event.pointerY(b)], a, this.last_active)) {
            if (this.last_active.onDrop) {
                this.last_active.onDrop(a, this.last_active.element, b);
                return true
            }
        }
    },
    reset: function () {
        if (this.last_active) {
            this.deactivate(this.last_active)
        }
    }
};
var Draggables = {
    drags: [],
    observers: [],
    register: function (a) {
        if (this.drags.length == 0) {
            this.eventMouseUp = this.endDrag.bindAsEventListener(this);
            this.eventMouseMove = this.updateDrag.bindAsEventListener(this);
            this.eventKeypress = this.keyPress.bindAsEventListener(this);
            Event.observe(document, "mouseup", this.eventMouseUp);
            Event.observe(document, "mousemove", this.eventMouseMove);
            Event.observe(document, "keypress", this.eventKeypress)
        }
        this.drags.push(a)
    },
    unregister: function (a) {
        this.drags = this.drags.reject(function (b) {
            return b == a
        });
        if (this.drags.length == 0) {
            Event.stopObserving(document, "mouseup", this.eventMouseUp);
            Event.stopObserving(document, "mousemove", this.eventMouseMove);
            Event.stopObserving(document, "keypress", this.eventKeypress)
        }
    },
    activate: function (a) {
        if (a.options.delay) {
            this._timeout = setTimeout(function () {
                Draggables._timeout = null;
                window.focus();
                Draggables.activeDraggable = a
            }.bind(this), a.options.delay)
        } else {
            window.focus();
            this.activeDraggable = a
        }
    },
    deactivate: function () {
        this.activeDraggable = null
    },
    updateDrag: function (a) {
        if (!this.activeDraggable) {
            return
        }
        var b = [Event.pointerX(a), Event.pointerY(a)];
        if (this._lastPointer && (this._lastPointer.inspect() == b.inspect())) {
            return
        }
        this._lastPointer = b;
        this.activeDraggable.updateDrag(a, b)
    },
    endDrag: function (a) {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null
        }
        if (!this.activeDraggable) {
            return
        }
        this._lastPointer = null;
        this.activeDraggable.endDrag(a);
        this.activeDraggable = null
    },
    keyPress: function (a) {
        if (this.activeDraggable) {
            this.activeDraggable.keyPress(a)
        }
    },
    addObserver: function (a) {
        this.observers.push(a);
        this._cacheObserverCallbacks()
    },
    removeObserver: function (a) {
        this.observers = this.observers.reject(function (b) {
            return b.element == a
        });
        this._cacheObserverCallbacks()
    },
    notify: function (b, a, c) {
        if (this[b + "Count"] > 0) {
            this.observers.each(function (d) {
                if (d[b]) {
                    d[b](b, a, c)
                }
            })
        }
        if (a.options[b]) {
            a.options[b](a, c)
        }
    },
    _cacheObserverCallbacks: function () {
        ["onStart", "onEnd", "onDrag"].each(function (a) {
            Draggables[a + "Count"] = Draggables.observers.select(function (b) {
                return b[a]
            }).length
        })
    }
};
var Draggable = Class.create({
    initialize: function (b) {
        var c = {
            handle: false,
            reverteffect: function (f, e, d) {
                var g = Math.sqrt(Math.abs(e ^ 2) + Math.abs(d ^ 2)) * 0.02;
                var j = parseInt(f.style.top) - e;
                var h = parseInt(f.style.left) - d;
                f.morph("top:" + (j + "px") + ";left:" + (h + "px"), g)
            },
            endeffect: function (d) {
                Draggable._dragging[d] = false
            },
            zindex: 1000,
            revert: false,
            quiet: false,
            scroll: false,
            scrollSensitivity: 20,
            scrollSpeed: 15,
            snap: false,
            delay: 0
        };
        if (!arguments[1] || Object.isUndefined(arguments[1].endeffect)) {
            Object.extend(c, {
                starteffect: function (d) {
                    d._opacity = Element.getOpacity(d);
                    Draggable._dragging[d] = true
                }
            })
        }
        var a = Object.extend(c, arguments[1] || {});
        this.element = $(b);
        if (a.handle && Object.isString(a.handle)) {
            this.handle = this.element.down("." + a.handle, 0)
        }
        if (!this.handle) {
            this.handle = $(a.handle)
        }
        if (!this.handle) {
            this.handle = this.element
        }
        if (a.scroll && !a.scroll.scrollTo && !a.scroll.outerHTML) {
            a.scroll = $(a.scroll);
            this._isScrollChild = Element.childOf(this.element, a.scroll)
        }
        Element.makePositioned(this.element);
        this.options = a;
        this.dragging = false;
        this.eventMouseDown = this.initDrag.bindAsEventListener(this);
        Event.observe(this.handle, "mousedown", this.eventMouseDown);
        Draggables.register(this)
    },
    destroy: function () {
        Event.stopObserving(this.handle, "mousedown", this.eventMouseDown);
        Draggables.unregister(this)
    },
    currentDelta: function () {
        return ([parseInt(Element.getStyle(this.element, "left") || "0"), parseInt(Element.getStyle(this.element, "top") || "0")])
    },
    initDrag: function (a) {
        if (!Object.isUndefined(Draggable._dragging[this.element]) && Draggable._dragging[this.element]) {
            return
        }
        if (Event.isLeftClick(a)) {
            var c = Event.element(a);
            if ((tag_name = c.tagName.toUpperCase()) && (tag_name == "INPUT" || tag_name == "SELECT" || tag_name == "OPTION" || tag_name == "BUTTON" || tag_name == "TEXTAREA")) {
                return
            }
            this.pointer = Event.pointer(a);
            var b = [this.pointer.x, this.pointer.y];
            var d = this.element.cumulativeOffset();
            this.offset = [0, 1].map(function (e) {
                return (b[e] - d[e])
            });
            Draggables.activate(this);
            Event.stop(a)
        }
    },
    startDrag: function (b) {
        this.dragging = true;
        if (!this.delta) {
            this.delta = this.currentDelta()
        }
        if (this.options.zindex) {
            this.originalZ = parseInt(Element.getStyle(this.element, "z-index") || 0);
            this.element.style.zIndex = this.options.zindex
        }
        if (this.options.ghosting) {
            this._clone = this.element.cloneNode(true);
            this._originallyAbsolute = (this.element.getStyle("position") == "absolute");
            if (!this._originallyAbsolute) {
                Position.absolutize(this.element)
            }
            this.element.parentNode.insertBefore(this._clone, this.element)
        }
        if (this.options.scroll) {
            if (this.options.scroll == window) {
                var a = this._getWindowScroll(this.options.scroll);
                this.originalScrollLeft = a.left;
                this.originalScrollTop = a.top
            } else {
                this.originalScrollLeft = this.options.scroll.scrollLeft;
                this.originalScrollTop = this.options.scroll.scrollTop
            }
        }
        Draggables.notify("onStart", this, b);
        this.element.wasDragged = true;
        if (this.options.starteffect) {
            this.options.starteffect(this.element)
        }
    },
    updateDrag: function (event, pointer) {
        var _pointer = Event.pointer(event);
        if (this.pointer.x == _pointer.x && this.pointer.y == _pointer.y) {
            return
        }
        if (!this.dragging) {
            this.startDrag(event)
        }
        if (!this.options.quiet) {
            Position.prepare();
            Droppables.show(pointer, this.element)
        }
        Draggables.notify("onDrag", this, event);
        this.draw(pointer);
        if (this.options.change) {
            this.options.change(this)
        }
        if (this.options.scroll) {
            this.stopScrolling();
            var p;
            if (this.options.scroll == window) {
                with(this._getWindowScroll(this.options.scroll)) {
                    p = [left, top, left + width, top + height]
                }
            } else {
                p = Position.page(this.options.scroll);
                p[0] += this.options.scroll.scrollLeft + Position.deltaX;
                p[1] += this.options.scroll.scrollTop + Position.deltaY;
                p.push(p[0] + this.options.scroll.offsetWidth);
                p.push(p[1] + this.options.scroll.offsetHeight)
            }
            var speed = [0, 0];
            if (pointer[0] < (p[0] + this.options.scrollSensitivity)) {
                speed[0] = pointer[0] - (p[0] + this.options.scrollSensitivity)
            }
            if (pointer[1] < (p[1] + this.options.scrollSensitivity)) {
                speed[1] = pointer[1] - (p[1] + this.options.scrollSensitivity)
            }
            if (pointer[0] > (p[2] - this.options.scrollSensitivity)) {
                speed[0] = pointer[0] - (p[2] - this.options.scrollSensitivity)
            }
            if (pointer[1] > (p[3] - this.options.scrollSensitivity)) {
                speed[1] = pointer[1] - (p[3] - this.options.scrollSensitivity)
            }
            this.startScrolling(speed)
        }
        if (Prototype.Browser.WebKit) {
            window.scrollBy(0, 0)
        }
        Event.stop(event)
    },
    finishDrag: function (b, f) {
        this.dragging = false;
        if (this.options.quiet) {
            Position.prepare();
            var e = [Event.pointerX(b), Event.pointerY(b)];
            Droppables.show(e, this.element)
        }
        if (this.options.ghosting) {
            if (!this._originallyAbsolute) {
                Position.relativize(this.element)
            }
            delete this._originallyAbsolute;
            Element.remove(this._clone);
            this._clone = null
        }
        var g = false;
        if (f) {
            g = Droppables.fire(b, this.element);
            if (!g) {
                g = false
            }
        }
        if (g && this.options.onDropped) {
            this.options.onDropped(this.element)
        }
        Draggables.notify("onEnd", this, b);
        var a = this.options.revert;
        if (a && Object.isFunction(a)) {
            a = a(this.element)
        }
        var c = this.currentDelta();
        if (a && this.options.reverteffect) {
            if (g == 0 || a != "failure") {
                this.options.reverteffect(this.element, c[1] - this.delta[1], c[0] - this.delta[0])
            }
        } else {
            this.delta = c
        } if (this.options.zindex) {
            this.element.style.zIndex = this.originalZ
        }
        if (this.options.endeffect) {
            this.options.endeffect(this.element)
        }
        Draggables.deactivate(this);
        Droppables.reset()
    },
    keyPress: function (a) {
        if (a.keyCode != Event.KEY_ESC) {
            return
        }
        this.finishDrag(a, false);
        Event.stop(a)
    },
    endDrag: function (a) {
        if (!this.dragging) {
            return
        }
        this.stopScrolling();
        this.finishDrag(a, true);
        Event.stop(a)
    },
    draw: function (a) {
        var g = this.element.cumulativeOffset();
        if (this.options.ghosting) {
            var c = Position.realOffset(this.element);
            g[0] += c[0] - Position.deltaX;
            g[1] += c[1] - Position.deltaY
        }
        var f = this.currentDelta();
        g[0] -= f[0];
        g[1] -= f[1];
        if (this.options.scroll && (this.options.scroll != window && this._isScrollChild)) {
            g[0] -= this.options.scroll.scrollLeft - this.originalScrollLeft;
            g[1] -= this.options.scroll.scrollTop - this.originalScrollTop
        }
        var e = [0, 1].map(function (d) {
            return (a[d] - g[d] - this.offset[d])
        }.bind(this));
        if (this.options.snap) {
            if (Object.isFunction(this.options.snap)) {
                e = this.options.snap(e[0], e[1], this)
            } else {
                if (Object.isArray(this.options.snap)) {
                    e = e.map(function (d, h) {
                        return (d / this.options.snap[h]).round() * this.options.snap[h]
                    }.bind(this))
                } else {
                    e = e.map(function (d) {
                        return (d / this.options.snap).round() * this.options.snap
                    }.bind(this))
                }
            }
        }
        var b = this.element.style;
        if ((!this.options.constraint) || (this.options.constraint == "horizontal")) {
            b.left = e[0] + "px"
        }
        if ((!this.options.constraint) || (this.options.constraint == "vertical")) {
            b.top = e[1] + "px"
        }
        if (b.visibility == "hidden") {
            b.visibility = ""
        }
    },
    stopScrolling: function () {
        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
            Draggables._lastScrollPointer = null
        }
    },
    startScrolling: function (a) {
        if (!(a[0] || a[1])) {
            return
        }
        this.scrollSpeed = [a[0] * this.options.scrollSpeed, a[1] * this.options.scrollSpeed];
        this.lastScrolled = new Date();
        this.scrollInterval = setInterval(this.scroll.bind(this), 10)
    },
    scroll: function () {
        var current = new Date();
        var delta = current - this.lastScrolled;
        this.lastScrolled = current;
        if (this.options.scroll == window) {
            with(this._getWindowScroll(this.options.scroll)) {
                if (this.scrollSpeed[0] || this.scrollSpeed[1]) {
                    var d = delta / 1000;
                    this.options.scroll.scrollTo(left + d * this.scrollSpeed[0], top + d * this.scrollSpeed[1])
                }
            }
        } else {
            this.options.scroll.scrollLeft += this.scrollSpeed[0] * delta / 1000;
            this.options.scroll.scrollTop += this.scrollSpeed[1] * delta / 1000
        }
        Position.prepare();
        Droppables.show(Draggables._lastPointer, this.element);
        Draggables.notify("onDrag", this);
        if (this._isScrollChild) {
            Draggables._lastScrollPointer = Draggables._lastScrollPointer || $A(Draggables._lastPointer);
            Draggables._lastScrollPointer[0] += this.scrollSpeed[0] * delta / 1000;
            Draggables._lastScrollPointer[1] += this.scrollSpeed[1] * delta / 1000;
            if (Draggables._lastScrollPointer[0] < 0) {
                Draggables._lastScrollPointer[0] = 0
            }
            if (Draggables._lastScrollPointer[1] < 0) {
                Draggables._lastScrollPointer[1] = 0
            }
            this.draw(Draggables._lastScrollPointer)
        }
        if (this.options.change) {
            this.options.change(this)
        }
    },
    _getWindowScroll: function (w) {
        var T, L, W, H;
        with(w.document) {
            if (w.document.documentElement && documentElement.scrollTop) {
                T = documentElement.scrollTop;
                L = documentElement.scrollLeft
            } else {
                if (w.document.body) {
                    T = body.scrollTop;
                    L = body.scrollLeft
                }
            } if (w.innerWidth) {
                W = w.innerWidth;
                H = w.innerHeight
            } else {
                if (w.document.documentElement && documentElement.clientWidth) {
                    W = documentElement.clientWidth;
                    H = documentElement.clientHeight
                } else {
                    W = body.offsetWidth;
                    H = body.offsetHeight
                }
            }
        }
        return {
            top: T,
            left: L,
            width: W,
            height: H
        }
    }
});
Draggable._dragging = {};
var SortableObserver = Class.create({
    initialize: function (b, a) {
        this.element = $(b);
        this.observer = a;
        this.lastValue = Sortable.serialize(this.element)
    },
    onStart: function () {
        this.lastValue = Sortable.serialize(this.element)
    },
    onEnd: function () {
        Sortable.unmark();
        if (this.lastValue != Sortable.serialize(this.element)) {
            this.observer(this.element)
        }
    }
});
var Sortable = {
    SERIALIZE_RULE: /^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,
    sortables: {},
    _findRootElement: function (a) {
        while (a.tagName.toUpperCase() != "BODY") {
            if (a.id && Sortable.sortables[a.id]) {
                return a
            }
            a = a.parentNode
        }
    },
    options: function (a) {
        a = Sortable._findRootElement($(a));
        if (!a) {
            return
        }
        return Sortable.sortables[a.id]
    },
    destroy: function (a) {
        a = $(a);
        var b = Sortable.sortables[a.id];
        if (b) {
            Draggables.removeObserver(b.element);
            b.droppables.each(function (c) {
                Droppables.remove(c)
            });
            b.draggables.invoke("destroy");
            delete Sortable.sortables[b.element.id]
        }
    },
    create: function (c) {
        c = $(c);
        var b = Object.extend({
            element: c,
            tag: "li",
            dropOnEmpty: false,
            tree: false,
            treeTag: "ul",
            overlap: "vertical",
            constraint: "vertical",
            containment: c,
            handle: false,
            only: false,
            delay: 0,
            hoverclass: null,
            ghosting: false,
            quiet: false,
            scroll: false,
            scrollSensitivity: 20,
            scrollSpeed: 15,
            format: this.SERIALIZE_RULE,
            elements: false,
            handles: false,
            onChange: Prototype.emptyFunction,
            onUpdate: Prototype.emptyFunction
        }, arguments[1] || {});
        this.destroy(c);
        var a = {
            revert: true,
            quiet: b.quiet,
            scroll: b.scroll,
            scrollSpeed: b.scrollSpeed,
            scrollSensitivity: b.scrollSensitivity,
            delay: b.delay,
            ghosting: b.ghosting,
            constraint: b.constraint,
            handle: b.handle
        };
        if (b.starteffect) {
            a.starteffect = b.starteffect
        }
        if (b.reverteffect) {
            a.reverteffect = b.reverteffect
        } else {
            if (b.ghosting) {
                a.reverteffect = function (f) {
                    f.style.top = 0;
                    f.style.left = 0
                }
            }
        } if (b.endeffect) {
            a.endeffect = b.endeffect
        }
        if (b.zindex) {
            a.zindex = b.zindex
        }
        var d = {
            overlap: b.overlap,
            containment: b.containment,
            tree: b.tree,
            hoverclass: b.hoverclass,
            onHover: Sortable.onHover
        };
        var e = {
            onHover: Sortable.onEmptyHover,
            overlap: b.overlap,
            containment: b.containment,
            hoverclass: b.hoverclass
        };
        Element.cleanWhitespace(c);
        b.draggables = [];
        b.droppables = [];
        if (b.dropOnEmpty || b.tree) {
            Droppables.add(c, e);
            b.droppables.push(c)
        }(b.elements || this.findElements(c, b) || []).each(function (h, f) {
            var g = b.handles ? $(b.handles[f]) : (b.handle ? $(h).select("." + b.handle)[0] : h);
            b.draggables.push(new Draggable(h, Object.extend(a, {
                handle: g
            })));
            Droppables.add(h, d);
            if (b.tree) {
                h.treeNode = c
            }
            b.droppables.push(h)
        });
        if (b.tree) {
            (Sortable.findTreeElements(c, b) || []).each(function (f) {
                Droppables.add(f, e);
                f.treeNode = c;
                b.droppables.push(f)
            })
        }
        this.sortables[c.identify()] = b;
        Draggables.addObserver(new SortableObserver(c, b.onUpdate))
    },
    findElements: function (b, a) {
        return Element.findChildren(b, a.only, a.tree ? true : false, a.tag)
    },
    findTreeElements: function (b, a) {
        return Element.findChildren(b, a.only, a.tree ? true : false, a.treeTag)
    },
    onHover: function (e, d, a) {
        if (Element.isParent(d, e)) {
            return
        }
        if (a > 0.33 && a < 0.66 && Sortable.options(d).tree) {
            return
        } else {
            if (a > 0.5) {
                Sortable.mark(d, "before");
                if (d.previousSibling != e) {
                    var b = e.parentNode;
                    e.style.visibility = "hidden";
                    d.parentNode.insertBefore(e, d);
                    if (d.parentNode != b) {
                        Sortable.options(b).onChange(e)
                    }
                    Sortable.options(d.parentNode).onChange(e)
                }
            } else {
                Sortable.mark(d, "after");
                var c = d.nextSibling || null;
                if (c != e) {
                    var b = e.parentNode;
                    e.style.visibility = "hidden";
                    d.parentNode.insertBefore(e, c);
                    if (d.parentNode != b) {
                        Sortable.options(b).onChange(e)
                    }
                    Sortable.options(d.parentNode).onChange(e)
                }
            }
        }
    },
    onEmptyHover: function (e, g, h) {
        var j = e.parentNode;
        var a = Sortable.options(g);
        if (!Element.isParent(g, e)) {
            var f;
            var c = Sortable.findElements(g, {
                tag: a.tag,
                only: a.only
            });
            var b = null;
            if (c) {
                var d = Element.offsetSize(g, a.overlap) * (1 - h);
                for (f = 0; f < c.length; f += 1) {
                    if (d - Element.offsetSize(c[f], a.overlap) >= 0) {
                        d -= Element.offsetSize(c[f], a.overlap)
                    } else {
                        if (d - (Element.offsetSize(c[f], a.overlap) / 2) >= 0) {
                            b = f + 1 < c.length ? c[f + 1] : null;
                            break
                        } else {
                            b = c[f];
                            break
                        }
                    }
                }
            }
            g.insertBefore(e, b);
            Sortable.options(j).onChange(e);
            a.onChange(e)
        }
    },
    unmark: function () {
        if (Sortable._marker) {
            Sortable._marker.hide()
        }
    },
    mark: function (b, a) {
        var d = Sortable.options(b.parentNode);
        if (d && !d.ghosting) {
            return
        }
        if (!Sortable._marker) {
            Sortable._marker = ($("dropmarker") || Element.extend(document.createElement("DIV"))).hide().addClassName("dropmarker").setStyle({
                position: "absolute"
            });
            document.getElementsByTagName("body").item(0).appendChild(Sortable._marker)
        }
        var c = b.cumulativeOffset();
        Sortable._marker.setStyle({
            left: c[0] + "px",
            top: c[1] + "px"
        });
        if (a == "after") {
            if (d.overlap == "horizontal") {
                Sortable._marker.setStyle({
                    left: (c[0] + b.clientWidth) + "px"
                })
            } else {
                Sortable._marker.setStyle({
                    top: (c[1] + b.clientHeight) + "px"
                })
            }
        }
        Sortable._marker.show()
    },
    _tree: function (e, b, f) {
        var d = Sortable.findElements(e, b) || [];
        for (var c = 0; c < d.length; ++c) {
            var a = d[c].id.match(b.format);
            if (!a) {
                continue
            }
            var g = {
                id: encodeURIComponent(a ? a[1] : null),
                element: e,
                parent: f,
                children: [],
                position: f.children.length,
                container: $(d[c]).down(b.treeTag)
            };
            if (g.container) {
                this._tree(g.container, b, g)
            }
            f.children.push(g)
        }
        return f
    },
    tree: function (d) {
        d = $(d);
        var c = this.options(d);
        var b = Object.extend({
            tag: c.tag,
            treeTag: c.treeTag,
            only: c.only,
            name: d.id,
            format: c.format
        }, arguments[1] || {});
        var a = {
            id: null,
            parent: null,
            children: [],
            container: d,
            position: 0
        };
        return Sortable._tree(d, b, a)
    },
    _constructIndex: function (b) {
        var a = "";
        do {
            if (b.id) {
                a = "[" + b.position + "]" + a
            }
        } while ((b = b.parent) != null);
        return a
    },
    sequence: function (b) {
        b = $(b);
        var a = Object.extend(this.options(b), arguments[1] || {});
        return $(this.findElements(b, a) || []).map(function (c) {
            return c.id.match(a.format) ? c.id.match(a.format)[1] : ""
        })
    },
    setSequence: function (b, c) {
        b = $(b);
        var a = Object.extend(this.options(b), arguments[2] || {});
        var d = {};
        this.findElements(b, a).each(function (e) {
            if (e.id.match(a.format)) {
                d[e.id.match(a.format)[1]] = [e, e.parentNode]
            }
            e.parentNode.removeChild(e)
        });
        c.each(function (e) {
            var f = d[e];
            if (f) {
                f[1].appendChild(f[0]);
                delete d[e]
            }
        })
    },
    serialize: function (c) {
        c = $(c);
        var b = Object.extend(Sortable.options(c), arguments[1] || {});
        var a = encodeURIComponent((arguments[1] && arguments[1].name) ? arguments[1].name : c.id);
        if (b.tree) {
            return Sortable.tree(c, arguments[1]).children.map(function (d) {
                return [a + Sortable._constructIndex(d) + "[id]=" + encodeURIComponent(d.id)].concat(d.children.map(arguments.callee))
            }).flatten().join("&")
        } else {
            return Sortable.sequence(c, arguments[1]).map(function (d) {
                return a + "[]=" + encodeURIComponent(d)
            }).join("&")
        }
    }
};
Element.isParent = function (b, a) {
    if (!b.parentNode || b == a) {
        return false
    }
    if (b.parentNode == a) {
        return true
    }
    return Element.isParent(b.parentNode, a)
};
Element.findChildren = function (d, b, a, c) {
    if (!d.hasChildNodes()) {
        return null
    }
    c = c.toUpperCase();
    if (b) {
        b = [b].flatten()
    }
    var e = [];
    $A(d.childNodes).each(function (g) {
        if (g.tagName && g.tagName.toUpperCase() == c && (!b || (Element.classNames(g).detect(function (h) {
            return b.include(h)
        })))) {
            e.push(g)
        }
        if (a) {
            var f = Element.findChildren(g, b, a, c);
            if (f) {
                e.push(f)
            }
        }
    });
    return (e.length > 0 ? e.flatten() : [])
};
Element.offsetSize = function (a, b) {
    return a["offset" + ((b == "vertical" || b == "height") ? "Height" : "Width")]
};
