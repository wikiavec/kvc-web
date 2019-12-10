const kType = 'kvc_setting';
const kCollection = 'kvc_settings';

export const KVCSettingStoragePath = function(inputData) {
	return `${ kCollection }/${ inputData || '' }`;
};

import * as KVCSettingModel from './model.js';

export const KVCSettingStorage = function (privateClient, publicClient, changeDelegate) {
	return {
		KVCStorageCollection: kCollection,
		KVCStorageType: kType,
		KVCStorageModelErrors: KVCSettingModel.KVCSettingModelErrorsFor({}),
		KVCStorageExports: {
			KVCSettingStorageCache () {
				return privateClient.cache(KVCSettingStoragePath());
			},
			listObjects () {
				return privateClient.getAll(KVCSettingStoragePath(), false);
			},
			async writeObject (param1, param2) {
				await privateClient.storeObject(kType, KVCSettingStoragePath(param1), param2);
				return param2;
			},
			readObject (inputData) {
				return privateClient.getObject(KVCSettingStoragePath(inputData));
			},
			deleteObject (inputData) {
				return privateClient.remove(KVCSettingStoragePath(inputData));
			},
		},
	};
};


