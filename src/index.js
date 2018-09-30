import { version as VERSION } from '../package.json';

import betterResult from './better-result/index.js';
import camelCase from './camel-case/index.js';
import takeFirst from './take-first/index.js';

import comparator from './comparator/index.js';
import compareAB from './compare-ab/index.js';
import convertString from './convert-string/index.js';
import toNumber from './convert-string/to-number.js';
import extend from './extend/index.js';

import flat from './flat/index.js';
import getByPath from './get-by-path/index.js';
import getOption from './get-option/index.js';
import { instanceGetOption } from './get-option/index.js';

import { hasFlag, getFlag } from './flags/index.js';

import isKnownCtor from './is-known-ctor/index.js';
import knownCtors from './is-known-ctor/ctors.js';

import isEmptyValue from './is-empty-value';

import mix from './mix/index.js';
import paramsToObject from './params-to-object/index.js';
import setByPath from './set-by-path/index.js';
import toBool from './to-bool/index.js';
import unflat from './unflat/index.js';

import compareObjects from './compare-objects/index.js';
import mergeObjects from './merge-objects/index.js';
import triggerMethod  from './trigger-method/index.js';
import { triggerMethodOn } from './trigger-method/index.js';

import mergeOptions from './merge-options/index.js';

import buildViewByKey from './build-view-by-key/index.js';

import enums, { enumsStore } from './enums/index.js';

import skipTake from './skip-take/index.js';


import { 
	isClass, isModel, isModelClass, isCollection, isCollectionClass, isView, isViewClass
} from 'bbmn-core';


export {
	VERSION,
	betterResult,
	camelCase,
	takeFirst,
	comparator, 
	compareAB,
	convertString,
	toNumber,
	extend,
	flat,
	getByPath,
	getOption,
	instanceGetOption,
	hasFlag, getFlag,
	isKnownCtor,
	knownCtors,
	isEmptyValue,
	mix,
	paramsToObject,
	setByPath,
	toBool,
	unflat,
	compareObjects,
	mergeObjects,
	triggerMethod,
	triggerMethodOn,
	mergeOptions,
	buildViewByKey,
	enums, enumsStore,
	skipTake,
	isClass, isModel, isModelClass, isCollection, isCollectionClass, isView, isViewClass
};

export default {
	VERSION,
	betterResult,
	camelCase,
	takeFirst,
	comparator, 
	compareAB,
	convertString,
	toNumber,
	extend,
	flat,
	getByPath,
	getOption,
	instanceGetOption,
	hasFlag, getFlag,
	isKnownCtor,
	knownCtors,
	isEmptyValue,
	mix,
	paramsToObject,
	setByPath,
	toBool,
	unflat,
	compareObjects,
	mergeObjects,
	triggerMethod,
	triggerMethodOn,
	mergeOptions,
	buildViewByKey,
	enums, enumsStore,
	skipTake,
	isClass, isModel, isModelClass, isCollection, isCollectionClass, isView, isViewClass
};
