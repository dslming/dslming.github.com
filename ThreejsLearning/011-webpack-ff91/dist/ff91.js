"use strict";
define("AssetLoader", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = window.THREE;
    var Cargo = /** @class */ (function () {
        function Cargo() {
            this.mesh = {};
        }
        Cargo.prototype.addAsset = function (name, asset) {
            if (this.mesh[name] === undefined) {
                this.mesh[name] = asset;
                return true;
            }
            return false;
        };
        Cargo.prototype.getMesh = function (name) {
            return this.mesh[name] !== undefined ? this.mesh[name] : null;
        };
        Cargo.prototype.getTexture = function (name) {
            return this.mesh[name] !== undefined ? this.mesh[name] : null;
        };
        Cargo.prototype.getCubeTexture = function (name) {
            return this.mesh[name] !== undefined ? this.mesh[name] : null;
        };
        return Cargo;
    }());
    var AssetLoader = /** @class */ (function () {
        function AssetLoader(_path, _manifesto, _callback) {
            this.path = _path;
            this.manifesto = _manifesto;
            this.callback = _callback;
            this.language = document.location.href.indexOf('/us') > -1 ? 'us' : 'cn';
            this.cargo = new Cargo();
            this.assetCount = 0;
            this.assetTotal = _manifesto.length;
            this.loaderText = new THREE.TextureLoader();
            this.loaderMesh = new THREE.ObjectLoader();
            this.loaderCube = new THREE.CubeTextureLoader();
            this.container = document.getElementById('preloader');
            this.progBar = document.getElementById('preProg');
            this.detailBox = document.getElementById('preDetail');
        }
        AssetLoader.prototype.start = function () {
            var _this = this;
            this.container && (this.container.className = 'visible');
            if (this.language === 'us') {
                this.detailBox && (this.detailBox.innerHTML = 'Loading assets');
            }
            else {
                this.detailBox && (this.detailBox.innerHTML = '加载中');
            }
            var ext;
            var _loop_1 = function (i) {
                ext = '.' + this_1.manifesto[i].ext;
                switch (this_1.manifesto[i].type) {
                    case 'texture':
                        this_1.loaderText.load(this_1.path + 'textures/' + this_1.manifesto[i].name + ext, function (_obj) {
                            _this.assetAquired(_obj, _this.manifesto[i].name);
                        }, undefined, function (_err) {
                            _this.assetFailed(_err, _this.manifesto[i].name);
                        });
                        break;
                    case 'mesh':
                        this_1.loaderMesh.load(this_1.path + 'meshes/' + this_1.manifesto[i].name + '.json', function (_obj) {
                            _this.assetAquired(_obj, _this.manifesto[i].name);
                        }, undefined, function (_err) {
                            _this.assetFailed(_err, _this.manifesto[i].name);
                        });
                        break;
                    case 'cubetexture':
                        this_1.loaderCube.setPath(this_1.path + 'textures/' + this_1.manifesto[i].name + '/');
                        this_1.loaderCube.load([
                            'xp' + ext,
                            'xn' + ext,
                            'yp' + ext,
                            'yn' + ext,
                            'zp' + ext,
                            'zn' + ext
                        ], function (_obj) {
                            _this.assetAquired(_obj, _this.manifesto[i].name);
                        }, undefined, function (_err) {
                            _this.assetFailed(_err, _this.manifesto[i].name);
                        });
                        break;
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.assetTotal; i++) {
                _loop_1(i);
            }
        };
        AssetLoader.prototype.remove = function () {
            this.container && (this.container.className = '');
        };
        AssetLoader.prototype.assetAquired = function (_obj, _name) {
            this.cargo.addAsset(_name, _obj);
            this.assetCount++;
            this.pct = this.assetCount / this.assetTotal;
            this.progBar && (this.progBar.style.width = this.pct * 100 + '%');
            if (this.assetCount == this.assetTotal) {
                this.complete();
            }
        };
        AssetLoader.prototype.assetFailed = function (_err, _name) {
            this.assetCount++;
            this.pct = this.assetCount / this.assetTotal;
            if (this.assetCount == this.assetTotal) {
                this.complete();
            }
        };
        AssetLoader.prototype.complete = function () {
            this.container && (this.container.classList.remove('visible'));
            this.callback(this.cargo);
        };
        return AssetLoader;
    }());
    exports.default = AssetLoader;
});
define("CameraControl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = window.THREE;
    var CameraControl = /** @class */ (function () {
        function CameraControl(_options) {
            this.forceUpdate = true;
            this.options = {
                distance: 90,
                focusPos: new THREE.Vector3(),
                rotation: new THREE.Vector3(),
                rotRange: {
                    xMax: Number.POSITIVE_INFINITY,
                    xMin: Number.NEGATIVE_INFINITY,
                    yMax: 90,
                    yMin: -90
                },
                distRange: {
                    max: Number.POSITIVE_INFINITY,
                    min: Number.NEGATIVE_INFINITY
                },
                fov: 45,
                eyeSeparation: 1.5,
                smartUpdates: false
            };
            this.readOptions(_options);
            this.vpW = window.innerWidth;
            this.vpH = window.innerHeight;
            this.quatX = new THREE.Quaternion();
            this.quatY = new THREE.Quaternion();
            this.camHolder = new THREE.Object3D();
            this.gyro = { orient: 0 };
            if (window.orientation !== undefined) {
                this.defaultEuler = new THREE.Euler(90 * CameraControl.RADIANS, 180 * CameraControl.RADIANS, (180 + parseInt(window.orientation.toString(), 10)) * CameraControl.RADIANS);
            }
            else {
                this.defaultEuler = new THREE.Euler(0, 0, 0);
            }
        }
        CameraControl.prototype.readOptions = function (_options) {
            var opt = this.options;
            for (var key in _options) {
                if (key === 'rotRange') {
                    for (var key in _options.rotRange) {
                        opt.rotRange[key] = _options.rotRange[key];
                    }
                }
                else if (key === 'distRange') {
                    for (var key in _options.distRange) {
                        opt.distRange[key] = _options.distRange[key];
                    }
                }
                else if (key === 'focusPos') {
                    for (var key in _options.focusPos) {
                        opt.focusPos[key] = _options.focusPos[key];
                    }
                }
                else if (key === 'rotation') {
                    for (var key in _options.rotation) {
                        opt.rotation[key] = _options.rotation[key];
                    }
                }
                else {
                    opt[key] = _options[key];
                }
            }
            this.distActual = opt.distance;
            this.distTarget = opt.distance;
            this.focusActual = new THREE.Vector3(opt.focusPos.x, opt.focusPos.y, opt.focusPos.z);
            this.focusTarget = this.focusActual.clone();
            this.rotActual = new THREE.Vector3(opt.rotation.x, opt.rotation.y, opt.rotation.z);
            this.rotTarget = this.rotActual.clone();
        };
        CameraControl.prototype.setDistance = function (dist) {
            this.distTarget = dist;
            this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
            this.forceUpdate = true;
        };
        CameraControl.prototype.setDistRange = function (max, min) {
            this.options.distRange.max = max;
            this.options.distRange.min = min;
        };
        CameraControl.prototype.setRotation = function (_rotX, _rotY, _rotZ) {
            if (_rotX === void 0) {
                _rotX = 0;
            }
            if (_rotY === void 0) {
                _rotY = 0;
            }
            if (_rotZ === void 0) {
                _rotZ = 0;
            }
            this.rotActual.set(_rotX, _rotY, _rotZ);
            this.rotTarget.set(_rotX, _rotY, _rotZ);
            this.gyro.alpha = undefined;
            this.gyro.beta = undefined;
            this.gyro.gamma = undefined;
            this.forceUpdate = true;
        };
        CameraControl.prototype.setRotRange = function (xMax, xMin, yMax, yMin) {
            this.options.rotRange.xMax = xMax !== undefined ? xMax : this.options.rotRange.xMax;
            this.options.rotRange.xMin = xMin !== undefined ? xMin : this.options.rotRange.xMin;
            this.options.rotRange.yMax = yMax !== undefined ? yMax : this.options.rotRange.yMax;
            this.options.rotRange.yMin = yMin !== undefined ? yMin : this.options.rotRange.yMin;
        };
        CameraControl.prototype.clearRotRange = function () {
            this.options.rotRange.xMax = Number.POSITIVE_INFINITY;
            this.options.rotRange.xMin = Number.NEGATIVE_INFINITY;
            this.options.rotRange.yMax = Number.POSITIVE_INFINITY;
            this.options.rotRange.yMin = Number.NEGATIVE_INFINITY;
        };
        CameraControl.prototype.setFocusPos = function (_posX, _posY, _posZ) {
            if (_posX === void 0) {
                _posX = 0;
            }
            if (_posY === void 0) {
                _posY = 0;
            }
            if (_posZ === void 0) {
                _posZ = 0;
            }
            this.focusActual.set(_posX, _posY, _posZ);
            this.focusTarget.set(_posX, _posY, _posZ);
            this.forceUpdate = true;
        };
        CameraControl.prototype.getDistance = function () {
            return this.distTarget;
        };
        CameraControl.prototype.dolly = function (distance) {
            this.distTarget += distance;
            this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
        };
        CameraControl.prototype.orbitBy = function (angleX, angleY) {
            this.rotTarget.x += angleX;
            this.rotTarget.y += angleY;
            this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
            this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
        };
        CameraControl.prototype.orbitTo = function (angleX, angleY) {
            this.rotTarget.x = angleX;
            this.rotTarget.y = angleY;
            this.rotTarget.x = THREE.Math.clamp(this.rotTarget.x, this.options.rotRange.xMin, this.options.rotRange.xMax);
            this.rotTarget.y = THREE.Math.clamp(this.rotTarget.y, this.options.rotRange.yMin, this.options.rotRange.yMax);
        };
        CameraControl.prototype.pan = function (distX, distY) {
            this.focusTarget.x -= distX;
            this.focusTarget.y += distY;
        };
        CameraControl.prototype.onWindowResize = function (vpW, vpH) {
            this.vpW = vpW;
            this.vpH = vpH;
            this.forceUpdate = true;
        };
        CameraControl.prototype.onDeviceReorientation = function (orientation) {
            this.gyro.orient = orientation * CameraControl.RADIANS;
            this.forceUpdate = true;
        };
        CameraControl.prototype.onGyroMove = function (alpha, beta, gamma) {
            var acc = this.gyro;
            acc.alpha = alpha;
            acc.beta = beta;
            acc.gamma = gamma;
        };
        CameraControl.prototype.follow = function (target) {
            this.distTarget = THREE.Math.clamp(this.distTarget, this.options.distRange.min, this.options.distRange.max);
            this.distActual += (this.distTarget - this.distActual) * 0.01;
            this.focusTarget.set(target.x, target.y + 1, target.z + this.distActual);
            this.focusActual.lerp(this.focusTarget, 0.01);
            this.camHolder.position.copy(this.focusActual);
            this.camHolder.lookAt(target);
        };
        CameraControl.prototype.changesOccurred = function () {
            if (this.options.smartUpdates && this.rotActual.manhattanDistanceTo(this.rotTarget) < 0.01 && Math.abs(this.distActual - this.distTarget) < 0.01 && this.focusActual.manhattanDistanceTo(this.focusTarget) < 0.01) {
                return false;
            }
            return true;
        };
        CameraControl.RADIANS = Math.PI / 180;
        CameraControl.AXIS_X = new THREE.Vector3(1, 0, 0);
        CameraControl.AXIS_Y = new THREE.Vector3(0, 1, 0);
        return CameraControl;
    }());
    exports.default = CameraControl;
});
define("Tool", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function normalize(val, min, max) {
        return Math.max(0, Math.min(1, (val - min) / (max - min)));
    }
    exports.normalize = normalize;
    function normalizeQuadIn(val, min, max) {
        return Math.pow(normalize(val, min, max), 2);
    }
    exports.normalizeQuadIn = normalizeQuadIn;
    function normalizeQuadOut(val, min, max) {
        var x = normalize(val, min, max);
        return x * (2 - x);
    }
    exports.normalizeQuadOut = normalizeQuadOut;
    function shuffle(array) {
        var m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }
    exports.shuffle = shuffle;
    function mod(n, m) {
        return (n % m + m) % m;
    }
    exports.mod = mod;
    function scaleAndCenter(_geometry, _bounds, _center) {
        if (_center === void 0) {
            _center = 'xyz';
        }
        if (_bounds.x === undefined)
            _bounds.x = Infinity;
        if (_bounds.y === undefined)
            _bounds.y = Infinity;
        if (_bounds.z === undefined)
            _bounds.z = Infinity;
        if (_bounds.x === _bounds.y && _bounds.y === _bounds.z && _bounds.z === Infinity) {
            return null;
        }
        _geometry.computeBoundingBox();
        var geomMin = _geometry.boundingBox.min;
        var geomMax = _geometry.boundingBox.max;
        var width = geomMax.x - geomMin.x;
        var height = geomMax.z - geomMin.z;
        var depth = geomMax.y - geomMin.y;
        var avgX = _center.indexOf('x') > -1 ? (geomMax.x + geomMin.x) / 2 : 0;
        var avgY = _center.indexOf('y') > -1 ? (geomMax.y + geomMin.y) / 2 : 0;
        var avgZ = _center.indexOf('z') > -1 ? (geomMax.z + geomMin.z) / 2 : 0;
        _geometry.translate(-avgX, -avgY, -avgZ);
        var xDiff = _bounds.x / width;
        var yDiff = _bounds.y / height;
        var zDiff = _bounds.z / depth;
        var geoScale = Math.min(xDiff, yDiff, zDiff);
        _geometry.scale(geoScale, geoScale, geoScale);
    }
    exports.scaleAndCenter = scaleAndCenter;
    function zTween(_val, _target, _ratio) {
        return Math.abs(_target - _val) < 0.00001 ? _target : _val + (_target - _val) * Math.min(_ratio, 1);
    }
    exports.zTween = zTween;
    var Time = /** @class */ (function () {
        function Time(timeFactor) {
            this.fallBackRates = [
                60,
                40,
                30,
                20,
                15
            ];
            this.prev = 0;
            this.prevBreak = 0;
            this.delta = 0;
            this.timeFact = typeof timeFactor === 'undefined' ? 1 : timeFactor;
            this.frameCount = 0;
            this.fallBackIndex = 0;
            this.setFPS(60);
        }
        Time.prototype.update = function (_newTime) {
            this.deltaBreak = Math.min(_newTime - this.prevBreak, 1);
            if (this.deltaBreak > this.spf) {
                this.delta = Math.min(_newTime - this.prev, 1);
                this.prev = _newTime;
                this.prevBreak = _newTime - this.deltaBreak % this.spf;
                return true;
            }
            else {
                return false;
            }
        };
        Time.prototype.checkFPS = function () {
            if (this.delta > this.spf * 2) {
                this.frameCount++;
                console.log(this.frameCount);
                if (this.frameCount > 30) {
                    this.frameCount = 0;
                    this.fallBackIndex++;
                    this.setFPS(this.fallBackRates[this.fallBackIndex]);
                }
            }
        };
        Time.prototype.setFPS = function (_newVal) {
            this.fps = _newVal;
            this.spf = 1 / this.fps;
        };
        return Time;
    }());
    exports.Time = Time;
});
define("Camera", ["require", "exports", "tslib", "CameraControl", "Tool"], function (require, exports, tslib_1, CameraControl_1, Tool_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    CameraControl_1 = tslib_1.__importDefault(CameraControl_1);
    var THREE = window.THREE;
    var Camera = /** @class */ (function (_super) {
        tslib_1.__extends(Camera, _super);
        function Camera(options) {
            var _this = _super.call(this, options) || this;
            _this.camera = new THREE.PerspectiveCamera(_this.options.fov, _this.vpW / _this.vpH, 0.1, 100);
            return _this;
        }
        Camera.prototype.onWindowResize = function (vpW, vpH) {
            _super.prototype.onWindowResize.call(this, vpW, vpH);
            this.camera.aspect = this.vpW / this.vpH;
            this.camera.updateProjectionMatrix();
        };
        ;
        Camera.prototype.update = function () {
            if (!this.forceUpdate && !this.changesOccurred()) {
                return false;
            }
            this.focusActual.lerp(this.focusTarget, 0.05);
            this.camera.position.copy(this.focusActual);
            if (this.gyro.alpha && this.gyro.beta && this.gyro.gamma) {
                this.camera.setRotationFromEuler(this.defaultEuler);
                this.camera.rotateZ(this.gyro.alpha * CameraControl_1.default.RADIANS);
                this.camera.rotateX(this.gyro.beta * CameraControl_1.default.RADIANS);
                this.camera.rotateY(this.gyro.gamma * CameraControl_1.default.RADIANS);
                this.camera.rotation.z += this.gyro.orient;
            }
            else {
                this.rotActual.lerp(this.rotTarget, 0.05);
                this.quatX.setFromAxisAngle(CameraControl_1.default.AXIS_X, -THREE.Math.degToRad(this.rotActual.y));
                this.quatY.setFromAxisAngle(CameraControl_1.default.AXIS_Y, -THREE.Math.degToRad(this.rotActual.x));
                this.quatY.multiply(this.quatX);
                this.camera.quaternion.copy(this.quatY);
            }
            if (this.distActual !== this.distTarget) {
                this.distActual = Tool_1.zTween(this.distActual, this.distTarget, 0.05);
            }
            this.camera.translateZ(this.distActual);
            this.forceUpdate = false;
            return true;
        };
        return Camera;
    }(CameraControl_1.default));
    exports.default = Camera;
});
define("Props", ["require", "exports", "Tool"], function (require, exports, Tool_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = window.THREE;
    var FF91Props = /** @class */ (function () {
        function FF91Props() {
        }
        FF91Props.Accel = 5;
        FF91Props.Decel = -10;
        FF91Props.MaxVel = 70 * 1610 / 3600;
        FF91Props.MaxTurn = Math.PI * 0.2;
        FF91Props.Length = 5.25;
        FF91Props.Width = 2.283;
        FF91Props.WheelTrack = 1.72;
        FF91Props.WheelBase = 3.2;
        FF91Props.WheelDiam = 0.78;
        FF91Props.WheelCirc = FF91Props.WheelDiam * Math.PI;
        return FF91Props;
    }());
    exports.FF91Props = FF91Props;
    var CarProps = /** @class */ (function () {
        function CarProps() {
            this.time = new Tool_2.Time(undefined);
            this.velocity = new THREE.Vector2();
            this.speed = 1;
            this.accel = 0;
            this.pos = new THREE.Vector2();
            this.longitMomentum = 0;
            this.lateralMomentum = 0;
            this.wAngleInner = 0;
            this.wAngleOuter = 0;
            this.wAngleTarg = 0;
            this.joyVec = new THREE.Vector2();
            this.keys = new Array();
            this.braking = false;
            this.headLights = 2;
            this.omega = 0;
            this.theta = 0;
        }
        CarProps.prototype.onKeyDown = function (evt) {
            if (this.keys.indexOf(evt.keyCode) === -1) {
                this.keys.push(evt.keyCode);
            }
        };
        CarProps.prototype.onKeyUp = function (evt) {
            this.keys.splice(this.keys.indexOf(evt.keyCode), 1);
        };
        CarProps.prototype.readKeyboardInput = function () {
            for (var i = 0; i < this.keys.length; i++) {
                switch (this.keys[i]) {
                    case 38:
                        this.accel += FF91Props.Accel;
                        this.accel *= Tool_2.normalizeQuadIn(this.speed, FF91Props.MaxVel, FF91Props.MaxVel - 10);
                        break;
                    case 40:
                        this.accel += FF91Props.Decel;
                        break;
                    case 37:
                        this.wAngleTarg += FF91Props.MaxTurn;
                        break;
                    case 39:
                        this.wAngleTarg -= FF91Props.MaxTurn;
                        break;
                }
            }
        };
        CarProps.prototype.onJoystickMove = function (_vec) {
            this.joyVec.x = _vec.x / -40;
            this.joyVec.y = _vec.y / -40;
            if (Math.abs(this.joyVec.x) > 0.85) {
                this.joyVec.y = 0;
            }
            if (Math.abs(this.joyVec.y) > 0.95) {
                this.joyVec.x = 0;
            }
        };
        CarProps.prototype.onKnobMove = function (_vec, _section) {
            this.joyVec.x = _vec.x / -150;
            this.joyVec.y = _vec.y / -150;
            if (_section === 5 && Math.abs(this.joyVec.x) < 0.1) {
                this.joyVec.x = 0;
            }
        };
        CarProps.prototype.readJoyStickInput = function () {
            this.wAngleTarg = this.joyVec.x * FF91Props.MaxTurn;
            if (this.joyVec.y >= 0) {
                this.accel = this.joyVec.y * FF91Props.Accel;
                this.accel *= Tool_2.normalizeQuadIn(this.speed, FF91Props.MaxVel, FF91Props.MaxVel - 10);
            }
            else {
                this.accel = this.joyVec.y * -FF91Props.Decel;
            }
        };
        CarProps.prototype.changeHeadlights = function (_new) {
            this.headLights = THREE.Math.clamp(Math.round(_new), 0, 4);
        };
        CarProps.prototype.update = function (_time) {
            if (this.time.update(_time) === false) {
                return false;
            }
            this.accel = 0;
            this.wAngleTarg = 0;
            if (this.keys.length > 0) {
                this.readKeyboardInput();
            }
            else if (this.joyVec.x != 0 || this.joyVec.y != 0) {
                this.readJoyStickInput();
            }
            this.accel *= this.time.delta;
            this.speed += this.accel;
            this.braking = this.accel < 0;
            if (this.speed < 0) {
                this.speed = 0;
                this.accel = 0;
            }
            this.frameDist = this.speed * this.time.delta;
            this.wAngleTarg *= Tool_2.normalizeQuadIn(this.speed, FF91Props.MaxVel + 10, 3);
            this.wAngleInner = Tool_2.zTween(this.wAngleInner, this.wAngleTarg, this.time.delta * 2);
            this.wAngleSign = this.wAngleInner > 0.001 ? 1 : this.wAngleInner < -0.001 ? -1 : 0;
            this.omega = this.wAngleInner * this.speed / FF91Props.WheelBase;
            this.theta += this.omega * this.time.delta;
            this.velocity.set(Math.cos(this.theta) * this.frameDist, -Math.sin(this.theta) * this.frameDist);
            this.pos.add(this.velocity);
            this.longitMomentum = Tool_2.zTween(this.longitMomentum, this.accel / this.time.delta, this.time.delta * 6);
            this.lateralMomentum = this.omega * this.speed;
            if (this.wAngleSign) {
                this.radFrontIn = FF91Props.WheelBase / Math.sin(this.wAngleInner);
                this.radBackIn = FF91Props.WheelBase / Math.tan(this.wAngleInner);
                this.radBackOut = this.radBackIn + FF91Props.WheelTrack * this.wAngleSign;
                this.wAngleOuter = Math.atan(FF91Props.WheelBase / this.radBackOut);
                this.radFrontOut = FF91Props.WheelBase / Math.sin(this.wAngleOuter);
            }
            else {
                this.radFrontOut = 100;
                this.radBackOut = 100;
                this.radBackIn = 100;
                this.radFrontIn = 100;
                this.wAngleOuter = 0;
            }
            return true;
        };
        return CarProps;
    }());
    exports.CarProps = CarProps;
});
define("CarWheels", ["require", "exports", "Tool", "Props"], function (require, exports, Tool_3, Props_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = window.THREE;
    var CarWheels = /** @class */ (function () {
        function CarWheels(_carWhole, _cargo) {
            this.maxWheelTurn = Math.PI / 9.69;
            this.carWhole = _carWhole;
            this.thread = _cargo.getTexture('thread');
            this.thread.minFilter = THREE.NearestFilter;
            this.thread.magFilter = THREE.LinearFilter;
            this.thread.format = THREE.RGBFormat;
            this.ogMatrix = new THREE.Matrix4().set(0.000788, 0, 0, -0.3939, 0, 0, 0.000788, -0.3939, 0, -0.000788, 0, 0.15, 0, 0, 0, 1);
            this.wPosFr = Props_1.FF91Props.WheelBase;
            this.wPosBk = 0;
            this.wPosLf = Props_1.FF91Props.WheelTrack / -2;
            this.wPosRt = Props_1.FF91Props.WheelTrack / 2;
            this.wPosY = Props_1.FF91Props.WheelDiam / 2;
            var wheelGeom = _cargo.getMesh('wheel');
            this.addWheels(wheelGeom.getObjectByName('Wheel'));
            this.addBrakes(wheelGeom.getObjectByName('Brake'));
        }
        CarWheels.prototype.addWheels = function (_wheelGroup) {
            this.wheelFL = _wheelGroup;
            var meshRubber = this.wheelFL.getObjectByName('Tire');
            var meshSilver = this.wheelFL.getObjectByName('RimsSilver');
            var meshBlack = this.wheelFL.getObjectByName('RimsBlack');
            var geomRubber = meshRubber.geometry;
            var geomSilver = meshSilver.geometry;
            var geomBlack = meshBlack.geometry;
            geomRubber.applyMatrix(this.ogMatrix);
            geomSilver.applyMatrix(this.ogMatrix);
            geomBlack.applyMatrix(this.ogMatrix);
            geomRubber.computeVertexNormals();
            geomSilver.computeVertexNormals();
            geomBlack.computeVertexNormals();
            var matRubber = new THREE.MeshLambertMaterial({
                color: 2105376,
                map: this.thread,
                side: THREE.DoubleSide
            });
            var matSilver = new THREE.MeshPhongMaterial({
                color: 10066329,
                shininess: 50,
                side: THREE.DoubleSide
            });
            var matBlack = new THREE.MeshPhongMaterial({
                color: 1118481,
                shininess: 50,
                side: THREE.DoubleSide
            });
            meshRubber.material = matRubber;
            meshSilver.material = matSilver;
            meshBlack.material = matBlack;
            this.wheelFL.position.set(this.wPosFr, this.wPosY, this.wPosLf);
            this.carWhole.add(this.wheelFL);
            this.wheelBL = this.wheelFL.clone();
            this.wheelBL.position.set(this.wPosBk, this.wPosY, this.wPosLf);
            this.carWhole.add(this.wheelBL);
            var iGeomRubber = geomRubber.clone().scale(1, 1, -1);
            var iGeomSilver = geomSilver.clone().scale(1, 1, -1);
            var iGeomBlack = geomBlack.clone().scale(1, 1, -1);
            iGeomRubber.computeVertexNormals();
            iGeomSilver.computeVertexNormals();
            iGeomBlack.computeVertexNormals();
            var iMeshRubber = new THREE.Mesh(iGeomRubber, matRubber);
            var iMeshSilver = new THREE.Mesh(iGeomSilver, matSilver);
            var iMeshBlack = new THREE.Mesh(iGeomBlack, matBlack);
            this.wheelFR = new THREE.Group();
            this.wheelFR.add(iMeshRubber);
            this.wheelFR.add(iMeshSilver);
            this.wheelFR.add(iMeshBlack);
            this.wheelFR.position.set(this.wPosFr, this.wPosY, this.wPosRt);
            this.carWhole.add(this.wheelFR);
            this.wheelBR = this.wheelFR.clone();
            this.wheelBR.position.set(this.wPosBk, this.wPosY, this.wPosRt);
            this.carWhole.add(this.wheelBR);
        };
        ;
        CarWheels.prototype.addBrakes = function (_brakeGroup) {
            this.brakeBL = _brakeGroup;
            var brMeshDisc = this.brakeBL.getObjectByName('Disc');
            var brMeshPads = this.brakeBL.getObjectByName('Pad');
            brMeshDisc.geometry.applyMatrix(this.ogMatrix);
            brMeshPads.geometry.applyMatrix(this.ogMatrix);
            brMeshDisc.material = new THREE.MeshPhongMaterial({
                color: 5592405,
                shininess: 100,
                flatShading: true
            });
            brMeshPads.material = new THREE.MeshPhongMaterial({
                color: 3355443,
                shininess: 50,
                flatShading: true
            });
            this.brakeBL.position.set(this.wPosBk, this.wPosY, this.wPosLf);
            this.carWhole.add(this.brakeBL);
            this.brakeFL = this.brakeBL.clone();
            this.brakeFL.position.set(this.wPosFr, this.wPosY, this.wPosLf);
            this.brakeFL.rotation.set(0, 0, Math.PI);
            this.carWhole.add(this.brakeFL);
            this.brakeFR = this.brakeBL.clone();
            this.brakeFR.position.set(this.wPosFr, this.wPosY, this.wPosRt);
            this.brakeFR.rotation.set(Math.PI, 0, Math.PI);
            this.carWhole.add(this.brakeFR);
            this.brakeBR = this.brakeBL.clone();
            this.brakeBR.position.set(this.wPosBk, this.wPosY, this.wPosRt);
            this.brakeBR.rotation.set(Math.PI, 0, 0);
            this.carWhole.add(this.brakeBR);
        };
        ;
        CarWheels.prototype.turnByRadiusRatio = function (_props) {
            this.rotOverall = -_props.frameDist / Props_1.FF91Props.WheelCirc * Math.PI * 2;
            this.rotFL = this.rotBL = this.rotFR = this.rotBR = Math.max(this.rotOverall, -this.maxWheelTurn);
            if (_props.wAngleSign !== 0) {
                this.ratioFO = _props.radFrontOut / _props.radBackIn;
                this.ratioBO = _props.radBackOut / _props.radBackIn;
                this.ratioFI = _props.radFrontIn / _props.radBackIn;
                this.ratioBI = 1;
                if (_props.wAngleSign == 1) {
                    this.rotFL *= this.ratioFI;
                    this.rotBL *= this.ratioBI;
                    this.rotFR *= this.ratioFO;
                    this.rotBR *= this.ratioBO;
                    this.wheelFL.rotation.y = _props.wAngleInner;
                    this.wheelFR.rotation.y = _props.wAngleOuter;
                    this.brakeFL.rotation.y = _props.wAngleInner;
                    this.brakeFR.rotation.y = -_props.wAngleOuter;
                }
                else {
                    this.rotFL *= this.ratioFO;
                    this.rotBL *= this.ratioBO;
                    this.rotFR *= this.ratioFI;
                    this.rotBR *= this.ratioBI;
                    this.wheelFL.rotation.y = _props.wAngleOuter;
                    this.wheelFR.rotation.y = _props.wAngleInner;
                    this.brakeFL.rotation.y = _props.wAngleOuter;
                    this.brakeFR.rotation.y = -_props.wAngleInner;
                }
                this.brakeBL.rotation.y = this.wheelBR.rotation.y = this.wheelBL.rotation.y = Tool_3.normalize(_props.speed, 22.2, 0) * _props.wAngleInner * -0.09;
                this.brakeBR.rotation.y = -this.wheelBL.rotation.y;
            }
            this.wheelFL.rotateZ(this.rotFL);
            this.wheelBL.rotateZ(this.rotBL);
            this.wheelFR.rotateZ(this.rotFR);
            this.wheelBR.rotateZ(this.rotBR);
        };
        ;
        CarWheels.prototype.update = function (props) {
            this.turnByRadiusRatio(props);
        };
        ;
        return CarWheels;
    }());
    exports.default = CarWheels;
});
define("CarBody", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Lights_1 = require('./27');
    var Motors_1 = require('./28');
    var Batts_1 = require('./25');
    var CarBody = /** @class */ (function () {
        function CarBody(_scene, _cargo) {
            this.parent = _scene;
            this.carWhole = new THREE.Group();
            this.carWhole.position.x = -1.56;
            this.parent.add(this.carWhole);
            this.carChassis = this.buildCarChassis(_cargo.getMesh('body'), _cargo.getCubeTexture('envReflection'));
            this.carWhole.add(this.carChassis);
            this.addShadow(_cargo.getTexture('shadow'));
            this.carLights = new Lights_1.default(this.carChassis, _cargo);
            this.carWheels = new Wheels_1.default(this.carWhole, _cargo);
            this.carMotors = new Motors_1.default(this.carChassis, _cargo.getMesh('xrays'));
            this.carBatts = new Batts_1.default(this.carWhole, _cargo.getMesh('xrays'));
        }
        CarBody.prototype.buildCarChassis = function (_bodyGeom, _cubeText) {
            _bodyGeom.scale.set(0.0005, 0.0005, 0.0005);
            _bodyGeom.position.set(1.56, 0, 0);
            this.envCube = _cubeText;
            this.envCube.format = THREE.RGBFormat;
            this.matBodySilver = new THREE.MeshStandardMaterial({
                color: 12303291,
                metalness: 0.7,
                roughness: 0.7
            });
            if (window['EXT_STLOD_SUPPORT'] === false) {
                this.envCube.minFilter = THREE.LinearFilter;
                this.matBodySilver.metalness = 0.05;
                this.matBodySilver.roughness = 0.8;
                this.matBodySilver.color = new THREE.Color(7829367);
            }
            this.matBodyBlack = new THREE.MeshLambertMaterial({
                color: 2236962,
                reflectivity: 0.8,
                envMap: this.envCube
            });
            this.matGlassTinted = new THREE.MeshLambertMaterial({
                color: 6710886,
                reflectivity: 1,
                envMap: this.envCube
            });
            this.matUndercarriage = new THREE.MeshBasicMaterial({ color: 0 });
            this.matGlassTransp = new THREE.MeshLambertMaterial({
                color: 6710886,
                reflectivity: 1,
                envMap: this.envCube,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            _bodyGeom.getObjectByName('BodyBlack').material = this.matBodyBlack;
            _bodyGeom.getObjectByName('BodySilver').material = this.matBodySilver;
            _bodyGeom.getObjectByName('GlassTransparent').material = this.matGlassTransp;
            _bodyGeom.getObjectByName('GlassTinted').material = this.matGlassTinted;
            _bodyGeom.getObjectByName('Undercarriage').material = this.matUndercarriage;
            return _bodyGeom;
        };
        CarBody.prototype.addShadow = function (_shad) {
            var shadowPlane = new THREE.PlaneBufferGeometry(6.5, 6.5, 1, 1);
            shadowPlane.rotateX(-Math.PI / 2);
            shadowPlane.translate(1.56, 0, 0);
            var shadowMat = new THREE.MeshBasicMaterial({
                map: _shad,
                blending: THREE.MultiplyBlending,
                transparent: true
            });
            var shadowMesh = new THREE.Mesh(shadowPlane, shadowMat);
            this.carWhole.add(shadowMesh);
        };
        CarBody.prototype.onWindowResize = function (_vpH) {
            this.carLights.onWindowResize(_vpH);
        };
        CarBody.prototype.update = function (_props) {
            this.carWhole.rotation.y = _props.theta;
            if (_props.longitMomentum !== 0) {
                this.carChassis.rotation.z = _props.longitMomentum * 0.0015;
            }
            this.carChassis.rotation.x = _props.lateralMomentum * 0.002;
            this.carWheels.update(_props);
            this.carLights.update(_props);
        };
        return CarBody;
    }());
    exports.default = CarBody;
});
define("shader/head_light_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n // \u5149\u7684\u5F00\u5173\nuniform vec3 lightsT;\t// Lights Turn | x: anyTurn, y: left turn, z: right turn\n// \u5149\u7684\u5F3A\u5EA6\nuniform vec4 lightsS;\t// Lights Stat | x: daytime, y: loBeams, z: hiBeams, w: fogs\nattribute float type;\nvarying float wht;\nvarying float amb;\n\n// z-up position because Blender is weird like that\nvoid main() {\n\tvec2 posXY = vec2(position.y - 2299.0, position.z - 1355.0);\n\tfloat distOrigin = distance(posXY, vec2(0.0));   // FF Logo\n\n\t// 0: Daytime running lights\n\twht = checkType(type, 0.0) * lightsS.x;\n\t\n\t// 1: nightlights\n\twht += checkType(type, 1.0) * lightsS.y;\n\t\n\t// 2: high beams\n\twht += checkType(type, 2.0) * lightsS.z;\n\t\n\t// 3: right turn signal\n\twht += checkType(type, 3.0) * (1.0 + lightsT.x) * lightsS.x;\n\tamb = checkType(type, 3.0) * lightsT.z;\n\t\n\t// 4: left turn signal\n\twht += checkType(type, 4.0) * (1.0 - lightsT.x) * lightsS.x;\n\tamb += checkType(type, 4.0) * lightsT.y;\n\n\t// 5: fog lamps\n\twht += checkType(type, 5.0) * lightsS.w;\n\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n}\n";
});
define("shader/head_light_frag.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#define RED vec3(1.0, 0.1, 0.1) // red\n#define AMB vec3(1.0, 0.6, 0.1)\t// amber\n#define WHT vec3(1.0, 1.0, 1.0)\t// white\n\nvarying float wht;\nvarying float amb;\n\nvoid main() {\n\tgl_FragColor = vec4((WHT * wht + AMB * amb), 1.0);\n}\n";
});
define("shader/tail_light_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#define NIGHTLIGHT 0.4\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n\nuniform vec3 lightsT;\nuniform vec3 lightsO;\nattribute float type;\n\nvarying float redVal;\nvarying float ambVal;\nvarying float whtVal;\nvarying float brightness;\n\nvoid main(){\n\tbrightness = 1.0;\n\n\t// Type 0: Reverse light?\n\n\t// Type 1: Right blinker\n\tambVal = checkType(type, 1.0) * lightsT.z;\n\n\t// Type 2: Left blinker\n\tambVal += checkType(type, 2.0) * lightsT.y;\n\n\t// Type 3: Side brakelights & side nightlights\n\tredVal = checkType(type, 3.0) * (NIGHTLIGHT + lightsO.x * (1.0 - NIGHTLIGHT));\n\n\t// Type 4: Center brakelight\n\tredVal += checkType(type, 4.0) * lightsO.x;\n\n\t// Type 5: Center nightlight\n\tredVal += checkType(type, 5.0) * NIGHTLIGHT;\n\n\t// Type 6: Lower foglights off\n\tredVal += checkType(type, 6.0) * NIGHTLIGHT * 0.2;\n\n\t// Type 7: Lower foglights on\n\tredVal += checkType(type, 7.0) * NIGHTLIGHT * 1.5;\n\t\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );\n}\n";
});
define("shader/tail_grid_vert.glsl", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = "\n#define NIGHTLIGHT 0.4\n#define NIGHTLIGHT 0.4\n\nfloat normFloat(float n, float minVal, float maxVal){\n\treturn max(0.0, min(1.0, (n-minVal) / (maxVal-minVal)));\n}\n\n// Returns 1 if type matches val, 0 if not\nfloat checkType(float type, float val){\n\treturn step(val - 0.1, type) * step(type, val + 0.1);\n}\n\nuniform vec3 lightsT;\nuniform vec3 lightsO;\nattribute float type;\n\nvarying float redVal;\nvarying float ambVal;\nvarying float whtVal;\nvarying float brightness;\n\nvoid main(){\n\n \tvec4 realPos = modelMatrix * vec4(position, 1.0);\n\tvec3 realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));\n\n\tvec3 lightVector = normalize(cameraPosition - realPos.xyz);\n\tbrightness = dot(realNorm, lightVector);\n\tbrightness = normFloat(brightness, 0.3, 0.2) + 0.5;\n\tbrightness *= brightness * brightness;\n\t\n\t// Type 0: FF logo\t\n\tredVal = checkType(type, 0.0);\n\t// FF brightens on stop light\n\tredVal += redVal * lightsO.x;\n\n\t// Type 1: center grid\n\tredVal += checkType(type, 1.0) * NIGHTLIGHT;\n\n\t// Type 2: Right blinker\n\tredVal += (checkType(type, 2.0) * NIGHTLIGHT) * step(0.0, lightsT.x);\n\tambVal = checkType(type, 2.0) * lightsT.z;\n\n\t// Type 3: Left blinker\n\tredVal += (checkType(type, 3.0) * NIGHTLIGHT) * step(lightsT.x, 0.0);\n\tambVal += checkType(type, 3.0) * lightsT.y;\n\t\n\tbrightness = clamp(brightness, 0.0, 1.0);\n\n\tgl_Position = projectionMatrix * viewMatrix * realPos;\n}\n";
});
define;
RED_COLOR;
vec3(1.0, 0.1, 0.1); // red
define;
AMB_COLOR;
vec3(1.0, 0.6, 0.1); // amber
define;
WHT;
vec3(1.0, 1.0, 1.0); // white
varying;
float;
redVal;
varying;
float;
ambVal;
varying;
float;
whtVal;
varying;
float;
brightness;
void main();
{
    gl_FragColor = vec4((RED_COLOR * redVal + AMB_COLOR * ambVal) * brightness, 1.0);
}
define;
PI;
3.1415926;
uniform;
float;
vpH;
uniform;
float;
size;
uniform;
float;
brightness;
varying;
float;
opacity;
// Normalizes a value between 0 - 1
float;
normFloat(float, n, float, minVal, float, maxVal);
{
    return max(0.0, min(1.0, (n - minVal) / (maxVal - minVal)));
}
void main();
{
    vec4;
    realPos = modelMatrix * vec4(position, 1.0);
    vec3;
    realNorm = normalize(vec3(modelMatrix * vec4(normal, 0.0)));
    vec3;
    lightVector = normalize(cameraPosition - realPos.xyz);
    opacity = dot(realNorm, lightVector);
    opacity = normFloat(opacity, 0.5, 1.0) * brightness;
    vec4;
    mvPosition = viewMatrix * realPos;
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = max((vpH * size / -mvPosition.z) * opacity, 0.0);
}
define("CarLights", ["require", "exports", "tslib", "shader/head_light_vert.glsl", "shader/head_light_frag.glsl", "shader/tail_light_vert.glsl", "shader/tail_grid_vert.glsl", "./shader/tail_grid_frag.glsl", "./shader/flare_vert.glsl", "./shader/flare_vert.glsl"], function (require, exports, tslib_2, head_light_vert_glsl_1, head_light_frag_glsl_1, tail_light_vert_glsl_1, tail_grid_vert_glsl_1, tail_grid_frag_glsl_1, flare_vert_glsl_1, flare_vert_glsl_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    head_light_vert_glsl_1 = tslib_2.__importDefault(head_light_vert_glsl_1);
    head_light_frag_glsl_1 = tslib_2.__importDefault(head_light_frag_glsl_1);
    tail_light_vert_glsl_1 = tslib_2.__importDefault(tail_light_vert_glsl_1);
    tail_grid_vert_glsl_1 = tslib_2.__importDefault(tail_grid_vert_glsl_1);
    tail_grid_frag_glsl_1 = tslib_2.__importDefault(tail_grid_frag_glsl_1);
    flare_vert_glsl_1 = tslib_2.__importDefault(flare_vert_glsl_1);
    flare_vert_glsl_2 = tslib_2.__importDefault(flare_vert_glsl_2);
    // var turnBarVS = require('./18');
    // var stopBarVS = require('./13');
    // var turnBarFS = require('./17');
    var THREE = window.THREE;
    var CarLights = /** @class */ (function () {
        function CarLights(_carChassis, _cargo) {
            this.lfTimer = 0;
            this.rtTimer = 0;
            this.carChassis = _carChassis;
            this.lightsCtrlTurn = new THREE.Vector3();
            this.lightsCtrlOther = new THREE.Vector3();
            this.lightsCtrlHead = new THREE.Vector4();
            this.prevHeadlightState = undefined;
            this.prevTurnState = undefined;
            this.addMeshMaterials();
            this.addHeadFlares(_cargo.getTexture('flareHead'));
            this.addStopMesh(_cargo.getTexture('lightStop'));
            this.addTurnFlares(_cargo.getTexture('flareTurn'), _cargo.getTexture('lightTurn'));
        }
        CarLights.prototype.addMeshMaterials = function () {
            var headLights = this.carChassis.getObjectByName('HeadLights');
            var tailLights = this.carChassis.getObjectByName('TailLights');
            var tailGrid = this.carChassis.getObjectByName('TailGrid');
            tailGrid.geometry.computeVertexNormals();
            headLights.material = new THREE.ShaderMaterial({
                uniforms: {
                    lightsT: { value: this.lightsCtrlTurn },
                    lightsS: { value: this.lightsCtrlHead }
                },
                vertexShader: head_light_vert_glsl_1.default,
                fragmentShader: head_light_frag_glsl_1.default
            });
            tailLights.material = new THREE.ShaderMaterial({
                uniforms: {
                    lightsT: { value: this.lightsCtrlTurn },
                    lightsO: { value: this.lightsCtrlOther }
                },
                vertexShader: tail_light_vert_glsl_1.default,
                fragmentShader: tail_grid_frag_glsl_1.default
            });
            tailGrid.material = new THREE.ShaderMaterial({
                uniforms: {
                    lightsT: { value: this.lightsCtrlTurn },
                    lightsO: { value: this.lightsCtrlOther }
                },
                vertexShader: tail_grid_vert_glsl_1.default,
                fragmentShader: tail_grid_frag_glsl_1.default
            });
        };
        CarLights.prototype.addHeadFlares = function (_tex) {
            this.headFlareMat = new THREE.ShaderMaterial({
                uniforms: {
                    texture: { value: _tex },
                    vpH: { value: window.innerHeight },
                    size: { value: 1.5 },
                    brightness: { value: 1 }
                },
                vertexShader: flare_vert_glsl_1.default,
                fragmentShader: flare_vert_glsl_2.default,
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false
            });
            var posArray = new Float32Array([
                4000,
                1875,
                1700,
                4300,
                1800,
                1700,
                4000,
                1875,
                -1700,
                4300,
                1800,
                -1700
            ]);
            var normArray = new Float32Array([
                0.87,
                0.22,
                0.44,
                0.87,
                0.22,
                0.44,
                0.87,
                0.22,
                -0.44,
                0.87,
                0.22,
                -0.44
            ]);
            var flareHeadGeom = new THREE.BufferGeometry();
            flareHeadGeom.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
            flareHeadGeom.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
            this.flareHeadPoints = new THREE.Points(flareHeadGeom, this.headFlareMat);
            this.carChassis.add(this.flareHeadPoints);
        };
        CarLights.prototype.addStopMesh = function (_tex) {
            this.meshStopGlow = this.carChassis.getObjectByName('Stop');
            this.meshStopGlow.material = new THREE.ShaderMaterial({
                uniforms: { texture: { value: _tex } },
                vertexShader: stopBarVS,
                fragmentShader: turnBarFS,
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false
            });
            ;
        };
        CarLights.prototype.addTurnFlares = function (_tex1, _tex2) {
            var posArray = new Float32Array([
                -4755,
                2227,
                -1269,
                -4703,
                2222,
                -1326,
                -4649,
                2215,
                -1381,
                -4590,
                2208,
                -1436,
                -4526,
                2200,
                -1492,
                -4459,
                2192,
                -1548,
                -4386,
                2182,
                -1604,
                -4718,
                2182,
                -1264,
                -4668,
                2179,
                -1321,
                -4301,
                2175,
                -1658,
                -4614,
                2175,
                -1377,
                -4556,
                2168,
                -1433,
                -4494,
                2163,
                -1489,
                -4429,
                2158,
                -1545,
                -4358,
                2151,
                -1600,
                -4266,
                2147,
                -1653,
                -4675,
                2136,
                -1260,
                -4627,
                2134,
                -1316,
                -4575,
                2132,
                -1373,
                -4520,
                2130,
                -1428,
                -4461,
                2128,
                -1485,
                -4400,
                2126,
                -1540,
                -4329,
                2123,
                -1597
            ]);
            var normArray = new Float32Array([
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4,
                -0.9,
                0,
                -0.4
            ]);
            this.turnPointMaterial = this.headFlareMat.clone();
            this.turnPointMaterial.uniforms['texture'].value = _tex1;
            this.turnPointMaterial.uniforms['size'].value = 0.1;
            this.turnPointMaterial.uniforms['brightness'].value = 1;
            var leftTurnGrid = new THREE.BufferGeometry();
            leftTurnGrid.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
            leftTurnGrid.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
            this.turnLeftPoints = new THREE.Points(leftTurnGrid, this.turnPointMaterial);
            this.turnLeftPoints.visible = false;
            this.carChassis.add(this.turnLeftPoints);
            posArray = new Float32Array([
                -4755,
                2227,
                1269,
                -4703,
                2222,
                1326,
                -4649,
                2215,
                1381,
                -4590,
                2208,
                1436,
                -4526,
                2200,
                1492,
                -4459,
                2192,
                1548,
                -4386,
                2182,
                1604,
                -4718,
                2182,
                1264,
                -4668,
                2179,
                1321,
                -4301,
                2175,
                1658,
                -4614,
                2175,
                1377,
                -4556,
                2168,
                1433,
                -4494,
                2163,
                1489,
                -4429,
                2158,
                1545,
                -4358,
                2151,
                1600,
                -4266,
                2147,
                1653,
                -4675,
                2136,
                1260,
                -4627,
                2134,
                1316,
                -4575,
                2132,
                1373,
                -4520,
                2130,
                1428,
                -4461,
                2128,
                1485,
                -4400,
                2126,
                1540,
                -4329,
                2123,
                1597
            ]);
            normArray = new Float32Array([
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4,
                -0.9,
                0,
                0.4
            ]);
            var rightTurnGrid = new THREE.BufferGeometry();
            rightTurnGrid.addAttribute('position', new THREE.BufferAttribute(posArray, 3));
            rightTurnGrid.addAttribute('normal', new THREE.BufferAttribute(normArray, 3));
            this.turnRightPoints = new THREE.Points(rightTurnGrid, this.turnPointMaterial);
            this.turnRightPoints.visible = false;
            this.carChassis.add(this.turnRightPoints);
            this.carChassis.getObjectByName('Turn').material = new THREE.ShaderMaterial({
                uniforms: {
                    texture: { value: _tex2 },
                    lightsT: { value: this.lightsCtrlTurn }
                },
                vertexShader: turnBarVS,
                fragmentShader: turnBarFS,
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false
            });
        };
        CarLights.prototype.turnSignalsBlink = function (_angle, _tDelta) {
            this.lightsCtrlTurn.x = Math.sign(_angle);
            if (_angle > 0) {
                this.lfTimer = (this.lfTimer + _tDelta * 2) % 2;
                this.rtTimer = 0;
                this.lightsCtrlTurn.y = this.lfTimer > 1 ? 0 : 1;
                this.lightsCtrlTurn.z = 0;
            }
            else if (_angle < 0) {
                this.lfTimer = 0;
                this.rtTimer = (this.rtTimer + _tDelta * 2) % 2;
                this.lightsCtrlTurn.y = 0;
                this.lightsCtrlTurn.z = this.rtTimer > 1 ? 0 : 1;
            }
            this.turnLeftPoints.visible = this.lightsCtrlTurn.y ? true : false;
            this.turnRightPoints.visible = this.lightsCtrlTurn.z ? true : false;
        };
        CarLights.prototype.turnSignalsClear = function () {
            this.lightsCtrlTurn.set(0, 0, 0);
            this.lfTimer = 0;
            this.rtTimer = 0;
            this.turnLeftPoints.visible = false;
            this.turnRightPoints.visible = false;
        };
        CarLights.prototype.headlightsChanged = function (_newState) {
            switch (_newState) {
                case 0:
                    this.lightsCtrlHead.set(0, 0, 0, 0);
                    this.flareHeadPoints.visible = false;
                    break;
                case 1:
                    this.lightsCtrlHead.set(1, 0, 0, 0);
                    this.flareHeadPoints.visible = false;
                    break;
                case 2:
                    this.lightsCtrlHead.set(1, 1, 0, 0);
                    this.flareHeadPoints.visible = true;
                    break;
                case 3:
                    this.lightsCtrlHead.set(1, 1, 1, 0);
                    this.flareHeadPoints.visible = true;
                    break;
                case 4:
                    this.lightsCtrlHead.set(1, 1, 1, 1);
                    this.flareHeadPoints.visible = true;
                    break;
            }
            this.prevHeadlightState = _newState;
        };
        CarLights.prototype.onWindowResize = function (_vpH) {
            this.headFlareMat.uniforms['vpH'].value = _vpH;
            this.turnPointMaterial.uniforms['vpH'].value = _vpH;
        };
        CarLights.prototype.update = function (_props) {
            if (_props.wAngleTarg !== 0) {
                this.turnSignalsBlink(_props.wAngleTarg, _props.time.delta);
            }
            else if (this.lightsCtrlTurn.x !== 0) {
                this.turnSignalsClear();
            }
            if (this.prevHeadlightState !== _props.headLights) {
                this.headlightsChanged(_props.headLights);
            }
            if (_props.braking && !this.meshStopGlow.visible) {
                this.meshStopGlow.visible = true;
                this.lightsCtrlOther.x = 1;
            }
            else if (!_props.braking && this.meshStopGlow.visible) {
                this.meshStopGlow.visible = false;
                this.lightsCtrlOther.x = 0;
            }
        };
        return CarLights;
    }());
    exports.CarLights = CarLights;
});
define("ViewTour", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var THREE = window.THREE;
    var TweenLite = window.TweenLite;
    // var Card_1 = require('./30');
    // var CardProps = require('./2');
    // var Props_1 = require('./1');
    // var Body_1 = require('./26');
    // var Floor_1 = require('./33');
    // var Skybox_1 = require('./35');
    var ViewTour = /** @class */ (function () {
        // initMeshes: (_cargo: { getMesh: (arg0: string) => void; getCubeTexture: (arg0: string) => void; }) => void;
        // car: any;
        // floor: any;
        // goToSection: (index: string | number) => void;
        // moveCamera(sectProps: any) {
        //     throw new Error("Method not implemented.");
        // }
        // enterFreeDriving: (sectProps: { camPos: any; }) => void;
        // knobMoved: (_knobPos: any) => void;
        // frontLightsClicked: (_index: any) => void;
        // onWindowResize: (_vp: { x: number; y: number; }) => void;
        // update: (t: any) => boolean;
        function ViewTour(_scene, _renderer, _cam, _vp) {
            this.sceneWGL = _scene;
            this.rendererWGL = _renderer;
            this.sceneCSS = new THREE.Scene();
            this.rendererCSS = new THREE.CSS3DRenderer();
            this.rendererCSS.setSize(_vp.x, _vp.y);
            // document.getElementById('CSSCanvas').appendChild(this.rendererCSS.domElement))
            var camOptions = {
                distance: 6,
                focusPos: {
                    x: 0,
                    y: 1,
                    z: 0
                },
                rotation: {
                    x: -90,
                    y: 0
                },
                distRange: {
                    max: 7,
                    min: 5
                },
                rotRange: {
                    xMax: Number.POSITIVE_INFINITY,
                    xMin: Number.NEGATIVE_INFINITY,
                    yMax: 90,
                    yMin: 0
                },
                smartUpdates: true
            };
            this.cam = _cam;
            this.cam.readOptions(camOptions);
            this.mobileView = _vp.x <= _vp.y * 1.2 ? true : false;
            this.sectionPrev = this.sectionActive = -1;
            // this.card = new Card_1.default(this.sceneCSS);
            // this.carProps = new Props_1.CarProps();
            this.dirLight = new THREE.DirectionalLight(0, 0.7);
            this.dirLight.name = 'dirLight';
            this.dirLight.position.set(0, 1, 1);
            this.sceneWGL.add(this.dirLight);
            this.ambLight = new THREE.AmbientLight(0, 0.5);
            this.ambLight.name = 'ambLight';
            this.sceneWGL.add(this.ambLight);
            // this.skybox = new Skybox_1.default(this.sceneWGL, this.dirLight.color);
        }
        ViewTour.prototype.moveCamera = function (_cardProps) {
            var _this = this;
            if (this.sectionActive === -1)
                return;
            var targetAX = this.cam.rotActual.x;
            var targetAY = Math.max(this.cam.rotActual.y, 0);
            var minY = 0;
            if (_cardProps.camRot !== undefined) {
                targetAY = _cardProps.camRot.y;
                minY = targetAY < 0 ? targetAY : 0;
                var angleXDist = THREE.Math.euclideanModulo(_cardProps.camRot.x - this.cam.rotActual.x + 180, 360) - 180;
                targetAX += angleXDist < -180 ? angleXDist + 360 : angleXDist;
            }
            if (targetAX !== this.cam.rotActual.x || targetAY !== this.cam.rotActual.y) {
                TweenLite.to(this.cam.rotTarget, 2, {
                    x: targetAX,
                    y: targetAY
                });
            }
            var range = _cardProps.camRotRange;
            if (range !== undefined) {
                this.cam.setRotRange(targetAX + range.x, targetAX - range.x, Math.min(targetAY + range.y, 90), Math.max(targetAY - range.y, minY));
            }
            else {
                this.cam.setRotRange(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 90, 0);
            }
            TweenLite.to(this.cam.focusTarget, 2, _cardProps.camPos);
            TweenLite.to(this.cam, 2, {
                distTarget: _cardProps.camDist,
                onComplete: function () {
                    _this.cam.setDistRange(_cardProps.camDist + 1, _cardProps.camDist - 1);
                }
            });
        };
        ;
        ViewTour.prototype.initMeshes = function (_cargo) {
            var xrayMesh = _cargo.getMesh('xrays');
            // this.car = new Body_1.default(this.sceneWGL, _cargo);
            // this.floor = new Floor_1.default(this.sceneWGL, this.carProps.pos, _cargo);
            this.skybox.setCubeTexture(_cargo.getCubeTexture('envSkybox'));
            // var freeProps = this.mobileView ? CardProps.Mobile[7] : CardProps.Desktop[7];
            TweenLite.to(this.dirLight.color, 3, {
                r: 1,
                g: 1,
                b: 1
            });
            TweenLite.to(this.ambLight.color, 3, {
                r: 1,
                g: 1,
                b: 1
            });
            TweenLite.to(this.cam.rotTarget, 3, {
                x: -125,
                y: 5
            });
            // TweenLite.to(this.cam.focusTarget, 3, { y: freeProps.camPos.y });
            // TweenLite.to(this.cam, 3, { distTarget: freeProps.camDist });
            // this.cam.setDistRange(freeProps.camDist + 1, freeProps.camDist - 1);
        };
        ViewTour.prototype.goToSection = function (index) {
            // var sectProps = this.mobileView ? CardProps.Mobile[index] : CardProps.Desktop[index];
            // this.sectionPrev = this.sectionActive;
            // this.sectionActive = index;
            // if (sectProps.inverted === true) {
            //   TweenLite.to(this.dirLight.color, 1, {
            //     r: 0.063,
            //     g: 0.075,
            //     b: 0.094
            //   });
            //   TweenLite.to(this.ambLight.color, 1, {
            //     r: 0.063,
            //     g: 0.075,
            //     b: 0.094
            //   });
            // } else {
            //   TweenLite.to(this.dirLight.color, 1, {
            //     r: 1,
            //     g: 1,
            //     b: 1
            //   });
            //   TweenLite.to(this.ambLight.color, 1, {
            //     r: 1,
            //     g: 1,
            //     b: 1
            //   });
            // }
            // if (this.sectionPrev === 1) {
            //   this.car.carBatts.hide();
            // } else if (this.sectionPrev === 2) {
            //   this.car.carMotors.hide();
            // }
            // switch (index) {
            // case 0:
            //   break;
            // case 1:
            //   this.car.carBatts.show();
            //   break;
            // case 2:
            //   this.car.carMotors.show();
            //   break;
            // case 3:
            // case 4:
            // case 5:
            //   TweenLite.to(this.carProps, 3, {
            //     speed: 0,
            //     ease: Power2.easeOut
            //   });
            //   break;
            // case 6:
            //   break;
            // case 7:
            //   this.card.hide();
            //   break;
            // }
            // this.card.show(index, sectProps);
            // this.moveCamera(sectProps);
        };
        ViewTour.prototype.enterFreeDriving = function (sectProps) {
            TweenLite.to(this.cam.focusTarget, 1, sectProps.camPos);
            this.cam.setRotRange(Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, 90, 0);
        };
        ViewTour.prototype.knobMoved = function (_knobPos) {
            this.cam.forceUpdate = true;
            this.carProps.onKnobMove(_knobPos, this.sectionActive);
        };
        ViewTour.prototype.frontLightsClicked = function (_index) {
            this.cam.forceUpdate = true;
            this.carProps.changeHeadlights(_index);
        };
        ViewTour.prototype.onWindowResize = function (_vp) {
            // this.rendererCSS.setSize(_vp.x, _vp.y);
            // if (this.sectionActive === -1)
            //   return;
            // if (_vp.x <= _vp.y * 1.2 && this.mobileView !== true) {
            //   this.mobileView = true;
            //   this.moveCamera(CardProps.Mobile[this.sectionActive]);
            //   this.card.setPosition(CardProps.Mobile[this.sectionActive].position);
            // } else if (_vp.x > _vp.y * 1.2 && this.mobileView !== false) {
            //   this.mobileView = false;
            //   this.moveCamera(CardProps.Desktop[this.sectionActive]);
            //   this.card.setPosition(CardProps.Desktop[this.sectionActive].position);
            // }
        };
        ViewTour.prototype.update = function (t) {
            if (this.carProps.speed > 0 || this.carProps.wAngleInner !== 0 || this.carProps.longitMomentum !== 0) {
                this.cam.forceUpdate = true;
            }
            if (this.cam.update() === false) {
                return false;
            }
            this.carProps.update(t);
            this.car.update(this.carProps);
            this.dirLight.position.copy(this.cam.camera.position);
            this.dirLight.position.multiplyScalar(0.5);
            this.dirLight.position.y += 1;
            this.rendererWGL.render(this.sceneWGL, this.cam.camera);
            // this.cam.camera.position.multiplyScalar(CardProps.GOLDEN_RATIO);
            this.rendererCSS.render(this.sceneCSS, this.cam.camera);
            return true;
        };
        return ViewTour;
    }());
    exports.default = ViewTour;
});
define("ff91", ["require", "exports", "tslib", "Camera", "AssetLoader"], function (require, exports, tslib_3, Camera_1, AssetLoader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Camera_1 = tslib_3.__importDefault(Camera_1);
    AssetLoader_1 = tslib_3.__importDefault(AssetLoader_1);
    var THREE = window.THREE;
    var Control = /** @class */ (function () {
        function Control() {
            // 资源加载
            var manifesto = [
                // Cube textures
                { name: "envReflection", type: "cubetexture", ext: "jpg" },
                { name: "envSkybox", type: "cubetexture", ext: "jpg" },
                // Car lights
                { name: "flareHead", type: "texture", ext: "jpg" },
                { name: "flareTurn", type: "texture", ext: "jpg" },
                { name: "lightTurn", type: "texture", ext: "jpg" },
                { name: "lightStop", type: "texture", ext: "jpg" },
                // Car geometry
                { name: "body", type: "mesh", ext: "json" },
                { name: "wheel", type: "mesh", ext: "json" },
                { name: "xrays", type: "mesh", ext: "json" },
                // Car textures
                { name: "thread", type: "texture", ext: "jpg" },
                { name: "shadow", type: "texture", ext: "jpg" },
                { name: "led", type: "texture", ext: "png" },
            ];
            this.assetLoader = new AssetLoader_1.default("./static/", manifesto, function () { console.error('load over...'); });
            this.assetLoader.start();
            // 场景
            this.sceneWGL = new THREE.Scene();
            this.sceneWGL.name = 'sceneWGL';
            // 渲染
            this.vp = new THREE.Vector2(window.innerWidth, window.innerHeight);
            this.sceneWGL.background = new THREE.Color(0x000000);
            this.rendererWGL = new THREE.WebGLRenderer({ antialias: true });
            this.rendererWGL.setSize(this.vp.x, this.vp.y);
            this.continer = document.getElementById("GLCanvas");
            this.continer.appendChild(this.rendererWGL.domElement);
            // 相机
            var camOptions = {
                distance: this.vp.y > 550 ? 8 : 6,
                rotRange: {
                    xMin: -30,
                    xMax: 30,
                    yMin: -30,
                    yMax: 30
                },
                distRange: {
                    max: 20,
                    min: 3
                }
            };
            this.cam = new Camera_1.default(camOptions);
            this.cam.rotTarget.x = THREE.Math.randFloatSpread(30);
            this.cam.rotTarget.y = THREE.Math.randFloatSpread(30);
        }
        return Control;
    }());
    exports.Control = Control;
});
//# sourceMappingURL=ff91.js.map