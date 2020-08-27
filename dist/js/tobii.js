/**
 * tobii 2.0.0-beta 
 *
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Tobii = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $filter = arrayIteration.filter;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
	// Edge 14- issue
	var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $forEach = arrayIteration.forEach;



	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH$1) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var $indexOf = arrayIncludes.indexOf;



	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$1 = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$2 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var nativeJoin = [].join;

	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$2 = arrayMethodIsStrict('join', ',');

	// `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$2 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$3 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	// `Object.{ entries, values }` methods implementation
	var createMethod$2 = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!descriptors || propertyIsEnumerable.call(O, key)) {
	        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.github.io/ecma262/#sec-object.entries
	  entries: createMethod$2(true),
	  // `Object.values` method
	  // https://tc39.github.io/ecma262/#sec-object.values
	  values: createMethod$2(false)
	};

	var $entries = objectToArray.entries;

	// `Object.entries` method
	// https://tc39.github.io/ecma262/#sec-object.entries
	_export({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return $entries(O);
	  }
	});

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points







	var SPECIES$3 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$3] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$3 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$3(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$3(true)
	};

	var charAt = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible(this);
	      var matcher = regexp == undefined ? undefined : regexp[MATCH];
	      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative(nativeMatch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      if (!rx.global) return regexpExecAbstract(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	/**
	 * CustomEvent() polyfill
	 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent#Polyfill
	 *
	 */
	if (typeof window.CustomEvent !== 'function') {
	  var CustomEvent$1 = function CustomEvent(event, params) {
	    params = params || {
	      bubbles: false,
	      cancelable: false,
	      detail: undefined
	    };
	    var evt = document.createEvent('CustomEvent');
	    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	    return evt;
	  };

	  CustomEvent$1.prototype = window.Event.prototype;
	  window.CustomEvent = CustomEvent$1;
	}

	/**
	 * Tobii
	 *
	 * @author rqrauhvmra
	 * @version 2.0.0-beta
	 * @url https://github.com/rqrauhvmra/tobii
	 *
	 * MIT License
	 */

	function Tobii(userOptions) {
	  /**
	   * Global variables
	   *
	   */
	  var BROWSER_WINDOW = window;
	  var FOCUSABLE_ELEMENTS = ['a[href]:not([tabindex^="-"]):not([inert])', 'area[href]:not([tabindex^="-"]):not([inert])', 'input:not([disabled]):not([inert])', 'select:not([disabled]):not([inert])', 'textarea:not([disabled]):not([inert])', 'button:not([disabled]):not([inert])', 'iframe:not([tabindex^="-"]):not([inert])', 'audio:not([tabindex^="-"]):not([inert])', 'video:not([tabindex^="-"]):not([inert])', '[contenteditable]:not([tabindex^="-"]):not([inert])', '[tabindex]:not([tabindex^="-"]):not([inert])'];
	  var WAITING_ELS = [];
	  var GROUP_ATTS = {
	    gallery: [],
	    slider: null,
	    sliderElements: [],
	    elementsLength: 0,
	    currentIndex: 0,
	    x: 0
	  };
	  var PLAYER = [];
	  var config = {};
	  var figcaptionId = 0;
	  var lightbox = null;
	  var prevButton = null;
	  var nextButton = null;
	  var closeButton = null;
	  var counter = null;
	  var drag = {};
	  var isDraggingX = false;
	  var isDraggingY = false;
	  var pointerDown = false;
	  var lastFocus = null;
	  var offset = null;
	  var offsetTmp = null;
	  var resizeTicking = false;
	  var isYouTubeDependencieLoaded = false;
	  var playerId = 0;
	  var groups = {};
	  var newGroup = null;
	  var activeGroup = null;
	  /**
	   * Merge default options with user options
	   *
	   * @param {Object} userOptions - Optional user options
	   * @returns {Object} - Custom options
	   */

	  var mergeOptions = function mergeOptions(userOptions) {
	    // Default options
	    var OPTIONS = {
	      selector: '.lightbox',
	      captions: true,
	      captionsSelector: 'img',
	      captionAttribute: 'alt',
	      nav: 'auto',
	      navText: ["<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\">\n          <path stroke=\"none\" d=\"M0 0h24v24H0z\"/>\n          <polyline points=\"15 6 9 12 15 18\" />\n        </svg>", "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\">\n          <path stroke=\"none\" d=\"M0 0h24v24H0z\"/>\n          <polyline points=\"9 6 15 12 9 18\" />\n        </svg>"],
	      navLabel: ['Previous image', 'Next image'],
	      close: true,
	      closeText: "\n        <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\">\n          <path stroke=\"none\" d=\"M0 0h24v24H0z\"/>\n          <line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\" />\n          <line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\" />\n        </svg>\n      ",
	      closeLabel: 'Close lightbox',
	      loadingIndicatorLabel: 'Image loading',
	      counter: true,
	      download: false,
	      // TODO
	      downloadText: '',
	      // TODO
	      downloadLabel: 'Download image',
	      // TODO
	      keyboard: true,
	      zoom: true,
	      zoomText: "\n        <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\">\n          <path stroke=\"none\" d=\"M0 0h24v24H0z\"/>\n          <polyline points=\"16 4 20 4 20 8\" />\n          <line x1=\"14\" y1=\"10\" x2=\"20\" y2=\"4\" />\n          <polyline points=\"8 20 4 20 4 16\" />\n          <line x1=\"4\" y1=\"20\" x2=\"10\" y2=\"14\" />\n          <polyline points=\"16 20 20 20 20 16\" />\n          <line x1=\"14\" y1=\"14\" x2=\"20\" y2=\"20\" />\n          <polyline points=\"8 4 4 4 4 8\" />\n          <line x1=\"4\" y1=\"4\" x2=\"10\" y2=\"10\" />\n        </svg>\n      ",
	      docClose: true,
	      swipeClose: true,
	      hideScrollbar: true,
	      draggable: true,
	      threshold: 100,
	      rtl: false,
	      // TODO
	      loop: false,
	      // TODO
	      autoplayVideo: false,
	      modal: false,
	      theme: 'tobii--theme-default'
	    };

	    if (userOptions) {
	      Object.keys(userOptions).forEach(function (key) {
	        OPTIONS[key] = userOptions[key];
	      });
	    }

	    return OPTIONS;
	  };
	  /**
	   * Types - you can add new type to support something new
	   *
	   */


	  var SUPPORTED_ELEMENTS = {
	    image: {
	      checkSupport: function checkSupport(el) {
	        return !el.hasAttribute('data-type') && el.href.match(/\.(png|jpe?g|tiff|tif|gif|bmp|webp|svg|ico)(\?.*)?$/i);
	      },
	      init: function init(el, container) {
	        var FIGURE = document.createElement('figure');
	        var FIGCAPTION = document.createElement('figcaption');
	        var IMAGE = document.createElement('img');
	        var THUMBNAIL = el.querySelector('img');
	        var LOADING_INDICATOR = document.createElement('div'); // Hide figure until the image is loaded

	        FIGURE.style.opacity = '0';

	        if (THUMBNAIL) {
	          IMAGE.alt = THUMBNAIL.alt || '';
	        }

	        IMAGE.setAttribute('src', '');
	        IMAGE.setAttribute('data-src', el.href); // Add image to figure

	        FIGURE.appendChild(IMAGE); // Create figcaption

	        if (config.captions) {
	          if (config.captionsSelector === 'self' && el.getAttribute(config.captionAttribute)) {
	            FIGCAPTION.textContent = el.getAttribute(config.captionAttribute);
	          } else if (config.captionsSelector === 'img' && THUMBNAIL && THUMBNAIL.getAttribute(config.captionAttribute)) {
	            FIGCAPTION.textContent = THUMBNAIL.getAttribute(config.captionAttribute);
	          }

	          if (FIGCAPTION.textContent) {
	            FIGCAPTION.id = "tobii-figcaption-".concat(figcaptionId);
	            FIGURE.appendChild(FIGCAPTION);
	            IMAGE.setAttribute('aria-labelledby', FIGCAPTION.id);
	            ++figcaptionId;
	          }
	        } // Add figure to container


	        container.appendChild(FIGURE); // Create loading indicator

	        LOADING_INDICATOR.className = 'tobii__loader';
	        LOADING_INDICATOR.setAttribute('role', 'progressbar');
	        LOADING_INDICATOR.setAttribute('aria-label', config.loadingIndicatorLabel); // Add loading indicator to container

	        container.appendChild(LOADING_INDICATOR); // Register type

	        container.setAttribute('data-type', 'image');
	      },
	      onPreload: function onPreload(container) {
	        // Same as preload
	        SUPPORTED_ELEMENTS.image.onLoad(container);
	      },
	      onLoad: function onLoad(container) {
	        var IMAGE = container.querySelector('img');

	        if (!IMAGE.hasAttribute('data-src')) {
	          return;
	        }

	        var FIGURE = container.querySelector('figure');
	        var LOADING_INDICATOR = container.querySelector('.tobii__loader');

	        IMAGE.onload = function () {
	          container.removeChild(LOADING_INDICATOR);
	          FIGURE.style.opacity = '1';
	        };

	        IMAGE.setAttribute('src', IMAGE.getAttribute('data-src'));
	        IMAGE.removeAttribute('data-src');
	      },
	      onLeave: function onLeave(container) {// Nothing
	      },
	      onCleanup: function onCleanup(container) {// Nothing
	      }
	    },
	    html: {
	      checkSupport: function checkSupport(el) {
	        return checkType(el, 'html');
	      },
	      init: function init(el, container) {
	        var TARGET_SELECTOR = el.hasAttribute('href') ? el.getAttribute('href') : el.getAttribute('data-target');
	        var TARGET = document.querySelector(TARGET_SELECTOR);

	        if (!TARGET) {
	          throw new Error("Ups, I can't find the target ".concat(TARGET_SELECTOR, "."));
	        } // Add content to container


	        container.appendChild(TARGET); // Register type

	        container.setAttribute('data-type', 'html');
	      },
	      onPreload: function onPreload(container) {// Nothing
	      },
	      onLoad: function onLoad(container) {
	        var VIDEO = container.querySelector('video');

	        if (VIDEO) {
	          if (VIDEO.hasAttribute('data-time') && VIDEO.readyState > 0) {
	            // Continue where video was stopped
	            VIDEO.currentTime = VIDEO.getAttribute('data-time');
	          }

	          if (config.autoplayVideo) {
	            // Start playback (and loading if necessary)
	            VIDEO.play();
	          }
	        }
	      },
	      onLeave: function onLeave(container) {
	        var VIDEO = container.querySelector('video');

	        if (VIDEO) {
	          if (!VIDEO.paused) {
	            // Stop if video is playing
	            VIDEO.pause();
	          } // Backup currentTime (needed for revisit)


	          if (VIDEO.readyState > 0) {
	            VIDEO.setAttribute('data-time', VIDEO.currentTime);
	          }
	        }
	      },
	      onCleanup: function onCleanup(container) {
	        var VIDEO = container.querySelector('video');

	        if (VIDEO) {
	          if (VIDEO.readyState > 0 && VIDEO.readyState < 3 && VIDEO.duration !== VIDEO.currentTime) {
	            // Some data has been loaded but not the whole package.
	            // In order to save bandwidth, stop downloading as soon as possible.
	            var VIDEO_CLONE = VIDEO.cloneNode(true);
	            removeSources(VIDEO);
	            VIDEO.load();
	            VIDEO.parentNode.removeChild(VIDEO);
	            container.appendChild(VIDEO_CLONE);
	          }
	        }
	      }
	    },
	    iframe: {
	      checkSupport: function checkSupport(el) {
	        return checkType(el, 'iframe');
	      },
	      init: function init(el, container) {
	        var IFRAME = document.createElement('iframe');
	        var HREF = el.hasAttribute('href') ? el.getAttribute('href') : el.getAttribute('data-target');
	        IFRAME.setAttribute('frameborder', '0');
	        IFRAME.setAttribute('src', '');
	        IFRAME.setAttribute('data-src', HREF);

	        if (el.getAttribute('data-width')) {
	          IFRAME.style.maxWidth = "".concat(el.getAttribute('data-width'), "px");
	        }

	        if (el.getAttribute('data-height')) {
	          IFRAME.style.maxHeight = "".concat(el.getAttribute('data-height'), "px");
	        } // Add iframe to container


	        container.appendChild(IFRAME); // Register type

	        container.setAttribute('data-type', 'iframe');
	      },
	      onPreload: function onPreload(container) {// Nothing
	      },
	      onLoad: function onLoad(container) {
	        var IFRAME = container.querySelector('iframe');
	        IFRAME.setAttribute('src', IFRAME.getAttribute('data-src'));
	      },
	      onLeave: function onLeave(container) {// Nothing
	      },
	      onCleanup: function onCleanup(container) {// Nothing
	      }
	    },
	    youtube: {
	      checkSupport: function checkSupport(el) {
	        return checkType(el, 'youtube');
	      },
	      init: function init(el, container) {
	        var IFRAME_PLACEHOLDER = document.createElement('div'); // Add iframePlaceholder to container

	        container.appendChild(IFRAME_PLACEHOLDER);
	        PLAYER[playerId] = new window.YT.Player(IFRAME_PLACEHOLDER, {
	          host: 'https://www.youtube-nocookie.com',
	          height: el.getAttribute('data-height') || '360',
	          width: el.getAttribute('data-width') || '640',
	          videoId: el.getAttribute('data-id'),
	          playerVars: {
	            controls: el.getAttribute('data-controls') || 1,
	            rel: 0,
	            playsinline: 1
	          }
	        }); // Set player ID

	        container.setAttribute('data-player', playerId); // Register type

	        container.setAttribute('data-type', 'youtube');
	        playerId++;
	      },
	      onPreload: function onPreload(container) {// Nothing
	      },
	      onLoad: function onLoad(container) {
	        if (config.autoplayVideo) {
	          PLAYER[container.getAttribute('data-player')].playVideo();
	        }
	      },
	      onLeave: function onLeave(container) {
	        if (PLAYER[container.getAttribute('data-player')].getPlayerState() === 1) {
	          PLAYER[container.getAttribute('data-player')].pauseVideo();
	        }
	      },
	      onCleanup: function onCleanup(container) {
	        if (PLAYER[container.getAttribute('data-player')].getPlayerState() === 1) {
	          PLAYER[container.getAttribute('data-player')].pauseVideo();
	        }
	      }
	    }
	  };
	  /**
	   * Init
	   *
	   */

	  var init = function init(userOptions) {
	    // Merge user options into defaults
	    config = mergeOptions(userOptions); // Check if the lightbox already exists

	    if (!lightbox) {
	      createLightbox();
	    } // Get a list of all elements within the document


	    var LIGHTBOX_TRIGGER_ELS = document.querySelectorAll(config.selector);

	    if (!LIGHTBOX_TRIGGER_ELS) {
	      throw new Error("Ups, I can't find the selector ".concat(config.selector, " on this website."));
	    } // Execute a few things once per element


	    LIGHTBOX_TRIGGER_ELS.forEach(function (lightboxTriggerEl) {
	      checkDependencies(lightboxTriggerEl);
	    });
	  };
	  /**
	   * Check dependencies
	   *
	   * @param {HTMLElement} el - Element to add
	   */


	  var checkDependencies = function checkDependencies(el) {
	    // Check if there is a YouTube video and if the YouTube iframe-API is ready
	    if (document.querySelector('[data-type="youtube"]') !== null && !isYouTubeDependencieLoaded) {
	      if (document.getElementById('iframe_api') === null) {
	        var TAG = document.createElement('script');
	        var FIRST_SCRIPT_TAG = document.getElementsByTagName('script')[0];
	        TAG.id = 'iframe_api';
	        TAG.src = 'https://www.youtube.com/iframe_api';
	        FIRST_SCRIPT_TAG.parentNode.insertBefore(TAG, FIRST_SCRIPT_TAG);
	      }

	      if (WAITING_ELS.indexOf(el) === -1) {
	        WAITING_ELS.push(el);
	      }

	      window.onYouTubePlayerAPIReady = function () {
	        WAITING_ELS.forEach(function (waitingEl) {
	          add(waitingEl);
	        });
	        isYouTubeDependencieLoaded = true;
	      };
	    } else {
	      add(el);
	    }
	  };
	  /**
	   * Get group name from element
	   *
	   * @param {HTMLElement} el
	   * @return {string}
	   */


	  var getGroupName = function getGroupName(el) {
	    return el.hasAttribute('data-group') ? el.getAttribute('data-group') : 'default';
	  };
	  /**
	   * Copy an object. (The secure way)
	   *
	   * @param {object} object
	   * @return {object}
	   */


	  var copyObject = function copyObject(object) {
	    return JSON.parse(JSON.stringify(object));
	  };
	  /**
	   * Add element
	   *
	   * @param {HTMLElement} el - Element to add
	   */


	  var add = function add(el) {
	    newGroup = getGroupName(el);

	    if (!Object.prototype.hasOwnProperty.call(groups, newGroup)) {
	      groups[newGroup] = copyObject(GROUP_ATTS);
	      createSlider();
	    } // Check if element already exists


	    if (groups[newGroup].gallery.indexOf(el) === -1) {
	      groups[newGroup].gallery.push(el);
	      groups[newGroup].elementsLength++; // Set zoom icon if necessary

	      if (config.zoom && el.querySelector('img')) {
	        var TOBII_ZOOM = document.createElement('div');
	        TOBII_ZOOM.className = 'tobii-zoom__icon';
	        TOBII_ZOOM.innerHTML = config.zoomText;
	        el.classList.add('tobii-zoom');
	        el.appendChild(TOBII_ZOOM);
	      } // Bind click event handler


	      el.addEventListener('click', triggerTobii);
	      createSlide(el);

	      if (isOpen() && newGroup === activeGroup) {
	        updateConfig();
	        updateLightbox();
	      }
	    } else {
	      throw new Error('Ups, element already added.');
	    }
	  };
	  /**
	   * Remove element
	   *
	   * @param {HTMLElement} el - Element to remove
	   */


	  var remove = function remove(el) {
	    var GROUP_NAME = getGroupName(el); // Check if element exists

	    if (groups[GROUP_NAME].gallery.indexOf(el) === -1) {
	      throw new Error("Ups, I can't find a slide for the element ".concat(el, "."));
	    } else {
	      var SLIDE_INDEX = groups[GROUP_NAME].gallery.indexOf(el);
	      var SLIDE_EL = groups[GROUP_NAME].sliderElements[SLIDE_INDEX]; // If the element to be removed is the currently visible slide

	      if (isOpen() && GROUP_NAME === activeGroup && SLIDE_INDEX === groups[GROUP_NAME].currentIndex) {
	        if (groups[GROUP_NAME].elementsLength === 1) {
	          close();
	          throw new Error('Ups, I\'ve closed. There are no slides more to show.');
	        } else {
	          // TODO If there is only one slide left, deactivate horizontal dragging/ swiping
	          // TODO Recalculate counter
	          // TODO Set new absolute position per slide
	          // If the first slide is displayed
	          if (groups[GROUP_NAME].currentIndex === 0) {
	            next();
	          } else {
	            previous();
	          }
	        }
	      } // TODO Remove element
	      // groups[GROUP_NAME].gallery.splice(groups[GROUP_NAME].gallery.indexOf(el)) don't work


	      groups[GROUP_NAME].elementsLength--; // Remove zoom icon if necessary

	      if (config.zoom && el.querySelector('.tobii-zoom__icon')) {
	        var ZOOM_ICON = el.querySelector('.tobii-zoom__icon');
	        ZOOM_ICON.parentNode.classList.remove('tobii-zoom');
	        ZOOM_ICON.parentNode.removeChild(ZOOM_ICON);
	      } // Unbind click event handler


	      el.removeEventListener('click', triggerTobii); // Remove slide

	      SLIDE_EL.parentNode.removeChild(SLIDE_EL);
	    }
	  };
	  /**
	   * Create the lightbox
	   *
	   */


	  var createLightbox = function createLightbox() {
	    // Create the lightbox container
	    lightbox = document.createElement('div');
	    lightbox.setAttribute('role', 'dialog');
	    lightbox.setAttribute('aria-hidden', 'true');
	    lightbox.classList.add('tobii'); // Adc theme class

	    lightbox.classList.add(config.theme); // Create the previous button

	    prevButton = document.createElement('button');
	    prevButton.className = 'tobii__btn tobii__btn--previous';
	    prevButton.setAttribute('type', 'button');
	    prevButton.setAttribute('aria-label', config.navLabel[0]);
	    prevButton.innerHTML = config.navText[0];
	    lightbox.appendChild(prevButton); // Create the next button

	    nextButton = document.createElement('button');
	    nextButton.className = 'tobii__btn tobii__btn--next';
	    nextButton.setAttribute('type', 'button');
	    nextButton.setAttribute('aria-label', config.navLabel[1]);
	    nextButton.innerHTML = config.navText[1];
	    lightbox.appendChild(nextButton); // Create the close button

	    closeButton = document.createElement('button');
	    closeButton.className = 'tobii__btn tobii__btn--close';
	    closeButton.setAttribute('type', 'button');
	    closeButton.setAttribute('aria-label', config.closeLabel);
	    closeButton.innerHTML = config.closeText;
	    lightbox.appendChild(closeButton); // Create the counter

	    counter = document.createElement('div');
	    counter.className = 'tobii__counter';
	    lightbox.appendChild(counter);
	    document.body.appendChild(lightbox);
	  };
	  /**
	   * Create a slider
	   */


	  var createSlider = function createSlider() {
	    groups[newGroup].slider = document.createElement('div');
	    groups[newGroup].slider.className = 'tobii__slider'; // Hide slider

	    groups[newGroup].slider.setAttribute('aria-hidden', 'true');
	    lightbox.appendChild(groups[newGroup].slider);
	  };
	  /**
	   * Create a slide
	   *
	   */


	  var createSlide = function createSlide(el) {
	    // Detect type
	    for (var index in SUPPORTED_ELEMENTS) {
	      // const index don't work in IE
	      if (Object.prototype.hasOwnProperty.call(SUPPORTED_ELEMENTS, index)) {
	        if (SUPPORTED_ELEMENTS[index].checkSupport(el)) {
	          // Create slide elements
	          var SLIDER_ELEMENT = document.createElement('div');
	          var SLIDER_ELEMENT_CONTENT = document.createElement('div');
	          SLIDER_ELEMENT.className = 'tobii__slide';
	          SLIDER_ELEMENT.style.position = 'absolute';
	          SLIDER_ELEMENT.style.left = "".concat(groups[newGroup].x * 100, "%"); // Hide slide

	          SLIDER_ELEMENT.setAttribute('aria-hidden', 'true'); // Create type elements

	          SUPPORTED_ELEMENTS[index].init(el, SLIDER_ELEMENT_CONTENT); // Add slide content container to slider element

	          SLIDER_ELEMENT.appendChild(SLIDER_ELEMENT_CONTENT); // Add slider element to slider

	          groups[newGroup].slider.appendChild(SLIDER_ELEMENT);
	          groups[newGroup].sliderElements.push(SLIDER_ELEMENT);
	          ++groups[newGroup].x;
	          break;
	        }
	      }
	    }
	  };
	  /**
	   * Open Tobii
	   *
	   * @param {number} index - Index to load
	   */


	  var open = function open(index) {
	    activeGroup = activeGroup !== null ? activeGroup : newGroup;

	    if (isOpen()) {
	      throw new Error('Ups, I\'m aleady open.');
	    }

	    if (!isOpen()) {
	      if (!index) {
	        index = 0;
	      }

	      if (index === -1 || index >= groups[activeGroup].elementsLength) {
	        throw new Error("Ups, I can't find slide ".concat(index, "."));
	      }
	    }

	    if (config.hideScrollbar) {
	      document.documentElement.classList.add('tobii-is-open');
	      document.body.classList.add('tobii-is-open');
	    }

	    updateConfig(); // Hide close if necessary

	    if (!config.close) {
	      closeButton.disabled = false;
	      closeButton.setAttribute('aria-hidden', 'true');
	    } // Save user’s focus


	    lastFocus = document.activeElement; // Use `history.pushState()` to make sure the "Back" button behavior
	    // that aligns with the user's expectations

	    var stateObj = {
	      tobii: 'close'
	    };
	    var url = window.location.href;
	    history.pushState(stateObj, 'Image', url); // Set current index

	    groups[activeGroup].currentIndex = index;
	    clearDrag();
	    bindEvents(); // Load slide

	    load(groups[activeGroup].currentIndex); // Show slider

	    groups[activeGroup].slider.setAttribute('aria-hidden', 'false'); // Show lightbox

	    lightbox.setAttribute('aria-hidden', 'false');
	    updateLightbox(); // Preload previous and next slide

	    preload(groups[activeGroup].currentIndex + 1);
	    preload(groups[activeGroup].currentIndex - 1); // Hack to prevent animation during opening

	    setTimeout(function () {
	      groups[activeGroup].slider.classList.add('tobii__slider--animate');
	    }, 1000); // Create and dispatch a new event

	    var openEvent = new CustomEvent('open');
	    lightbox.dispatchEvent(openEvent);
	  };
	  /**
	   * Close Tobii
	   *
	   */


	  var close = function close() {
	    if (!isOpen()) {
	      throw new Error('Ups, I\'m already closed.');
	    }

	    if (config.hideScrollbar) {
	      document.documentElement.classList.remove('tobii-is-open');
	      document.body.classList.remove('tobii-is-open');
	    }

	    unbindEvents(); // Remove entry in browser history

	    if (history.state !== null) {
	      if (history.state.tobii === 'close') {
	        history.back();
	      }
	    } // Reenable the user’s focus


	    lastFocus.focus(); // Don't forget to cleanup our current element

	    leave(groups[activeGroup].currentIndex);
	    cleanup(groups[activeGroup].currentIndex); // Hide lightbox

	    lightbox.setAttribute('aria-hidden', 'true'); // Hide slider

	    groups[activeGroup].slider.setAttribute('aria-hidden', 'true'); // Reset current index

	    groups[activeGroup].currentIndex = 0; // Remove the hack to prevent animation during opening

	    groups[activeGroup].slider.classList.remove('tobii__slider--animate');
	  };
	  /**
	   * Preload slide
	   *
	   * @param {number} index - Index to preload
	   */


	  var preload = function preload(index) {
	    if (groups[activeGroup].sliderElements[index] === undefined) {
	      return;
	    }

	    var CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]');
	    var TYPE = CONTAINER.getAttribute('data-type');
	    SUPPORTED_ELEMENTS[TYPE].onPreload(CONTAINER);
	  };
	  /**
	   * Load slide
	   * Will be called when opening the lightbox or moving index
	   *
	   * @param {number} index - Index to load
	   */


	  var load = function load(index) {
	    if (groups[activeGroup].sliderElements[index] === undefined) {
	      return;
	    }

	    var CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]');
	    var TYPE = CONTAINER.getAttribute('data-type'); // Add active slide class

	    groups[activeGroup].sliderElements[index].classList.add('tobii__slide--is-active');
	    groups[activeGroup].sliderElements[index].setAttribute('aria-hidden', 'false');
	    SUPPORTED_ELEMENTS[TYPE].onLoad(CONTAINER);
	  };
	  /**
	   * Select a slide
	   *
	   * @param {number} index - Index to select
	   */


	  var select = function select(index) {
	    var currIndex = groups[activeGroup].currentIndex;

	    if (!isOpen()) {
	      throw new Error('Ups, I\'m closed.');
	    }

	    if (isOpen()) {
	      if (!index && index !== 0) {
	        throw new Error('Ups, no slide specified.');
	      }

	      if (index === groups[activeGroup].currentIndex) {
	        throw new Error("Ups, slide ".concat(index, " is already selected."));
	      }

	      if (index === -1 || index >= groups[activeGroup].elementsLength) {
	        throw new Error("Ups, I can't find slide ".concat(index, "."));
	      }
	    } // Set current index


	    groups[activeGroup].currentIndex = index;
	    leave(currIndex);
	    load(index);

	    if (index < currIndex) {
	      updateLightbox('left');
	      cleanup(currIndex);
	      preload(index - 1);
	    }

	    if (index > currIndex) {
	      updateLightbox('right');
	      cleanup(currIndex);
	      preload(index + 1);
	    }
	  };
	  /**
	   * Select the previous slide
	   *
	   */


	  var previous = function previous() {
	    if (!isOpen()) {
	      throw new Error('Ups, I\'m closed.');
	    }

	    if (groups[activeGroup].currentIndex > 0) {
	      leave(groups[activeGroup].currentIndex);
	      load(--groups[activeGroup].currentIndex);
	      updateLightbox('left');
	      cleanup(groups[activeGroup].currentIndex + 1);
	      preload(groups[activeGroup].currentIndex - 1);
	    } // Create and dispatch a new event


	    var previousEvent = new CustomEvent('previous');
	    lightbox.dispatchEvent(previousEvent);
	  };
	  /**
	   * Select the next slide
	   *
	   */


	  var next = function next() {
	    if (!isOpen()) {
	      throw new Error('Ups, I\'m closed.');
	    }

	    if (groups[activeGroup].currentIndex < groups[activeGroup].elementsLength - 1) {
	      leave(groups[activeGroup].currentIndex);
	      load(++groups[activeGroup].currentIndex);
	      updateLightbox('right');
	      cleanup(groups[activeGroup].currentIndex - 1);
	      preload(groups[activeGroup].currentIndex + 1);
	    } // Create and dispatch a new event


	    var nextEvent = new CustomEvent('next');
	    lightbox.dispatchEvent(nextEvent);
	  };
	  /**
	   * Select a group
	   *
	   * @param {string} name - Name of the group to select
	   */


	  var selectGroup = function selectGroup(name) {
	    if (isOpen()) {
	      throw new Error('Ups, I\'m open.');
	    }

	    if (!name) {
	      throw new Error('Ups, no group specified.');
	    }

	    if (name && !Object.prototype.hasOwnProperty.call(groups, name)) {
	      throw new Error("Ups, I don't have a group called \"".concat(name, "\"."));
	    }

	    activeGroup = name;
	  };
	  /**
	   * Leave slide
	   * Will be called before moving index
	   *
	   * @param {number} index - Index to leave
	   */


	  var leave = function leave(index) {
	    if (groups[activeGroup].sliderElements[index] === undefined) {
	      return;
	    }

	    var CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]');
	    var TYPE = CONTAINER.getAttribute('data-type'); // Remove active slide class

	    groups[activeGroup].sliderElements[index].classList.remove('tobii__slide--is-active');
	    groups[activeGroup].sliderElements[index].setAttribute('aria-hidden', 'true');
	    SUPPORTED_ELEMENTS[TYPE].onLeave(CONTAINER);
	  };
	  /**
	   * Cleanup slide
	   * Will be called after moving index
	   *
	   * @param {number} index - Index to cleanup
	   */


	  var cleanup = function cleanup(index) {
	    if (groups[activeGroup].sliderElements[index] === undefined) {
	      return;
	    }

	    var CONTAINER = groups[activeGroup].sliderElements[index].querySelector('[data-type]');
	    var TYPE = CONTAINER.getAttribute('data-type');
	    SUPPORTED_ELEMENTS[TYPE].onCleanup(CONTAINER);
	  };
	  /**
	   * Update offset
	   *
	   */


	  var updateOffset = function updateOffset() {
	    activeGroup = activeGroup !== null ? activeGroup : newGroup;
	    offset = -groups[activeGroup].currentIndex * lightbox.offsetWidth;
	    groups[activeGroup].slider.style.transform = "translate3d(".concat(offset, "px, 0, 0)");
	    offsetTmp = offset;
	  };
	  /**
	   * Update counter
	   *
	   */


	  var updateCounter = function updateCounter() {
	    counter.textContent = "".concat(groups[activeGroup].currentIndex + 1, "/").concat(groups[activeGroup].elementsLength);
	  };
	  /**
	   * Update focus
	   *
	   * @param {string} dir - Current slide direction
	   */


	  var updateFocus = function updateFocus(dir) {
	    if ((config.nav === true || config.nav === 'auto') && !isTouchDevice() && groups[activeGroup].elementsLength > 1) {
	      prevButton.setAttribute('aria-hidden', 'true');
	      prevButton.disabled = true;
	      nextButton.setAttribute('aria-hidden', 'true');
	      nextButton.disabled = true; // If there is only one slide

	      if (groups[activeGroup].elementsLength === 1) {
	        if (config.close) {
	          closeButton.focus();
	        }
	      } else {
	        // If the first slide is displayed
	        if (groups[activeGroup].currentIndex === 0) {
	          nextButton.setAttribute('aria-hidden', 'false');
	          nextButton.disabled = false;
	          nextButton.focus(); // If the last slide is displayed
	        } else if (groups[activeGroup].currentIndex === groups[activeGroup].elementsLength - 1) {
	          prevButton.setAttribute('aria-hidden', 'false');
	          prevButton.disabled = false;
	          prevButton.focus();
	        } else {
	          prevButton.setAttribute('aria-hidden', 'false');
	          prevButton.disabled = false;
	          nextButton.setAttribute('aria-hidden', 'false');
	          nextButton.disabled = false;

	          if (dir === 'left') {
	            prevButton.focus();
	          } else {
	            nextButton.focus();
	          }
	        }
	      }
	    } else if (config.close) {
	      closeButton.focus();
	    }
	  };
	  /**
	   * Clear drag after touchend and mousup event
	   *
	   */


	  var clearDrag = function clearDrag() {
	    drag = {
	      startX: 0,
	      endX: 0,
	      startY: 0,
	      endY: 0
	    };
	  };
	  /**
	   * Recalculate drag / swipe event
	   *
	   */


	  var updateAfterDrag = function updateAfterDrag() {
	    var MOVEMENT_X = drag.endX - drag.startX;
	    var MOVEMENT_Y = drag.endY - drag.startY;
	    var MOVEMENT_X_DISTANCE = Math.abs(MOVEMENT_X);
	    var MOVEMENT_Y_DISTANCE = Math.abs(MOVEMENT_Y);

	    if (MOVEMENT_X > 0 && MOVEMENT_X_DISTANCE > config.threshold && groups[activeGroup].currentIndex > 0) {
	      previous();
	    } else if (MOVEMENT_X < 0 && MOVEMENT_X_DISTANCE > config.threshold && groups[activeGroup].currentIndex !== groups[activeGroup].elementsLength - 1) {
	      next();
	    } else if (MOVEMENT_Y < 0 && MOVEMENT_Y_DISTANCE > config.threshold && config.swipeClose) {
	      close();
	    } else {
	      updateOffset();
	    }
	  };
	  /**
	   * Resize event using requestAnimationFrame
	   *
	   */


	  var resizeHandler = function resizeHandler() {
	    if (!resizeTicking) {
	      resizeTicking = true;
	      BROWSER_WINDOW.requestAnimationFrame(function () {
	        updateOffset();
	        resizeTicking = false;
	      });
	    }
	  };
	  /**
	   * Click event handler to trigger Tobii
	   *
	   */


	  var triggerTobii = function triggerTobii(event) {
	    event.preventDefault();
	    activeGroup = getGroupName(this);
	    open(groups[activeGroup].gallery.indexOf(this));
	  };
	  /**
	   * Click event handler
	   *
	   */


	  var clickHandler = function clickHandler(event) {
	    if (event.target === prevButton) {
	      previous();
	    } else if (event.target === nextButton) {
	      next();
	    } else if (event.target === closeButton || isDraggingX === false && isDraggingY === false && event.target.classList.contains('tobii__slide') && config.docClose) {
	      close();
	    }

	    event.stopPropagation();
	  };
	  /**
	   * Get the focusable children of the given element
	   *
	   * @return {Array<Element>}
	   */


	  var getFocusableChildren = function getFocusableChildren() {
	    return Array.prototype.slice.call(lightbox.querySelectorAll(".tobii__btn:not([disabled]), .tobii__slide--is-active + ".concat(FOCUSABLE_ELEMENTS.join(', .tobii__slide--is-active ')))).filter(function (child) {
	      return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
	    });
	  };
	  /**
	   * Keydown event handler
	   *
	   * @TODO: Remove the deprecated event.keyCode when Edge support event.code and we drop f*cking IE
	   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
	   */


	  var keydownHandler = function keydownHandler(event) {
	    var FOCUSABLE_CHILDREN = getFocusableChildren();
	    var FOCUSED_ITEM_INDEX = FOCUSABLE_CHILDREN.indexOf(document.activeElement);

	    if (event.keyCode === 9 || event.code === 'Tab') {
	      // If the SHIFT key is being pressed while tabbing (moving backwards) and
	      // the currently focused item is the first one, move the focus to the last
	      // focusable item from the slide
	      if (event.shiftKey && FOCUSED_ITEM_INDEX === 0) {
	        FOCUSABLE_CHILDREN[FOCUSABLE_CHILDREN.length - 1].focus();
	        event.preventDefault(); // If the SHIFT key is not being pressed (moving forwards) and the currently
	        // focused item is the last one, move the focus to the first focusable item
	        // from the slide
	      } else if (!event.shiftKey && FOCUSED_ITEM_INDEX === FOCUSABLE_CHILDREN.length - 1) {
	        FOCUSABLE_CHILDREN[0].focus();
	        event.preventDefault();
	      }
	    } else if (event.keyCode === 27 || event.code === 'Escape') {
	      // `ESC` Key: Close Tobii
	      event.preventDefault();
	      close();
	    } else if (event.keyCode === 37 || event.code === 'ArrowLeft') {
	      // `PREV` Key: Show the previous slide
	      event.preventDefault();
	      previous();
	    } else if (event.keyCode === 39 || event.code === 'ArrowRight') {
	      // `NEXT` Key: Show the next slide
	      event.preventDefault();
	      next();
	    }
	  };
	  /**
	   * Touchstart event handler
	   *
	   */


	  var touchstartHandler = function touchstartHandler(event) {
	    // Prevent dragging / swiping on textareas inputs and selects
	    if (isIgnoreElement(event.target)) {
	      return;
	    }

	    event.stopPropagation();
	    isDraggingX = false;
	    isDraggingY = false;
	    pointerDown = true;
	    drag.startX = event.touches[0].pageX;
	    drag.startY = event.touches[0].pageY;
	    groups[activeGroup].slider.classList.add('tobii__slider--is-dragging');
	  };
	  /**
	   * Touchmove event handler
	   *
	   */


	  var touchmoveHandler = function touchmoveHandler(event) {
	    event.stopPropagation();

	    if (pointerDown) {
	      event.preventDefault();
	      drag.endX = event.touches[0].pageX;
	      drag.endY = event.touches[0].pageY;
	      doSwipe();
	    }
	  };
	  /**
	   * Touchend event handler
	   *
	   */


	  var touchendHandler = function touchendHandler(event) {
	    event.stopPropagation();
	    pointerDown = false;
	    groups[activeGroup].slider.classList.remove('tobii__slider--is-dragging');

	    if (drag.endX) {
	      updateAfterDrag();
	    }

	    clearDrag();
	  };
	  /**
	   * Mousedown event handler
	   *
	   */


	  var mousedownHandler = function mousedownHandler(event) {
	    // Prevent dragging / swiping on textareas inputs and selects
	    if (isIgnoreElement(event.target)) {
	      return;
	    }

	    event.preventDefault();
	    event.stopPropagation();
	    isDraggingX = false;
	    isDraggingY = false;
	    pointerDown = true;
	    drag.startX = event.pageX;
	    drag.startY = event.pageY;
	    groups[activeGroup].slider.classList.add('tobii__slider--is-dragging');
	  };
	  /**
	   * Mousemove event handler
	   *
	   */


	  var mousemoveHandler = function mousemoveHandler(event) {
	    event.preventDefault();

	    if (pointerDown) {
	      drag.endX = event.pageX;
	      drag.endY = event.pageY;
	      doSwipe();
	    }
	  };
	  /**
	   * Mouseup event handler
	   *
	   */


	  var mouseupHandler = function mouseupHandler(event) {
	    event.stopPropagation();
	    pointerDown = false;
	    groups[activeGroup].slider.classList.remove('tobii__slider--is-dragging');

	    if (drag.endX) {
	      updateAfterDrag();
	    }

	    clearDrag();
	  };
	  /**
	   * Contextmenu event handler
	   * This is a fix for chromium based browser on mac.
	   * The 'contextmenu' terminates a mouse event sequence.
	   * https://bugs.chromium.org/p/chromium/issues/detail?id=506801
	   *
	   */


	  var contextmenuHandler = function contextmenuHandler() {
	    pointerDown = false;
	  };
	  /**
	   * Decide whether to do horizontal of vertical swipe
	   *
	   */


	  var doSwipe = function doSwipe() {
	    if (Math.abs(drag.startX - drag.endX) > 0 && !isDraggingY && groups[activeGroup].elementsLength > 1) {
	      // Horizontal swipe
	      groups[activeGroup].slider.style.transform = "translate3d(".concat(offsetTmp - Math.round(drag.startX - drag.endX), "px, 0, 0)");
	      isDraggingX = true;
	      isDraggingY = false;
	    } else if (Math.abs(drag.startY - drag.endY) > 0 && !isDraggingX && config.swipeClose) {
	      // Vertical swipe
	      groups[activeGroup].slider.style.transform = "translate3d(".concat(offsetTmp, "px, -").concat(Math.round(drag.startY - drag.endY), "px, 0)");
	      isDraggingX = false;
	      isDraggingY = true;
	    }
	  };
	  /**
	   * Bind events
	   *
	   */


	  var bindEvents = function bindEvents() {
	    if (config.keyboard) {
	      BROWSER_WINDOW.addEventListener('keydown', keydownHandler);
	    } // Resize event


	    BROWSER_WINDOW.addEventListener('resize', resizeHandler); // Popstate event

	    BROWSER_WINDOW.addEventListener('popstate', close); // Click event

	    lightbox.addEventListener('click', clickHandler);

	    if (config.draggable) {
	      if (isTouchDevice()) {
	        // Touch events
	        lightbox.addEventListener('touchstart', touchstartHandler);
	        lightbox.addEventListener('touchmove', touchmoveHandler);
	        lightbox.addEventListener('touchend', touchendHandler);
	      } // Mouse events


	      lightbox.addEventListener('mousedown', mousedownHandler);
	      lightbox.addEventListener('mouseup', mouseupHandler);
	      lightbox.addEventListener('mousemove', mousemoveHandler);
	      lightbox.addEventListener('contextmenu', contextmenuHandler);
	    }
	  };
	  /**
	   * Unbind events
	   *
	   */


	  var unbindEvents = function unbindEvents() {
	    if (config.keyboard) {
	      BROWSER_WINDOW.removeEventListener('keydown', keydownHandler);
	    } // Resize event


	    BROWSER_WINDOW.removeEventListener('resize', resizeHandler); // Popstate event

	    BROWSER_WINDOW.removeEventListener('popstate', close); // Click event

	    lightbox.removeEventListener('click', clickHandler);

	    if (config.draggable) {
	      if (isTouchDevice()) {
	        // Touch events
	        lightbox.removeEventListener('touchstart', touchstartHandler);
	        lightbox.removeEventListener('touchmove', touchmoveHandler);
	        lightbox.removeEventListener('touchend', touchendHandler);
	      } // Mouse events


	      lightbox.removeEventListener('mousedown', mousedownHandler);
	      lightbox.removeEventListener('mouseup', mouseupHandler);
	      lightbox.removeEventListener('mousemove', mousemoveHandler);
	      lightbox.removeEventListener('contextmenu', contextmenuHandler);
	    }
	  };
	  /**
	   * Checks whether element has requested data-type value
	   *
	   */


	  var checkType = function checkType(el, type) {
	    return el.getAttribute('data-type') === type;
	  };
	  /**
	   * Remove all `src` attributes
	   *
	   * @param {HTMLElement} el - Element to remove all `src` attributes
	   */


	  var removeSources = function setVideoSources(el) {
	    var SOURCES = el.querySelectorAll('src');

	    if (SOURCES) {
	      SOURCES.forEach(function (source) {
	        source.setAttribute('src', '');
	      });
	    }
	  };
	  /**
	   * Update Config
	   *
	   */


	  var updateConfig = function updateConfig() {
	    if (config.draggable && config.swipeClose && !groups[activeGroup].slider.classList.contains('tobii__slider--is-draggable') || config.draggable && groups[activeGroup].elementsLength > 1 && !groups[activeGroup].slider.classList.contains('tobii__slider--is-draggable')) {
	      groups[activeGroup].slider.classList.add('tobii__slider--is-draggable');
	    } // Hide buttons if necessary


	    if (!config.nav || groups[activeGroup].elementsLength === 1 || config.nav === 'auto' && isTouchDevice()) {
	      prevButton.setAttribute('aria-hidden', 'true');
	      prevButton.disabled = true;
	      nextButton.setAttribute('aria-hidden', 'true');
	      nextButton.disabled = true;
	    } else {
	      prevButton.setAttribute('aria-hidden', 'false');
	      prevButton.disabled = false;
	      nextButton.setAttribute('aria-hidden', 'false');
	      nextButton.disabled = false;
	    } // Hide counter if necessary


	    if (!config.counter || groups[activeGroup].elementsLength === 1) {
	      counter.setAttribute('aria-hidden', 'true');
	    } else {
	      counter.setAttribute('aria-hidden', 'false');
	    }
	  };
	  /**
	   * Update lightbox
	   *
	   * @param {string} dir - Current slide direction
	   */


	  var updateLightbox = function updateLightbox(dir) {
	    updateOffset();
	    updateCounter();
	    updateFocus(dir);
	  };
	  /**
	   * Reset Tobii
	   *
	   */


	  var reset = function reset() {
	    if (isOpen()) {
	      close();
	    } // TODO Cleanup


	    var GROUPS_ENTRIES = Object.entries(groups);
	    GROUPS_ENTRIES.forEach(function (groupsEntrie) {
	      var SLIDE_ELS = groupsEntrie[1].gallery; // Remove slides

	      SLIDE_ELS.forEach(function (slideEl) {
	        remove(slideEl);
	      });
	    });
	    groups = {};
	    newGroup = activeGroup = null;
	    figcaptionId = 0; // TODO
	  };
	  /**
	   * Destroy Tobii
	   *
	   */


	  var destroy = function destroy() {
	    reset();
	    lightbox.parentNode.removeChild(lightbox);
	  };
	  /**
	   * Check if Tobii is open
	   *
	   */


	  var isOpen = function isOpen() {
	    return lightbox.getAttribute('aria-hidden') === 'false';
	  };
	  /**
	   * Detect whether device is touch capable
	   *
	   */


	  var isTouchDevice = function isTouchDevice() {
	    return 'ontouchstart' in window;
	  };
	  /**
	   * Checks whether element's nodeName is part of array
	   *
	   */


	  var isIgnoreElement = function isIgnoreElement(el) {
	    return ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(el.nodeName) !== -1 || el === prevButton || el === nextButton || el === closeButton;
	  };
	  /**
	   * Return current index
	   *
	   */


	  var slidesIndex = function slidesIndex() {
	    return groups[activeGroup].currentIndex;
	  };
	  /**
	   * Return elements length
	   *
	   */


	  var slidesCount = function slidesCount() {
	    return groups[activeGroup].elementsLength;
	  };
	  /**
	   * Return current group
	   *
	   */


	  var currentGroup = function currentGroup() {
	    return activeGroup !== null ? activeGroup : newGroup;
	  };
	  /**
	   * Bind events
	   * @param {String} eventName
	   * @param {function} callback - callback to call
	   *
	   */


	  var on = function on(eventName, callback) {
	    lightbox.addEventListener(eventName, callback);
	  };
	  /**
	   * Unbind events
	   * @param {String} eventName
	   * @param {function} callback - callback to call
	   *
	   */


	  var off = function off(eventName, callback) {
	    lightbox.removeEventListener(eventName, callback);
	  };

	  init(userOptions);
	  Tobii.open = open;
	  Tobii.previous = previous;
	  Tobii.next = next;
	  Tobii.close = close;
	  Tobii.add = checkDependencies;
	  Tobii.remove = remove;
	  Tobii.reset = reset;
	  Tobii.destroy = destroy;
	  Tobii.isOpen = isOpen;
	  Tobii.slidesIndex = slidesIndex;
	  Tobii.select = select;
	  Tobii.slidesCount = slidesCount;
	  Tobii.selectGroup = selectGroup;
	  Tobii.currentGroup = currentGroup;
	  Tobii.on = on;
	  Tobii.off = off;
	  return Tobii;
	}

	return Tobii;

})));
