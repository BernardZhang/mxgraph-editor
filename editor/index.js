import React, { useEffect, useRef } from "react";
// import { parse } from "query-string";
import './js/Init';
import './deflate/pako.min';
import './deflate/base64';
import './jscolor/jscolor';
import './sanitizer/sanitizer.min';
import MxGraph from './mxgraph';
// import '../mxgraph/js/mxClient';
import './js/EditorUi';
import './js/Editor';
import './js/Sidebar';
import './js/Graph';
import './js/Format';
import './js/Shapes';
import './js/Actions';
import './js/Menus';
import './js/Toolbar';
import './js/Dialogs';


import grapheditorResources from "./resources/grapheditor";
// import themesXml from './styles/default.xml';
import "./styles/grapheditor.css";



const mxgraph = MxGraph({
    mxImageBasePath: './images',
    mxBasePath: './'
});
const editorUiInit = EditorUi.prototype.init;
const { mxUtils, mxResources } = mxgraph;

EditorUi.prototype.init = function() {
	const { actions } = this;

	editorUiInit.apply(this, arguments);
	actions.get("export").setEnabled(false);

	// Updates action states which require a backend
	if (!Editor.useLocalStorage) {
		mxUtils.post(
			OPEN_URL,
			"",
			mxUtils.bind(this, req => {
				var enabled = req.getStatus() != 404;
				actions.get("open").setEnabled(enabled || Graph.fileSupport);
				actions.get("import").setEnabled(enabled || Graph.fileSupport);
				actions.get("save").setEnabled(enabled);
				actions.get("saveAs").setEnabled(enabled);
				actions.get("export").setEnabled(enabled);
			})
		);
	}
};

export default props => {
    console.log(window, MxGraph);
	const ref = useRef(null);
	// const urlParams = parse(location.search);

	// Adds required resources (disables loading of fallback properties, this can only
	// be used if we know that all keys are defined in the language specific file)
	mxResources.loadDefaultBundle = false;

	// Adds bundle text to resources
	mxResources.resources = mxResources.resources || {};
	Object.assign(mxResources.resources, grapheditorResources);

	// Configures the default graph theme
	const themes = {
		// [Graph.prototype.defaultThemeName]: themesXml.getDocumentElement()
	};

	// Main
    // new EditorUi(new Editor(urlParams["chrome"] == "0", null));
    new EditorUi(new Editor(false, null));

	return (
		<div ref={ref}></div>
	);
};



// export default props => {
//     console.log(window, MxGraph);
//     return (
//         <div>
//             GraphEditor
//         </div>
//     );
// };
