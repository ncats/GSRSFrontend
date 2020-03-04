dependencies = {
	//Strip all console.* calls except console.warn and console.error. This is basically a work-around
	//for trac issue: http://bugs.dojotoolkit.org/ticket/6849 where Safari 3's console.debug seems
	//to be flaky to set up (apparently fixed in a webkit nightly).
	//But in general for a build, console.warn/error should be the only things to survive anyway.
	stripConsole: "normal",

	selectorEngine:"acme",

	layers: [
		{
			name: "dojo.js",
			dependencies: [
				"dojo.loadInit",
				"dojo.text",
				"dojo.i18n",
				"dojo.selector.acme",
				"dojo.io.script",
				"dojo.io.iframe",
 			        "dojo.window",
				"dojo.Stateful",
				"dojo.cache",
				"dojo.colors",
				"dojo.cookie",
				"dojo.date.stamp",
				"dojo.fx",
				"dojo.fx.Toggler",
				"dojo.fx.easing",
				"dojo.hccss",
				"dojo.html",
				"dojo.parser",
				"dojo.promise.all",
				"dojo.regexp",
				"dojo.string",
				"dojo.touch",
				"dojo.uacss",
				"dojo.touch",
				"dojo.touch",
				"dojo.touch",
				"dojo._base.url",
				"dijit.dijit",
				"dojox.gfx",
				"dojox.gfx.fx",
				"dojox.gfx.path",
				"dojox.gfx.renderer",
				"dojox.gfx.svg",
				"dojox.gfx.utils",
				"dojox.gfx.gradutils",
				"dojox.color._base",
				"dojox.color.Pallete",
				"dojox.charting.Chart",
				"dojox.charting.Chart2D",
				"dojox.charting.Theme",
				"dojox.charting.action2d.Base",
				"dojox.color.Pallete",
				"dojox.storage.Provider",
				"dojox.storage.LocalStorageProvider",
				"dojox.charting.action2d.Highlight",
				"dojox.charting.action2d.Magnify",
				"dojox.charting.action2d.MoveSlice",
				"dojox.charting.action2d.PlotAction",
				"dojox.charting.action2d.Tooltip",
				"dojox.charting.themes.Claro",
				"dojox.charting.themes.Wetland",
				"dojox.charting.themes.common",
				"dojox.charting.widget.Legend",
				"dojox.lang.functional.scan",
				"dijit.Tooltip",
				"dijit._HasDropDown",
				"dijit.form.Button",
				"dijit.form.ComboButton",
				"dijit.form.DropDownButton",
				"dijit.form.ToggleButton",
				"dijit.form._ButtonMixin",
				"dijit.form._ToggleButtonMixin",
				"dijit.layout.AccordionContainer",
				"dijit.layout.AccordionPane",
				"dijit.layout.ContentPane",
				"dijit.layout.StackContainer",
				"dijit.layout.StackController",
				"dijit.layout._ContentPaneResizeMixin",
				"dijit.layout.utils",
				"dijit.nls.loading",
				"dijit.nls.dojo_en-us"
			]
		},
		{
			name: "../dijit/dijit.js",
			dependencies: [
				"dijit.dijit"
			]
		},
		{
			name: "../dijit/dijit-all.js",
			layerDependencies: [
				"../dijit/dijit.js"
			],
			dependencies: [
				"dijit.dijit-all"
			]
		},
		{
			name: "../dojox/grid/DataGrid.js",
			dependencies: [
				"dojox.grid.DataGrid"
			]
		},
		{
			name: "../dojox/gfx.js",
			dependencies: [
				"dojox.gfx"
			]
		},
		// FIXME:
		//		we probably need a better structure for this layer and need to
		//		add some of the most common themes
		{
			name: "../dojox/charting/widget/Chart2D.js",
			dependencies: [
				"dojox.charting.widget.Chart2D",
				"dojox.charting.widget.Sparkline",
				"dojox.charting.widget.Legend"
			]
		},
		{
			name: "../dojox/dtl.js",
			dependencies: [
				"dojox.dtl",
				"dojox.dtl.Context",
				"dojox.dtl.tag.logic",
				"dojox.dtl.tag.loop",
				"dojox.dtl.tag.date",
				"dojox.dtl.tag.loader",
				"dojox.dtl.tag.misc",
				"dojox.dtl.ext-dojo.NodeList"
			]
		},
		{
			name: "../dojox/mobile.js",
			dependencies: [
				"dojox.mobile"
			]
		},
		{
			name: "../dojox/mobile/app.js",
			dependencies: [
				"dojox.mobile.app"
			]
		},
		{
			name: "../dojox/mobile/compat.js",
			dependencies: [
				"dojox.mobile.compat"
			]
		},
		{
			name: "../dojox/mobile/app/compat.js",
			dependencies: [
				"dojox.mobile.app.compat"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ],
		[ "themes", "../themes" ]
	]
};
