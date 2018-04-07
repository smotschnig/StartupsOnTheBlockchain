webpackHotUpdate(3,{

/***/ "./pages/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__ = __webpack_require__("./node_modules/babel-runtime/regenerator/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__("./node_modules/react/cjs/react.development.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_semantic_ui_react__ = __webpack_require__("./node_modules/semantic-ui-react/dist/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ethereum_factory__ = __webpack_require__("./ethereum/factory.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__routes__ = __webpack_require__("./routes.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__routes___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__routes__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_Cards__ = __webpack_require__("./components/Cards.js");

var _jsxFileName = 'C:\\Users\\motschsv\\Documents\\Blockchain\\startup\\pages\\index.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

(function () {
    var enterModule = __webpack_require__("./node_modules/react-hot-loader/index.js").enterModule;

    enterModule && enterModule(module);
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



// import Layout from '../components/Layout';




var StartUp = function (_Component) {
    _inherits(StartUp, _Component);

    function StartUp() {
        _classCallCheck(this, StartUp);

        return _possibleConstructorReturn(this, (StartUp.__proto__ || Object.getPrototypeOf(StartUp)).apply(this, arguments));
    }

    _createClass(StartUp, [{
        key: 'renderProjects',
        value: function renderProjects() {
            var items = this.props.projects.map(function (address) {
                return {
                    header: address,
                    description: __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_4__routes__["Link"],
                        { route: '/projects/' + address, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 20
                            }
                        },
                        __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                            'a',
                            {
                                __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 21
                                }
                            },
                            'View Project'
                        )
                    ),
                    fluid: true,
                    style: { overflowWrap: 'break-word' }
                };
            });
            return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_semantic_ui_react__["b" /* Card */].Group, { items: items, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 28
                }
            });
        }
    }, {
        key: 'renderTestProjects',
        value: function renderTestProjects() {}
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                Layout,
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 37
                    }
                },
                __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                    'div',
                    { className: 'example', __source: {
                            fileName: _jsxFileName,
                            lineNumber: 38
                        }
                    },
                    'Hello World!'
                ),
                __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                    'h3',
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 39
                        }
                    },
                    'Open Projects'
                ),
                __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_2_semantic_ui_react__["c" /* Grid */],
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 40
                        }
                    },
                    __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_2_semantic_ui_react__["c" /* Grid */].Column,
                        { width: 12, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 41
                            }
                        },
                        __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_5__components_Cards__["a" /* default */], {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 42
                            }
                        }),
                        this.renderProjects()
                    ),
                    __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_2_semantic_ui_react__["c" /* Grid */].Column,
                        { width: 4, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 45
                            }
                        },
                        __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_4__routes__["Link"],
                            { route: 'projects/new', __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 46
                                }
                            },
                            __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(
                                'a',
                                {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 47
                                    }
                                },
                                __WEBPACK_IMPORTED_MODULE_1_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_semantic_ui_react__["a" /* Button */], { floated: 'right', content: 'Create Project', icon: 'add circle', primary: true, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 48
                                    }
                                })
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: '__reactstandin__regenerateByEval',
        value: function __reactstandin__regenerateByEval(key, code) {
            this[key] = eval(code);
        }
    }], [{
        key: 'getInitialProps',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.mark(function _callee() {
                var projects;
                return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return __WEBPACK_IMPORTED_MODULE_3__ethereum_factory__["a" /* default */].methods.getDeployedProjects().call();

                            case 2:
                                projects = _context.sent;
                                return _context.abrupt('return', { projects: projects });

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function getInitialProps() {
                return _ref.apply(this, arguments);
            }

            return getInitialProps;
        }()
    }]);

    return StartUp;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

var _default = StartUp;


/* harmony default export */ __webpack_exports__["default"] = (_default);
;

(function () {
    var reactHotLoader = __webpack_require__("./node_modules/react-hot-loader/index.js").default;

    var leaveModule = __webpack_require__("./node_modules/react-hot-loader/index.js").leaveModule;

    if (!reactHotLoader) {
        return;
    }

    reactHotLoader.register(StartUp, 'StartUp', 'C:/Users/motschsv/Documents/Blockchain/startup/pages/index.js');
    reactHotLoader.register(_default, 'default', 'C:/Users/motschsv/Documents/Blockchain/startup/pages/index.js');
    leaveModule(module);
})();

;
    (function (Component, route) {
      if(!Component) return
      if (false) return
      module.hot.accept()
      Component.__route = route

      if (module.hot.status() === 'idle') return

      var components = next.router.components
      for (var r in components) {
        if (!components.hasOwnProperty(r)) continue

        if (components[r].Component.__route === route) {
          next.router.update(r, Component)
        }
      }
    })(typeof __webpack_exports__ !== 'undefined' ? __webpack_exports__.default : (module.exports.default || module.exports), "/")
  
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__("./node_modules/webpack/buildin/harmony-module.js")(module)))

/***/ })

})
//# sourceMappingURL=3.e537a4a20f0eb77a2ee0.hot-update.js.map