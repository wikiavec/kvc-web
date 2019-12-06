import RollupStart from './main.svelte';

const WKCEditor = new RollupStart({
	target: document.body,
	props: Object.assign({
		WKCEditorDispatchUpdate (inputData) {
			window.TestWKCEditorDispatchUpdate.innerHTML = parseInt(window.TestWKCEditorDispatchUpdate.innerHTML) + 1;
			window.TestWKCEditorDispatchUpdateData.innerHTML = inputData;
		},
	}, Object.fromEntries((new window.URLSearchParams(window.location.search)).entries())),
});

export default WKCEditor;