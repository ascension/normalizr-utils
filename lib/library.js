(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Library", [], factory);
	else if(typeof exports === 'object')
		exports["Library"] = factory();
	else
		root["Library"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isImmutable = isImmutable;
exports.denormalizeImmutable = denormalizeImmutable;
/**
 * Helpers to enable Immutable compatibility *without* bringing in
 * the 'immutable' package as a dependency.
 */

/**
 * Check if an object is immutable by checking if it has a key specific
 * to the immutable library.
 *
 * @param  {any} object
 * @return {bool}
 */
function isImmutable(object) {
  return !!(object && (object.hasOwnProperty('__ownerID') || // Immutable.Map
  object._map && object._map.hasOwnProperty('__ownerID') // Immutable.Record
  ));
}

/**
 * Denormalize an immutable entity.
 *
 * @param  {Schema} schema
 * @param  {Immutable.Map|Immutable.Record} input
 * @param  {function} unvisit
 * @param  {function} getDenormalizedEntity
 * @return {Immutable.Map|Immutable.Record}
 */
function denormalizeImmutable(schema, input, unvisit) {
  return Object.keys(schema).reduce(function (object, key) {
    // Immutable maps cast keys to strings on write so we need to ensure
    // we're accessing them using string keys.
    var stringKey = '' + key;

    if (object.has(stringKey)) {
      return object.set(stringKey, unvisit(object.get(stringKey), schema[stringKey]));
    } else {
      return object;
    }
  }, input);
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImmutableUtils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PolymorphicSchema = function () {
  function PolymorphicSchema(definition, schemaAttribute) {
    _classCallCheck(this, PolymorphicSchema);

    if (schemaAttribute) {
      this._schemaAttribute = typeof schemaAttribute === 'string' ? function (input) {
        return input[schemaAttribute];
      } : schemaAttribute;
    }
    this.define(definition);
  }

  _createClass(PolymorphicSchema, [{
    key: 'define',
    value: function define(definition) {
      this.schema = definition;
    }
  }, {
    key: 'getSchemaAttribute',
    value: function getSchemaAttribute(input, parent, key) {
      return !this.isSingleSchema && this._schemaAttribute(input, parent, key);
    }
  }, {
    key: 'inferSchema',
    value: function inferSchema(input, parent, key) {
      if (this.isSingleSchema) {
        return this.schema;
      }

      var attr = this.getSchemaAttribute(input, parent, key);
      return this.schema[attr];
    }
  }, {
    key: 'normalizeValue',
    value: function normalizeValue(value, parent, key, visit, addEntity) {
      var schema = this.inferSchema(value, parent, key);
      if (!schema) {
        return value;
      }
      var normalizedValue = visit(value, parent, key, schema, addEntity);
      return this.isSingleSchema || normalizedValue === undefined || normalizedValue === null ? normalizedValue : { id: normalizedValue, schema: this.getSchemaAttribute(value, parent, key) };
    }
  }, {
    key: 'denormalizeValue',
    value: function denormalizeValue(value, unvisit) {
      var schemaKey = (0, _ImmutableUtils.isImmutable)(value) ? value.get('schema') : value.schema;
      if (!this.isSingleSchema && !schemaKey) {
        return value;
      }
      var id = (0, _ImmutableUtils.isImmutable)(value) ? value.get('id') : value.id;
      var schema = this.isSingleSchema ? this.schema : this.schema[schemaKey];
      return unvisit(id || value, schema);
    }
  }, {
    key: 'isSingleSchema',
    get: function get() {
      return !this._schemaAttribute;
    }
  }]);

  return PolymorphicSchema;
}();

exports.default = PolymorphicSchema;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.denormalize = exports.normalize = exports.schema = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Entity = __webpack_require__(5);

var _Entity2 = _interopRequireDefault(_Entity);

var _Union = __webpack_require__(7);

var _Union2 = _interopRequireDefault(_Union);

var _Values = __webpack_require__(8);

var _Values2 = _interopRequireDefault(_Values);

var _Array = __webpack_require__(4);

var ArrayUtils = _interopRequireWildcard(_Array);

var _Object = __webpack_require__(6);

var ObjectUtils = _interopRequireWildcard(_Object);

var _ImmutableUtils = __webpack_require__(0);

var ImmutableUtils = _interopRequireWildcard(_ImmutableUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var visit = function visit(value, parent, key, schema, addEntity) {
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || !value) {
    return value;
  }

  if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) === 'object' && (!schema.normalize || typeof schema.normalize !== 'function')) {
    var method = Array.isArray(schema) ? ArrayUtils.normalize : ObjectUtils.normalize;
    return method(schema, value, parent, key, visit, addEntity);
  }

  return schema.normalize(value, parent, key, visit, addEntity);
};

var addEntities = function addEntities(entities) {
  return function (schema, processedEntity, value, parent, key) {
    var schemaKey = schema.key;
    var id = schema.getId(value, parent, key);
    if (!(schemaKey in entities)) {
      entities[schemaKey] = {};
    }

    var existingEntity = entities[schemaKey][id];
    if (existingEntity) {
      entities[schemaKey][id] = schema.merge(existingEntity, processedEntity);
    } else {
      entities[schemaKey][id] = processedEntity;
    }
  };
};

var schema = exports.schema = {
  Array: ArrayUtils.default,
  Entity: _Entity2.default,
  Object: ObjectUtils.default,
  Union: _Union2.default,
  Values: _Values2.default
};

var normalize = exports.normalize = function normalize(input, schema) {
  if (!input || (typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object') {
    throw new Error('Unexpected input given to normalize. Expected type to be "object", found "' + (typeof input === 'undefined' ? 'undefined' : _typeof(input)) + '".');
  }

  var entities = {};
  var addEntity = addEntities(entities);

  var result = visit(input, input, null, schema, addEntity);
  return { entities: entities, result: result };
};

var unvisitEntity = function unvisitEntity(input, schema, unvisit, getEntity, cache) {
  var entity = getEntity(input, schema);
  if ((typeof entity === 'undefined' ? 'undefined' : _typeof(entity)) !== 'object' || entity === null) {
    return entity;
  }

  var id = schema.getId(entity);

  if (!cache[schema.key]) {
    cache[schema.key] = {};
  }

  if (!cache[schema.key][id]) {
    // Ensure we don't mutate it non-immutable objects
    var entityCopy = ImmutableUtils.isImmutable(entity) ? entity : _extends({}, entity);

    // Need to set this first so that if it is referenced further within the
    // denormalization the reference will already exist.
    cache[schema.key][id] = entityCopy;
    cache[schema.key][id] = schema.denormalize(entityCopy, unvisit);
  }

  return cache[schema.key][id];
};

var getUnvisit = function getUnvisit(entities) {
  var cache = {};
  var getEntity = getEntities(entities);

  return function unvisit(input, schema) {
    if ((typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) === 'object' && (!schema.denormalize || typeof schema.denormalize !== 'function')) {
      var method = Array.isArray(schema) ? ArrayUtils.denormalize : ObjectUtils.denormalize;
      return method(schema, input, unvisit);
    }

    if (input === undefined || input === null) {
      return input;
    }

    if (schema instanceof _Entity2.default) {
      return unvisitEntity(input, schema, unvisit, getEntity, cache);
    }

    return schema.denormalize(input, unvisit);
  };
};

var getEntities = function getEntities(entities) {
  var isImmutable = ImmutableUtils.isImmutable(entities);

  return function (entityOrId, schema) {
    var schemaKey = schema.key;

    if ((typeof entityOrId === 'undefined' ? 'undefined' : _typeof(entityOrId)) === 'object') {
      return entityOrId;
    }

    return isImmutable ? entities.getIn([schemaKey, entityOrId.toString()]) : entities[schemaKey][entityOrId];
  };
};

var denormalize = exports.denormalize = function denormalize(input, schema, entities) {
  if (!input) {
    return input;
  }

  return getUnvisit(entities)(input, schema);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteUnionId = exports.addUnionIds = exports.addUnionId = exports.deleteEntities = exports.deleteEntity = exports.updateEntity = exports.addEntities = exports.addEntity = exports.getEntities = exports.setIsNotLoading = exports.setIsLoading = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _normalizr = __webpack_require__(2);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Sets isLoading => true
 * @param {*} state
 */
var setIsLoading = exports.setIsLoading = function setIsLoading(state) {
  return _extends({}, state, { isLoading: true });
};

/**
 * Sets isLoading => false
 * @param {*} state
 */
var setIsNotLoading = exports.setIsNotLoading = function setIsNotLoading(state) {
  return _extends({}, state, { isLoading: false });
};

/**
 * Get the entities for a given state.
 * @param {*} state
 */
var getEntities = exports.getEntities = function getEntities(state) {
  return state.entities;
};

/**
 * Add an entity to the state
 * @param {*} param0
 * @param {*} currentEntities
 */
var addEntity = function addEntity(_ref, currentEntities) {
  var id = _ref.id,
      newEntity = _objectWithoutProperties(_ref, ['id']);

  return _extends({}, currentEntities, _defineProperty({}, id, _extends({ id: id }, newEntity)));
};

/**
 * Adds new entities by performing a merge between existing entities and new entities.
 * New Entity will override the data of an existing entity.
 * @param newEntities
 * @param currentEntities
 * @returns {{}}
 */
exports.addEntity = addEntity;
var addEntities = exports.addEntities = function addEntities(newEntities) {
  var currentEntities = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var normalizedEntities = void 0;

  if (Array.isArray(newEntities)) {
    normalizedEntities = (0, _normalizr.normalize)(newEntities);
  } else {
    normalizedEntities = newEntities;
  }

  var newEntityKeys = Object.keys(normalizedEntities);

  if (newEntityKeys.length > 0) {
    newEntityKeys.forEach(function (entityId) {
      if (currentEntities.hasOwnProperty(entityId)) {
        normalizedEntities[entityId] = _extends({}, currentEntities[entityId], normalizedEntities[entityId]);
      }
    });
  }
  return _extends({}, currentEntities, normalizedEntities);
};

/**
 * Updates an existing entity by performing an merge between the current record and the updated fields.
 * @param {*} id
 * @param {*} updatedFields
 * @param {*} currentEntities
 */
var updateEntity = exports.updateEntity = function updateEntity(id, updatedFields, currentEntities) {
  try {
    var entityToUpdate = currentEntities[id];

    return _extends({}, currentEntities, _defineProperty({}, id, _extends({}, entityToUpdate, updatedFields)));
  } catch (e) {
    // TODO - add dev logger
    return currentEntities;
  }
};

/**
 * Delete an Entity from the state
 * @param {*} id
 * @param {*} currentEntities
 */
var deleteEntity = exports.deleteEntity = function deleteEntity(id, currentEntities) {
  var entities = _extends({}, currentEntities);

  delete entities[id];
  return entities;
};

/**
 * Delete Entities from the state
 * @param {*} ids
 * @param {*} currentEntities
 */
var deleteEntities = exports.deleteEntities = function deleteEntities() {
  var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var currentEntities = arguments[1];

  var entities = _extends({}, currentEntities);

  ids.forEach(function (id) {
    delete entities[id];
  });
  return entities;
};

/**
 *
 * @param {*} id
 * @param {*} childKeys
 */
var addUnionId = exports.addUnionId = function addUnionId(id, unionIds) {
  return [].concat(_toConsumableArray(unionIds), [id]);
};

var addUnionIds = exports.addUnionIds = function addUnionIds(ids, unionIds) {
  return [].concat(_toConsumableArray(unionIds), _toConsumableArray(ids));
};

/**
 * Delete a union by id
 * @param {*} id
 * @param {*} unionIds
 */
var deleteUnionId = exports.deleteUnionId = function deleteUnionId(id, unionIds) {
  return unionIds.filter(function (unionId) {
    return id !== unionId;
  });
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.denormalize = exports.normalize = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Polymorphic = __webpack_require__(1);

var _Polymorphic2 = _interopRequireDefault(_Polymorphic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var validateSchema = function validateSchema(definition) {
  var isArray = Array.isArray(definition);
  if (isArray && definition.length > 1) {
    throw new Error('Expected schema definition to be a single schema, but found ' + definition.length + '.');
  }

  return definition[0];
};

var getValues = function getValues(input) {
  return Array.isArray(input) ? input : Object.keys(input).map(function (key) {
    return input[key];
  });
};

var normalize = exports.normalize = function normalize(schema, input, parent, key, visit, addEntity) {
  schema = validateSchema(schema);

  var values = getValues(input);

  // Special case: Arrays pass *their* parent on to their children, since there
  // is not any special information that can be gathered from themselves directly
  return values.map(function (value, index) {
    return visit(value, parent, key, schema, addEntity);
  });
};

var denormalize = exports.denormalize = function denormalize(schema, input, unvisit) {
  schema = validateSchema(schema);
  return input && input.map ? input.map(function (entityOrId) {
    return unvisit(entityOrId, schema);
  }) : input;
};

var ArraySchema = function (_PolymorphicSchema) {
  _inherits(ArraySchema, _PolymorphicSchema);

  function ArraySchema() {
    _classCallCheck(this, ArraySchema);

    return _possibleConstructorReturn(this, (ArraySchema.__proto__ || Object.getPrototypeOf(ArraySchema)).apply(this, arguments));
  }

  _createClass(ArraySchema, [{
    key: 'normalize',
    value: function normalize(input, parent, key, visit, addEntity) {
      var _this2 = this;

      var values = getValues(input);

      return values.map(function (value, index) {
        return _this2.normalizeValue(value, parent, key, visit, addEntity);
      }).filter(function (value) {
        return value !== undefined && value !== null;
      });
    }
  }, {
    key: 'denormalize',
    value: function denormalize(input, unvisit) {
      var _this3 = this;

      return input && input.map ? input.map(function (value) {
        return _this3.denormalizeValue(value, unvisit);
      }) : input;
    }
  }]);

  return ArraySchema;
}(_Polymorphic2.default);

exports.default = ArraySchema;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ImmutableUtils = __webpack_require__(0);

var ImmutableUtils = _interopRequireWildcard(_ImmutableUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getDefaultGetId = function getDefaultGetId(idAttribute) {
  return function (input) {
    return ImmutableUtils.isImmutable(input) ? input.get(idAttribute) : input[idAttribute];
  };
};

var EntitySchema = function () {
  function EntitySchema(key) {
    var definition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, EntitySchema);

    if (!key || typeof key !== 'string') {
      throw new Error('Expected a string key for Entity, but found ' + key + '.');
    }

    var _options$idAttribute = options.idAttribute,
        idAttribute = _options$idAttribute === undefined ? 'id' : _options$idAttribute,
        _options$mergeStrateg = options.mergeStrategy,
        mergeStrategy = _options$mergeStrateg === undefined ? function (entityA, entityB) {
      return _extends({}, entityA, entityB);
    } : _options$mergeStrateg,
        _options$processStrat = options.processStrategy,
        processStrategy = _options$processStrat === undefined ? function (input) {
      return _extends({}, input);
    } : _options$processStrat;


    this._key = key;
    this._getId = typeof idAttribute === 'function' ? idAttribute : getDefaultGetId(idAttribute);
    this._idAttribute = idAttribute;
    this._mergeStrategy = mergeStrategy;
    this._processStrategy = processStrategy;
    this.define(definition);
  }

  _createClass(EntitySchema, [{
    key: 'define',
    value: function define(definition) {
      this.schema = Object.keys(definition).reduce(function (entitySchema, key) {
        var schema = definition[key];
        return _extends({}, entitySchema, _defineProperty({}, key, schema));
      }, this.schema || {});
    }
  }, {
    key: 'getId',
    value: function getId(input, parent, key) {
      return this._getId(input, parent, key);
    }
  }, {
    key: 'merge',
    value: function merge(entityA, entityB) {
      return this._mergeStrategy(entityA, entityB);
    }
  }, {
    key: 'normalize',
    value: function normalize(input, parent, key, visit, addEntity) {
      var _this = this;

      var processedEntity = this._processStrategy(input, parent, key);
      Object.keys(this.schema).forEach(function (key) {
        if (processedEntity.hasOwnProperty(key) && _typeof(processedEntity[key]) === 'object') {
          var schema = _this.schema[key];
          processedEntity[key] = visit(processedEntity[key], processedEntity, key, schema, addEntity);
        }
      });

      addEntity(this, processedEntity, input, parent, key);
      return this.getId(input, parent, key);
    }
  }, {
    key: 'denormalize',
    value: function denormalize(entity, unvisit) {
      var _this2 = this;

      if (ImmutableUtils.isImmutable(entity)) {
        return ImmutableUtils.denormalizeImmutable(this.schema, entity, unvisit);
      }

      Object.keys(this.schema).forEach(function (key) {
        if (entity.hasOwnProperty(key)) {
          var schema = _this2.schema[key];
          entity[key] = unvisit(entity[key], schema);
        }
      });
      return entity;
    }
  }, {
    key: 'key',
    get: function get() {
      return this._key;
    }
  }, {
    key: 'idAttribute',
    get: function get() {
      return this._idAttribute;
    }
  }]);

  return EntitySchema;
}();

exports.default = EntitySchema;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.denormalize = exports.normalize = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ImmutableUtils = __webpack_require__(0);

var ImmutableUtils = _interopRequireWildcard(_ImmutableUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _normalize = function _normalize(schema, input, parent, key, visit, addEntity) {
  var object = _extends({}, input);
  Object.keys(schema).forEach(function (key) {
    var localSchema = schema[key];
    var value = visit(input[key], input, key, localSchema, addEntity);
    if (value === undefined || value === null) {
      delete object[key];
    } else {
      object[key] = value;
    }
  });
  return object;
};

exports.normalize = _normalize;
var _denormalize = function _denormalize(schema, input, unvisit) {
  if (ImmutableUtils.isImmutable(input)) {
    return ImmutableUtils.denormalizeImmutable(schema, input, unvisit);
  }

  var object = _extends({}, input);
  Object.keys(schema).forEach(function (key) {
    if (object[key]) {
      object[key] = unvisit(object[key], schema[key]);
    }
  });
  return object;
};

exports.denormalize = _denormalize;

var ObjectSchema = function () {
  function ObjectSchema(definition) {
    _classCallCheck(this, ObjectSchema);

    this.define(definition);
  }

  _createClass(ObjectSchema, [{
    key: 'define',
    value: function define(definition) {
      this.schema = Object.keys(definition).reduce(function (entitySchema, key) {
        var schema = definition[key];
        return _extends({}, entitySchema, _defineProperty({}, key, schema));
      }, this.schema || {});
    }
  }, {
    key: 'normalize',
    value: function normalize() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _normalize.apply(undefined, [this.schema].concat(args));
    }
  }, {
    key: 'denormalize',
    value: function denormalize() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _denormalize.apply(undefined, [this.schema].concat(args));
    }
  }]);

  return ObjectSchema;
}();

exports.default = ObjectSchema;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Polymorphic = __webpack_require__(1);

var _Polymorphic2 = _interopRequireDefault(_Polymorphic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UnionSchema = function (_PolymorphicSchema) {
  _inherits(UnionSchema, _PolymorphicSchema);

  function UnionSchema(definition, schemaAttribute) {
    _classCallCheck(this, UnionSchema);

    if (!schemaAttribute) {
      throw new Error('Expected option "schemaAttribute" not found on UnionSchema.');
    }
    return _possibleConstructorReturn(this, (UnionSchema.__proto__ || Object.getPrototypeOf(UnionSchema)).call(this, definition, schemaAttribute));
  }

  _createClass(UnionSchema, [{
    key: 'normalize',
    value: function normalize(input, parent, key, visit, addEntity) {
      return this.normalizeValue(input, parent, key, visit, addEntity);
    }
  }, {
    key: 'denormalize',
    value: function denormalize(input, unvisit) {
      return this.denormalizeValue(input, unvisit);
    }
  }]);

  return UnionSchema;
}(_Polymorphic2.default);

exports.default = UnionSchema;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Polymorphic = __webpack_require__(1);

var _Polymorphic2 = _interopRequireDefault(_Polymorphic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValuesSchema = function (_PolymorphicSchema) {
  _inherits(ValuesSchema, _PolymorphicSchema);

  function ValuesSchema() {
    _classCallCheck(this, ValuesSchema);

    return _possibleConstructorReturn(this, (ValuesSchema.__proto__ || Object.getPrototypeOf(ValuesSchema)).apply(this, arguments));
  }

  _createClass(ValuesSchema, [{
    key: 'normalize',
    value: function normalize(input, parent, key, visit, addEntity) {
      var _this2 = this;

      return Object.keys(input).reduce(function (output, key, index) {
        var value = input[key];
        return value !== undefined && value !== null ? _extends({}, output, _defineProperty({}, key, _this2.normalizeValue(value, input, key, visit, addEntity))) : output;
      }, {});
    }
  }, {
    key: 'denormalize',
    value: function denormalize(input, unvisit) {
      var _this3 = this;

      return Object.keys(input).reduce(function (output, key) {
        var entityOrId = input[key];
        return _extends({}, output, _defineProperty({}, key, _this3.denormalizeValue(entityOrId, unvisit)));
      }, {});
    }
  }]);

  return ValuesSchema;
}(_Polymorphic2.default);

exports.default = ValuesSchema;

/***/ })
/******/ ]);
});
//# sourceMappingURL=Library.js.map