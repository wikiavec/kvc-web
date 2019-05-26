(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RSModuleProtocol_wkc_settings = global.RSModuleProtocol_wkc_settings || {})));
}(this, (function (exports) { 'use strict';

	const RSModuleShared = typeof require === 'undefined' ? window.RSModuleShared : require('../_shared/main.js');
	const WKCSettingsModel = typeof require === 'undefined' ? window.WKCSettingsModel : require('./model.js');

	exports.RSModuleProtocolModuleForChangeDelegate = function () {
		return {
			name: 'wkc_settings',
			builder: function(privateClient, publicClient) {
				privateClient.declareType('wkc_setting', RSModuleShared.RSModuleSharedJSONSchemaForErrors(WKCSettingsModel.WKCSettingsModelErrorsFor({})));

				return {
					exports: {
						init: function () {
							return privateClient.cache('');
						},
						listObjects: function () {
							return privateClient.getAll('');
						},
						writeObject: async function (param1, param2) {
							await privateClient.storeObject('wkc_setting', param1, param2);
							return param2;
						},
						readObject: function (inputData) {
							return privateClient.getObject(inputData);
						},
						deleteObject: function (inputData) {
							return privateClient.remove(inputData);
						},
					},
				};
			},
		};
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));