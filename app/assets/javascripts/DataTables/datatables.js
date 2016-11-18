/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#dt/dt-1.10.12/b-1.2.2/b-colvis-1.2.2/e-1.5.6/r-2.1.0/se-1.2.0
 *
 * Included libraries:
 *   DataTables 1.10.12, Buttons 1.2.2, Column visibility 1.2.2, Editor 1.5.6, Responsive 2.1.0, Select 1.2.0
 */

/*! DataTables 1.10.12
 * ©2008-2015 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.12
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2008-2015 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = $.isArray(data) && ( $.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).bind('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ) );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if ( s.nTable == this || s.nTHead.parentNode == this || (s.nTFoot && s.nTFoot.parentNode == this) )
				{
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			
			if ( oInit.oLanguage )
			{
				_fnLanguageCompat( oInit.oLanguage );
			}
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = $.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ],
				[ "bJQueryUI", "bJUI" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			// @todo Remove in 1.11
			if ( oInit.bJQueryUI )
			{
				/* Use the JUI classes object for display. You could clone the oStdClasses object if
				 * you want to have multiple tables with multiple independent classes
				 */
				$.extend( oClasses, DataTable.ext.oJUIClasses, oInit.oClasses );
			
				if ( oInit.sDom === defaults.sDom && defaults.sDom === "lfrtip" )
				{
					/* Set the DOM to use a layout suitable for jQuery UI's theming */
					oSettings.sDom = '<"H"lfr>t<"F"ip>';
				}
			
				if ( ! oSettings.renderer ) {
					oSettings.renderer = 'jqueryui';
				}
				else if ( $.isPlainObject( oSettings.renderer ) && ! oSettings.renderer.header ) {
					oSettings.renderer.header = 'jqueryui';
				}
			}
			else
			{
				$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			}
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = $.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl !== "" )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnLoadState( oSettings, oInit );
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
			}
			
			
			/*
			 * Sorting
			 * @todo For modularisation (1.11) this needs to do into a sort start up handler
			 */
			
			// If aaSorting is not defined, then we use the first indicator in asSorting
			// in case that has been altered, so the default sort reflects that option
			if ( oInit.aaSorting === undefined )
			{
				var sorting = oSettings.aaSorting;
				for ( i=0, iLen=sorting.length ; i<iLen ; i++ )
				{
					sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
				}
			}
			
			/* Do a first pass on the sorting classes (allows any size changes to be taken into
			 * account, and also will apply sorting disabled classes if disabled
			 */
			_fnSortingClasses( oSettings );
			
			if ( features.bSort )
			{
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted ) {
						var aSort = _fnSortFlatten( oSettings );
						var sortedColumns = {};
			
						$.each( aSort, function (i, val) {
							sortedColumns[ val.src ] = val.dir;
						} );
			
						_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
						_fnSortAria( oSettings );
					}
				} );
			}
			
			_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
				if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
					_fnSortingClasses( oSettings );
				}
			}, 'sc' );
			
			
			/*
			 * Final init
			 * Cache the header, body and footer as required, creating them if needed
			 */
			
			// Work around for Webkit bug 83867 - store the caption-side before removing from doc
			var captions = $this.children('caption').each( function () {
				this._captionSide = $this.css('caption-side');
			} );
			
			var thead = $this.children('thead');
			if ( thead.length === 0 )
			{
				thead = $('<thead/>').appendTo(this);
			}
			oSettings.nTHead = thead[0];
			
			var tbody = $this.children('tbody');
			if ( tbody.length === 0 )
			{
				tbody = $('<tbody/>').appendTo(this);
			}
			oSettings.nTBody = tbody[0];
			
			var tfoot = $this.children('tfoot');
			if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") )
			{
				// If we are a scrolling table, and no footer has been given, then we need to create
				// a tfoot element for the caption element to be appended to
				tfoot = $('<tfoot/>').appendTo(this);
			}
			
			if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
				$this.addClass( oClasses.sNoFooter );
			}
			else if ( tfoot.length > 0 ) {
				oSettings.nTFoot = tfoot[0];
				_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
			}
			
			/* Check if there is data passing into the constructor */
			if ( oInit.aaData )
			{
				for ( i=0 ; i<oInit.aaData.length ; i++ )
				{
					_fnAddData( oSettings, oInit.aaData[ i ] );
				}
			}
			else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' )
			{
				/* Grab the data from the page - only do this when deferred loading or no Ajax
				 * source since there is no point in reading the DOM data if we are then going
				 * to replace it with Ajax data
				 */
				_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
			}
			
			/* Copy the data index array */
			oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
			/* Initialisation complete - table can be drawn */
			oSettings.bInitialised = true;
			
			/* Check if we need to initialise the table (it might not have been handed off to the
			 * language processor)
			 */
			if ( bInitHandedOff === false )
			{
				_fnInitialise( oSettings );
			}
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n]/g;
	var _re_html = /<.*?>/g;
	var _re_date_start = /^[\w\+\-]/;
	var _re_date_end = /[\w\+\-]$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	//   standards as thousands separators.
	var _re_formatted_numeric = /[',$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		var defaults = DataTable.defaults.oLanguage;
		var zeroRecords = lang.sZeroRecords;
	
		/* Backwards compatibility - if there is no sEmptyTable given, then use the same as
		 * sZeroRecords - assuming that is given.
		 */
		if ( ! lang.sEmptyTable && zeroRecords &&
			defaults.sEmptyTable === "No data available in table" )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
		}
	
		/* Likewise with loading records */
		if ( ! lang.sLoadingRecords && zeroRecords &&
			defaults.sLoadingRecords === "Loading..." )
		{
			_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
		}
	
		// Old parameter name of the thousands separator mapped onto the new
		if ( lang.sInfoThousands ) {
			lang.sThousands = lang.sInfoThousands;
		}
	
		var decimal = lang.sDecimal;
		if ( decimal ) {
			_addNumericSort( decimal );
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( dataSort && ! $.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: 0,
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! $.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( $.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( $.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = $.trim(cell.innerHTML);
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
	
				nTd = nTrIn ? anTds[i] : document.createElement( oCol.sCellType );
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( (!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
	 	$(thead).find('>tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).find('>tr>th, >tr>td').addClass( classes.sHeaderTH );
		$(tfoot).find('>tr>th, >tr>td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && $.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = $.isFunction( ajaxData ) ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = $.isFunction( ajaxData ) && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( $.isFunction( ajax ) )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.bind(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.bind( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=display.length-1 ; i>=0 ; i-- ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( ! rpSearch.test( data ) ) {
				display.splice( i, 1 );
			}
		}
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=display.length-1 ; i>=0 ; i-- ) {
				if ( ! rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					display.splice( i, 1 );
				}
			}
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = $.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option( language[i], lengths[i] );
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.bind( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).bind( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css(
			scrollY && scroll.bCollapse ? 'max-height' : 'height', 
			scrollY
		);
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+headerContent[i]+'</div>';
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+footerContent[i]+'</div>';
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.scroll();
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).bind('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! $.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( $.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit )
	{
		var i, ien;
		var columns = settings.aoColumns;
	
		if ( ! settings.oFeatures.bStateSave ) {
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings );
		if ( ! state || ! state.time ) {
			return;
		}
	
		/* Allow custom and plug-in manipulation functions to alter the saved data set and
		 * cancelling of loading by returning false
		 */
		var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, state] );
		if ( $.inArray( false, abStateLoad ) !== -1 ) {
			return;
		}
	
		/* Reject old data */
		var duration = settings.iStateDuration;
		if ( duration > 0 && state.time < +new Date() - (duration*1000) ) {
			return;
		}
	
		// Number of columns have changed - all bets are off, no restore of settings
		if ( columns.length !== state.columns.length ) {
			return;
		}
	
		// Store the saved state so it might be accessed at any time
		settings.oLoadedState = $.extend( true, {}, state );
	
		// Restore key features - todo - for 1.11 this needs to be done by
		// subscribed events
		if ( state.start !== undefined ) {
			settings._iDisplayStart    = state.start;
			settings.iInitDisplayStart = state.start;
		}
		if ( state.length !== undefined ) {
			settings._iDisplayLength   = state.length;
		}
	
		// Order
		if ( state.order !== undefined ) {
			settings.aaSorting = [];
			$.each( state.order, function ( i, col ) {
				settings.aaSorting.push( col[0] >= columns.length ?
					[ 0, col[1] ] :
					col
				);
			} );
		}
	
		// Search
		if ( state.search !== undefined ) {
			$.extend( settings.oPreviousSearch, _fnSearchToHung( state.search ) );
		}
	
		// Columns
		for ( i=0, ien=state.columns.length ; i<ien ; i++ ) {
			var col = state.columns[i];
	
			// Visibility
			if ( col.visible !== undefined ) {
				columns[i].bVisible = col.visible;
			}
	
			// Search
			if ( col.search !== undefined ) {
				$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
			}
		}
	
		_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, state] );
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( $.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( $.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && $.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.bind( 'click.DT', oData, function (e) {
					n.blur(); // Remove focus outline for mouse users
					fn(e);
				} )
			.bind( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.bind( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings = settings.concat( a );
			}
		};
	
		if ( $.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			j, jen,
			struct, inner,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = typeof struct.val === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				$.isPlainObject( struct.val ) ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( $.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   []
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					$.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			a = selector[i] && selector[i].split ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? $.trim(a[j]) : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			a = search == 'none' ?
				displayMaster.slice() :                      // no search
				search == 'applied' ?
					displayFiltered.slice() :                // applied search
					$.map( displayMaster, function (el, i) { // removed search
						return $.inArray( el, displayFiltered ) === -1 ? el : null;
					} );
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	
	
	var __row_selector = function ( settings, selector, opts )
	{
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			var rows = _selector_row_indexes( settings, opts );
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( ! sel ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = settings.aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - node
			if ( sel.nodeName ) {
				if ( sel._DT_RowIndex !== undefined ) {
					return [ sel._DT_RowIndex ]; // Property added by DT for fast lookup
				}
				else if ( sel._DT_CellIndex ) {
					return [ sel._DT_CellIndex.row ];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		ctx[0].aoData[ this[0] ]._aData = data;
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( $.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td/></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.remove();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^(.+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		_fnSaveState( settings );
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			// Second loop once the first is done for events
			this.iterator( 'column', function ( settings, column ) {
				_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
			} );
	
			if ( calc === undefined || calc ) {
				this.columns.adjust();
			}
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $( [].concat.apply([], cells) );
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				return [s];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// Row + column selector
		var columns = this.columns( columnSelector, opts );
		var rows = this.rows( rowSelector, opts );
		var a, i, ien, j, jen;
	
		var cells = this.iterator( 'table', function ( settings, idx ) {
			a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! $.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return $.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			if ( ! args[0].match(/\.dt\b/) ) {
				args[0] += '.dt';
			}
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.unbind('.DT').find(':not(tbody *)').unbind('.DT');
			$(window).unbind('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			if ( settings.bJUI ) {
				$('th span.'+classes.sSortIcon+ ', td span.'+classes.sSortIcon, thead).detach();
				$('th, td', thead).each( function () {
					var wrapper = $('div.'+classes.sSortJUIWrapper, this);
					$(this).append( wrapper.contents() );
					wrapper.detach();
				} );
			}
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );

	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.12";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would at around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit.
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Enable jQuery UI ThemeRoller support (required as ThemeRoller requires some
		 * slightly different and additional mark-up from what DataTables has
		 * traditionally used).
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.jQueryUI
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "jQueryUI": true
		 *      } );
		 *    } );
		 */
		"bJQueryUI": false,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings) {
		 *          var o;
		 *
		 *          // Send an Ajax request to the server to get the data. Note that
		 *          // this is a synchronous request.
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "async": false,
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              o = json;
		 *            }
		 *          } );
		 *
		 *          return o;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features four different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus
		 *   page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "platform.details.0" },
		 *          { "data": "platform.details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * Flag to indicate if jQuery UI marking and classes should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bJUI": null,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"dt/dt-1.10.12/b-1.2.2/b-colvis-1.2.2/e-1.5.6/r-2.1.0/se-1.2.0",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! $.isNumeric( data.substring(1) ) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	(function() {
	
	// Reused strings for better compression. Closure compiler appears to have a
	// weird edge case where it is trying to expand strings rather than use the
	// variable version. This results in about 200 bytes being added, for very
	// little preference benefit since it this run on script load only.
	var _empty = '';
	_empty = '';
	
	var _stateDefault = _empty + 'ui-state-default';
	var _sortIcon     = _empty + 'css_right ui-icon ui-icon-';
	var _headerFooter = _empty + 'fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix';
	
	$.extend( DataTable.ext.oJUIClasses, DataTable.ext.classes, {
		/* Full numbers paging buttons */
		"sPageButton":         "fg-button ui-button "+_stateDefault,
		"sPageButtonActive":   "ui-state-disabled",
		"sPageButtonDisabled": "ui-state-disabled",
	
		/* Features */
		"sPaging": "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi "+
			"ui-buttonset-multi paging_", /* Note that the type is postfixed */
	
		/* Sorting */
		"sSortAsc":            _stateDefault+" sorting_asc",
		"sSortDesc":           _stateDefault+" sorting_desc",
		"sSortable":           _stateDefault+" sorting",
		"sSortableAsc":        _stateDefault+" sorting_asc_disabled",
		"sSortableDesc":       _stateDefault+" sorting_desc_disabled",
		"sSortableNone":       _stateDefault+" sorting_disabled",
		"sSortJUIAsc":         _sortIcon+"triangle-1-n",
		"sSortJUIDesc":        _sortIcon+"triangle-1-s",
		"sSortJUI":            _sortIcon+"carat-2-n-s",
		"sSortJUIAscAllowed":  _sortIcon+"carat-1-n",
		"sSortJUIDescAllowed": _sortIcon+"carat-1-s",
		"sSortJUIWrapper":     "DataTables_sort_wrapper",
		"sSortIcon":           "DataTables_sort_icon",
	
		/* Scrolling */
		"sScrollHead": "dataTables_scrollHead "+_stateDefault,
		"sScrollFoot": "dataTables_scrollFoot "+_stateDefault,
	
		/* Misc */
		"sHeaderTH":  _stateDefault,
		"sFooterTH":  _stateDefault,
		"sJUIHeader": _headerFooter+" ui-corner-tl ui-corner-tr",
		"sJUIFooter": _headerFooter+" ui-corner-bl ui-corner-br"
	} );
	
	}());
	
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( $.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = '';
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
									btnClass = button + (page > 0 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
									btnClass = button + (page < pages-1 ?
										'' : ' '+classes.sPageButtonDisabled);
									break;
	
								default:
									btnDisplay = button + 1;
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': settings.iTabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).focus();
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 will remove any unknown characters at the start and end of the
			// expression, leading to false matches such as `$245.12` or `10%` being
			// a valid date. See forum thread 18941 for detail.
			if ( d && !(d instanceof Date) && ( ! _re_date_start.test(d) || ! _re_date_end.test(d) ) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			return Date.parse( d ) || 0;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, searcg or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*! Buttons for DataTables 1.2.2
 * ©2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Used for namespacing events added to the document by each instance, so they
// can be removed on destroy
var _instCounter = 0;

// Button namespacing counter for namespacing events on individual buttons
var _buttonCounter = 0;

var _dtButtons = DataTable.ext.buttons;

/**
 * [Buttons description]
 * @param {[type]}
 * @param {[type]}
 */
var Buttons = function( dt, config )
{
	// Allow a boolean true for defaults
	if ( config === true ) {
		config = {};
	}

	// For easy configuration of buttons an array can be given
	if ( $.isArray( config ) ) {
		config = { buttons: config };
	}

	this.c = $.extend( true, {}, Buttons.defaults, config );

	// Don't want a deep copy for the buttons
	if ( config.buttons ) {
		this.c.buttons = config.buttons;
	}

	this.s = {
		dt: new DataTable.Api( dt ),
		buttons: [],
		listenKeys: '',
		namespace: 'dtb'+(_instCounter++)
	};

	this.dom = {
		container: $('<'+this.c.dom.container.tag+'/>')
			.addClass( this.c.dom.container.className )
	};

	this._constructor();
};


$.extend( Buttons.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Public methods
	 */

	/**
	 * Get the action of a button
	 * @param  {int|string} Button index
	 * @return {function}
	 *//**
	 * Set the action of a button
	 * @param  {node} node Button element
	 * @param  {function} action Function to set
	 * @return {Buttons} Self for chaining
	 */
	action: function ( node, action )
	{
		var button = this._nodeToButton( node );

		if ( action === undefined ) {
			return button.conf.action;
		}

		button.conf.action = action;

		return this;
	},

	/**
	 * Add an active class to the button to make to look active or get current
	 * active state.
	 * @param  {node} node Button element
	 * @param  {boolean} [flag] Enable / disable flag
	 * @return {Buttons} Self for chaining or boolean for getter
	 */
	active: function ( node, flag ) {
		var button = this._nodeToButton( node );
		var klass = this.c.dom.button.active;
		var jqNode = $(button.node);

		if ( flag === undefined ) {
			return jqNode.hasClass( klass );
		}

		jqNode.toggleClass( klass, flag === undefined ? true : flag );

		return this;
	},

	/**
	 * Add a new button
	 * @param {object} config Button configuration object, base string name or function
	 * @param {int|string} [idx] Button index for where to insert the button
	 * @return {Buttons} Self for chaining
	 */
	add: function ( config, idx )
	{
		var buttons = this.s.buttons;

		if ( typeof idx === 'string' ) {
			var split = idx.split('-');
			var base = this.s;

			for ( var i=0, ien=split.length-1 ; i<ien ; i++ ) {
				base = base.buttons[ split[i]*1 ];
			}

			buttons = base.buttons;
			idx = split[ split.length-1 ]*1;
		}

		this._expandButton( buttons, config, false, idx );
		this._draw();

		return this;
	},

	/**
	 * Get the container node for the buttons
	 * @return {jQuery} Buttons node
	 */
	container: function ()
	{
		return this.dom.container;
	},

	/**
	 * Disable a button
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	disable: function ( node ) {
		var button = this._nodeToButton( node );

		$(button.node).addClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Destroy the instance, cleaning up event handlers and removing DOM
	 * elements
	 * @return {Buttons} Self for chaining
	 */
	destroy: function ()
	{
		// Key event listener
		$('body').off( 'keyup.'+this.s.namespace );

		// Individual button destroy (so they can remove their own events if
		// needed). Take a copy as the array is modified by `remove`
		var buttons = this.s.buttons.slice();
		var i, ien;
		
		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.remove( buttons[i].node );
		}

		// Container
		this.dom.container.remove();

		// Remove from the settings object collection
		var buttonInsts = this.s.dt.settings()[0];

		for ( i=0, ien=buttonInsts.length ; i<ien ; i++ ) {
			if ( buttonInsts.inst === this ) {
				buttonInsts.splice( i, 1 );
				break;
			}
		}

		return this;
	},

	/**
	 * Enable / disable a button
	 * @param  {node} node Button node
	 * @param  {boolean} [flag=true] Enable / disable flag
	 * @return {Buttons} Self for chaining
	 */
	enable: function ( node, flag )
	{
		if ( flag === false ) {
			return this.disable( node );
		}

		var button = this._nodeToButton( node );
		$(button.node).removeClass( this.c.dom.button.disabled );

		return this;
	},

	/**
	 * Get the instance name for the button set selector
	 * @return {string} Instance name
	 */
	name: function ()
	{
		return this.c.name;
	},

	/**
	 * Get a button's node
	 * @param  {node} node Button node
	 * @return {jQuery} Button element
	 */
	node: function ( node )
	{
		var button = this._nodeToButton( node );
		return $(button.node);
	},

	/**
	 * Remove a button.
	 * @param  {node} node Button node
	 * @return {Buttons} Self for chaining
	 */
	remove: function ( node )
	{
		var button = this._nodeToButton( node );
		var host = this._nodeToHost( node );
		var dt = this.s.dt;

		// Remove any child buttons first
		if ( button.buttons.length ) {
			for ( var i=button.buttons.length-1 ; i>=0 ; i-- ) {
				this.remove( button.buttons[i].node );
			}
		}

		// Allow the button to remove event handlers, etc
		if ( button.conf.destroy ) {
			button.conf.destroy.call( dt.button(node), dt, $(node), button.conf );
		}

		this._removeKey( button.conf );

		$(button.node).remove();

		var idx = $.inArray( button, host );
		host.splice( idx, 1 );

		return this;
	},

	/**
	 * Get the text for a button
	 * @param  {int|string} node Button index
	 * @return {string} Button text
	 *//**
	 * Set the text for a button
	 * @param  {int|string|function} node Button index
	 * @param  {string} label Text
	 * @return {Buttons} Self for chaining
	 */
	text: function ( node, label )
	{
		var button = this._nodeToButton( node );
		var buttonLiner = this.c.dom.collection.buttonLiner;
		var linerTag = button.inCollection && buttonLiner && buttonLiner.tag ?
			buttonLiner.tag :
			this.c.dom.buttonLiner.tag;
		var dt = this.s.dt;
		var jqNode = $(button.node);
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, jqNode, button.conf ) :
				opt;
		};

		if ( label === undefined ) {
			return text( button.conf.text );
		}

		button.conf.text = label;

		if ( linerTag ) {
			jqNode.children( linerTag ).html( text(label) );
		}
		else {
			jqNode.html( text(label) );
		}

		return this;
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Buttons constructor
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtSettings = dt.settings()[0];
		var buttons =  this.c.buttons;

		if ( ! dtSettings._buttons ) {
			dtSettings._buttons = [];
		}

		dtSettings._buttons.push( {
			inst: this,
			name: this.c.name
		} );

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			this.add( buttons[i] );
		}

		dt.on( 'destroy', function () {
			that.destroy();
		} );

		// Global key event binding to listen for button keys
		$('body').on( 'keyup.'+this.s.namespace, function ( e ) {
			if ( ! document.activeElement || document.activeElement === document.body ) {
				// SUse a string of characters for fast lookup of if we need to
				// handle this
				var character = String.fromCharCode(e.keyCode).toLowerCase();

				if ( that.s.listenKeys.toLowerCase().indexOf( character ) !== -1 ) {
					that._keypress( character, e );
				}
			}
		} );
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Add a new button to the key press listener
	 * @param {object} conf Resolved button configuration object
	 * @private
	 */
	_addKey: function ( conf )
	{
		if ( conf.key ) {
			this.s.listenKeys += $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;
		}
	},

	/**
	 * Insert the buttons into the container. Call without parameters!
	 * @param  {node} [container] Recursive only - Insert point
	 * @param  {array} [buttons] Recursive only - Buttons array
	 * @private
	 */
	_draw: function ( container, buttons )
	{
		if ( ! container ) {
			container = this.dom.container;
			buttons = this.s.buttons;
		}

		container.children().detach();

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			container.append( buttons[i].inserter );

			if ( buttons[i].buttons && buttons[i].buttons.length ) {
				this._draw( buttons[i].collection, buttons[i].buttons );
			}
		}
	},

	/**
	 * Create buttons from an array of buttons
	 * @param  {array} attachTo Buttons array to attach to
	 * @param  {object} button Button definition
	 * @param  {boolean} inCollection true if the button is in a collection
	 * @private
	 */
	_expandButton: function ( attachTo, button, inCollection, attachPoint )
	{
		var dt = this.s.dt;
		var buttonCounter = 0;
		var buttons = ! $.isArray( button ) ?
			[ button ] :
			button;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			var conf = this._resolveExtends( buttons[i] );

			if ( ! conf ) {
				continue;
			}

			// If the configuration is an array, then expand the buttons at this
			// point
			if ( $.isArray( conf ) ) {
				this._expandButton( attachTo, conf, inCollection, attachPoint );
				continue;
			}

			var built = this._buildButton( conf, inCollection );
			if ( ! built ) {
				continue;
			}

			if ( attachPoint !== undefined ) {
				attachTo.splice( attachPoint, 0, built );
				attachPoint++;
			}
			else {
				attachTo.push( built );
			}

			if ( built.conf.buttons ) {
				var collectionDom = this.c.dom.collection;
				built.collection = $('<'+collectionDom.tag+'/>')
					.addClass( collectionDom.className );
				built.conf._collection = built.collection;

				this._expandButton( built.buttons, built.conf.buttons, true, attachPoint );
			}

			// init call is made here, rather than buildButton as it needs to
			// be selectable, and for that it needs to be in the buttons array
			if ( conf.init ) {
				conf.init.call( dt.button( built.node ), dt, $(built.node), conf );
			}

			buttonCounter++;
		}
	},

	/**
	 * Create an individual button
	 * @param  {object} config            Resolved button configuration
	 * @param  {boolean} inCollection `true` if a collection button
	 * @return {jQuery} Created button node (jQuery)
	 * @private
	 */
	_buildButton: function ( config, inCollection )
	{
		var buttonDom = this.c.dom.button;
		var linerDom = this.c.dom.buttonLiner;
		var collectionDom = this.c.dom.collection;
		var dt = this.s.dt;
		var text = function ( opt ) {
			return typeof opt === 'function' ?
				opt( dt, button, config ) :
				opt;
		};

		if ( inCollection && collectionDom.button ) {
			buttonDom = collectionDom.button;
		}

		if ( inCollection && collectionDom.buttonLiner ) {
			linerDom = collectionDom.buttonLiner;
		}

		// Make sure that the button is available based on whatever requirements
		// it has. For example, Flash buttons require Flash
		if ( config.available && ! config.available( dt, config ) ) {
			return false;
		}

		var action = function ( e, dt, button, config ) {
			config.action.call( dt.button( button ), e, dt, button, config );

			$(dt.table().node()).triggerHandler( 'buttons-action.dt', [
				dt.button( button ), dt, button, config 
			] );
		};

		var button = $('<'+buttonDom.tag+'/>')
			.addClass( buttonDom.className )
			.attr( 'tabindex', this.s.dt.settings()[0].iTabIndex )
			.attr( 'aria-controls', this.s.dt.table().node().id )
			.on( 'click.dtb', function (e) {
				e.preventDefault();

				if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
					action( e, dt, button, config );
				}

				button.blur();
			} )
			.on( 'keyup.dtb', function (e) {
				if ( e.keyCode === 13 ) {
					if ( ! button.hasClass( buttonDom.disabled ) && config.action ) {
						action( e, dt, button, config );
					}
				}
			} );

		// Make `a` tags act like a link
		if ( buttonDom.tag.toLowerCase() === 'a' ) {
			button.attr( 'href', '#' );
		}

		if ( linerDom.tag ) {
			var liner = $('<'+linerDom.tag+'/>')
				.html( text( config.text ) )
				.addClass( linerDom.className );

			if ( linerDom.tag.toLowerCase() === 'a' ) {
				liner.attr( 'href', '#' );
			}

			button.append( liner );
		}
		else {
			button.html( text( config.text ) );
		}

		if ( config.enabled === false ) {
			button.addClass( buttonDom.disabled );
		}

		if ( config.className ) {
			button.addClass( config.className );
		}

		if ( config.titleAttr ) {
			button.attr( 'title', config.titleAttr );
		}

		if ( ! config.namespace ) {
			config.namespace = '.dt-button-'+(_buttonCounter++);
		}

		var buttonContainer = this.c.dom.buttonContainer;
		var inserter;
		if ( buttonContainer && buttonContainer.tag ) {
			inserter = $('<'+buttonContainer.tag+'/>')
				.addClass( buttonContainer.className )
				.append( button );
		}
		else {
			inserter = button;
		}

		this._addKey( config );

		return {
			conf:         config,
			node:         button.get(0),
			inserter:     inserter,
			buttons:      [],
			inCollection: inCollection,
			collection:   null
		};
	},

	/**
	 * Get the button object from a node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {object} Button object
	 * @private
	 */
	_nodeToButton: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons[i];
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToButton( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Get container array for a button from a button node (recursive)
	 * @param  {node} node Button node
	 * @param  {array} [buttons] Button array, uses base if not defined
	 * @return {array} Button's host array
	 * @private
	 */
	_nodeToHost: function ( node, buttons )
	{
		if ( ! buttons ) {
			buttons = this.s.buttons;
		}

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			if ( buttons[i].node === node ) {
				return buttons;
			}

			if ( buttons[i].buttons.length ) {
				var ret = this._nodeToHost( node, buttons[i].buttons );

				if ( ret ) {
					return ret;
				}
			}
		}
	},

	/**
	 * Handle a key press - determine if any button's key configured matches
	 * what was typed and trigger the action if so.
	 * @param  {string} character The character pressed
	 * @param  {object} e Key event that triggered this call
	 * @private
	 */
	_keypress: function ( character, e )
	{
		var run = function ( conf, node ) {
			if ( ! conf.key ) {
				return;
			}

			if ( conf.key === character ) {
				$(node).click();
			}
			else if ( $.isPlainObject( conf.key ) ) {
				if ( conf.key.key !== character ) {
					return;
				}

				if ( conf.key.shiftKey && ! e.shiftKey ) {
					return;
				}

				if ( conf.key.altKey && ! e.altKey ) {
					return;
				}

				if ( conf.key.ctrlKey && ! e.ctrlKey ) {
					return;
				}

				if ( conf.key.metaKey && ! e.metaKey ) {
					return;
				}

				// Made it this far - it is good
				$(node).click();
			}
		};

		var recurse = function ( a ) {
			for ( var i=0, ien=a.length ; i<ien ; i++ ) {
				run( a[i].conf, a[i].node );

				if ( a[i].buttons.length ) {
					recurse( a[i].buttons );
				}
			}
		};

		recurse( this.s.buttons );
	},

	/**
	 * Remove a key from the key listener for this instance (to be used when a
	 * button is removed)
	 * @param  {object} conf Button configuration
	 * @private
	 */
	_removeKey: function ( conf )
	{
		if ( conf.key ) {
			var character = $.isPlainObject( conf.key ) ?
				conf.key.key :
				conf.key;

			// Remove only one character, as multiple buttons could have the
			// same listening key
			var a = this.s.listenKeys.split('');
			var idx = $.inArray( character, a );
			a.splice( idx, 1 );
			this.s.listenKeys = a.join('');
		}
	},

	/**
	 * Resolve a button configuration
	 * @param  {string|function|object} conf Button config to resolve
	 * @return {object} Button configuration
	 * @private
	 */
	_resolveExtends: function ( conf )
	{
		var dt = this.s.dt;
		var i, ien;
		var toConfObject = function ( base ) {
			var loop = 0;

			// Loop until we have resolved to a button configuration, or an
			// array of button configurations (which will be iterated
			// separately)
			while ( ! $.isPlainObject(base) && ! $.isArray(base) ) {
				if ( base === undefined ) {
					return;
				}

				if ( typeof base === 'function' ) {
					base = base( dt, conf );

					if ( ! base ) {
						return false;
					}
				}
				else if ( typeof base === 'string' ) {
					if ( ! _dtButtons[ base ] ) {
						throw 'Unknown button type: '+base;
					}

					base = _dtButtons[ base ];
				}

				loop++;
				if ( loop > 30 ) {
					// Protect against misconfiguration killing the browser
					throw 'Buttons: Too many iterations';
				}
			}

			return $.isArray( base ) ?
				base :
				$.extend( {}, base );
		};

		conf = toConfObject( conf );

		while ( conf && conf.extend ) {
			// Use `toConfObject` in case the button definition being extended
			// is itself a string or a function
			if ( ! _dtButtons[ conf.extend ] ) {
				throw 'Cannot extend unknown button type: '+conf.extend;
			}

			var objArray = toConfObject( _dtButtons[ conf.extend ] );
			if ( $.isArray( objArray ) ) {
				return objArray;
			}
			else if ( ! objArray ) {
				// This is a little brutal as it might be possible to have a
				// valid button without the extend, but if there is no extend
				// then the host button would be acting in an undefined state
				return false;
			}

			// Stash the current class name
			var originalClassName = objArray.className;

			conf = $.extend( {}, objArray, conf );

			// The extend will have overwritten the original class name if the
			// `conf` object also assigned a class, but we want to concatenate
			// them so they are list that is combined from all extended buttons
			if ( originalClassName && conf.className !== originalClassName ) {
				conf.className = originalClassName+' '+conf.className;
			}

			// Buttons to be added to a collection  -gives the ability to define
			// if buttons should be added to the start or end of a collection
			var postfixButtons = conf.postfixButtons;
			if ( postfixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=postfixButtons.length ; i<ien ; i++ ) {
					conf.buttons.push( postfixButtons[i] );
				}

				conf.postfixButtons = null;
			}

			var prefixButtons = conf.prefixButtons;
			if ( prefixButtons ) {
				if ( ! conf.buttons ) {
					conf.buttons = [];
				}

				for ( i=0, ien=prefixButtons.length ; i<ien ; i++ ) {
					conf.buttons.splice( i, 0, prefixButtons[i] );
				}

				conf.prefixButtons = null;
			}

			// Although we want the `conf` object to overwrite almost all of
			// the properties of the object being extended, the `extend`
			// property should come from the object being extended
			conf.extend = objArray.extend;
		}

		return conf;
	}
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Statics
 */

/**
 * Show / hide a background layer behind a collection
 * @param  {boolean} Flag to indicate if the background should be shown or
 *   hidden 
 * @param  {string} Class to assign to the background
 * @static
 */
Buttons.background = function ( show, className, fade ) {
	if ( fade === undefined ) {
		fade = 400;
	}

	if ( show ) {
		$('<div/>')
			.addClass( className )
			.css( 'display', 'none' )
			.appendTo( 'body' )
			.fadeIn( fade );
	}
	else {
		$('body > div.'+className)
			.fadeOut( fade, function () {
				$(this)
					.removeClass( className )
					.remove();
			} );
	}
};

/**
 * Instance selector - select Buttons instances based on an instance selector
 * value from the buttons assigned to a DataTable. This is only useful if
 * multiple instances are attached to a DataTable.
 * @param  {string|int|array} Instance selector - see `instance-selector`
 *   documentation on the DataTables site
 * @param  {array} Button instance array that was attached to the DataTables
 *   settings object
 * @return {array} Buttons instances
 * @static
 */
Buttons.instanceSelector = function ( group, buttons )
{
	if ( ! group ) {
		return $.map( buttons, function ( v ) {
			return v.inst;
		} );
	}

	var ret = [];
	var names = $.map( buttons, function ( v ) {
		return v.name;
	} );

	// Flatten the group selector into an array of single options
	var process = function ( input ) {
		if ( $.isArray( input ) ) {
			for ( var i=0, ien=input.length ; i<ien ; i++ ) {
				process( input[i] );
			}
			return;
		}

		if ( typeof input === 'string' ) {
			if ( input.indexOf( ',' ) !== -1 ) {
				// String selector, list of names
				process( input.split(',') );
			}
			else {
				// String selector individual name
				var idx = $.inArray( $.trim(input), names );

				if ( idx !== -1 ) {
					ret.push( buttons[ idx ].inst );
				}
			}
		}
		else if ( typeof input === 'number' ) {
			// Index selector
			ret.push( buttons[ input ].inst );
		}
	};
	
	process( group );

	return ret;
};

/**
 * Button selector - select one or more buttons from a selector input so some
 * operation can be performed on them.
 * @param  {array} Button instances array that the selector should operate on
 * @param  {string|int|node|jQuery|array} Button selector - see
 *   `button-selector` documentation on the DataTables site
 * @return {array} Array of objects containing `inst` and `idx` properties of
 *   the selected buttons so you know which instance each button belongs to.
 * @static
 */
Buttons.buttonSelector = function ( insts, selector )
{
	var ret = [];
	var nodeBuilder = function ( a, buttons, baseIdx ) {
		var button;
		var idx;

		for ( var i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( button ) {
				idx = baseIdx !== undefined ?
					baseIdx+i :
					i+'';

				a.push( {
					node: button.node,
					name: button.conf.name,
					idx:  idx
				} );

				if ( button.buttons ) {
					nodeBuilder( a, button.buttons, idx+'-' );
				}
			}
		}
	};

	var run = function ( selector, inst ) {
		var i, ien;
		var buttons = [];
		nodeBuilder( buttons, inst.s.buttons );

		var nodes = $.map( buttons, function (v) {
			return v.node;
		} );

		if ( $.isArray( selector ) || selector instanceof $ ) {
			for ( i=0, ien=selector.length ; i<ien ; i++ ) {
				run( selector[i], inst );
			}
			return;
		}

		if ( selector === null || selector === undefined || selector === '*' ) {
			// Select all
			for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
				ret.push( {
					inst: inst,
					node: buttons[i].node
				} );
			}
		}
		else if ( typeof selector === 'number' ) {
			// Main button index selector
			ret.push( {
				inst: inst,
				node: inst.s.buttons[ selector ].node
			} );
		}
		else if ( typeof selector === 'string' ) {
			if ( selector.indexOf( ',' ) !== -1 ) {
				// Split
				var a = selector.split(',');

				for ( i=0, ien=a.length ; i<ien ; i++ ) {
					run( $.trim(a[i]), inst );
				}
			}
			else if ( selector.match( /^\d+(\-\d+)*$/ ) ) {
				// Sub-button index selector
				var indexes = $.map( buttons, function (v) {
					return v.idx;
				} );

				ret.push( {
					inst: inst,
					node: buttons[ $.inArray( selector, indexes ) ].node
				} );
			}
			else if ( selector.indexOf( ':name' ) !== -1 ) {
				// Button name selector
				var name = selector.replace( ':name', '' );

				for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
					if ( buttons[i].name === name ) {
						ret.push( {
							inst: inst,
							node: buttons[i].node
						} );
					}
				}
			}
			else {
				// jQuery selector on the nodes
				$( nodes ).filter( selector ).each( function () {
					ret.push( {
						inst: inst,
						node: this
					} );
				} );
			}
		}
		else if ( typeof selector === 'object' && selector.nodeName ) {
			// Node selector
			var idx = $.inArray( selector, nodes );

			if ( idx !== -1 ) {
				ret.push( {
					inst: inst,
					node: nodes[ idx ]
				} );
			}
		}
	};


	for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
		var inst = insts[i];

		run( selector, inst );
	}

	return ret;
};


/**
 * Buttons defaults. For full documentation, please refer to the docs/option
 * directory or the DataTables site.
 * @type {Object}
 * @static
 */
Buttons.defaults = {
	buttons: [ 'copy', 'excel', 'csv', 'pdf', 'print' ],
	name: 'main',
	tabIndex: 0,
	dom: {
		container: {
			tag: 'div',
			className: 'dt-buttons'
		},
		collection: {
			tag: 'div',
			className: 'dt-button-collection'
		},
		button: {
			tag: 'a',
			className: 'dt-button',
			active: 'active',
			disabled: 'disabled'
		},
		buttonLiner: {
			tag: 'span',
			className: ''
		}
	}
};

/**
 * Version information
 * @type {string}
 * @static
 */
Buttons.version = '1.2.2';


$.extend( _dtButtons, {
	collection: {
		text: function ( dt ) {
			return dt.i18n( 'buttons.collection', 'Collection' );
		},
		className: 'buttons-collection',
		action: function ( e, dt, button, config ) {
			var host = button;
			var hostOffset = host.offset();
			var tableContainer = $( dt.table().container() );
			var multiLevel = false;

			// Remove any old collection
			if ( $('div.dt-button-background').length ) {
				multiLevel = $('div.dt-button-collection').offset();
				$('body').trigger( 'click.dtb-collection' );
			}

			config._collection
				.addClass( config.collectionLayout )
				.css( 'display', 'none' )
				.appendTo( 'body' )
				.fadeIn( config.fade );

			var position = config._collection.css( 'position' );

			if ( multiLevel && position === 'absolute' ) {
				config._collection.css( {
					top: multiLevel.top + 5, // magic numbers for a little offset
					left: multiLevel.left + 5
				} );
			}
			else if ( position === 'absolute' ) {
				config._collection.css( {
					top: hostOffset.top + host.outerHeight(),
					left: hostOffset.left
				} );

				var listRight = hostOffset.left + config._collection.outerWidth();
				var tableRight = tableContainer.offset().left + tableContainer.width();
				if ( listRight > tableRight ) {
					config._collection.css( 'left', hostOffset.left - ( listRight - tableRight ) );
				}
			}
			else {
				// Fix position - centre on screen
				var top = config._collection.height() / 2;
				if ( top > $(window).height() / 2 ) {
					top = $(window).height() / 2;
				}

				config._collection.css( 'marginTop', top*-1 );
			}

			if ( config.background ) {
				Buttons.background( true, config.backgroundClassName, config.fade );
			}

			// Need to break the 'thread' for the collection button being
			// activated by a click - it would also trigger this event
			setTimeout( function () {
				// This is bonkers, but if we don't have a click listener on the
				// background element, iOS Safari will ignore the body click
				// listener below. An empty function here is all that is
				// required to make it work...
				$('div.dt-button-background').on( 'click.dtb-collection', function () {} );

				$('body').on( 'click.dtb-collection', function (e) {
					// andSelf is deprecated in jQ1.8, but we want 1.7 compat
					var back = $.fn.addBack ? 'addBack' : 'andSelf';

					if ( ! $(e.target).parents()[back]().filter( config._collection ).length ) {
						config._collection
							.fadeOut( config.fade, function () {
								config._collection.detach();
							} );

						$('div.dt-button-background').off( 'click.dtb-collection' );
						Buttons.background( false, config.backgroundClassName, config.fade );

						$('body').off( 'click.dtb-collection' );
						dt.off( 'buttons-action.b-internal' );
					}
				} );
			}, 10 );

			if ( config.autoClose ) {
				dt.on( 'buttons-action.b-internal', function () {
					$('div.dt-button-background').click();
				} );
			}
		},
		background: true,
		collectionLayout: '',
		backgroundClassName: 'dt-button-background',
		autoClose: false,
		fade: 400
	},
	copy: function ( dt, conf ) {
		if ( _dtButtons.copyHtml5 ) {
			return 'copyHtml5';
		}
		if ( _dtButtons.copyFlash && _dtButtons.copyFlash.available( dt, conf ) ) {
			return 'copyFlash';
		}
	},
	csv: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.csvHtml5 && _dtButtons.csvHtml5.available( dt, conf ) ) {
			return 'csvHtml5';
		}
		if ( _dtButtons.csvFlash && _dtButtons.csvFlash.available( dt, conf ) ) {
			return 'csvFlash';
		}
	},
	excel: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.excelHtml5 && _dtButtons.excelHtml5.available( dt, conf ) ) {
			return 'excelHtml5';
		}
		if ( _dtButtons.excelFlash && _dtButtons.excelFlash.available( dt, conf ) ) {
			return 'excelFlash';
		}
	},
	pdf: function ( dt, conf ) {
		// Common option that will use the HTML5 or Flash export buttons
		if ( _dtButtons.pdfHtml5 && _dtButtons.pdfHtml5.available( dt, conf ) ) {
			return 'pdfHtml5';
		}
		if ( _dtButtons.pdfFlash && _dtButtons.pdfFlash.available( dt, conf ) ) {
			return 'pdfFlash';
		}
	},
	pageLength: function ( dt ) {
		var lengthMenu = dt.settings()[0].aLengthMenu;
		var vals = $.isArray( lengthMenu[0] ) ? lengthMenu[0] : lengthMenu;
		var lang = $.isArray( lengthMenu[0] ) ? lengthMenu[1] : lengthMenu;
		var text = function ( dt ) {
			return dt.i18n( 'buttons.pageLength', {
				"-1": 'Show all rows',
				_:    'Show %d rows'
			}, dt.page.len() );
		};

		return {
			extend: 'collection',
			text: text,
			className: 'buttons-page-length',
			autoClose: true,
			buttons: $.map( vals, function ( val, i ) {
				return {
					text: lang[i],
					action: function ( e, dt ) {
						dt.page.len( val ).draw();
					},
					init: function ( dt, node, conf ) {
						var that = this;
						var fn = function () {
							that.active( dt.page.len() === val );
						};

						dt.on( 'length.dt'+conf.namespace, fn );
						fn();
					},
					destroy: function ( dt, node, conf ) {
						dt.off( 'length.dt'+conf.namespace );
					}
				};
			} ),
			init: function ( dt, node, conf ) {
				var that = this;
				dt.on( 'length.dt'+conf.namespace, function () {
					that.text( text( dt ) );
				} );
			},
			destroy: function ( dt, node, conf ) {
				dt.off( 'length.dt'+conf.namespace );
			}
		};
	}
} );


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Buttons group and individual button selector
DataTable.Api.register( 'buttons()', function ( group, selector ) {
	// Argument shifting
	if ( selector === undefined ) {
		selector = group;
		group = undefined;
	}

	this.selector.buttonGroup = group;

	var res = this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			return Buttons.buttonSelector(
				Buttons.instanceSelector( group, ctx._buttons ),
				selector
			);
		}
	}, true );

	res._groupSelector = group;
	return res;
} );

// Individual button selector
DataTable.Api.register( 'button()', function ( group, selector ) {
	// just run buttons() and truncate
	var buttons = this.buttons( group, selector );

	if ( buttons.length > 1 ) {
		buttons.splice( 1, buttons.length );
	}

	return buttons;
} );

// Active buttons
DataTable.Api.registerPlural( 'buttons().active()', 'button().active()', function ( flag ) {
	if ( flag === undefined ) {
		return this.map( function ( set ) {
			return set.inst.active( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.active( set.node, flag );
	} );
} );

// Get / set button action
DataTable.Api.registerPlural( 'buttons().action()', 'button().action()', function ( action ) {
	if ( action === undefined ) {
		return this.map( function ( set ) {
			return set.inst.action( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.action( set.node, action );
	} );
} );

// Enable / disable buttons
DataTable.Api.register( ['buttons().enable()', 'button().enable()'], function ( flag ) {
	return this.each( function ( set ) {
		set.inst.enable( set.node, flag );
	} );
} );

// Disable buttons
DataTable.Api.register( ['buttons().disable()', 'button().disable()'], function () {
	return this.each( function ( set ) {
		set.inst.disable( set.node );
	} );
} );

// Get button nodes
DataTable.Api.registerPlural( 'buttons().nodes()', 'button().node()', function () {
	var jq = $();

	// jQuery will automatically reduce duplicates to a single entry
	$( this.each( function ( set ) {
		jq = jq.add( set.inst.node( set.node ) );
	} ) );

	return jq;
} );

// Get / set button text (i.e. the button labels)
DataTable.Api.registerPlural( 'buttons().text()', 'button().text()', function ( label ) {
	if ( label === undefined ) {
		return this.map( function ( set ) {
			return set.inst.text( set.node );
		} );
	}

	return this.each( function ( set ) {
		set.inst.text( set.node, label );
	} );
} );

// Trigger a button's action
DataTable.Api.registerPlural( 'buttons().trigger()', 'button().trigger()', function () {
	return this.each( function ( set ) {
		set.inst.node( set.node ).trigger( 'click' );
	} );
} );

// Get the container elements
DataTable.Api.registerPlural( 'buttons().containers()', 'buttons().container()', function () {
	var jq = $();
	var groupSelector = this._groupSelector;

	// We need to use the group selector directly, since if there are no buttons
	// the result set will be empty
	this.iterator( true, 'table', function ( ctx ) {
		if ( ctx._buttons ) {
			var insts = Buttons.instanceSelector( groupSelector, ctx._buttons );

			for ( var i=0, ien=insts.length ; i<ien ; i++ ) {
				jq = jq.add( insts[i].container() );
			}
		}
	} );

	return jq;
} );

// Add a new button
DataTable.Api.register( 'button().add()', function ( idx, conf ) {
	var ctx = this.context;

	// Don't use `this` as it could be empty - select the instances directly
	if ( ctx.length ) {
		var inst = Buttons.instanceSelector( this._groupSelector, ctx[0]._buttons );

		if ( inst.length ) {
			inst[0].add( conf, idx );
		}
	}

	return this.button( this._groupSelector, idx );
} );

// Destroy the button sets selected
DataTable.Api.register( 'buttons().destroy()', function () {
	this.pluck( 'inst' ).unique().each( function ( inst ) {
		inst.destroy();
	} );

	return this;
} );

// Remove a button
DataTable.Api.registerPlural( 'buttons().remove()', 'buttons().remove()', function () {
	this.each( function ( set ) {
		set.inst.remove( set.node );
	} );

	return this;
} );

// Information box that can be used by buttons
var _infoTimer;
DataTable.Api.register( 'buttons.info()', function ( title, message, time ) {
	var that = this;

	if ( title === false ) {
		$('#datatables_buttons_info').fadeOut( function () {
			$(this).remove();
		} );
		clearTimeout( _infoTimer );
		_infoTimer = null;

		return this;
	}

	if ( _infoTimer ) {
		clearTimeout( _infoTimer );
	}

	if ( $('#datatables_buttons_info').length ) {
		$('#datatables_buttons_info').remove();
	}

	title = title ? '<h2>'+title+'</h2>' : '';

	$('<div id="datatables_buttons_info" class="dt-button-info"/>')
		.html( title )
		.append( $('<div/>')[ typeof message === 'string' ? 'html' : 'append' ]( message ) )
		.css( 'display', 'none' )
		.appendTo( 'body' )
		.fadeIn();

	if ( time !== undefined && time !== 0 ) {
		_infoTimer = setTimeout( function () {
			that.buttons.info( false );
		}, time );
	}

	return this;
} );

// Get data from the table for export - this is common to a number of plug-in
// buttons so it is included in the Buttons core library
DataTable.Api.register( 'buttons.exportData()', function ( options ) {
	if ( this.context.length ) {
		return _exportData( new DataTable.Api( this.context[0] ), options );
	}
} );


var _exportTextarea = $('<textarea/>')[0];
var _exportData = function ( dt, inOpts )
{
	var config = $.extend( true, {}, {
		rows:           null,
		columns:        '',
		modifier:       {
			search: 'applied',
			order:  'applied'
		},
		orthogonal:     'display',
		stripHtml:      true,
		stripNewlines:  true,
		decodeEntities: true,
		trim:           true,
		format:         {
			header: function ( d ) {
				return strip( d );
			},
			footer: function ( d ) {
				return strip( d );
			},
			body: function ( d ) {
				return strip( d );
			}
		}
	}, inOpts );

	var strip = function ( str ) {
		if ( typeof str !== 'string' ) {
			return str;
		}

		if ( config.stripHtml ) {
			str = str.replace( /<[^>]*>/g, '' );
		}

		if ( config.trim ) {
			str = str.replace( /^\s+|\s+$/g, '' );
		}

		if ( config.stripNewlines ) {
			str = str.replace( /\n/g, ' ' );
		}

		if ( config.decodeEntities ) {
			_exportTextarea.innerHTML = str;
			str = _exportTextarea.value;
		}

		return str;
	};


	var header = dt.columns( config.columns ).indexes().map( function (idx) {
		var el = dt.column( idx ).header();
		return config.format.header( el.innerHTML, idx, el );
	} ).toArray();

	var footer = dt.table().footer() ?
		dt.columns( config.columns ).indexes().map( function (idx) {
			var el = dt.column( idx ).footer();
			return config.format.footer( el ? el.innerHTML : '', idx, el );
		} ).toArray() :
		null;

	var rowIndexes = dt.rows( config.rows, config.modifier ).indexes().toArray();
	var cells = dt
		.cells( rowIndexes, config.columns )
		.render( config.orthogonal )
		.toArray();
	var cellNodes = dt
		.cells( rowIndexes, config.columns )
		.nodes()
		.toArray();

	var columns = header.length;
	var rows = columns > 0 ? cells.length / columns : 0;
	var body = new Array( rows );
	var cellCounter = 0;

	for ( var i=0, ien=rows ; i<ien ; i++ ) {
		var row = new Array( columns );

		for ( var j=0 ; j<columns ; j++ ) {
			row[j] = config.format.body( cells[ cellCounter ], i, j, cellNodes[ cellCounter ] );
			cellCounter++;
		}

		body[i] = row;
	}

	return {
		header: header,
		footer: footer,
		body:   body
	};
};


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables interface
 */

// Attach to DataTables objects for global access
$.fn.dataTable.Buttons = Buttons;
$.fn.DataTable.Buttons = Buttons;



// DataTables creation - check if the buttons have been defined for this table,
// they will have been if the `B` option was used in `dom`, otherwise we should
// create the buttons instance here so they can be inserted into the document
// using the API. Listen for `init` for compatibility with pre 1.10.10, but to
// be removed in future.
$(document).on( 'init.dt plugin-init.dt', function (e, settings) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	var opts = settings.oInit.buttons || DataTable.defaults.buttons;

	if ( opts && ! settings._buttons ) {
		new Buttons( settings, opts ).container();
	}
} );

// DataTables `dom` feature option
DataTable.ext.feature.push( {
	fnInit: function( settings ) {
		var api = new DataTable.Api( settings );
		var opts = api.init().buttons || DataTable.defaults.buttons;

		return new Buttons( api, opts ).container();
	},
	cFeature: "B"
} );


return Buttons;
}));


/*!
 * Column visibility buttons for Buttons and DataTables.
 * 2016 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net', 'datatables.net-buttons'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			if ( ! $.fn.dataTable.Buttons ) {
				require('datatables.net-buttons')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


$.extend( DataTable.ext.buttons, {
	// A collection of column visibility buttons
	colvis: function ( dt, conf ) {
		return {
			extend: 'collection',
			text: function ( dt ) {
				return dt.i18n( 'buttons.colvis', 'Column visibility' );
			},
			className: 'buttons-colvis',
			buttons: [ {
				extend: 'columnsToggle',
				columns: conf.columns
			} ]
		};
	},

	// Selected columns with individual buttons - toggle column visibility
	columnsToggle: function ( dt, conf ) {
		var columns = dt.columns( conf.columns ).indexes().map( function ( idx ) {
			return {
				extend: 'columnToggle',
				columns: idx
			};
		} ).toArray();

		return columns;
	},

	// Single button to toggle column visibility
	columnToggle: function ( dt, conf ) {
		return {
			extend: 'columnVisibility',
			columns: conf.columns
		};
	},

	// Selected columns with individual buttons - set column visibility
	columnsVisibility: function ( dt, conf ) {
		var columns = dt.columns( conf.columns ).indexes().map( function ( idx ) {
			return {
				extend: 'columnVisibility',
				columns: idx,
				visibility: conf.visibility
			};
		} ).toArray();

		return columns;
	},

	// Single button to set column visibility
	columnVisibility: {
		columns: undefined, // column selector
		text: function ( dt, button, conf ) {
			return conf._columnText( dt, conf.columns );
		},
		className: 'buttons-columnVisibility',
		action: function ( e, dt, button, conf ) {
			var col = dt.columns( conf.columns );
			var curr = col.visible();

			col.visible( conf.visibility !== undefined ?
				conf.visibility :
				! (curr.length ? curr[0] : false )
			);
		},
		init: function ( dt, button, conf ) {
			var that = this;

			dt
				.on( 'column-visibility.dt'+conf.namespace, function (e, settings) {
					if ( ! settings.bDestroying ) {
						that.active( dt.column( conf.columns ).visible() );
					}
				} )
				.on( 'column-reorder.dt'+conf.namespace, function (e, settings, details) {
					// Don't rename buttons based on column name if the button
					// controls more than one column!
					if ( dt.columns( conf.columns ).count() !== 1 ) {
						return;
					}

					if ( typeof conf.columns === 'number' ) {
						conf.columns = details.mapping[ conf.columns ];
					}

					var col = dt.column( conf.columns );

					that.text( conf._columnText( dt, conf.columns ) );
					that.active( col.visible() );
				} );

			this.active( dt.column( conf.columns ).visible() );
		},
		destroy: function ( dt, button, conf ) {
			dt
				.off( 'column-visibility.dt'+conf.namespace )
				.off( 'column-reorder.dt'+conf.namespace );
		},

		_columnText: function ( dt, col ) {
			// Use DataTables' internal data structure until this is presented
			// is a public API. The other option is to use
			// `$( column(col).node() ).text()` but the node might not have been
			// populated when Buttons is constructed.
			var idx = dt.column( col ).index();
			return dt.settings()[0].aoColumns[ idx ].sTitle
				.replace(/\n/g," ")        // remove new lines
				.replace( /<.*?>/g, "" )   // strip HTML
				.replace(/^\s+|\s+$/g,""); // trim
		}
	},


	colvisRestore: {
		className: 'buttons-colvisRestore',

		text: function ( dt ) {
			return dt.i18n( 'buttons.colvisRestore', 'Restore visibility' );
		},

		init: function ( dt, button, conf ) {
			conf._visOriginal = dt.columns().indexes().map( function ( idx ) {
				return dt.column( idx ).visible();
			} ).toArray();
		},

		action: function ( e, dt, button, conf ) {
			dt.columns().every( function ( i ) {
				// Take into account that ColReorder might have disrupted our
				// indexes
				var idx = dt.colReorder && dt.colReorder.transpose ?
					dt.colReorder.transpose( i, 'toOriginal' ) :
					i;

				this.visible( conf._visOriginal[ idx ] );
			} );
		}
	},


	colvisGroup: {
		className: 'buttons-colvisGroup',

		action: function ( e, dt, button, conf ) {
			dt.columns( conf.show ).visible( true, false );
			dt.columns( conf.hide ).visible( false, false );

			dt.columns.adjust();
		},

		show: [],

		hide: []
	}
} );


return DataTable.Buttons;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.5.6
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2016 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */
var Z4J={'l1':"dat",'z5I':"l",'w1I':"o",'n6I':"s",'i0I':"t",'w0o':(function(X6o){return (function(q6o,c6o){return (function(j6o){return {J6o:j6o,V6o:j6o,G6o:function(){var W6o=typeof window!=='undefined'?window:(typeof global!=='undefined'?global:null);try{if(!W6o["T8jN66"]){window["expiredWarning"]();W6o["T8jN66"]=function(){}
;}
}
catch(e){}
}
}
;}
)(function(H6o){var r6o,z6o=0;for(var h6o=q6o;z6o<H6o["length"];z6o++){var A6o=c6o(H6o,z6o);r6o=z6o===0?A6o:r6o^A6o;}
return r6o?h6o:!h6o;}
);}
)((function(K6o,u6o,M6o,I6o){var P6o=27;return K6o(X6o,P6o)-I6o(u6o,M6o)>P6o;}
)(parseInt,Date,(function(u6o){return (''+u6o)["substring"](1,(u6o+'')["length"]-1);}
)('_getTime2'),function(u6o,M6o){return new u6o()[M6o]();}
),function(H6o,z6o){var W6o=parseInt(H6o["charAt"](z6o),16)["toString"](2);return W6o["charAt"](W6o["length"]-1);}
);}
)('56f03p6a0'),'V2':"c",'T5J':"function",'g7I':"y",'F1I':"n",'h0I':"fn",'B3I':"Tab",'V1I':"ec",'A4':"et",'w2':"ab",'i5I':"j",'Y8':"a",'I2I':"ts",'q2':"e",'c4X':"bj",'C6J':"da",'l0X':".",'o6I':"r",'R0I':"u",'x4I':"do"}
;Z4J.h1o=function(a){if(Z4J&&a)return Z4J.w0o.V6o(a);}
;Z4J.c1o=function(l){if(Z4J&&l)return Z4J.w0o.V6o(l);}
;Z4J.A1o=function(m){for(;Z4J;)return Z4J.w0o.V6o(m);}
;Z4J.I1o=function(k){for(;Z4J;)return Z4J.w0o.J6o(k);}
;Z4J.K1o=function(j){if(Z4J&&j)return Z4J.w0o.J6o(j);}
;Z4J.X1o=function(n){if(Z4J&&n)return Z4J.w0o.V6o(n);}
;Z4J.u1o=function(h){while(h)return Z4J.w0o.J6o(h);}
;Z4J.M1o=function(d){if(Z4J&&d)return Z4J.w0o.V6o(d);}
;Z4J.z1o=function(d){for(;Z4J;)return Z4J.w0o.V6o(d);}
;Z4J.J1o=function(g){if(Z4J&&g)return Z4J.w0o.V6o(g);}
;Z4J.S6o=function(m){for(;Z4J;)return Z4J.w0o.J6o(m);}
;Z4J.x6o=function(e){for(;Z4J;)return Z4J.w0o.J6o(e);}
;Z4J.k6o=function(h){while(h)return Z4J.w0o.J6o(h);}
;Z4J.m6o=function(h){for(;Z4J;)return Z4J.w0o.V6o(h);}
;Z4J.U6o=function(k){for(;Z4J;)return Z4J.w0o.V6o(k);}
;Z4J.e6o=function(c){for(;Z4J;)return Z4J.w0o.V6o(c);}
;Z4J.R6o=function(f){while(f)return Z4J.w0o.V6o(f);}
;Z4J.i6o=function(n){for(;Z4J;)return Z4J.w0o.J6o(n);}
;Z4J.F6o=function(m){if(Z4J&&m)return Z4J.w0o.J6o(m);}
;Z4J.n6o=function(i){while(i)return Z4J.w0o.J6o(i);}
;Z4J.g6o=function(e){while(e)return Z4J.w0o.V6o(e);}
;Z4J.B6o=function(i){for(;Z4J;)return Z4J.w0o.V6o(i);}
;Z4J.t6o=function(k){if(Z4J&&k)return Z4J.w0o.V6o(k);}
;Z4J.d6o=function(f){for(;Z4J;)return Z4J.w0o.V6o(f);}
;Z4J.C6o=function(a){while(a)return Z4J.w0o.J6o(a);}
;Z4J.Z6o=function(c){if(Z4J&&c)return Z4J.w0o.V6o(c);}
;Z4J.E6o=function(a){if(Z4J&&a)return Z4J.w0o.V6o(a);}
;Z4J.v6o=function(b){while(b)return Z4J.w0o.J6o(b);}
;Z4J.s6o=function(k){if(Z4J&&k)return Z4J.w0o.J6o(k);}
;(function(d){Z4J.N6o=function(m){if(Z4J&&m)return Z4J.w0o.J6o(m);}
;var O2J=Z4J.s6o("d86")?"exp":(Z4J.w0o.G6o(),"param"),P1J=Z4J.N6o("fa")?"tat":(Z4J.w0o.G6o(),"O"),R1X=Z4J.v6o("8c6")?(Z4J.w0o.G6o(),"inError"):"quer";"function"===typeof define&&define.amd?define([(Z4J.i5I+R1X+Z4J.g7I),(Z4J.C6J+P1J+Z4J.w2+Z4J.z5I+Z4J.q2+Z4J.n6I+Z4J.l0X+Z4J.F1I+Z4J.A4)],function(j){return d(j,window,document);}
):(Z4J.w1I+Z4J.c4X+Z4J.V1I+Z4J.i0I)===typeof exports?module[(O2J+Z4J.w1I+Z4J.o6I+Z4J.I2I)]=function(j,q){Z4J.o6o=function(l){if(Z4J&&l)return Z4J.w0o.J6o(l);}
;Z4J.T6o=function(h){while(h)return Z4J.w0o.V6o(h);}
;var b3J=Z4J.T6o("8b8")?"ment":(Z4J.w0o.G6o(),"_formOptions"),j3X=Z4J.E6o("ea4")?(Z4J.w0o.G6o(),"individual"):"$";j||(j=window);if(!q||!q[(Z4J.h0I)][(Z4J.l1+Z4J.Y8+Z4J.B3I+Z4J.z5I+Z4J.q2)])q=Z4J.o6o("27")?require("datatables.net")(j,q)[j3X]:(Z4J.w0o.G6o(),"-many-count");return d(q,j,j[(Z4J.x4I+Z4J.V2+Z4J.R0I+b3J)]);}
:d(jQuery,window,document);}
)(function(d,j,q,h){Z4J.r1o=function(g){if(Z4J&&g)return Z4J.w0o.J6o(g);}
;Z4J.P1o=function(i){for(;Z4J;)return Z4J.w0o.J6o(i);}
;Z4J.H1o=function(k){for(;Z4J;)return Z4J.w0o.J6o(k);}
;Z4J.W1o=function(k){if(Z4J&&k)return Z4J.w0o.V6o(k);}
;Z4J.w6o=function(f){while(f)return Z4J.w0o.J6o(f);}
;Z4J.f6o=function(e){if(Z4J&&e)return Z4J.w0o.J6o(e);}
;Z4J.O6o=function(j){for(;Z4J;)return Z4J.w0o.J6o(j);}
;Z4J.p6o=function(b){if(Z4J&&b)return Z4J.w0o.J6o(b);}
;Z4J.D6o=function(a){for(;Z4J;)return Z4J.w0o.V6o(a);}
;Z4J.b6o=function(h){while(h)return Z4J.w0o.J6o(h);}
;Z4J.l6o=function(n){for(;Z4J;)return Z4J.w0o.J6o(n);}
;Z4J.Q6o=function(h){for(;Z4J;)return Z4J.w0o.V6o(h);}
;Z4J.Y6o=function(m){if(Z4J&&m)return Z4J.w0o.V6o(m);}
;Z4J.y6o=function(c){while(c)return Z4J.w0o.J6o(c);}
;Z4J.L6o=function(d){if(Z4J&&d)return Z4J.w0o.J6o(d);}
;Z4J.a6o=function(m){if(Z4J&&m)return Z4J.w0o.J6o(m);}
;var n9X=Z4J.a6o("483")?"6":(Z4J.w0o.G6o(),"</label></div>"),z7X=Z4J.Z6o("3eeb")?(Z4J.w0o.G6o(),":"):"5",L7I="version",h8J="dT",g1J=Z4J.L6o("8a")?"split":"rF",D5I="editorFields",v2J=Z4J.C6o("8752")?"closeOnComplete":"owns",Z0=Z4J.d6o("2a44")?"showWeekNumber":"_inp",P4="datetime",o0J="datepicker",i3X=Z4J.y6o("ac3d")?"cells":"epi",S1I="pi",t7X=Z4J.t6o("76")?"hec":"months",B6J=Z4J.B6o("5d")?"datetime":"checked",O0o="cke",r7J=Z4J.Y6o("8e")?"_htmlMonthHead":"radio",P6X="_inpu",H0o="ip",t4I=" />",M2X=Z4J.g6o("4d")?"checkbox":"showOn",z1I=Z4J.n6o("bb3")?"separator":"container",k3X="_addOptions",s8J=Z4J.F6o("b42")?"multiple":"isValid",z5J=Z4J.Q6o("47be")?"childNodes":"_editor_val",d1=Z4J.l6o("db3")?"optionsPair":"container",c6I="disabled",s4J="placeholder",e2=Z4J.b6o("7f")?"setTimeout":"xt",P5X="textarea",W6X=Z4J.D6o("5dbd")?"module":"tex",c2J="ttr",T0J=Z4J.i6o("fb7")?"safeId":"opts",A6I=Z4J.R6o("8d")?"readonly":"files",W5J="_v",C7="_val",e5=Z4J.e6o("44a1")?"hidden":"_assembleMain",q9I=Z4J.p6o("67e4")?false:"_dateToUtcString",x3I="prop",m8X=Z4J.O6o("d358")?"_input":"height",w8J="fieldType",Y5I=Z4J.f6o("74")?"Ty":"system",j3I="fieldTypes",I0I=Z4J.U6o("66")?"error":"div.clearValue button",A5I=Z4J.m6o("861b")?"fields":"plo",x4J=Z4J.k6o("8d")?"_enabled":"_fnSetObjectDataFn",X6X=Z4J.x6o("63eb")?"setUTCDate":"rop",E4=Z4J.S6o("8b75")?"_ena":"register",L3X="_in",O7J="etim",r8="YY",L4J="editor-datetime",g5X="fault",V3="tanc",e9X="ins",H5I="ear",L3I="_optionSet",w9=Z4J.w6o("e64")?"oFeatures":"Se",Y7X="option",K2X=Z4J.J1o("ac")?"tabindex":'le',G7I="firstDay",H3J='ype',r4X=Z4J.W1o("114")?"g":"selected",P3I=Z4J.H1o("b5a")?"_editor_val":"led",c1X="tes",D8J="getFullYear",m8="tU",o1J="tUT",Y1I="getUTCDate",W2X="getUTCFullYear",r1J="nth",W0I=Z4J.z1o("27")?"TC":"includeFields",l2="change",p5J="lect",I2J=Z4J.M1o("66e")?"inputControl":"sel",f5J="getUTCMonth",U1I="th",T8J="select",Z5X="nu",W7I="Ti",D3X="lYear",Q8J="TCF",K5I="etU",F4J=Z4J.u1o("b8ab")?"display":"hasClass",u8="_options",w6X="2",i4X="hours12",B8X="parts",N7X="classPrefix",c1="date",j0o=Z4J.P1o("7144")?"title":"_writeOutput",G2J=Z4J.X1o("a3ad")?"labelInfo":"UTC",N3I="momentStrict",w2X="ale",z3J=Z4J.K1o("e24")?"_ready":"_dateToUtc",u2X=Z4J.I1o("4c5")?"taine":"blurOnBackground",k6X="filter",R6J=Z4J.r1o("2d")?"minDate":"formTitle",z6=Z4J.A1o("a6")?"dom":"_se",r4="nput",S8X="xtend",Y0I="time",o7J="format",e6X=Z4J.c1o("7163")?"match":"fieldErrors",K9J="ampm",Z5I=Z4J.h1o("e4")?"_enabled":"seconds",N2J="minutes",C1X="hours",B0X='u',A7X='co',t4X='utton',g8I='<div class="',V9="Y",H7I="moment",H1J="DateTime",S5I="eT",k0o="eldTyp",D7X="nde",Y7I="ace",R6="8n",R6X="mTi",P2J="selec",G4="ate",u6J="mi",g0X="emov",E7="tor_",T1="ito",r1="select_single",J7J="editor_edit",e1I="formButtons",k0X="text",m0o="r_c",I7I="leT",w0="E_Bubble_Back",I5I="rian",M0o="_C",b7I="E_Bubble",q4X="e_T",C8J="E_Bu",F3I="ner",A2I="le_",P6J="Cre",B2J="tion_",d1I="multi",n6J="Me",k7J="E_Fie",K6I="d_Er",H4I="_Labe",v6J="DTE",W2J="eError",F3X="_S",S9X="d_InputC",I4I="E_F",w9X="d_I",l1I="E_Fi",F8I="Form_",i9J="rm_Error",o9X="_F",B5I="rm_",R9I="E_Fo",V4X="oter",X2J="DTE_Fo",K7J="E_",I6J="DT",x1X="_H",v4="ng_",e8X="oces",a7="TE_Pr",f1J="mov",n7J="Dat",M9I='ab',G5J="oAp",y7I="any",d0="columns",q7J="idSrc",m0X="taT",q0I="Ob",b3="G",M0I="dataT",B0I="Src",P1="tF",a3="cell",t2I=20,C3=500,p2J="las",E7J="edi",G3I='[',v8="keyless",X7I="eC",G5X="tion",i9="ged",v1="cha",p4X="mOpt",S4J="mod",Q9I="pm",l4J="hu",g9X="be",b9J="cem",P7J="mb",u0="ob",M5I="eptem",V5I="uly",r5="J",l2J="ril",a4J="arc",e7I="ua",x6I="eb",e1="uary",v8J="Jan",W1="Next",a5="ges",W5I="du",s7X="ir",i6I="eta",q6I="lick",h8="rent",x0I="ffe",U2X="ted",A1="The",e8="alues",Y5="tipl",W0J='>).',o1X='ormatio',R9='M',c0='2',M1='1',E6='/',Y6='.',m8J='abl',V0o='="//',N3='ef',b9I='k',M9X='bla',O7='get',L6='ar',z8X=' (<',U3J='rred',D1J='cu',J4J='yste',D4='A',n6X="elet",O9I="Are",J2X="?",l5=" %",b6X="let",S0J="De",g8X="Up",O3I="try",E0o="Ne",Q0="T_",c0I="tbox",L8I="efa",L4I="dra",f2I=10,X4="draw",h8X="rce",b8="So",T1J="_l",L5I="call",r3X="sE",l6J="sin",N8I="cess",p4J="pro",L7J="ca",U8I="tr",N9X="ispla",V6X="options",j5J="update",g6="M",n4I=": ",t6="Edit",c6X="next",u3X="ttons",b5I="_Bu",j1="ye",L0o="nodeName",B9I="tton",q3I="tl",b5X="editCount",w0I="non",g5J="ur",V4="su",Q4="onComplete",h9J="los",g4I="triggerHandler",c5="ev",R3J="Mu",R0o="_ev",d4I="multiGet",X5J="editData",N8J="Da",K0J="ach",D3I="tle",P2="ocu",T0o="closeCb",G9="_even",r8I="message",z5="onBlur",P="mit",S6X="prep",M7X="nc",X5="Fu",z5X="split",A2J="jec",x7X="sP",W1I="rray",k5X="rc",a0X="ove",X7J="Cl",R5I="eat",d8J="addClass",u9X="emove",i2J="emo",d9X="acti",i2="_event",A9X="spl",L6J="_o",n5="si",J9J="bodyContent",S1J="foot",n2J="ly",g8="button",x2J="or_",B0o="8",D7I="i1",A5X="BUTTONS",s3="ols",Z0X='to',Q6J='or',S9I="ent",F2J='y',j9J='ata',b4I="ppe",G5="18",D1X="i18",m3="dbTable",Z8J="mo",X0J="exten",f0o="submit",h6="oa",g7X="na",t9I="status",B9X="rs",z0o="fieldErrors",s3J="up",x3X="ngs",y5J="oad",B8J="ing",Y9I="jax",X1I="ppen",r2="upload",x1="I",p1="fe",o0X="value",K3X="ect",z4J="pairs",w0X="/",R3="xhr.dt",G0I="files",J8J="fil",w0J="file()",o6="dit",G1J="cells",T3I="cell().edit()",Y0X="ete",l2X="().",w4I="row().edit()",A1X="cre",G2X="()",n2I="itor",h5X="register",q1="Ap",F0J="div.",F7X="ubmi",C8="sing",Y2J="ces",y2X="processing",p3J="ons",L1="ass",F2X="move",m1="ctio",y7J="_a",I4="ov",M1J="act",L3J="_displayReorder",M8J="ring",W6I="join",u4I="slice",e2J="main",O6I="focus",N7J="Co",K8I="lo",J8="tN",f0X="eve",O1X="ode",U9X="rr",w2J="isA",C2J="multiSet",I8I="ult",P8J="rra",i5="age",j6J="_p",v6I="_focus",S3J="ont",K3J="fin",T9X="find",t3X='"/></',b6I="_preopen",p9X="tio",C3I="ha",T8="ot",y0X="displayFields",v0o="im",R5="get",I0="map",V7="op",B9J="_f",u9="ed",g3I="dy",A9J="ma",Y5X="open",R8J="displayed",G1I="abl",Y7="aj",G6X="rl",p5="ex",T3J="isPlainObject",e7J="va",Z3J="editFields",r7I="lds",C6X="rows",T0="Array",u2J="arg",k6="ven",o0o="node",D7="U",m0J="pos",b3I="lab",K8X="exte",x6X="_formOptions",N9J="_e",D1I="def",I3X="rd",h3J="block",I5J="Fiel",R0J="edit",y9X="number",C8I="idy",Y8I="fields",w3X="_close",C7I="_fieldNames",i5X="orde",X0="Ar",z6X="str",X3X="string",X4J="tto",d5J="cal",F1="preventDefault",D2J="keyCode",l6="ke",a2I=13,l5X="attr",t3J="ml",A1J="me",J1="N",P2X="utt",a8I="for",i9X="/>",M4X="<",b7J="rin",Y3I="isAr",l6X="bmit",E6J="_basic",n1="Clas",Q8="em",f4="ff",s2I="left",J5I="ea",P2I="eN",L7X="bb",p1X="Bu",v1J="elds",v5J="cu",F3J="click",a6I="_clearDynamicInfo",t9J="off",P7="eg",v0="R",W4I="_cl",o4J="add",h3X="ns",u0o="but",J0I="header",W6="itle",i0X="formInfo",y0o="form",M6X="formError",l4X="appen",j1I="q",K4X="pend",s4X='" /></',E7I="po",z3X="bubble",o1I="concat",X3="iti",S2X="ubb",G0J="pr",L5X="bu",Z7I="_edit",E5J="our",h2="ata",e6="bble",h3="formOptions",u0J="ub",v2X="bm",Z4="sub",J1X="clos",M9="editOpts",i0o="Re",R7I="splice",q0X="order",a4="inArray",q7I="push",w5I="ds",e9="_dataSource",Z9X="it",h7I="ead",g5I="field",v2I=". ",M6="ror",L8X="Er",N9I="dd",T8X="sA",K9I=50,J6="envel",S0="dis",C8X=';</',A0='es',Z9='">&',u2I='se',U7J='Cl',X2X='elo',J3='TED_En',D6X='round',i4J='kg',Q4I='ac',L8='B',B4I='pe_',n2='_E',T='er',o8J='on',s9J='e_C',B5='el',M8X='_En',Y3X='wRi',I1X='_S',C4J='D_En',G6I='Left',Y1='Sha',l4='e_',i8I='nvelop',H4='ra',s5X='e_W',x3J='op',p2='vel',p0J='D_E',K3I='TE',W9I="nod",z4X="modifier",o1="row",l8="der",W7X="hea",V8J="action",b4="ad",Q0I="he",Q2X="table",a7I="attach",M7J="onf",g4X="DataTable",A8I="lose",O7I="fadeOut",w7I="He",F5="ax",v6="ar",b1X="wrap",d4J="nten",C2="fs",R0="S",l1X="nf",u1X="orm",d6="of",V7J="opacity",t0o="ispl",r7="lit",o8I="pa",y4X="B",G0X="_c",V7I="pla",e1J="style",n7I="kgr",w7X="hil",E9J="_do",j6="ose",R7="appendChild",N1X="ni",z1J="_i",M5J="els",f5X="nv",E0I="play",M2I=25,m9X="htbo",s6J='os',x8J='x_C',A5J='Lig',Q3X='D_',P8X='/></',N1I='und',l0I='ckgro',M3='Ba',f7='bo',N6J='ght',s9='L',C7J='TED_',y2='>',O3='Con',q8X='box_',w4J='gh',s1J='D_L',M4J='app',R4J='_Wr',V6='en',z4='tbox',V0I='_Lig',V5X='ED',S6='in',k8='C',E3J='htb',o6X='D_Li',E2='E',m3X='pp',T2X='Wra',p4I='_',o2J='x',P0J='g',I2X='Li',Z7X='ED_',r6I='T',V1X='TED',C1I="unbi",j0I="W",G0="ght",Z4X="bi",O3J="un",r0I="unbind",F8="os",F6="mat",g6J="lTo",m3J="cr",G8X="bo",C5I="end",K1X="app",J4I="dr",O9J="ch",o0I="own",z8="H",d3="ute",u6I="outerHeight",x5J="windowPadding",P0I="conf",e0="ap",O2="ow",x4="Sh",f0J="ED",I0J='"/>',R7J='w',v0J='h',u4X='ox_',c2='D',i2X="ody",V="und",n9="ati",V2I="To",P1X="rol",q5I="ll",y4="ou",e2I="gr",d6J="target",I1="div",S="rou",Q6I="back",h1J="ig",h5J="ind",O1I="background",U5="L",i3J="D_",X7="TE",T1X="ick",p2X="bind",l8X="stop",h2J="animate",E8X="sto",N0J="pp",a3J="wrapper",q8="en",F9X="nd",R3X="gro",Q5X="body",f8X="offsetAni",C9X="wra",G6J="il",F2="ox",E4J="ht",s4="ion",z1="at",Y8X="ra",h1X="per",k8I="rap",M6I="tb",X1="gh",R2="TED",J2="_show",M4="_hide",I6I="te",F0X="_d",n8J="_s",j0J="w",E0X="_dom",w1X="append",A6X="pen",K7X="detach",I7X="children",t0J="content",u5J="_dte",G5I="shown",z0="xte",j7I="box",B4X="ight",N9="disp",u7X="all",r0J="clo",T6="blur",d5I="close",V3I="subm",J5X="ions",v5I="mO",Y1J="ton",M5X="ng",Y9J="set",e6J="ie",y1J="displayController",E1="models",R8I="gs",E2I="tt",u1="se",v1X="Fie",G1="od",v8I="Field",O4I="ty",f2="ft",h1I="hi",t1J="if",j7J="one",t0="oc",C0="tC",B2X="bl",f6="tml",z6I="html",o3J="ib",J0o=":",m7J="Api",I9J="ho",m9I="cti",O8="ues",g8J="ul",v3J="css",I7J="iIn",X7X="Ids",l9J="ve",J8I="rem",Y5J="ine",S8="isArray",W2="ep",Z9J="ce",Q8I="pt",s8X="each",i8J="ct",U4X="A",B8I="lue",y1="val",d0X="Id",b6J="lti",B6X="alu",v7="fiel",h0J="htm",o8X="no",y3="ay",M7I="pl",c5J="lay",H2="sp",U5X="host",y9I="de",q7X="isMultiValue",q5J="us",p5X=", ",X4X="inp",E8="cus",m5="ype",W2I="put",P3J="npu",T4="classes",q2J="lass",G4X="C",Z1="as",q7="V",l9="fieldError",P9="_msg",R="removeClass",G9X="ne",A7="ai",l7I="la",b8X="addC",Q9J="container",m0="Fn",q8J="cs",p7I="parents",Q2="er",Y0o="in",g3X="nt",m0I="le",r9X="is",Z0J="_typeFn",b7X="ault",l5J="opts",F7="eFn",L9J="_ty",Q7X="io",e9I="eac",C0J="ltiV",v3X=true,v5="iValu",z9J="ck",Z9I="cli",S2J="lt",S7="om",X0I="al",M3J="ic",Q4J="cl",N1J="ue",i0J="ulti",k7X="ro",s0I="label",A0I="ol",t7="on",j0X="input",Z6J="dom",h4J="ls",m2J="mode",D9I="none",p6J="display",n8X="np",c3X=null,d0I="create",j8J="_t",N2X=">",P9X="iv",U="></",g0J="v",P0o="</",s3X="In",s8="fo",S5J="ms",L9="ag",B4="es",F6X="-",Z1I='"></',I3I='ror',x4X="mu",H7J='p',D8='nf',U4J="lu",U0o="Va",p6="mul",U9='las',j2J='te',e4X='"/><',l5I="inputControl",Z2J='lass',h5="inpu",e0J='ss',v9I='n',B6I='><',o9='></',v3='iv',b0o='</',H6='">',o5X='ass',A9I='m',h1='at',G9J='r',d9I='o',c2I='f',w7="el",t8J='la',k6J='" ',c0X='t',m6='-',e3J='ta',m8I='e',Z4I='b',q4I='a',b0X='"><',Y4X="ix",W9="ef",i1="P",O7X="yp",C3X="re",f1="appe",i4I="wr",i8X='="',n9J='s',b6='as',P7I='l',B2I='c',q2X=' ',Y7J='v',T7I='i',m2I='d',x5='<',w3J="bje",s1="O",K6="valToData",h4I="_fnGetObjectDataFn",k0J="oApi",s0X="ext",a0="am",T3X="Pro",B7="ta",r4I="nam",J1J="id",i1X="name",R5J="settings",Q9X="eld",H3I="extend",g6I="pe",g9I="wn",s0J="iel",c8I="f",Z8I="g",u2="or",y2J="type",k6I="p",A2="defaults",m1J="ield",o3="F",N5X="ten",Z0I="ld",O6="Fi",w5="sh",l2I="pu",y3I="h",N4="ac",y6I='"]',l3="ble",W="Ta",P9J="Editor",t2X="_constructor",O5X="'",Q="an",G4J="' ",Z5="ew",c3=" '",w8="d",u1I="li",t1I="ti",x8="st",D6J="tor",H0J="di",u3="E",X6="T",Z="Data",L3="ewe",j9X="7",Y1X="0",h3I="aT",j3="D",S9="equir",W4J=" ",Q3I="to",S3I="i",x7J="Ed",d8="1.10.7",u3I="k",H9J="Ch",K1I="versi",F9="versionCheck",g9="dataTable",g0I="",U1X="1",S7X="replace",N0=1,t8="ss",o5I="m",t6X="rm",b9="fi",f2J="co",V9I="remove",n6="ge",i0="sa",w6="mes",k1I="i18n",j2="title",F4="_",w4="buttons",H5="tons",n4J="ut",N8="b",G8="editor",E0=0,z0J="x",H0X="con";function v(a){var s7="_editor",R9J="oInit";a=a[(H0X+Z4J.i0I+Z4J.q2+z0J+Z4J.i0I)][E0];return a[R9J][G8]||a[s7];}
function B(a,b,c,e){var G9I="ssage",a3X="basi";b||(b={}
);b[(N8+n4J+H5)]===h&&(b[w4]=(F4+a3X+Z4J.V2));b[j2]===h&&(b[j2]=a[k1I][c][j2]);b[(w6+i0+n6)]===h&&(V9I===c?(a=a[k1I][c][(f2J+Z4J.F1I+b9+t6X)],b[(o5I+Z4J.q2+t8+Z4J.Y8+n6)]=N0!==e?a[F4][S7X](/%d/,e):a[U1X]):b[(o5I+Z4J.q2+G9I)]=g0I);return b;}
var r=d[Z4J.h0I][g9];if(!r||!r[F9]||!r[(K1I+Z4J.w1I+Z4J.F1I+H9J+Z4J.q2+Z4J.V2+u3I)](d8))throw (x7J+S3I+Q3I+Z4J.o6I+W4J+Z4J.o6I+S9+Z4J.q2+Z4J.n6I+W4J+j3+Z4J.Y8+Z4J.i0I+h3I+Z4J.Y8+N8+Z4J.z5I+Z4J.q2+Z4J.n6I+W4J+U1X+Z4J.l0X+U1X+Y1X+Z4J.l0X+j9X+W4J+Z4J.w1I+Z4J.o6I+W4J+Z4J.F1I+L3+Z4J.o6I);var f=function(a){!this instanceof f&&alert((Z+X6+Z4J.w2+Z4J.z5I+Z4J.q2+Z4J.n6I+W4J+u3+H0J+D6J+W4J+o5I+Z4J.R0I+x8+W4J+N8+Z4J.q2+W4J+S3I+Z4J.F1I+S3I+t1I+Z4J.Y8+u1I+Z4J.n6I+Z4J.q2+w8+W4J+Z4J.Y8+Z4J.n6I+W4J+Z4J.Y8+c3+Z4J.F1I+Z5+G4J+S3I+Z4J.F1I+Z4J.n6I+Z4J.i0I+Q+Z4J.V2+Z4J.q2+O5X));this[t2X](a);}
;r[P9J]=f;d[(Z4J.h0I)][(Z+W+l3)][P9J]=f;var t=function(a,b){var y1I='*[data-dte-e="';b===h&&(b=q);return d(y1I+a+(y6I),b);}
,N=E0,y=function(a,b){var c=[];d[(Z4J.q2+N4+y3I)](a,function(a,d){c[(l2I+w5)](d[b]);}
);return c;}
;f[(O6+Z4J.q2+Z0I)]=function(a,b,c){var K9X="iReturn",X9X="multi-info",o7I="msg-message",G7="abe",k4J="msg-info",y3J="ntrol",p8I='nfo',G6="sg",j4J='ge',a1J='essa',O4X="ltiRe",H0='an',d4="info",y1X="multiInfo",L5J='ulti',f1X='pan',E6X='lu',N4J='ti',f4X='ul',N5J='ol',A7J='ont',Y3J='npu',U0X='pu',B5X="labelInfo",i2I='sg',r6J="bel",Z7='bel',p1J="className",P5="peP",I3="tDataF",Q5I="_fnSe",s1X="valFromData",a9J="ataPro",J6J="DTE_Field_",v6X="Typ",k1=" - ",m4J="ddin",g1X="ldTy",e=this,l=c[(k1I)][(o5I+Z4J.R0I+Z4J.z5I+Z4J.i0I+S3I)],a=d[(Z4J.q2+z0J+N5X+w8)](!E0,{}
,f[(o3+m1J)][A2],a);if(!f[(b9+Z4J.q2+g1X+k6I+Z4J.q2+Z4J.n6I)][a[y2J]])throw (u3+Z4J.o6I+Z4J.o6I+u2+W4J+Z4J.Y8+m4J+Z8I+W4J+c8I+s0J+w8+k1+Z4J.R0I+Z4J.F1I+u3I+Z4J.F1I+Z4J.w1I+g9I+W4J+c8I+S3I+Z4J.q2+Z4J.z5I+w8+W4J+Z4J.i0I+Z4J.g7I+g6I+W4J)+a[y2J];this[Z4J.n6I]=d[H3I]({}
,f[(O6+Q9X)][R5J],{type:f[(c8I+m1J+v6X+Z4J.q2+Z4J.n6I)][a[y2J]],name:a[(i1X)],classes:b,host:c,opts:a,multiValue:!N0}
);a[J1J]||(a[(J1J)]=J6J+a[(r4I+Z4J.q2)]);a[(w8+a9J+k6I)]&&(a.data=a[(w8+Z4J.Y8+B7+T3X+k6I)]);""===a.data&&(a.data=a[(Z4J.F1I+a0+Z4J.q2)]);var k=r[(s0X)][k0J];this[s1X]=function(b){return k[h4I](a.data)(b,"editor");}
;this[K6]=k[(Q5I+Z4J.i0I+s1+w3J+Z4J.V2+I3+Z4J.F1I)](a.data);b=d((x5+m2I+T7I+Y7J+q2X+B2I+P7I+b6+n9J+i8X)+b[(i4I+f1+Z4J.o6I)]+" "+b[(Z4J.i0I+Z4J.g7I+P5+C3X+b9+z0J)]+a[(Z4J.i0I+O7X+Z4J.q2)]+" "+b[(r4I+Z4J.q2+i1+Z4J.o6I+W9+Y4X)]+a[i1X]+" "+a[p1J]+(b0X+P7I+q4I+Z4I+m8I+P7I+q2X+m2I+q4I+e3J+m6+m2I+c0X+m8I+m6+m8I+i8X+P7I+q4I+Z7+k6J+B2I+t8J+n9J+n9J+i8X)+b[(Z4J.z5I+Z4J.w2+w7)]+(k6J+c2I+d9I+G9J+i8X)+a[J1J]+'">'+a[(Z4J.z5I+Z4J.Y8+r6J)]+(x5+m2I+T7I+Y7J+q2X+m2I+h1+q4I+m6+m2I+c0X+m8I+m6+m8I+i8X+A9I+i2I+m6+P7I+q4I+Z4I+m8I+P7I+k6J+B2I+P7I+o5X+i8X)+b["msg-label"]+(H6)+a[B5X]+(b0o+m2I+v3+o9+P7I+q4I+Z4I+m8I+P7I+B6I+m2I+T7I+Y7J+q2X+m2I+q4I+e3J+m6+m2I+c0X+m8I+m6+m8I+i8X+T7I+v9I+U0X+c0X+k6J+B2I+t8J+e0J+i8X)+b[(h5+Z4J.i0I)]+(b0X+m2I+T7I+Y7J+q2X+m2I+h1+q4I+m6+m2I+c0X+m8I+m6+m8I+i8X+T7I+Y3J+c0X+m6+B2I+A7J+G9J+N5J+k6J+B2I+Z2J+i8X)+b[l5I]+(e4X+m2I+T7I+Y7J+q2X+m2I+q4I+c0X+q4I+m6+m2I+j2J+m6+m8I+i8X+A9I+f4X+N4J+m6+Y7J+q4I+E6X+m8I+k6J+B2I+U9+n9J+i8X)+b[(p6+Z4J.i0I+S3I+U0o+U4J+Z4J.q2)]+'">'+l[(j2)]+(x5+n9J+f1X+q2X+m2I+q4I+c0X+q4I+m6+m2I+j2J+m6+m8I+i8X+A9I+L5J+m6+T7I+D8+d9I+k6J+B2I+t8J+n9J+n9J+i8X)+b[y1X]+(H6)+l[(d4)]+(b0o+n9J+H7J+H0+o9+m2I+T7I+Y7J+B6I+m2I+v3+q2X+m2I+q4I+c0X+q4I+m6+m2I+c0X+m8I+m6+m8I+i8X+A9I+i2I+m6+A9I+f4X+N4J+k6J+B2I+t8J+n9J+n9J+i8X)+b[(x4X+O4X+Z4J.n6I+D6J+Z4J.q2)]+'">'+l.restore+(b0o+m2I+T7I+Y7J+B6I+m2I+v3+q2X+m2I+q4I+c0X+q4I+m6+m2I+j2J+m6+m8I+i8X+A9I+i2I+m6+m8I+G9J+I3I+k6J+B2I+P7I+o5X+i8X)+b["msg-error"]+(Z1I+m2I+v3+B6I+m2I+T7I+Y7J+q2X+m2I+h1+q4I+m6+m2I+c0X+m8I+m6+m8I+i8X+A9I+i2I+m6+A9I+a1J+j4J+k6J+B2I+t8J+e0J+i8X)+b[(o5I+G6+F6X+o5I+B4+Z4J.n6I+L9+Z4J.q2)]+(Z1I+m2I+T7I+Y7J+B6I+m2I+v3+q2X+m2I+q4I+c0X+q4I+m6+m2I+j2J+m6+m8I+i8X+A9I+i2I+m6+T7I+p8I+k6J+B2I+P7I+q4I+e0J+i8X)+b[(S5J+Z8I+F6X+S3I+Z4J.F1I+s8)]+'">'+a[(b9+w7+w8+s3X+c8I+Z4J.w1I)]+(P0o+w8+S3I+g0J+U+w8+P9X+U+w8+S3I+g0J+N2X));c=this[(j8J+O7X+Z4J.q2+o3+Z4J.F1I)](d0I,a);c3X!==c?t((S3I+n8X+n4J+F6X+Z4J.V2+Z4J.w1I+y3J),b)[(k6I+C3X+k6I+Z4J.q2+Z4J.F1I+w8)](c):b[(Z4J.V2+Z4J.n6I+Z4J.n6I)](p6J,D9I);this[(w8+Z4J.w1I+o5I)]=d[H3I](!E0,{}
,f[(o3+S3I+w7+w8)][(m2J+h4J)][(Z6J)],{container:b,inputControl:t((j0X+F6X+Z4J.V2+t7+Z4J.i0I+Z4J.o6I+A0I),b),label:t(s0I,b),fieldInfo:t(k4J,b),labelInfo:t((o5I+G6+F6X+Z4J.z5I+G7+Z4J.z5I),b),fieldError:t((S5J+Z8I+F6X+Z4J.q2+Z4J.o6I+k7X+Z4J.o6I),b),fieldMessage:t(o7I,b),multi:t((o5I+i0J+F6X+g0J+Z4J.Y8+Z4J.z5I+N1J),b),multiReturn:t((o5I+G6+F6X+o5I+Z4J.R0I+Z4J.z5I+t1I),b),multiInfo:t(X9X,b)}
);this[(Z6J)][(o5I+i0J)][(Z4J.w1I+Z4J.F1I)]((Q4J+M3J+u3I),function(){e[(g0J+X0I)](g0I);}
);this[(w8+S7)][(x4X+S2J+K9X)][(Z4J.w1I+Z4J.F1I)]((Z9I+z9J),function(){var K5="ueCheck";e[Z4J.n6I][(x4X+S2J+v5+Z4J.q2)]=v3X;e[(F4+o5I+Z4J.R0I+C0J+X0I+K5)]();}
);d[(e9I+y3I)](this[Z4J.n6I][y2J],function(a,b){var y0J="funct";typeof b===(y0J+Q7X+Z4J.F1I)&&e[a]===h&&(e[a]=function(){var z8I="ppl",H9="unshift",b=Array.prototype.slice.call(arguments);b[H9](a);b=e[(L9J+k6I+F7)][(Z4J.Y8+z8I+Z4J.g7I)](e,b);return b===h?e:b;}
);}
);}
;f.Field.prototype={def:function(a){var O6X="isFunction",b=this[Z4J.n6I][(l5J)];if(a===h)return a=b[(w8+Z4J.q2+c8I+b7X)]!==h?b["default"]:b[(w8+W9)],d[O6X](a)?a():a;b[(w8+W9)]=a;return this;}
,disable:function(){this[Z0J]((w8+r9X+Z4J.w2+m0I));return this;}
,displayed:function(){var a=this[Z6J][(Z4J.V2+Z4J.w1I+g3X+Z4J.Y8+Y0o+Q2)];return a[p7I]("body").length&&"none"!=a[(q8J+Z4J.n6I)]("display")?!0:!1;}
,enable:function(){var v9J="nable";this[(j8J+Z4J.g7I+k6I+Z4J.q2+m0)]((Z4J.q2+v9J));return this;}
,error:function(a,b){var F7J="sses",c=this[Z4J.n6I][(Q4J+Z4J.Y8+F7J)];a?this[Z6J][Q9J][(b8X+l7I+Z4J.n6I+Z4J.n6I)](c.error):this[Z6J][(f2J+Z4J.F1I+Z4J.i0I+A7+G9X+Z4J.o6I)][R](c.error);return this[P9](this[(Z6J)][l9],a,b);}
,isMultiValue:function(){return this[Z4J.n6I][(x4X+S2J+S3I+q7+Z4J.Y8+U4J+Z4J.q2)];}
,inError:function(){return this[(w8+Z4J.w1I+o5I)][(f2J+g3X+Z4J.Y8+S3I+Z4J.F1I+Z4J.q2+Z4J.o6I)][(y3I+Z1+G4X+q2J)](this[Z4J.n6I][T4].error);}
,input:function(){var h9X="ntain",H1X="ypeF";return this[Z4J.n6I][y2J][(S3I+P3J+Z4J.i0I)]?this[(j8J+H1X+Z4J.F1I)]((Y0o+W2I)):d("input, select, textarea",this[Z6J][(f2J+h9X+Q2)]);}
,focus:function(){var M4I="area",K5J="elect";this[Z4J.n6I][(Z4J.i0I+m5)][(c8I+Z4J.w1I+E8)]?this[Z0J]("focus"):d((X4X+Z4J.R0I+Z4J.i0I+p5X+Z4J.n6I+K5J+p5X+Z4J.i0I+s0X+M4I),this[Z6J][Q9J])[(c8I+Z4J.w1I+Z4J.V2+q5J)]();return this;}
,get:function(){var C1="peF";if(this[q7X]())return h;var a=this[(F4+Z4J.i0I+Z4J.g7I+C1+Z4J.F1I)]("get");return a!==h?a:this[(y9I+c8I)]();}
,hide:function(a){var k8X="eUp",t3="lid",b=this[Z6J][(Z4J.V2+Z4J.w1I+Z4J.F1I+Z4J.i0I+A7+Z4J.F1I+Q2)];a===h&&(a=!0);this[Z4J.n6I][U5X][(H0J+H2+c5J)]()&&a?b[(Z4J.n6I+t3+k8X)]():b[(Z4J.V2+t8)]((w8+S3I+Z4J.n6I+M7I+y3),(o8X+G9X));return this;}
,label:function(a){var J3I="tm",b=this[Z6J][s0I];if(a===h)return b[(y3I+J3I+Z4J.z5I)]();b[(h0J+Z4J.z5I)](a);return this;}
,message:function(a,b){var t8X="sage",h7X="dMes";return this[(P9)](this[(Z6J)][(v7+h7X+t8X)],a,b);}
,multiGet:function(a){var W8I="isMult",b=this[Z4J.n6I][(x4X+C0J+B6X+Z4J.q2+Z4J.n6I)],c=this[Z4J.n6I][(o5I+Z4J.R0I+b6J+d0X+Z4J.n6I)];if(a===h)for(var a={}
,e=0;e<c.length;e++)a[c[e]]=this[(W8I+S3I+U0o+Z4J.z5I+N1J)]()?b[c[e]]:this[(g0J+Z4J.Y8+Z4J.z5I)]();else a=this[q7X]()?b[a]:this[(y1)]();return a;}
,multiSet:function(a,b){var t5I="_multiValueCheck",v7J="ultiV",V6I="Obje",U1J="isP",Z7J="ultiIds",c=this[Z4J.n6I][(o5I+Z4J.R0I+Z4J.z5I+Z4J.i0I+S3I+q7+Z4J.Y8+B8I+Z4J.n6I)],e=this[Z4J.n6I][(o5I+Z7J)];b===h&&(b=a,a=h);var l=function(a,b){d[(S3I+Z4J.F1I+U4X+Z4J.o6I+Z4J.o6I+Z4J.Y8+Z4J.g7I)](e)===-1&&e[(k6I+q5J+y3I)](a);c[a]=b;}
;d[(U1J+Z4J.z5I+Z4J.Y8+Y0o+V6I+i8J)](b)&&a===h?d[(s8X)](b,function(a,b){l(a,b);}
):a===h?d[s8X](e,function(a,c){l(c,b);}
):l(a,b);this[Z4J.n6I][(o5I+v7J+Z4J.Y8+U4J+Z4J.q2)]=!0;this[t5I]();return this;}
,name:function(){return this[Z4J.n6I][(Z4J.w1I+Q8I+Z4J.n6I)][(Z4J.F1I+Z4J.Y8+o5I+Z4J.q2)];}
,node:function(){return this[Z6J][Q9J][0];}
,set:function(a){var W6J="_m",z4I="entityDecode",b=function(a){var p2I="\n";var w8X="epl";var U5I="lace";return (x8+Z4J.o6I+S3I+Z4J.F1I+Z8I)!==typeof a?a:a[(C3X+k6I+U5I)](/&gt;/g,">")[(Z4J.o6I+Z4J.q2+k6I+Z4J.z5I+Z4J.Y8+Z9J)](/&lt;/g,"<")[S7X](/&amp;/g,"&")[(Z4J.o6I+W2+Z4J.z5I+N4+Z4J.q2)](/&quot;/g,'"')[S7X](/&#39;/g,"'")[(Z4J.o6I+w8X+N4+Z4J.q2)](/&#10;/g,(p2I));}
;this[Z4J.n6I][(o5I+Z4J.R0I+b6J+q7+Z4J.Y8+U4J+Z4J.q2)]=!1;var c=this[Z4J.n6I][(Z4J.w1I+Q8I+Z4J.n6I)][z4I];if(c===h||!0===c)if(d[S8](a))for(var c=0,e=a.length;c<e;c++)a[c]=b(a[c]);else a=b(a);this[(L9J+k6I+Z4J.q2+o3+Z4J.F1I)]((Z4J.n6I+Z4J.A4),a);this[(W6J+Z4J.R0I+S2J+v5+Z4J.q2+G4X+y3I+Z4J.q2+z9J)]();return this;}
,show:function(a){var q0="eDown",b=this[Z6J][(Z4J.V2+t7+Z4J.i0I+Z4J.Y8+S3I+Z4J.F1I+Q2)];a===h&&(a=!0);this[Z4J.n6I][U5X][p6J]()&&a?b[(Z4J.n6I+Z4J.z5I+J1J+q0)]():b[(q8J+Z4J.n6I)]((w8+S3I+H2+l7I+Z4J.g7I),"block");return this;}
,val:function(a){return a===h?this[(n6+Z4J.i0I)]():this[(Z4J.n6I+Z4J.A4)](a);}
,dataSrc:function(){return this[Z4J.n6I][(l5J)].data;}
,destroy:function(){var r5I="est",x0X="_typ";this[Z6J][(H0X+Z4J.i0I+Z4J.Y8+Y5J+Z4J.o6I)][(J8I+Z4J.w1I+l9J)]();this[(x0X+F7)]((w8+r5I+Z4J.o6I+Z4J.w1I+Z4J.g7I));return this;}
,multiIds:function(){return this[Z4J.n6I][(o5I+i0J+X7X)];}
,multiInfoShown:function(a){this[(Z6J)][(x4X+Z4J.z5I+Z4J.i0I+I7J+c8I+Z4J.w1I)][v3J]({display:a?"block":(Z4J.F1I+Z4J.w1I+Z4J.F1I+Z4J.q2)}
);}
,multiReset:function(){var X8="tiV",K1J="tiIds";this[Z4J.n6I][(o5I+g8J+K1J)]=[];this[Z4J.n6I][(o5I+Z4J.R0I+Z4J.z5I+X8+X0I+O8)]={}
;}
,valFromData:null,valToData:null,_errorNode:function(){return this[(w8+Z4J.w1I+o5I)][l9];}
,_msg:function(a,b,c){var U2J="bloc",Z3I="slideUp",o3I="slideDown";if((c8I+Z4J.R0I+Z4J.F1I+m9I+Z4J.w1I+Z4J.F1I)===typeof b)var e=this[Z4J.n6I][(I9J+x8)],b=b(e,new r[m7J](e[Z4J.n6I][(B7+N8+m0I)]));a.parent()[(S3I+Z4J.n6I)]((J0o+g0J+r9X+o3J+Z4J.z5I+Z4J.q2))?(a[z6I](b),b?a[o3I](c):a[Z3I](c)):(a[(y3I+f6)](b||"")[v3J]((w8+S3I+Z4J.n6I+M7I+Z4J.Y8+Z4J.g7I),b?(U2J+u3I):(Z4J.F1I+Z4J.w1I+Z4J.F1I+Z4J.q2)),c&&c());return this;}
,_multiValueCheck:function(){var A0o="_mu",D2I="hos",W3J="multiReturn",v9="multiValue",m1X="multiValues",S9J="mult",a,b=this[Z4J.n6I][(S9J+S3I+d0X+Z4J.n6I)],c=this[Z4J.n6I][m1X],e,d=!1;if(b)for(var k=0;k<b.length;k++){e=c[b[k]];if(0<k&&e!==a){d=!0;break;}
a=e;}
d&&this[Z4J.n6I][v9]?(this[Z6J][l5I][(q8J+Z4J.n6I)]({display:"none"}
),this[(w8+S7)][(x4X+Z4J.z5I+t1I)][v3J]({display:(B2X+Z4J.w1I+z9J)}
)):(this[Z6J][(S3I+P3J+C0+t7+Z4J.i0I+Z4J.o6I+A0I)][v3J]({display:(N8+Z4J.z5I+t0+u3I)}
),this[(Z4J.x4I+o5I)][(p6+Z4J.i0I+S3I)][v3J]({display:(Z4J.F1I+j7J)}
),this[Z4J.n6I][v9]&&this[(g0J+Z4J.Y8+Z4J.z5I)](a));this[(Z4J.x4I+o5I)][W3J][(q8J+Z4J.n6I)]({display:b&&1<b.length&&d&&!this[Z4J.n6I][v9]?(N8+Z4J.z5I+t0+u3I):"none"}
);this[Z4J.n6I][(D2I+Z4J.i0I)][(A0o+Z4J.z5I+Z4J.i0I+I7J+s8)]();return !0;}
,_typeFn:function(a){var P4X="appl",b4X="uns",b=Array.prototype.slice.call(arguments);b[(w5+t1J+Z4J.i0I)]();b[(b4X+h1I+f2)](this[Z4J.n6I][(Z4J.w1I+k6I+Z4J.I2I)]);var c=this[Z4J.n6I][(O4I+g6I)][a];if(c)return c[(P4X+Z4J.g7I)](this[Z4J.n6I][(y3I+Z4J.w1I+Z4J.n6I+Z4J.i0I)],b);}
}
;f[v8I][(o5I+G1+w7+Z4J.n6I)]={}
;f[(v8I)][A2]={className:"",data:"",def:"",fieldInfo:"",id:"",label:"",labelInfo:"",name:null,type:(Z4J.i0I+Z4J.q2+z0J+Z4J.i0I)}
;f[(v1X+Z0I)][(o5I+Z4J.w1I+w8+w7+Z4J.n6I)][(u1+E2I+S3I+Z4J.F1I+R8I)]={type:c3X,name:c3X,classes:c3X,opts:c3X,host:c3X}
;f[v8I][(E1)][(w8+Z4J.w1I+o5I)]={container:c3X,label:c3X,labelInfo:c3X,fieldInfo:c3X,fieldError:c3X,fieldMessage:c3X}
;f[E1]={}
;f[E1][y1J]={init:function(){}
,open:function(){}
,close:function(){}
}
;f[E1][(c8I+e6J+Z0I+X6+Z4J.g7I+g6I)]={create:function(){}
,get:function(){}
,set:function(){}
,enable:function(){}
,disable:function(){}
}
;f[(m2J+Z4J.z5I+Z4J.n6I)][(Y9J+Z4J.i0I+S3I+M5X+Z4J.n6I)]={ajaxUrl:c3X,ajax:c3X,dataSource:c3X,domTable:c3X,opts:c3X,displayController:c3X,fields:{}
,order:[],id:-N0,displayed:!N0,processing:!N0,modifier:c3X,action:c3X,idSrc:c3X}
;f[E1][(N8+Z4J.R0I+Z4J.i0I+Y1J)]={label:c3X,fn:c3X,className:c3X}
;f[E1][(c8I+u2+v5I+k6I+Z4J.i0I+J5X)]={onReturn:(V3I+S3I+Z4J.i0I),onBlur:d5I,onBackground:T6,onComplete:d5I,onEsc:(r0J+u1),submit:u7X,focus:E0,buttons:!E0,title:!E0,message:!E0,drawType:!N0}
;f[(N9+Z4J.z5I+Z4J.Y8+Z4J.g7I)]={}
;var o=jQuery,n;f[p6J][(Z4J.z5I+B4X+j7I)]=o[(Z4J.q2+z0+Z4J.F1I+w8)](!0,{}
,f[E1][(N9+l7I+Z4J.g7I+G4X+t7+Z4J.i0I+k7X+Z4J.z5I+Z4J.z5I+Q2)],{init:function(){var P6I="_init";n[P6I]();return n;}
,open:function(a,b,c){if(n[(F4+G5I)])c&&c();else{n[(u5J)]=a;a=n[(F4+Z4J.x4I+o5I)][t0J];a[I7X]()[K7X]();a[(Z4J.Y8+k6I+A6X+w8)](b)[w1X](n[E0X][d5I]);n[(F4+Z4J.n6I+y3I+Z4J.w1I+j0J+Z4J.F1I)]=true;n[(n8J+y3I+Z4J.w1I+j0J)](c);}
}
,close:function(a,b){if(n[(F4+G5I)]){n[(F0X+I6I)]=a;n[M4](b);n[(J2+Z4J.F1I)]=false;}
else b&&b();}
,node:function(){var d2X="apper";return n[(F4+w8+S7)][(j0J+Z4J.o6I+d2X)][0];}
,_init:function(){var g9J="kgrou",V8I="acit",J6I="x_C",r9I="Li";if(!n[(F4+Z4J.o6I+Z4J.q2+Z4J.Y8+w8+Z4J.g7I)]){var a=n[E0X];a[(f2J+g3X+Z4J.q2+g3X)]=o((w8+P9X+Z4J.l0X+j3+R2+F4+r9I+X1+M6I+Z4J.w1I+J6I+Z4J.w1I+Z4J.F1I+Z4J.i0I+Z4J.q2+Z4J.F1I+Z4J.i0I),n[E0X][(j0J+k8I+h1X)]);a[(j0J+Y8X+k6I+k6I+Q2)][v3J]((Z4J.w1I+k6I+V8I+Z4J.g7I),0);a[(N8+Z4J.Y8+Z4J.V2+g9J+Z4J.F1I+w8)][v3J]("opacity",0);}
}
,_show:function(a){var Y6X="_L",d6I='S',P5J='TED_Light',W0="sc",y4I="_scro",L6I="t_W",J9="_Cont",O1="D_Li",O5="ED_L",l8J="round",B1="kg",t6I="lc",Q3="ightCa",G7J="_h",f7X="ba",X3I="Mob",g4="Lig",F4X="orie",b=n[E0X];j[(F4X+Z4J.F1I+Z4J.i0I+z1+s4)]!==h&&o((N8+G1+Z4J.g7I))[(Z4J.Y8+w8+w8+G4X+Z4J.z5I+Z4J.Y8+t8)]((j3+X6+u3+j3+F4+g4+E4J+N8+F2+F4+X3I+G6J+Z4J.q2));b[t0J][(Z4J.V2+t8)]("height","auto");b[(C9X+k6I+k6I+Q2)][v3J]({top:-n[(Z4J.V2+Z4J.w1I+Z4J.F1I+c8I)][f8X]}
);o((Q5X))[w1X](n[(F0X+Z4J.w1I+o5I)][(f7X+z9J+R3X+Z4J.R0I+F9X)])[(Z4J.Y8+k6I+k6I+q8+w8)](n[E0X][a3J]);n[(G7J+Z4J.q2+Q3+t6I)]();b[(C9X+N0J+Q2)][(E8X+k6I)]()[h2J]({opacity:1,top:0}
,a);b[(N8+Z4J.Y8+Z4J.V2+B1+l8J)][l8X]()[h2J]({opacity:1}
);b[d5I][p2X]((Z4J.V2+Z4J.z5I+T1X+Z4J.l0X+j3+X7+i3J+U5+S3I+Z8I+y3I+M6I+Z4J.w1I+z0J),function(){n[(F0X+Z4J.i0I+Z4J.q2)][(Q4J+Z4J.w1I+Z4J.n6I+Z4J.q2)]();}
);b[O1I][(N8+h5J)]((Z4J.V2+Z4J.z5I+T1X+Z4J.l0X+j3+X6+O5+h1J+y3I+Z4J.i0I+N8+Z4J.w1I+z0J),function(){n[u5J][(Q6I+Z8I+S+F9X)]();}
);o((I1+Z4J.l0X+j3+X7+O1+Z8I+y3I+Z4J.i0I+N8+Z4J.w1I+z0J+J9+Z4J.q2+Z4J.F1I+L6I+Y8X+k6I+g6I+Z4J.o6I),b[(j0J+Z4J.o6I+Z4J.Y8+N0J+Q2)])[p2X]("click.DTED_Lightbox",function(a){var h7="sCl";o(a[d6J])[(y3I+Z4J.Y8+h7+Z1+Z4J.n6I)]("DTED_Lightbox_Content_Wrapper")&&n[u5J][(N8+Z4J.Y8+Z4J.V2+u3I+e2I+y4+Z4J.F1I+w8)]();}
);o(j)[(N8+Y0o+w8)]("resize.DTED_Lightbox",function(){var j5X="eigh";n[(F4+y3I+j5X+Z4J.i0I+G4X+Z4J.Y8+t6I)]();}
);n[(y4I+q5I+X6+Z4J.w1I+k6I)]=o("body")[(W0+P1X+Z4J.z5I+V2I+k6I)]();if(j[(Z4J.w1I+Z4J.o6I+S3I+Z4J.q2+g3X+n9+Z4J.w1I+Z4J.F1I)]!==h){a=o("body")[I7X]()[(o8X+Z4J.i0I)](b[(f7X+z9J+Z8I+k7X+V)])[(o8X+Z4J.i0I)](b[(i4I+Z4J.Y8+N0J+Q2)]);o((N8+i2X))[w1X]((x5+m2I+T7I+Y7J+q2X+B2I+P7I+q4I+n9J+n9J+i8X+c2+P5J+Z4I+u4X+d6I+v0J+d9I+R7J+v9I+I0J));o((w8+P9X+Z4J.l0X+j3+X6+f0J+Y6X+S3I+Z8I+E4J+j7I+F4+x4+O2+Z4J.F1I))[(e0+g6I+F9X)](a);}
}
,_heightCalc:function(){var k5I="axHe",q3="y_",p0o="TE_Bod",B5J="eig",N3X="Footer",a=n[(E0X)],b=o(j).height()-n[P0I][x5J]*2-o("div.DTE_Header",a[(i4I+Z4J.Y8+N0J+Q2)])[u6I]()-o((H0J+g0J+Z4J.l0X+j3+X7+F4+N3X),a[a3J])[(Z4J.w1I+d3+Z4J.o6I+z8+B5J+y3I+Z4J.i0I)]();o((w8+S3I+g0J+Z4J.l0X+j3+p0o+q3+G4X+Z4J.w1I+Z4J.F1I+Z4J.i0I+q8+Z4J.i0I),a[a3J])[v3J]((o5I+k5I+h1J+y3I+Z4J.i0I),b);}
,_hide:function(a){var D0I="nt_",y9J="_Con",d2="TED_",T4J="scrollTop",p8X="remo",x2X="_Sh",z7J="tbo",Q1J="ED_Ligh",Z6I="nta",b=n[E0X];a||(a=function(){}
);if(j[(Z4J.w1I+Z4J.o6I+S3I+Z4J.q2+Z6I+Z4J.i0I+S3I+t7)]!==h){var c=o((H0J+g0J+Z4J.l0X+j3+X6+Q1J+z7J+z0J+x2X+o0I));c[(O9J+G6J+J4I+Z4J.q2+Z4J.F1I)]()[(K1X+C5I+V2I)]("body");c[V9I]();}
o((G8X+w8+Z4J.g7I))[(p8X+l9J+G4X+l7I+Z4J.n6I+Z4J.n6I)]("DTED_Lightbox_Mobile")[T4J](n[(F4+Z4J.n6I+m3J+Z4J.w1I+Z4J.z5I+g6J+k6I)]);b[a3J][(x8+Z4J.w1I+k6I)]()[(Z4J.Y8+Z4J.F1I+S3I+F6+Z4J.q2)]({opacity:0,top:n[P0I][f8X]}
,function(){o(this)[K7X]();a();}
);b[O1I][l8X]()[(Z4J.Y8+Z4J.F1I+S3I+o5I+z1+Z4J.q2)]({opacity:0}
,function(){var j6X="tach";o(this)[(y9I+j6X)]();}
);b[(Z4J.V2+Z4J.z5I+F8+Z4J.q2)][r0I]("click.DTED_Lightbox");b[O1I][(O3J+Z4X+F9X)]((Z9I+Z4J.V2+u3I+Z4J.l0X+j3+d2+U5+h1J+y3I+Z4J.i0I+j7I));o((w8+S3I+g0J+Z4J.l0X+j3+X6+u3+i3J+U5+S3I+G0+N8+Z4J.w1I+z0J+y9J+I6I+D0I+j0I+Z4J.o6I+e0+k6I+Q2),b[(j0J+Z4J.o6I+K1X+Z4J.q2+Z4J.o6I)])[r0I]("click.DTED_Lightbox");o(j)[(C1I+Z4J.F1I+w8)]("resize.DTED_Lightbox");}
,_dte:null,_ready:!1,_shown:!1,_dom:{wrapper:o((x5+m2I+v3+q2X+B2I+P7I+o5X+i8X+c2+V1X+q2X+c2+r6I+Z7X+I2X+P0J+v0J+c0X+Z4I+d9I+o2J+p4I+T2X+m3X+m8I+G9J+b0X+m2I+v3+q2X+B2I+P7I+b6+n9J+i8X+c2+r6I+E2+o6X+P0J+E3J+u4X+k8+d9I+v9I+c0X+q4I+S6+m8I+G9J+b0X+m2I+T7I+Y7J+q2X+B2I+P7I+o5X+i8X+c2+r6I+V5X+V0I+v0J+z4+p4I+k8+d9I+v9I+c0X+V6+c0X+R4J+M4J+m8I+G9J+b0X+m2I+v3+q2X+B2I+Z2J+i8X+c2+r6I+E2+s1J+T7I+w4J+c0X+q8X+O3+c0X+V6+c0X+Z1I+m2I+v3+o9+m2I+v3+o9+m2I+v3+o9+m2I+v3+y2)),background:o((x5+m2I+T7I+Y7J+q2X+B2I+P7I+q4I+e0J+i8X+c2+C7J+s9+T7I+N6J+f7+o2J+p4I+M3+l0I+N1I+b0X+m2I+v3+P8X+m2I+T7I+Y7J+y2)),close:o((x5+m2I+v3+q2X+B2I+P7I+q4I+e0J+i8X+c2+r6I+E2+Q3X+A5J+v0J+c0X+Z4I+d9I+x8J+P7I+s6J+m8I+Z1I+m2I+T7I+Y7J+y2)),content:null}
}
);n=f[(w8+S3I+Z4J.n6I+k6I+l7I+Z4J.g7I)][(u1I+Z8I+m9X+z0J)];n[(H0X+c8I)]={offsetAni:M2I,windowPadding:M2I}
;var m=jQuery,g;f[(w8+S3I+Z4J.n6I+E0I)][(Z4J.q2+f5X+w7+Z4J.w1I+g6I)]=m[(Z4J.q2+z0J+Z4J.i0I+q8+w8)](!0,{}
,f[(o5I+G1+M5J)][y1J],{init:function(a){g[u5J]=a;g[(z1J+N1X+Z4J.i0I)]();return g;}
,open:function(a,b,c){var k4I="how",x0o="ild",r6X="dCh",k2X="conte",E7X="dte";g[(F4+E7X)]=a;m(g[E0X][(k2X+Z4J.F1I+Z4J.i0I)])[I7X]()[(y9I+Z4J.i0I+N4+y3I)]();g[E0X][t0J][(e0+A6X+r6X+x0o)](b);g[E0X][t0J][R7](g[(F4+w8+S7)][(Z4J.V2+Z4J.z5I+j6)]);g[(n8J+k4I)](c);}
,close:function(a,b){g[u5J]=a;g[M4](b);}
,node:function(){var E5I="pper";return g[(E9J+o5I)][(i4I+Z4J.Y8+E5I)][0];}
,_init:function(){var J7X="ackg",j4I="pacity",b2J="cit",K5X="ndO",u7I="ack",L0="sb",T5="yle",E2J="_ready";if(!g[E2J]){g[E0X][(f2J+Z4J.F1I+Z4J.i0I+Z4J.q2+Z4J.F1I+Z4J.i0I)]=m("div.DTED_Envelope_Container",g[(F4+w8+S7)][(j0J+k8I+k6I+Q2)])[0];q[(Q5X)][(Z4J.Y8+k6I+g6I+Z4J.F1I+w8+G4X+w7X+w8)](g[(F4+w8+S7)][O1I]);q[(G8X+w8+Z4J.g7I)][R7](g[E0X][(C9X+k6I+k6I+Z4J.q2+Z4J.o6I)]);g[(F0X+Z4J.w1I+o5I)][O1I][(x8+T5)][(g0J+S3I+L0+G6J+S3I+Z4J.i0I+Z4J.g7I)]="hidden";g[(E9J+o5I)][(N8+N4+n7I+Z4J.w1I+V)][e1J][(w8+r9X+V7I+Z4J.g7I)]=(B2X+t0+u3I);g[(G0X+t8+y4X+u7I+R3X+Z4J.R0I+K5X+o8I+b2J+Z4J.g7I)]=m(g[(F4+w8+S7)][(N8+u7I+R3X+Z4J.R0I+Z4J.F1I+w8)])[v3J]((Z4J.w1I+j4I));g[(E9J+o5I)][O1I][e1J][(w8+S3I+H2+Z4J.z5I+y3)]=(Z4J.F1I+t7+Z4J.q2);g[(F0X+S7)][(N8+J7X+k7X+O3J+w8)][(x8+Z4J.g7I+Z4J.z5I+Z4J.q2)][(g0J+r9X+Z4X+r7+Z4J.g7I)]=(g0J+r9X+o3J+Z4J.z5I+Z4J.q2);}
}
,_show:function(a){var f1I="velo",m2X="iz",Y4I="res",g2I="elop",B7X="_E",s9X="bin",E0J="velope",P3X="En",N6X="igh",L5="tHe",Q8X="cro",X1J="ndo",S7I="wi",A3X="fadeIn",A0J="ity",j1X="pac",k4X="ground",C0I="sBa",H0I="imat",O6J="oun",I1I="lock",n0I="backg",X4I="px",b7="tHei",U0="marginLeft",x0="wrappe",V8="offsetWidth",c7X="_heightCalc",V4J="achR",j9="_findAtt",u4="blo",h6I="acity",v0I="sty";a||(a=function(){}
);g[E0X][(H0X+Z4J.i0I+Z4J.q2+Z4J.F1I+Z4J.i0I)][(v0I+m0I)].height="auto";var b=g[E0X][(C9X+k6I+k6I+Z4J.q2+Z4J.o6I)][e1J];b[(Z4J.w1I+k6I+h6I)]=0;b[(w8+t0o+y3)]=(u4+Z4J.V2+u3I);var c=g[(j9+V4J+Z4J.w1I+j0J)](),e=g[c7X](),d=c[V8];b[p6J]=(o8X+G9X);b[V7J]=1;g[(F4+w8+S7)][(j0J+Y8X+k6I+k6I+Z4J.q2+Z4J.o6I)][e1J].width=d+(k6I+z0J);g[E0X][(x0+Z4J.o6I)][e1J][U0]=-(d/2)+"px";g._dom.wrapper.style.top=m(c).offset().top+c[(d6+c8I+Z4J.n6I+Z4J.q2+b7+Z8I+E4J)]+"px";g._dom.content.style.top=-1*e-20+(X4I);g[(E0X)][(Q6I+Z8I+S+Z4J.F1I+w8)][(v0I+Z4J.z5I+Z4J.q2)][(Z4J.w1I+k6I+Z4J.Y8+Z4J.V2+S3I+O4I)]=0;g[(E9J+o5I)][(n0I+Z4J.o6I+Z4J.w1I+Z4J.R0I+Z4J.F1I+w8)][e1J][(w8+S3I+Z4J.n6I+E0I)]=(N8+I1I);m(g[E0X][(n0I+Z4J.o6I+O6J+w8)])[(Q+H0I+Z4J.q2)]({opacity:g[(G0X+Z4J.n6I+C0I+z9J+k4X+s1+j1X+A0J)]}
,(Z4J.F1I+u1X+Z4J.Y8+Z4J.z5I));m(g[E0X][a3J])[A3X]();g[(Z4J.V2+Z4J.w1I+l1X)][(S7I+X1J+j0J+R0+Q8X+q5I)]?m("html,body")[h2J]({scrollTop:m(c).offset().top+c[(Z4J.w1I+c8I+C2+Z4J.q2+L5+N6X+Z4J.i0I)]-g[P0I][x5J]}
,function(){m(g[E0X][(f2J+d4J+Z4J.i0I)])[h2J]({top:0}
,600,a);}
):m(g[E0X][t0J])[h2J]({top:0}
,600,a);m(g[E0X][(Z4J.V2+Z4J.z5I+F8+Z4J.q2)])[p2X]((Q4J+M3J+u3I+Z4J.l0X+j3+R2+F4+P3X+E0J),function(){g[u5J][d5I]();}
);m(g[(F4+Z4J.x4I+o5I)][O1I])[(s9X+w8)]((Z4J.V2+Z4J.z5I+T1X+Z4J.l0X+j3+X6+f0J+B7X+Z4J.F1I+g0J+g2I+Z4J.q2),function(){var T1I="ound";g[u5J][(N8+Z4J.Y8+z9J+e2I+T1I)]();}
);m("div.DTED_Lightbox_Content_Wrapper",g[E0X][(b1X+g6I+Z4J.o6I)])[(p2X)]("click.DTED_Envelope",function(a){m(a[(Z4J.i0I+v6+Z8I+Z4J.A4)])[(y3I+Z4J.Y8+Z4J.n6I+G4X+Z4J.z5I+Z4J.Y8+Z4J.n6I+Z4J.n6I)]("DTED_Envelope_Content_Wrapper")&&g[(u5J)][O1I]();}
);m(j)[(Z4X+F9X)]((Y4I+m2X+Z4J.q2+Z4J.l0X+j3+R2+F4+u3+Z4J.F1I+f1I+k6I+Z4J.q2),function(){g[c7X]();}
);}
,_heightCalc:function(){var A6J="y_C",s7I="TE_",Y2I="eight",Z2X="ooter",E2X="TE_F",N5I="onten",A3I="tCa",h2X="hei",N6I="heightCalc";g[(P0I)][N6I]?g[P0I][(h2X+Z8I+y3I+A3I+Z4J.z5I+Z4J.V2)](g[(F0X+S7)][a3J]):m(g[E0X][(Z4J.V2+N5I+Z4J.i0I)])[(O9J+G6J+w8+C3X+Z4J.F1I)]().height();var a=m(j).height()-g[(H0X+c8I)][x5J]*2-m("div.DTE_Header",g[E0X][(b1X+k6I+Q2)])[(Z4J.w1I+Z4J.R0I+I6I+Z4J.o6I+z8+Z4J.q2+B4X)]()-m((I1+Z4J.l0X+j3+E2X+Z2X),g[E0X][(i4I+e0+k6I+Q2)])[(Z4J.w1I+d3+Z4J.o6I+z8+Y2I)]();m((I1+Z4J.l0X+j3+s7I+y4X+Z4J.w1I+w8+A6J+t7+Z4J.i0I+Z4J.q2+g3X),g[E0X][a3J])[(Z4J.V2+t8)]((o5I+F5+z8+Y2I),a);return m(g[u5J][Z6J][(i4I+Z4J.Y8+k6I+k6I+Z4J.q2+Z4J.o6I)])[(y4+Z4J.i0I+Z4J.q2+Z4J.o6I+w7I+S3I+G0)]();}
,_hide:function(a){var N7I="TED_L",q1X="offsetHeight";a||(a=function(){}
);m(g[E0X][t0J])[h2J]({top:-(g[(F4+w8+Z4J.w1I+o5I)][t0J][q1X]+50)}
,600,function(){m([g[E0X][a3J],g[E0X][O1I]])[O7I]("normal",a);}
);m(g[E0X][(Z4J.V2+A8I)])[r0I]((Q4J+M3J+u3I+Z4J.l0X+j3+N7I+h1J+y3I+Z4J.i0I+N8+Z4J.w1I+z0J));m(g[(E0X)][O1I])[(C1I+Z4J.F1I+w8)]("click.DTED_Lightbox");m("div.DTED_Lightbox_Content_Wrapper",g[(F0X+S7)][(i4I+Z4J.Y8+k6I+g6I+Z4J.o6I)])[(O3J+N8+h5J)]((Q4J+S3I+z9J+Z4J.l0X+j3+X7+i3J+U5+S3I+X1+M6I+F2));m(j)[r0I]("resize.DTED_Lightbox");}
,_findAttachRow:function(){var v3I="dt",a=m(g[(F0X+I6I)][Z4J.n6I][(Z4J.i0I+Z4J.Y8+N8+m0I)])[g4X]();return g[(Z4J.V2+M7J)][a7I]==="head"?a[Q2X]()[(Q0I+b4+Q2)]():g[u5J][Z4J.n6I][V8J]===(Z4J.V2+Z4J.o6I+Z4J.q2+Z4J.Y8+Z4J.i0I+Z4J.q2)?a[(Z4J.i0I+Z4J.w2+Z4J.z5I+Z4J.q2)]()[(W7X+l8)]():a[o1](g[(F4+v3I+Z4J.q2)][Z4J.n6I][z4X])[(W9I+Z4J.q2)]();}
,_dte:null,_ready:!1,_cssBackgroundOpacity:1,_dom:{wrapper:m((x5+m2I+v3+q2X+B2I+Z2J+i8X+c2+V1X+q2X+c2+K3I+p0J+v9I+p2+x3J+s5X+H4+H7J+H7J+m8I+G9J+b0X+m2I+v3+q2X+B2I+t8J+e0J+i8X+c2+r6I+V5X+p4I+E2+i8I+l4+Y1+m2I+d9I+R7J+G6I+Z1I+m2I+v3+B6I+m2I+T7I+Y7J+q2X+B2I+t8J+e0J+i8X+c2+r6I+E2+C4J+p2+d9I+H7J+m8I+I1X+v0J+q4I+m2I+d9I+Y3X+N6J+Z1I+m2I+v3+B6I+m2I+v3+q2X+B2I+Z2J+i8X+c2+r6I+V5X+M8X+Y7J+B5+d9I+H7J+s9J+o8J+c0X+q4I+S6+T+Z1I+m2I+v3+o9+m2I+T7I+Y7J+y2))[0],background:m((x5+m2I+T7I+Y7J+q2X+B2I+t8J+e0J+i8X+c2+r6I+E2+c2+n2+v9I+p2+d9I+B4I+L8+Q4I+i4J+D6X+b0X+m2I+v3+P8X+m2I+T7I+Y7J+y2))[0],close:m((x5+m2I+T7I+Y7J+q2X+B2I+P7I+q4I+n9J+n9J+i8X+c2+J3+Y7J+X2X+B4I+U7J+d9I+u2I+Z9+c0X+T7I+A9I+A0+C8X+m2I+T7I+Y7J+y2))[0],content:null}
}
);g=f[(S0+E0I)][(J6+Z4J.w1I+k6I+Z4J.q2)];g[P0I]={windowPadding:K9I,heightCalc:c3X,attach:(Z4J.o6I+O2),windowScroll:!E0}
;f.prototype.add=function(a,b){var w2I="rder",b2I="nitFi",D9X="'. ",a0o="` ",b0J=" `",A4X="quir",e0X="dding";if(d[(S3I+T8X+Z4J.o6I+Y8X+Z4J.g7I)](a))for(var c=0,e=a.length;c<e;c++)this[(Z4J.Y8+N9I)](a[c]);else{c=a[i1X];if(c===h)throw (L8X+M6+W4J+Z4J.Y8+e0X+W4J+c8I+S3I+Z4J.q2+Z0I+v2I+X6+Q0I+W4J+c8I+S3I+Z4J.q2+Z0I+W4J+Z4J.o6I+Z4J.q2+A4X+B4+W4J+Z4J.Y8+b0J+Z4J.F1I+Z4J.Y8+o5I+Z4J.q2+a0o+Z4J.w1I+Q8I+Q7X+Z4J.F1I);if(this[Z4J.n6I][(g5I+Z4J.n6I)][c])throw "Error adding field '"+c+(D9X+U4X+W4J+c8I+S3I+Z4J.q2+Z4J.z5I+w8+W4J+Z4J.Y8+Z4J.z5I+Z4J.o6I+h7I+Z4J.g7I+W4J+Z4J.q2+z0J+S3I+x8+Z4J.n6I+W4J+j0J+Z9X+y3I+W4J+Z4J.i0I+h1I+Z4J.n6I+W4J+Z4J.F1I+Z4J.Y8+o5I+Z4J.q2);this[e9]((S3I+b2I+w7+w8),a);this[Z4J.n6I][(b9+Z4J.q2+Z4J.z5I+w5I)][c]=new f[v8I](a,this[(Z4J.V2+l7I+Z4J.n6I+Z4J.n6I+B4)][g5I],this);b===h?this[Z4J.n6I][(u2+y9I+Z4J.o6I)][q7I](c):null===b?this[Z4J.n6I][(u2+w8+Z4J.q2+Z4J.o6I)][(O3J+w5+S3I+c8I+Z4J.i0I)](c):(e=d[a4](b,this[Z4J.n6I][q0X]),this[Z4J.n6I][(Z4J.w1I+w2I)][R7I](e+1,0,c));}
this[(F0X+S3I+H2+l7I+Z4J.g7I+i0o+Z4J.w1I+Z4J.o6I+w8+Z4J.q2+Z4J.o6I)](this[(u2+w8+Q2)]());return this;}
;f.prototype.background=function(){var O8X="grou",C0X="onBa",a=this[Z4J.n6I][M9][(C0X+z9J+O8X+Z4J.F1I+w8)];(N8+Z4J.z5I+Z4J.R0I+Z4J.o6I)===a?this[T6]():d5I===a?this[(J1X+Z4J.q2)]():(Z4+o5I+S3I+Z4J.i0I)===a&&this[(Z4J.n6I+Z4J.R0I+v2X+Z9X)]();return this;}
;f.prototype.blur=function(){var g2="_bl";this[(g2+Z4J.R0I+Z4J.o6I)]();return this;}
;f.prototype.bubble=function(a,b,c,e){var A3J="ostop",A4I="clu",K2="anima",q3X="bubbleP",s2X="prepend",G8I="bod",O8J="dTo",K7I='" /></div></div><div class="',D8I="able",q4="lin",S1X='"><div/></div>',z9X="bg",T9J="ses",N2I="bleNode",j8="resize.",f3I="_formO",H5X="dual",G8J="ivi",D6I="Pl",g2X="boolean",T5X="je",U9I="_tidy",l=this;if(this[U9I](function(){l[(N8+u0J+N8+Z4J.z5I+Z4J.q2)](a,b,e);}
))return this;d[(r9X+i1+l7I+Y0o+s1+N8+T5X+i8J)](b)?(e=b,b=h,c=!E0):g2X===typeof b&&(c=b,e=b=h);d[(r9X+D6I+Z4J.Y8+S3I+Z4J.F1I+s1+N8+Z4J.i5I+Z4J.q2+i8J)](c)&&(e=c,c=!E0);c===h&&(c=!E0);var e=d[(Z4J.q2+z0J+Z4J.i0I+Z4J.q2+Z4J.F1I+w8)]({}
,this[Z4J.n6I][h3][(N8+Z4J.R0I+e6)],e),k=this[(F4+w8+h2+R0+E5J+Z4J.V2+Z4J.q2)]((h5J+G8J+H5X),a,b);this[Z7I](a,k,(L5X+N8+N8+m0I));if(!this[(F4+G0J+Z4J.q2+Z4J.w1I+k6I+Z4J.q2+Z4J.F1I)]((L5X+N8+N8+m0I)))return this;var f=this[(f3I+k6I+Z4J.i0I+J5X)](e);d(j)[(t7)](j8+f,function(){var S4I="eP";l[(N8+S2X+Z4J.z5I+S4I+F8+X3+Z4J.w1I+Z4J.F1I)]();}
);var i=[];this[Z4J.n6I][(N8+Z4J.R0I+N8+N2I+Z4J.n6I)]=i[o1I][(e0+k6I+Z4J.z5I+Z4J.g7I)](i,y(k,a7I));i=this[(Q4J+Z4J.Y8+Z4J.n6I+T9J)][z3X];k=d((x5+m2I+v3+q2X+B2I+P7I+q4I+e0J+i8X)+i[z9X]+S1X);i=d((x5+m2I+T7I+Y7J+q2X+B2I+P7I+q4I+e0J+i8X)+i[(b1X+h1X)]+(b0X+m2I+v3+q2X+B2I+Z2J+i8X)+i[(q4+Z4J.q2+Z4J.o6I)]+(b0X+m2I+T7I+Y7J+q2X+B2I+t8J+n9J+n9J+i8X)+i[(Z4J.i0I+D8I)]+(b0X+m2I+v3+q2X+B2I+P7I+q4I+e0J+i8X)+i[(J1X+Z4J.q2)]+K7I+i[(E7I+S3I+Z4J.F1I+Z4J.i0I+Q2)]+(s4X+m2I+v3+y2));c&&(i[(Z4J.Y8+k6I+K4X+V2I)]((N8+i2X)),k[(Z4J.Y8+k6I+A6X+O8J)]((G8I+Z4J.g7I)));var c=i[(O9J+G6J+w8+C3X+Z4J.F1I)]()[(Z4J.q2+j1I)](E0),g=c[(Z4J.V2+y3I+G6J+J4I+q8)](),u=g[(Z4J.V2+w7X+w8+Z4J.o6I+q8)]();c[(l4X+w8)](this[Z6J][M6X]);g[(k6I+C3X+k6I+q8+w8)](this[Z6J][y0o]);e[(o5I+B4+Z4J.n6I+Z4J.Y8+Z8I+Z4J.q2)]&&c[s2X](this[(Z6J)][i0X]);e[(Z4J.i0I+W6)]&&c[(k6I+Z4J.o6I+W2+Z4J.q2+Z4J.F1I+w8)](this[Z6J][J0I]);e[w4]&&g[(Z4J.Y8+k6I+k6I+q8+w8)](this[Z6J][(u0o+Q3I+h3X)]);var z=d()[o4J](i)[o4J](k);this[(W4I+Z4J.w1I+u1+v0+P7)](function(){var V3X="animat";z[(V3X+Z4J.q2)]({opacity:E0}
,function(){var v4J="size";z[(w8+Z4J.A4+N4+y3I)]();d(j)[t9J]((C3X+v4J+Z4J.l0X)+f);l[a6I]();}
);}
);k[F3J](function(){l[T6]();}
);u[F3J](function(){l[(F4+Z4J.V2+A8I)]();}
);this[(q3X+F8+S3I+Z4J.i0I+s4)]();z[(K2+I6I)]({opacity:N0}
);this[(F4+c8I+Z4J.w1I+v5J+Z4J.n6I)](this[Z4J.n6I][(S3I+Z4J.F1I+A4I+w8+Z4J.q2+o3+S3I+v1J)],e[(c8I+Z4J.w1I+E8)]);this[(F4+k6I+A3J+q8)]((L5X+N8+l3));return this;}
;f.prototype.bubblePosition=function(){var T0I="below",e4J="rW",W1J="_Line",a=d((w8+S3I+g0J+Z4J.l0X+j3+X7+F4+p1X+L7X+Z4J.z5I+Z4J.q2)),b=d((I1+Z4J.l0X+j3+X6+u3+F4+p1X+N8+N8+m0I+W1J+Z4J.o6I)),c=this[Z4J.n6I][(N8+S2X+Z4J.z5I+P2I+G1+Z4J.q2+Z4J.n6I)],e=0,l=0,k=0,f=0;d[(J5I+O9J)](c,function(a,b){var f7I="Wid",c=d(b)[(d6+c8I+Z4J.n6I+Z4J.q2+Z4J.i0I)]();e+=c.top;l+=c[s2I];k+=c[(m0I+f2)]+b[(Z4J.w1I+f4+Z4J.n6I+Z4J.A4+f7I+Z4J.i0I+y3I)];f+=c.top+b[(Z4J.w1I+c8I+c8I+Z4J.n6I+Z4J.q2+Z4J.i0I+w7I+S3I+Z8I+y3I+Z4J.i0I)];}
);var e=e/c.length,l=l/c.length,k=k/c.length,f=f/c.length,c=e,i=(l+k)/2,g=b[(y4+Z4J.i0I+Z4J.q2+e4J+S3I+w8+Z4J.i0I+y3I)](),u=i-g/2,g=u+g,h=d(j).width();a[(Z4J.V2+Z4J.n6I+Z4J.n6I)]({top:c,left:i}
);b.length&&0>b[(Z4J.w1I+c8I+C2+Z4J.q2+Z4J.i0I)]().top?a[v3J]("top",f)[(o4J+G4X+Z4J.z5I+Z4J.Y8+Z4J.n6I+Z4J.n6I)]((N8+w7+Z4J.w1I+j0J)):a[(Z4J.o6I+Q8+Z4J.w1I+l9J+n1+Z4J.n6I)]((T0I));g+15>h?b[(Z4J.V2+t8)]("left",15>u?-(u-15):-(g-h+15)):b[(Z4J.V2+t8)]((m0I+f2),15>u?-(u-15):0);return this;}
;f.prototype.buttons=function(a){var b=this;E6J===a?a=[{label:this[k1I][this[Z4J.n6I][V8J]][(Z4J.n6I+Z4J.R0I+l6X)],fn:function(){this[(Z4+o5I+Z9X)]();}
}
]:d[(Y3I+Y8X+Z4J.g7I)](a)||(a=[a]);d(this[(Z6J)][w4]).empty();d[s8X](a,function(a,e){var W3I="keypress",x8X="keyup",y8I="lassN";(Z4J.n6I+Z4J.i0I+b7J+Z8I)===typeof e&&(e={label:e,fn:function(){this[(Z4J.n6I+Z4J.R0I+N8+o5I+S3I+Z4J.i0I)]();}
}
);d((M4X+N8+Z4J.R0I+Z4J.i0I+Q3I+Z4J.F1I+i9X),{"class":b[T4][(a8I+o5I)][(N8+P2X+Z4J.w1I+Z4J.F1I)]+(e[(Z4J.V2+y8I+a0+Z4J.q2)]?W4J+e[(Z4J.V2+Z4J.z5I+Z4J.Y8+t8+J1+Z4J.Y8+A1J)]:g0I)}
)[(y3I+Z4J.i0I+t3J)](Z4J.T5J===typeof e[s0I]?e[(s0I)](b):e[(Z4J.z5I+Z4J.w2+w7)]||g0I)[l5X]((Z4J.i0I+Z4J.w2+S3I+Z4J.F1I+y9I+z0J),E0)[(Z4J.w1I+Z4J.F1I)](x8X,function(a){a2I===a[(l6+Z4J.g7I+G4X+G1+Z4J.q2)]&&e[(Z4J.h0I)]&&e[(Z4J.h0I)][(Z4J.V2+Z4J.Y8+Z4J.z5I+Z4J.z5I)](b);}
)[t7](W3I,function(a){a2I===a[D2J]&&a[F1]();}
)[t7]((Z4J.V2+Z4J.z5I+S3I+z9J),function(a){a[F1]();e[(Z4J.h0I)]&&e[(c8I+Z4J.F1I)][(d5J+Z4J.z5I)](b);}
)[(e0+k6I+Z4J.q2+F9X+V2I)](b[Z6J][(L5X+X4J+Z4J.F1I+Z4J.n6I)]);}
);return this;}
;f.prototype.clear=function(a){var R8X="fie",b=this,c=this[Z4J.n6I][(R8X+Z4J.z5I+w8+Z4J.n6I)];X3X===typeof a?(c[a][(y9I+z6X+Z4J.w1I+Z4J.g7I)](),delete  c[a],a=d[(Y0o+X0+Y8X+Z4J.g7I)](a,this[Z4J.n6I][(i5X+Z4J.o6I)]),this[Z4J.n6I][(u2+y9I+Z4J.o6I)][R7I](a,N0)):d[s8X](this[C7I](a),function(a,c){var k2I="clear";b[k2I](c);}
);return this;}
;f.prototype.close=function(){this[w3X](!N0);return this;}
;f.prototype.create=function(a,b,c,e){var C1J="Open",X8J="ybe",u6="leM",O0J="Cr",Z6X="vent",Q9="_dis",K8="_actionClass",c9I="Arg",T7X="ru",l=this,k=this[Z4J.n6I][Y8I],f=N0;if(this[(F4+Z4J.i0I+C8I)](function(){l[d0I](a,b,c,e);}
))return this;y9X===typeof a&&(f=a,a=b,b=c);this[Z4J.n6I][(R0J+o3+m1J+Z4J.n6I)]={}
;for(var i=E0;i<f;i++)this[Z4J.n6I][(Z4J.q2+w8+S3I+Z4J.i0I+I5J+w5I)][i]={fields:this[Z4J.n6I][(c8I+e6J+Z0I+Z4J.n6I)]}
;f=this[(F4+Z4J.V2+T7X+w8+c9I+Z4J.n6I)](a,b,c,e);this[Z4J.n6I][(Z4J.Y8+i8J+S3I+Z4J.w1I+Z4J.F1I)]=(m3J+J5I+I6I);this[Z4J.n6I][z4X]=c3X;this[(w8+S7)][(c8I+Z4J.w1I+t6X)][(x8+Z4J.g7I+Z4J.z5I+Z4J.q2)][p6J]=h3J;this[K8]();this[(Q9+M7I+Z4J.Y8+Z4J.g7I+i0o+Z4J.w1I+I3X+Q2)](this[(b9+Z4J.q2+Z0I+Z4J.n6I)]());d[(e9I+y3I)](k,function(a,b){var N2="eset",k9J="iR";b[(o5I+Z4J.R0I+S2J+k9J+N2)]();b[(u1+Z4J.i0I)](b[D1I]());}
);this[(N9J+Z6X)]((Y0o+Z9X+O0J+J5I+I6I));this[(F4+Z4J.Y8+Z4J.n6I+Z4J.n6I+Q8+N8+u6+Z4J.Y8+S3I+Z4J.F1I)]();this[x6X](f[(Z4J.w1I+Q8I+Z4J.n6I)]);f[(o5I+Z4J.Y8+X8J+C1J)]();return this;}
;f.prototype.dependent=function(a,b,c){if(d[(Y3I+Z4J.o6I+y3)](a)){for(var e=0,l=a.length;e<l;e++)this[(w8+W2+C5I+q8+Z4J.i0I)](a[e],b,c);return this;}
var k=this,f=this[(b9+Q9X)](a),i={type:"POST",dataType:"json"}
,c=d[(K8X+Z4J.F1I+w8)]({event:"change",data:null,preUpdate:null,postUpdate:null}
,c),g=function(a){var T0X="pdate",S6J="Upd",k4="rror",l4I="preUpdate",U8="eUpd";c[(G0J+U8+Z4J.Y8+I6I)]&&c[l4I](a);d[s8X]({labels:(b3I+w7),options:"update",values:(g0J+X0I),messages:"message",errors:(Z4J.q2+k4)}
,function(b,c){a[b]&&d[(J5I+Z4J.V2+y3I)](a[b],function(a,b){k[(c8I+S3I+Q9X)](a)[c](b);}
);}
);d[s8X](["hide","show","enable",(w8+S3I+Z4J.n6I+Z4J.w2+Z4J.z5I+Z4J.q2)],function(b,c){if(a[c])k[c](a[c]);}
);c[(m0J+Z4J.i0I+S6J+Z4J.Y8+Z4J.i0I+Z4J.q2)]&&c[(m0J+Z4J.i0I+D7+T0X)](a);}
;d(f[o0o]())[(Z4J.w1I+Z4J.F1I)](c[(Z4J.q2+k6+Z4J.i0I)],function(a){if(-1!==d[a4](a[(Z4J.i0I+u2J+Z4J.q2+Z4J.i0I)],f[j0X]()[(Q3I+T0)]())){a={}
;a[C6X]=k[Z4J.n6I][(R0J+o3+e6J+r7I)]?y(k[Z4J.n6I][Z3J],(Z4J.C6J+Z4J.i0I+Z4J.Y8)):null;a[o1]=a[C6X]?a[(k7X+j0J+Z4J.n6I)][0]:null;a[(e7J+B8I+Z4J.n6I)]=k[y1]();if(c.data){var e=c.data(a);e&&(c.data=e);}
(c8I+Z4J.R0I+Z4J.F1I+m9I+Z4J.w1I+Z4J.F1I)===typeof b?(a=b(f[(y1)](),a,g))&&g(a):(d[T3J](b)?d[(p5+N5X+w8)](i,b):i[(Z4J.R0I+G6X)]=b,d[(Y7+F5)](d[(p5+Z4J.i0I+Z4J.q2+F9X)](i,{url:b,data:a,success:g}
)));}
}
);return this;}
;f.prototype.disable=function(a){var b=this[Z4J.n6I][Y8I];d[s8X](this[C7I](a),function(a,e){b[e][(w8+S3I+Z4J.n6I+G1I+Z4J.q2)]();}
);return this;}
;f.prototype.display=function(a){return a===h?this[Z4J.n6I][R8J]:this[a?Y5X:(J1X+Z4J.q2)]();}
;f.prototype.displayed=function(){return d[(A9J+k6I)](this[Z4J.n6I][Y8I],function(a,b){return a[R8J]()?b:c3X;}
);}
;f.prototype.displayNode=function(){var R4I="yCo";return this[Z4J.n6I][(N9+Z4J.z5I+Z4J.Y8+R4I+Z4J.F1I+Z4J.i0I+Z4J.o6I+A0I+m0I+Z4J.o6I)][(Z4J.F1I+G1+Z4J.q2)](this);}
;f.prototype.edit=function(a,b,c,e,d){var D5="ayb",a5J="ormOpt",e7="_assembleMain",x3="aSo",g0="rgs",y6X="crudA",m1I="_ti",k=this;if(this[(m1I+g3I)](function(){k[(u9+S3I+Z4J.i0I)](a,b,c,e,d);}
))return this;var f=this[(F4+y6X+g0)](b,c,e,d);this[Z7I](a,this[(F4+Z4J.C6J+Z4J.i0I+x3+Z4J.R0I+Z4J.o6I+Z9J)]((c8I+S3I+Z4J.q2+Z4J.z5I+w5I),a),(A9J+S3I+Z4J.F1I));this[e7]();this[(B9J+a5J+Q7X+Z4J.F1I+Z4J.n6I)](f[(V7+Z4J.I2I)]);f[(o5I+D5+Z4J.q2+s1+A6X)]();return this;}
;f.prototype.enable=function(a){var b=this[Z4J.n6I][(c8I+e6J+Z0I+Z4J.n6I)];d[(e9I+y3I)](this[C7I](a),function(a,e){b[e][(q8+Z4J.Y8+N8+m0I)]();}
);return this;}
;f.prototype.error=function(a,b){var L0I="mE";b===h?this[(F4+o5I+B4+Z4J.n6I+L9+Z4J.q2)](this[(w8+Z4J.w1I+o5I)][(a8I+L0I+Z4J.o6I+Z4J.o6I+u2)],a):this[Z4J.n6I][Y8I][a].error(b);return this;}
;f.prototype.field=function(a){return this[Z4J.n6I][Y8I][a];}
;f.prototype.fields=function(){return d[(I0)](this[Z4J.n6I][(b9+Z4J.q2+Z4J.z5I+w5I)],function(a,b){return b;}
);}
;f.prototype.get=function(a){var H3="Arr",b=this[Z4J.n6I][(c8I+S3I+Z4J.q2+Z0I+Z4J.n6I)];a||(a=this[(v7+w5I)]());if(d[(S3I+Z4J.n6I+H3+Z4J.Y8+Z4J.g7I)](a)){var c={}
;d[(Z4J.q2+Z4J.Y8+O9J)](a,function(a,d){c[d]=b[d][(n6+Z4J.i0I)]();}
);return c;}
return b[a][R5]();}
;f.prototype.hide=function(a,b){var r9J="dNam",C4="_fi",c=this[Z4J.n6I][Y8I];d[(s8X)](this[(C4+w7+r9J+B4)](a),function(a,d){c[d][(y3I+S3I+y9I)](b);}
);return this;}
;f.prototype.inError=function(a){var w6J="inError",J8X="isi",s0="rmE";if(d(this[(w8+Z4J.w1I+o5I)][(s8+s0+Z4J.o6I+Z4J.o6I+u2)])[r9X]((J0o+g0J+J8X+B2X+Z4J.q2)))return !0;for(var b=this[Z4J.n6I][(c8I+e6J+Z4J.z5I+w5I)],a=this[C7I](a),c=0,e=a.length;c<e;c++)if(b[a[c]][w6J]())return !0;return !1;}
;f.prototype.inline=function(a,b,c){var I0X="_closeReg",S6I="_Fie",m4X="TE_I",J4='_But',P5I='nl',K0I='I',z7='eld',S2='_F',a8='ne',r3='TE_Inli',i7I='nlin',W8X='TE_I',i1I="contents",s3I="_edi",C6="inli",R2X="tid",j1J="nli",y4J="_dat",U8X="inl",e=this;d[T3J](b)&&(c=b,b=h);var c=d[H3I]({}
,this[Z4J.n6I][h3][(U8X+S3I+G9X)],c),l=this[(y4J+Z4J.Y8+R0+Z4J.w1I+Z4J.R0I+Z4J.o6I+Z9J)]("individual",a,b),k,f,i=0,g,u=!1;d[s8X](l,function(a,b){var e7X="han",c8X="ore",y5X="annot";if(i>0)throw (G4X+y5X+W4J+Z4J.q2+w8+Z9X+W4J+o5I+c8X+W4J+Z4J.i0I+e7X+W4J+Z4J.w1I+G9X+W4J+Z4J.o6I+O2+W4J+S3I+j1J+G9X+W4J+Z4J.Y8+Z4J.i0I+W4J+Z4J.Y8+W4J+Z4J.i0I+v0o+Z4J.q2);k=d(b[a7I][0]);g=0;d[s8X](b[y0X],function(a,b){var N8X="nn",K2J="Ca";if(g>0)throw (K2J+N8X+T8+W4J+Z4J.q2+w8+Z9X+W4J+o5I+c8X+W4J+Z4J.i0I+C3I+Z4J.F1I+W4J+Z4J.w1I+G9X+W4J+c8I+S3I+Z4J.q2+Z0I+W4J+S3I+Z4J.F1I+Z4J.z5I+Y5J+W4J+Z4J.Y8+Z4J.i0I+W4J+Z4J.Y8+W4J+Z4J.i0I+v0o+Z4J.q2);f=b;g++;}
);i++;}
);if(d("div.DTE_Field",k).length||this[(F4+R2X+Z4J.g7I)](function(){e[(C6+Z4J.F1I+Z4J.q2)](a,b,c);}
))return this;this[(s3I+Z4J.i0I)](a,l,"inline");var z=this[(F4+a8I+v5I+k6I+p9X+Z4J.F1I+Z4J.n6I)](c);if(!this[b6I]((C6+Z4J.F1I+Z4J.q2)))return this;var O=k[i1I]()[(y9I+Z4J.i0I+Z4J.Y8+O9J)]();k[(Z4J.Y8+N0J+Z4J.q2+F9X)](d((x5+m2I+T7I+Y7J+q2X+B2I+P7I+q4I+n9J+n9J+i8X+c2+r6I+E2+q2X+c2+W8X+i7I+m8I+b0X+m2I+v3+q2X+B2I+P7I+b6+n9J+i8X+c2+r3+a8+S2+T7I+z7+e4X+m2I+T7I+Y7J+q2X+B2I+t8J+n9J+n9J+i8X+c2+K3I+p4I+K0I+P5I+T7I+a8+J4+c0X+o8J+n9J+t3X+m2I+v3+y2)));k[T9X]((w8+S3I+g0J+Z4J.l0X+j3+m4X+j1J+G9X+S6I+Z0I))[w1X](f[(o8X+y9I)]());c[w4]&&k[(K3J+w8)]("div.DTE_Inline_Buttons")[(K1X+Z4J.q2+F9X)](this[Z6J][w4]);this[I0X](function(a){u=true;d(q)[(t9J)]((Q4J+S3I+z9J)+z);if(!a){k[(Z4J.V2+S3J+Z4J.q2+Z4J.F1I+Z4J.I2I)]()[K7X]();k[w1X](O);}
e[a6I]();}
);setTimeout(function(){if(!u)d(q)[t7]((Q4J+M3J+u3I)+z,function(a){var s9I="aren",H2X="peFn",x9="addBack",b=d[(c8I+Z4J.F1I)][x9]?"addBack":"andSelf";!f[(L9J+H2X)]("owns",a[(Z4J.i0I+u2J+Z4J.A4)])&&d[(S3I+Z4J.F1I+X0+Z4J.o6I+Z4J.Y8+Z4J.g7I)](k[0],d(a[(B7+Z4J.o6I+n6+Z4J.i0I)])[(k6I+s9I+Z4J.i0I+Z4J.n6I)]()[b]())===-1&&e[(T6)]();}
);}
,0);this[v6I]([f],c[(c8I+t0+q5J)]);this[(j6J+F8+Q3I+A6X)]((Y0o+Z4J.z5I+Y5J));return this;}
;f.prototype.message=function(a,b){var R0X="formInf",s5="_message";b===h?this[s5](this[(w8+Z4J.w1I+o5I)][(R0X+Z4J.w1I)],a):this[Z4J.n6I][Y8I][a][(w6+Z4J.n6I+i5)](b);return this;}
;f.prototype.mode=function(){return this[Z4J.n6I][V8J];}
;f.prototype.modifier=function(){var T4I="ier";return this[Z4J.n6I][(o5I+Z4J.w1I+w8+S3I+c8I+T4I)];}
;f.prototype.multiGet=function(a){var j7="Get",b=this[Z4J.n6I][Y8I];a===h&&(a=this[(c8I+S3I+w7+w8+Z4J.n6I)]());if(d[(r9X+U4X+P8J+Z4J.g7I)](a)){var c={}
;d[(Z4J.q2+Z4J.Y8+O9J)](a,function(a,d){var f8="tiG";c[d]=b[d][(p6+f8+Z4J.q2+Z4J.i0I)]();}
);return c;}
return b[a][(o5I+I8I+S3I+j7)]();}
;f.prototype.multiSet=function(a,b){var l9X="Objec",t7J="Plain",c=this[Z4J.n6I][Y8I];d[(S3I+Z4J.n6I+t7J+l9X+Z4J.i0I)](a)&&b===h?d[(J5I+Z4J.V2+y3I)](a,function(a,b){var A3="tiS";c[a][(p6+A3+Z4J.A4)](b);}
):c[a][C2J](b);return this;}
;f.prototype.node=function(a){var b=this[Z4J.n6I][(b9+v1J)];a||(a=this[(Z4J.w1I+Z4J.o6I+l8)]());return d[(w2J+U9X+Z4J.Y8+Z4J.g7I)](a)?d[(I0)](a,function(a){return b[a][(Z4J.F1I+G1+Z4J.q2)]();}
):b[a][(Z4J.F1I+O1X)]();}
;f.prototype.off=function(a,b){var c0J="ntN";d(this)[(Z4J.w1I+f4)](this[(N9J+g0J+Z4J.q2+c0J+a0+Z4J.q2)](a),b);return this;}
;f.prototype.on=function(a,b){d(this)[(t7)](this[(F4+f0X+Z4J.F1I+J8+Z4J.Y8+o5I+Z4J.q2)](a),b);return this;}
;f.prototype.one=function(a,b){d(this)[j7J](this[(F4+Z4J.q2+k6+J8+Z4J.Y8+A1J)](a),b);return this;}
;f.prototype.open=function(){var h9="ditO",W8="mai",U7I="seReg",I2="_clo",d7="eor",f3="splay",a=this;this[(F0X+S3I+f3+v0+d7+w8+Z4J.q2+Z4J.o6I)]();this[(I2+U7I)](function(){a[Z4J.n6I][(H0J+H2+c5J+G4X+S3J+k7X+Z4J.z5I+Z4J.z5I+Z4J.q2+Z4J.o6I)][(Z4J.V2+K8I+u1)](a,function(){var L1J="yna",o4X="arD",m9="_cle";a[(m9+o4X+L1J+o5I+S3I+Z4J.V2+s3X+s8)]();}
);}
);if(!this[b6I]((W8+Z4J.F1I)))return this;this[Z4J.n6I][(w8+t0o+y3+N7J+g3X+k7X+Z4J.z5I+Z4J.z5I+Q2)][(Z4J.w1I+k6I+Z4J.q2+Z4J.F1I)](this,this[Z6J][(j0J+Z4J.o6I+e0+k6I+Q2)]);this[v6I](d[(o5I+e0)](this[Z4J.n6I][(i5X+Z4J.o6I)],function(b){return a[Z4J.n6I][(c8I+S3I+w7+w8+Z4J.n6I)][b];}
),this[Z4J.n6I][(Z4J.q2+h9+k6I+Z4J.i0I+Z4J.n6I)][O6I]);this[(j6J+Z4J.w1I+E8X+A6X)]((e2J));return this;}
;f.prototype.order=function(a){var J0X="ide",E6I="sort",P7X="ort",t2="sArra";if(!a)return this[Z4J.n6I][q0X];arguments.length&&!d[(S3I+t2+Z4J.g7I)](a)&&(a=Array.prototype.slice.call(arguments));if(this[Z4J.n6I][q0X][u4I]()[(Z4J.n6I+P7X)]()[W6I](F6X)!==a[(Z4J.n6I+u1I+Z4J.V2+Z4J.q2)]()[E6I]()[W6I](F6X))throw (U4X+Z4J.z5I+Z4J.z5I+W4J+c8I+m1J+Z4J.n6I+p5X+Z4J.Y8+F9X+W4J+Z4J.F1I+Z4J.w1I+W4J+Z4J.Y8+w8+w8+S3I+Z4J.i0I+Q7X+Z4J.F1I+Z4J.Y8+Z4J.z5I+W4J+c8I+S3I+w7+w5I+p5X+o5I+q5J+Z4J.i0I+W4J+N8+Z4J.q2+W4J+k6I+k7X+g0J+J0X+w8+W4J+c8I+Z4J.w1I+Z4J.o6I+W4J+Z4J.w1I+I3X+Z4J.q2+M8J+Z4J.l0X);d[H3I](this[Z4J.n6I][q0X],a);this[L3J]();return this;}
;f.prototype.remove=function(a,b,c,e,l){var B3="maybeOpen",M0X="Ma",h4X="emble",m5I="tiRe",n0o="tMul",f3J="ini",F5X="nCl",c8="ditF",e6I="_dataS",I5X="_crudArgs",k=this;if(this[(F4+Z4J.i0I+C8I)](function(){k[V9I](a,b,c,e,l);}
))return this;a.length===h&&(a=[a]);var f=this[I5X](b,c,e,l),i=this[(e6I+E5J+Z9J)]((g5I+Z4J.n6I),a);this[Z4J.n6I][(M1J+S3I+t7)]=(Z4J.o6I+Q8+I4+Z4J.q2);this[Z4J.n6I][z4X]=a;this[Z4J.n6I][(Z4J.q2+c8+m1J+Z4J.n6I)]=i;this[(Z4J.x4I+o5I)][y0o][(Z4J.n6I+Z4J.i0I+Z4J.g7I+Z4J.z5I+Z4J.q2)][(w8+r9X+M7I+y3)]=D9I;this[(y7J+m1+F5X+Z1+Z4J.n6I)]();this[(N9J+l9J+g3X)]((S3I+N1X+Z4J.i0I+i0o+F2X),[y(i,(o8X+y9I)),y(i,(Z4J.C6J+B7)),a]);this[(F4+f0X+Z4J.F1I+Z4J.i0I)]((f3J+n0o+m5I+o5I+I4+Z4J.q2),[i,a]);this[(F4+L1+h4X+M0X+Y0o)]();this[x6X](f[l5J]);f[B3]();f=this[Z4J.n6I][M9];c3X!==f[(s8+Z4J.V2+q5J)]&&d((N8+Z4J.R0I+E2I+t7),this[(Z6J)][(N8+n4J+Z4J.i0I+p3J)])[(Z4J.q2+j1I)](f[O6I])[(O6I)]();return this;}
;f.prototype.set=function(a,b){var c=this[Z4J.n6I][(Y8I)];if(!d[T3J](a)){var e={}
;e[a]=b;a=e;}
d[(Z4J.q2+Z4J.Y8+Z4J.V2+y3I)](a,function(a,b){c[a][Y9J](b);}
);return this;}
;f.prototype.show=function(a,b){var c=this[Z4J.n6I][(c8I+S3I+w7+w5I)];d[(s8X)](this[C7I](a),function(a,d){c[d][(w5+O2)](b);}
);return this;}
;f.prototype.submit=function(a,b,c,e){var l=this,f=this[Z4J.n6I][Y8I],w=[],i=E0,g=!N0;if(this[Z4J.n6I][y2X]||!this[Z4J.n6I][(N4+t1I+t7)])return this;this[(F4+G0J+Z4J.w1I+Y2J+C8)](!E0);var h=function(){w.length!==i||g||(g=!0,l[(n8J+F7X+Z4J.i0I)](a,b,c,e));}
;this.error();d[(e9I+y3I)](f,function(a,b){var N0X="Erro";b[(Y0o+N0X+Z4J.o6I)]()&&w[q7I](a);}
);d[s8X](w,function(a,b){f[b].error("",function(){i++;h();}
);}
);h();return this;}
;f.prototype.title=function(a){var r0="unc",T3="lasses",b=d(this[(w8+Z4J.w1I+o5I)][(W7X+w8+Z4J.q2+Z4J.o6I)])[(Z4J.V2+y3I+S3I+Z4J.z5I+w8+C3X+Z4J.F1I)](F0J+this[(Z4J.V2+T3)][(y3I+Z4J.q2+Z4J.Y8+y9I+Z4J.o6I)][t0J]);if(a===h)return b[(y3I+Z4J.i0I+o5I+Z4J.z5I)]();(c8I+r0+t1I+Z4J.w1I+Z4J.F1I)===typeof a&&(a=a(this,new r[(q1+S3I)](this[Z4J.n6I][(Z4J.i0I+Z4J.Y8+B2X+Z4J.q2)])));b[(h0J+Z4J.z5I)](a);return this;}
;f.prototype.val=function(a,b){return b===h?this[R5](a):this[Y9J](a,b);}
;var p=r[m7J][h5X];p((Z4J.q2+w8+n2I+G2X),function(){return v(this);}
);p((k7X+j0J+Z4J.l0X+Z4J.V2+Z4J.o6I+J5I+Z4J.i0I+Z4J.q2+G2X),function(a){var b=v(this);b[(A1X+Z4J.Y8+Z4J.i0I+Z4J.q2)](B(b,a,(Z4J.V2+C3X+z1+Z4J.q2)));return this;}
);p(w4I,function(a){var b=v(this);b[(Z4J.q2+w8+Z9X)](this[E0][E0],B(b,a,(Z4J.q2+H0J+Z4J.i0I)));return this;}
);p((Z4J.o6I+O2+Z4J.n6I+l2X+Z4J.q2+w8+S3I+Z4J.i0I+G2X),function(a){var b=v(this);b[R0J](this[E0],B(b,a,(u9+Z9X)));return this;}
);p((o1+l2X+w8+Z4J.q2+m0I+I6I+G2X),function(a){var b=v(this);b[V9I](this[E0][E0],B(b,a,V9I,N0));return this;}
);p((C6X+l2X+w8+Z4J.q2+Z4J.z5I+Y0X+G2X),function(a){var b=v(this);b[V9I](this[0],B(b,a,"remove",this[0].length));return this;}
);p(T3I,function(a,b){var p0X="nl";a?d[T3J](a)&&(b=a,a=(S3I+p0X+S3I+Z4J.F1I+Z4J.q2)):a=(S3I+p0X+Y0o+Z4J.q2);v(this)[a](this[E0][E0],b);return this;}
);p((G1J+l2X+Z4J.q2+o6+G2X),function(a){v(this)[z3X](this[E0],a);return this;}
);p(w0J,function(a,b){return f[(J8J+B4)][a][b];}
);p((J8J+Z4J.q2+Z4J.n6I+G2X),function(a,b){var f6X="les";if(!a)return f[(J8J+Z4J.q2+Z4J.n6I)];if(!b)return f[(c8I+S3I+f6X)][a];f[G0I][a]=b;return this;}
);d(q)[t7](R3,function(a,b,c){var C0o="ile";(w8+Z4J.i0I)===a[(i1X+Z4J.n6I+k6I+Z4J.Y8+Z9J)]&&c&&c[(c8I+C0o+Z4J.n6I)]&&d[(Z4J.q2+Z4J.Y8+Z4J.V2+y3I)](c[(b9+m0I+Z4J.n6I)],function(a,b){f[(b9+Z4J.z5I+Z4J.q2+Z4J.n6I)][a]=b;}
);}
);f.error=function(a,b){var Q5J="bles",q5X="atat",h0X="://",w8I="ps";throw b?a+(W4J+o3+u2+W4J+o5I+Z4J.w1I+C3X+W4J+S3I+Z4J.F1I+c8I+Z4J.w1I+Z4J.o6I+o5I+n9+Z4J.w1I+Z4J.F1I+p5X+k6I+Z4J.z5I+J5I+u1+W4J+Z4J.o6I+Z4J.q2+c8I+Z4J.q2+Z4J.o6I+W4J+Z4J.i0I+Z4J.w1I+W4J+y3I+E2I+w8I+h0X+w8+q5X+Z4J.Y8+Q5J+Z4J.l0X+Z4J.F1I+Z4J.q2+Z4J.i0I+w0X+Z4J.i0I+Z4J.F1I+w0X)+b:a;}
;f[z4J]=function(a,b,c){var e,l,f,b=d[(Z4J.q2+z0J+I6I+F9X)]({label:(Z4J.z5I+Z4J.w2+w7),value:"value"}
,b);if(d[(S3I+Z4J.n6I+T0)](a)){e=0;for(l=a.length;e<l;e++)f=a[e],d[(r9X+i1+l7I+Y0o+s1+Z4J.c4X+K3X)](f)?c(f[b[o0X]]===h?f[b[(Z4J.z5I+Z4J.w2+w7)]]:f[b[(o0X)]],f[b[s0I]],e):c(f,f,e);}
else e=0,d[s8X](a,function(a,b){c(b,a,e);e++;}
);}
;f[(Z4J.n6I+Z4J.Y8+p1+x1+w8)]=function(a){return a[(Z4J.o6I+Z4J.q2+k6I+Z4J.z5I+N4+Z4J.q2)](/\./g,F6X);}
;f[r2]=function(a,b,c,e,l){var L4X="readAsDataURL",c0o="<i>Uploading file</i>",L0J="Te",k=new FileReader,w=E0,i=[];a.error(b[(r4I+Z4J.q2)],"");e(b,b[(b9+Z4J.z5I+Z4J.q2+i0o+b4+L0J+z0J+Z4J.i0I)]||c0o);k[(t7+Z4J.z5I+Z4J.w1I+b4)]=function(){var r2J="rro",u0X="son",R2J="reS",R1I="ied",Z1X="No",O3X="ja",d7J="ajax",U4I="aja",V2X="ajaxData",I1J="uploadField",P4I="ploa",g=new FormData,h;g[w1X]((M1J+s4),(Z4J.R0I+P4I+w8));g[(Z4J.Y8+X1I+w8)](I1J,b[i1X]);g[(f1+Z4J.F1I+w8)](r2,c[w]);b[V2X]&&b[(Z4J.Y8+Y9I+Z)](g);if(b[(Z4J.Y8+Z4J.i5I+Z4J.Y8+z0J)])h=b[(Z4J.Y8+Y9I)];else if((x8+Z4J.o6I+B8J)===typeof a[Z4J.n6I][(U4I+z0J)]||d[T3J](a[Z4J.n6I][d7J]))h=a[Z4J.n6I][(Z4J.Y8+O3X+z0J)];if(!h)throw (Z1X+W4J+U4X+O3X+z0J+W4J+Z4J.w1I+Q8I+s4+W4J+Z4J.n6I+k6I+Z4J.q2+Z4J.V2+t1J+R1I+W4J+c8I+Z4J.w1I+Z4J.o6I+W4J+Z4J.R0I+M7I+Z4J.w1I+Z4J.Y8+w8+W4J+k6I+U4J+Z8I+F6X+S3I+Z4J.F1I);(Z4J.n6I+Z4J.i0I+Z4J.o6I+B8J)===typeof h&&(h={url:h}
);var z=!N0;a[t7]((k6I+R2J+Z4J.R0I+N8+o5I+Z9X+Z4J.l0X+j3+X7+F4+D7+k6I+Z4J.z5I+y5J),function(){z=!E0;return !N0;}
);d[(Z4J.Y8+Y9I)](d[(Z4J.q2+z0+F9X)]({}
,h,{type:(E7I+x8),data:g,dataType:(Z4J.i5I+u0X),contentType:!1,processData:!1,xhr:function(){var Q0J="onloadend",g7="ogr",T6J="pload",D4X="axSe",a=d[(Y7+D4X+Z4J.i0I+t1I+x3X)][(z0J+y3I+Z4J.o6I)]();a[(Z4J.R0I+T6J)]&&(a[(s3J+K8I+Z4J.Y8+w8)][(Z4J.w1I+Z4J.F1I+G0J+g7+Z4J.q2+Z4J.n6I+Z4J.n6I)]=function(a){var v1I="toFixed",r5X="loaded",k7I="lengthComputable";a[k7I]&&(a=(100*(a[r5X]/a[(Q3I+Z4J.i0I+Z4J.Y8+Z4J.z5I)]))[v1I](0)+"%",e(b,1===c.length?a:w+":"+c.length+" "+a));}
,a[r2][Q0J]=function(){e(b);}
);return a;}
,success:function(e){var I8="aURL",q6="adAsD",X0X="cc";a[(t9J)]("preSubmit.DTE_Upload");if(e[z0o]&&e[(c8I+S3I+Z4J.q2+Z0I+u3+U9X+Z4J.w1I+Z4J.o6I+Z4J.n6I)].length)for(var e=e[(v7+w8+u3+r2J+B9X)],g=0,h=e.length;g<h;g++)a.error(e[g][i1X],e[g][t9I]);else e.error?a.error(e.error):!e[r2]||!e[(r2)][(S3I+w8)]?a.error(b[(g7X+o5I+Z4J.q2)],(U4X+W4J+Z4J.n6I+Q2+l9J+Z4J.o6I+W4J+Z4J.q2+Z4J.o6I+Z4J.o6I+Z4J.w1I+Z4J.o6I+W4J+Z4J.w1I+X0X+Z4J.R0I+U9X+Z4J.q2+w8+W4J+j0J+y3I+S3I+Z4J.z5I+Z4J.q2+W4J+Z4J.R0I+k6I+Z4J.z5I+h6+w8+B8J+W4J+Z4J.i0I+y3I+Z4J.q2+W4J+c8I+S3I+m0I)):(e[G0I]&&d[(e9I+y3I)](e[G0I],function(a,b){f[(J8J+B4)][a]=b;}
),i[(l2I+Z4J.n6I+y3I)](e[(s3J+Z4J.z5I+Z4J.w1I+Z4J.Y8+w8)][J1J]),w<c.length-1?(w++,k[(C3X+q6+Z4J.Y8+Z4J.i0I+I8)](c[w])):(l[(Z4J.V2+u7X)](a,i),z&&a[f0o]()));}
,error:function(){var O5J="rre";a.error(b[i1X],(U4X+W4J+Z4J.n6I+Q2+g0J+Q2+W4J+Z4J.q2+r2J+Z4J.o6I+W4J+Z4J.w1I+Z4J.V2+v5J+O5J+w8+W4J+j0J+h1I+m0I+W4J+Z4J.R0I+k6I+K8I+Z4J.Y8+H0J+Z4J.F1I+Z8I+W4J+Z4J.i0I+y3I+Z4J.q2+W4J+c8I+G6J+Z4J.q2));}
}
));}
;k[L4X](c[E0]);}
;f.prototype._constructor=function(a){var M2J="initComplete",W8J="trol",C3J="xhr",w5J="nT",O1J="init.dt.dte",R9X="body_content",c7="oo",a6J="form_content",F3="formC",M0="events",m6I="reat",S2I="TableTools",E1J='but',y5I='fo',o2X='_i',D9J='orm',z2J='error',L4='_co',q9='rm',z1X="ter",V9J="footer",K8J='oo',k0I='nt',H1I='conte',b3X='ody',t7I='rocess',c9J="legacyAjax",z7I="rmOption",V2J="dataSources",Z6="Url",Y0="domTab",y7="dels";a=d[H3I](!E0,{}
,f[A2],a);this[Z4J.n6I]=d[(X0J+w8)](!E0,{}
,f[(Z8J+y7)][(Z4J.n6I+Z4J.A4+t1I+x3X)],{table:a[(Y0+m0I)]||a[(Z4J.i0I+Z4J.w2+Z4J.z5I+Z4J.q2)],dbTable:a[m3]||c3X,ajaxUrl:a[(Z4J.Y8+Y9I+Z6)],ajax:a[(Z4J.Y8+Y9I)],idSrc:a[(S3I+w8+R0+Z4J.o6I+Z4J.V2)],dataSource:a[(w8+S7+W+l3)]||a[Q2X]?f[V2J][g9]:f[V2J][z6I],formOptions:a[(s8+z7I+Z4J.n6I)],legacyAjax:a[c9J]}
);this[(Q4J+Z4J.Y8+t8+Z4J.q2+Z4J.n6I)]=d[(Z4J.q2+z0J+Z4J.i0I+Z4J.q2+Z4J.F1I+w8)](!E0,{}
,f[(Q4J+L1+Z4J.q2+Z4J.n6I)]);this[(D1X+Z4J.F1I)]=a[(S3I+G5+Z4J.F1I)];var b=this,c=this[T4];this[(w8+S7)]={wrapper:d('<div class="'+c[(C9X+b4I+Z4J.o6I)]+(b0X+m2I+T7I+Y7J+q2X+m2I+q4I+c0X+q4I+m6+m2I+c0X+m8I+m6+m8I+i8X+H7J+t7I+T7I+v9I+P0J+k6J+B2I+t8J+n9J+n9J+i8X)+c[(G0J+t0+Z4J.q2+Z4J.n6I+C8)][(S3I+Z4J.F1I+w8+M3J+z1+u2)]+(Z1I+m2I+v3+B6I+m2I+v3+q2X+m2I+q4I+e3J+m6+m2I+c0X+m8I+m6+m8I+i8X+Z4I+b3X+k6J+B2I+Z2J+i8X)+c[Q5X][a3J]+(b0X+m2I+v3+q2X+m2I+j9J+m6+m2I+c0X+m8I+m6+m8I+i8X+Z4I+d9I+m2I+F2J+p4I+H1I+k0I+k6J+B2I+t8J+n9J+n9J+i8X)+c[(N8+i2X)][t0J]+(t3X+m2I+v3+B6I+m2I+T7I+Y7J+q2X+m2I+j9J+m6+m2I+c0X+m8I+m6+m8I+i8X+c2I+K8J+c0X+k6J+B2I+t8J+e0J+i8X)+c[V9J][(j0J+Z4J.o6I+e0+h1X)]+'"><div class="'+c[(c8I+Z4J.w1I+Z4J.w1I+z1X)][(Z4J.V2+Z4J.w1I+g3X+S9I)]+(t3X+m2I+v3+o9+m2I+v3+y2))[0],form:d((x5+c2I+d9I+q9+q2X+m2I+h1+q4I+m6+m2I+j2J+m6+m8I+i8X+c2I+Q6J+A9I+k6J+B2I+U9+n9J+i8X)+c[(y0o)][(Z4J.i0I+L9)]+(b0X+m2I+T7I+Y7J+q2X+m2I+q4I+e3J+m6+m2I+j2J+m6+m8I+i8X+c2I+Q6J+A9I+L4+v9I+j2J+v9I+c0X+k6J+B2I+U9+n9J+i8X)+c[y0o][t0J]+(t3X+c2I+Q6J+A9I+y2))[0],formError:d((x5+m2I+T7I+Y7J+q2X+m2I+q4I+c0X+q4I+m6+m2I+c0X+m8I+m6+m8I+i8X+c2I+d9I+q9+p4I+z2J+k6J+B2I+P7I+b6+n9J+i8X)+c[(c8I+Z4J.w1I+Z4J.o6I+o5I)].error+(I0J))[0],formInfo:d((x5+m2I+T7I+Y7J+q2X+m2I+q4I+c0X+q4I+m6+m2I+c0X+m8I+m6+m8I+i8X+c2I+D9J+o2X+v9I+y5I+k6J+B2I+P7I+o5X+i8X)+c[(s8+Z4J.o6I+o5I)][(S3I+l1X+Z4J.w1I)]+(I0J))[0],header:d('<div data-dte-e="head" class="'+c[J0I][(j0J+Z4J.o6I+e0+k6I+Z4J.q2+Z4J.o6I)]+(b0X+m2I+T7I+Y7J+q2X+B2I+Z2J+i8X)+c[J0I][(f2J+Z4J.F1I+I6I+g3X)]+(t3X+m2I+v3+y2))[0],buttons:d((x5+m2I+v3+q2X+m2I+j9J+m6+m2I+c0X+m8I+m6+m8I+i8X+c2I+D9J+p4I+E1J+Z0X+v9I+n9J+k6J+B2I+t8J+n9J+n9J+i8X)+c[(y0o)][w4]+'"/>')[0]}
;if(d[(c8I+Z4J.F1I)][(w8+Z4J.Y8+B7+X6+G1I+Z4J.q2)][(W+N8+m0I+X6+Z4J.w1I+s3)]){var e=d[(c8I+Z4J.F1I)][g9][S2I][A5X],l=this[(D7I+B0o+Z4J.F1I)];d[(s8X)]([(Z4J.V2+m6I+Z4J.q2),R0J,(Z4J.o6I+Z4J.q2+F2X)],function(a,b){var r7X="sButtonText";e[(u9+Z9X+x2J)+b][r7X]=l[b][g8];}
);}
d[(J5I+O9J)](a[(M0)],function(a,c){b[t7](a,function(){var l8I="shift",a=Array.prototype.slice.call(arguments);a[l8I]();c[(Z4J.Y8+N0J+n2J)](b,a);}
);}
);var c=this[(Z6J)],k=c[(j0J+k8I+k6I+Q2)];c[(F3+t7+N5X+Z4J.i0I)]=t(a6J,c[(c8I+Z4J.w1I+t6X)])[E0];c[(c8I+c7+Z4J.i0I+Z4J.q2+Z4J.o6I)]=t(S1J,k)[E0];c[Q5X]=t((N8+Z4J.w1I+w8+Z4J.g7I),k)[E0];c[J9J]=t(R9X,k)[E0];c[(G0J+t0+Z4J.q2+t8+Y0o+Z8I)]=t((k6I+Z4J.o6I+t0+Z4J.q2+Z4J.n6I+n5+Z4J.F1I+Z8I),k)[E0];a[Y8I]&&this[(Z4J.Y8+N9I)](a[Y8I]);d(q)[(Z4J.w1I+Z4J.F1I)](O1J,function(a,c){b[Z4J.n6I][Q2X]&&c[(w5J+Z4J.Y8+N8+Z4J.z5I+Z4J.q2)]===d(b[Z4J.n6I][(Z4J.i0I+Z4J.Y8+B2X+Z4J.q2)])[(n6+Z4J.i0I)](E0)&&(c[(F4+u9+S3I+D6J)]=b);}
)[(Z4J.w1I+Z4J.F1I)]((C3J+Z4J.l0X+w8+Z4J.i0I),function(a,c,e){e&&(b[Z4J.n6I][(Z4J.i0I+Z4J.Y8+N8+Z4J.z5I+Z4J.q2)]&&c[(w5J+Z4J.w2+m0I)]===d(b[Z4J.n6I][(Z4J.i0I+Z4J.Y8+l3)])[R5](E0))&&b[(L6J+Q8I+J5X+D7+k6I+w8+Z4J.Y8+Z4J.i0I+Z4J.q2)](e);}
);this[Z4J.n6I][(H0J+A9X+y3+G4X+Z4J.w1I+Z4J.F1I+W8J+Z4J.z5I+Z4J.q2+Z4J.o6I)]=f[(w8+S3I+A9X+Z4J.Y8+Z4J.g7I)][a[(w8+r9X+k6I+Z4J.z5I+Z4J.Y8+Z4J.g7I)]][(S3I+Z4J.F1I+S3I+Z4J.i0I)](this);this[i2](M2J,[]);}
;f.prototype._actionClass=function(){var L6X="oin",W9X="eCl",T6I="actions",a=this[T4][T6I],b=this[Z4J.n6I][(d9X+t7)],c=d(this[(w8+S7)][a3J]);c[(Z4J.o6I+i2J+g0J+W9X+Z4J.Y8+t8)]([a[d0I],a[R0J],a[(Z4J.o6I+u9X)]][(Z4J.i5I+L6X)](W4J));d0I===b?c[d8J](a[(m3J+R5I+Z4J.q2)]):(Z4J.q2+w8+Z9X)===b?c[d8J](a[(Z4J.q2+o6)]):(Z4J.o6I+Q8+Z4J.w1I+l9J)===b&&c[(Z4J.Y8+w8+w8+X7J+Z1+Z4J.n6I)](a[(J8I+a0X)]);}
;f.prototype._ajax=function(a,b,c){var B4J="param",J2I="rep",d1J="url",H7="Of",q8I="indexOf",c7J="axUr",H8X="ction",d3X="sF",s6X="lain",a8X="idS",U3I="ajaxUrl",G3="so",b0="PO",e={type:(b0+R0+X6),dataType:(Z4J.i5I+G3+Z4J.F1I),data:null,error:c,success:function(a,c,e){var A7I="statu";204===e[(A7I+Z4J.n6I)]&&(a={}
);b(a);}
}
,l;l=this[Z4J.n6I][V8J];var f=this[Z4J.n6I][(Z4J.Y8+Z4J.i5I+F5)]||this[Z4J.n6I][U3I],g=(R0J)===l||(Z4J.o6I+Z4J.q2+F2X)===l?y(this[Z4J.n6I][(Z4J.q2+H0J+Z4J.i0I+O6+Z4J.q2+Z0I+Z4J.n6I)],(a8X+k5X)):null;d[(S3I+Z4J.n6I+U4X+W1I)](g)&&(g=g[W6I](","));d[(S3I+x7X+s6X+s1+N8+A2J+Z4J.i0I)](f)&&f[l]&&(f=f[l]);if(d[(S3I+d3X+Z4J.R0I+Z4J.F1I+H8X)](f)){var h=null,e=null;if(this[Z4J.n6I][U3I]){var J=this[Z4J.n6I][(Y7+c7J+Z4J.z5I)];J[(Z4J.V2+Z4J.o6I+Z4J.q2+z1+Z4J.q2)]&&(h=J[l]);-1!==h[q8I](" ")&&(l=h[z5X](" "),e=l[0],h=l[1]);h=h[(S7X)](/_id_/,g);}
f(e,h,a,b,c);}
else "string"===typeof f?-1!==f[(S3I+F9X+p5+H7)](" ")?(l=f[(H2+r7)](" "),e[(O4I+g6I)]=l[0],e[(Z4J.R0I+G6X)]=l[1]):e[(Z4J.R0I+Z4J.o6I+Z4J.z5I)]=f:e=d[(X0J+w8)]({}
,e,f||{}
),e[(Z4J.R0I+G6X)]=e[d1J][(J2I+Z4J.z5I+Z4J.Y8+Z9J)](/_id_/,g),e.data&&(c=d[(S3I+Z4J.n6I+X5+M7X+p9X+Z4J.F1I)](e.data)?e.data(a):e.data,a=d[(S3I+Z4J.n6I+o3+Z4J.R0I+Z4J.F1I+Z4J.V2+Z4J.i0I+Q7X+Z4J.F1I)](e.data)&&c?c:d[(Z4J.q2+z0J+I6I+Z4J.F1I+w8)](!0,a,c)),e.data=a,"DELETE"===e[(Z4J.i0I+O7X+Z4J.q2)]&&(a=d[B4J](e.data),e[(Z4J.R0I+G6X)]+=-1===e[(d1J)][(S3I+Z4J.F1I+y9I+z0J+H7)]("?")?"?"+a:"&"+a,delete  e.data),d[(Z4J.Y8+Z4J.i5I+Z4J.Y8+z0J)](e);}
;f.prototype._assembleMain=function(){var a=this[(Z4J.x4I+o5I)];d(a[a3J])[(S6X+Z4J.q2+Z4J.F1I+w8)](a[(W7X+y9I+Z4J.o6I)]);d(a[(S1J+Q2)])[(Z4J.Y8+N0J+q8+w8)](a[M6X])[w1X](a[(N8+n4J+H5)]);d(a[J9J])[w1X](a[i0X])[w1X](a[(s8+t6X)]);}
;f.prototype._blur=function(){var o4I="eBlur",a=this[Z4J.n6I][M9];!N0!==this[(N9J+g0J+Z4J.q2+g3X)]((k6I+Z4J.o6I+o4I))&&((Z4J.n6I+u0J+P)===a[z5]?this[(Z4J.n6I+Z4J.R0I+N8+P)]():d5I===a[z5]&&this[w3X]());}
;f.prototype._clearDynamicInfo=function(){var f7J="eCla",a=this[T4][(c8I+e6J+Z4J.z5I+w8)].error,b=this[Z4J.n6I][Y8I];d("div."+a,this[Z6J][(j0J+k8I+h1X)])[(Z4J.o6I+Z4J.q2+o5I+Z4J.w1I+g0J+f7J+t8)](a);d[s8X](b,function(a,b){b.error("")[r8I]("");}
);this.error("")[(o5I+Z4J.q2+Z4J.n6I+Z4J.n6I+Z4J.Y8+Z8I+Z4J.q2)]("");}
;f.prototype._close=function(a){var u5X="closeIcb",h0o="eIcb",J3X="seC",d8I="closeC",F5I="preClose";!N0!==this[(G9+Z4J.i0I)](F5I)&&(this[Z4J.n6I][T0o]&&(this[Z4J.n6I][(d8I+N8)](a),this[Z4J.n6I][(Z4J.V2+Z4J.z5I+Z4J.w1I+J3X+N8)]=c3X),this[Z4J.n6I][(Z4J.V2+Z4J.z5I+Z4J.w1I+Z4J.n6I+h0o)]&&(this[Z4J.n6I][u5X](),this[Z4J.n6I][u5X]=c3X),d(Q5X)[(d6+c8I)]((c8I+Z4J.w1I+Z4J.V2+Z4J.R0I+Z4J.n6I+Z4J.l0X+Z4J.q2+w8+n2I+F6X+c8I+P2+Z4J.n6I)),this[Z4J.n6I][R8J]=!N0,this[i2]((r0J+u1)));}
;f.prototype._closeReg=function(a){this[Z4J.n6I][T0o]=a;}
;f.prototype._crudArgs=function(a,b,c,e){var V3J="ain",G7X="mOp",Q6="oolea",G2I="Obj",l=this,f,g,i;d[(r9X+i1+Z4J.z5I+Z4J.Y8+Y0o+G2I+K3X)](a)||((N8+Q6+Z4J.F1I)===typeof a?(i=a,a=b):(f=a,g=b,i=c,a=e));i===h&&(i=!E0);f&&l[(t1I+D3I)](f);g&&l[(N8+n4J+Z4J.i0I+t7+Z4J.n6I)](g);return {opts:d[H3I]({}
,this[Z4J.n6I][(a8I+G7X+Z4J.i0I+Q7X+Z4J.F1I+Z4J.n6I)][(o5I+V3J)],a),maybeOpen:function(){i&&l[(Z4J.w1I+A6X)]();}
}
;}
;f.prototype._dataSource=function(a){var u6X="apply",H7X="dataSource",t4="ift",b=Array.prototype.slice.call(arguments);b[(w5+t4)]();var c=this[Z4J.n6I][H7X][a];if(c)return c[u6X](this,b);}
;f.prototype._displayReorder=function(a){var S1="layed",M8="Or",O4="det",K6X="hildr",K0o="includeFields",d9="eFi",B7J="nclud",E1X="formCon",b=d(this[(w8+Z4J.w1I+o5I)][(E1X+Z4J.i0I+Z4J.q2+g3X)]),c=this[Z4J.n6I][(b9+Z4J.q2+Z0I+Z4J.n6I)],e=this[Z4J.n6I][q0X];a?this[Z4J.n6I][(S3I+B7J+d9+w7+w5I)]=a:a=this[Z4J.n6I][K0o];b[(Z4J.V2+K6X+Z4J.q2+Z4J.F1I)]()[(O4+N4+y3I)]();d[s8X](e,function(e,k){var g=k instanceof f[(v1X+Z0I)]?k[(Z4J.F1I+Z4J.Y8+A1J)]():k;-N0!==d[a4](g,a)&&b[w1X](c[g][(Z4J.F1I+Z4J.w1I+y9I)]());}
);this[(F4+Z4J.q2+g0J+q8+Z4J.i0I)]((w8+r9X+E0I+M8+y9I+Z4J.o6I),[this[Z4J.n6I][(w8+r9X+k6I+S1)],this[Z4J.n6I][(N4+Z4J.i0I+Q7X+Z4J.F1I)],b]);}
;f.prototype._edit=function(a,b,c){var j5="ock",b9X="tyl",k8J="modifi",e=this[Z4J.n6I][(c8I+S3I+Z4J.q2+Z4J.z5I+w8+Z4J.n6I)],l=[],f;this[Z4J.n6I][Z3J]=b;this[Z4J.n6I][(k8J+Q2)]=a;this[Z4J.n6I][(Z4J.Y8+m1+Z4J.F1I)]="edit";this[Z6J][y0o][(Z4J.n6I+b9X+Z4J.q2)][p6J]=(N8+Z4J.z5I+j5);this[(F4+Z4J.Y8+i8J+s4+n1+Z4J.n6I)]();d[(Z4J.q2+K0J)](e,function(a,c){var t8I="pus",p7J="multiIds";c[(p6+t1I+v0+Z4J.q2+u1+Z4J.i0I)]();f=!0;d[s8X](b,function(b,e){var W7J="lFrom";if(e[(b9+w7+w5I)][a]){var d=c[(e7J+W7J+N8J+Z4J.i0I+Z4J.Y8)](e.data);c[C2J](b,d!==h?d:c[(D1I)]());e[y0X]&&!e[y0X][a]&&(f=!1);}
}
);0!==c[p7J]().length&&f&&l[(t8I+y3I)](a);}
);for(var e=this[(i5X+Z4J.o6I)]()[u4I](),g=e.length;0<=g;g--)-1===d[a4](e[g],l)&&e[(Z4J.n6I+k6I+Z4J.z5I+S3I+Z9J)](g,1);this[L3J](e);this[Z4J.n6I][X5J]=d[H3I](!0,{}
,this[d4I]());this[(G9+Z4J.i0I)]("initEdit",[y(b,"node")[0],y(b,"data")[0],a,c]);this[(R0o+q8+Z4J.i0I)]((S3I+N1X+Z4J.i0I+R3J+Z4J.z5I+Z4J.i0I+S3I+x7J+Z9X),[b,a,c]);}
;f.prototype._event=function(a,b){var n5X="result",l7J="Event";b||(b=[]);if(d[(S3I+T8X+U9X+y3)](a))for(var c=0,e=a.length;c<e;c++)this[(F4+c5+q8+Z4J.i0I)](a[c],b);else return c=d[l7J](a),d(this)[g4I](c,b),c[n5X];}
;f.prototype._eventName=function(a){var r8X="substri",n9I="ase",e4="wer",p6X="oL";for(var b=a[(A9X+S3I+Z4J.i0I)](" "),c=0,e=b.length;c<e;c++){var a=b[c],d=a[(o5I+z1+O9J)](/^on([A-Z])/);d&&(a=d[1][(Z4J.i0I+p6X+Z4J.w1I+e4+G4X+n9I)]()+a[(r8X+Z4J.F1I+Z8I)](3));b[c]=a;}
return b[W6I](" ");}
;f.prototype._fieldNames=function(a){return a===h?this[(c8I+s0J+w5I)]():!d[S8](a)?[a]:a;}
;f.prototype._focus=function(a,b){var F7I="foc",s6I="setFocus",a2="jq",c=this,e,l=d[(o5I+Z4J.Y8+k6I)](a,function(a){var e1X="ri";return (x8+e1X+M5X)===typeof a?c[Z4J.n6I][(b9+Q9X+Z4J.n6I)][a]:a;}
);y9X===typeof b?e=l[b]:b&&(e=E0===b[(h5J+Z4J.q2+z0J+s1+c8I)]((a2+J0o))?d((I1+Z4J.l0X+j3+X6+u3+W4J)+b[(C3X+k6I+Z4J.z5I+N4+Z4J.q2)](/^jq:/,g0I)):this[Z4J.n6I][(c8I+S3I+Z4J.q2+Z0I+Z4J.n6I)][b]);(this[Z4J.n6I][s6I]=e)&&e[(F7I+Z4J.R0I+Z4J.n6I)]();}
;f.prototype._formOptions=function(a){var k5="oseIc",y6J="olean",V8X="titl",a4I="nBa",T7="blurOnBackground",P9I="Retu",s5J="nR",t4J="eturn",R5X="submitOnBlur",g6X="itO",k1X="closeOnComplete",K4I="Com",D0="On",q5="Inlin",b=this,c=N++,e=(Z4J.l0X+w8+Z4J.i0I+Z4J.q2+q5+Z4J.q2)+c;a[(Z4J.V2+h9J+Z4J.q2+D0+K4I+M7I+Z4J.q2+I6I)]!==h&&(a[Q4]=a[k1X]?d5I:D9I);a[(V4+N8+o5I+g6X+Z4J.F1I+y4X+Z4J.z5I+g5J)]!==h&&(a[z5]=a[R5X]?(Z4J.n6I+Z4J.R0I+l6X):d5I);a[(V4+l6X+s1+Z4J.F1I+v0+t4J)]!==h&&(a[(Z4J.w1I+s5J+t4J)]=a[(V3I+Z9X+D0+P9I+Z4J.o6I+Z4J.F1I)]?f0o:D9I);a[T7]!==h&&(a[(Z4J.w1I+a4I+z9J+R3X+O3J+w8)]=a[(N8+U4J+Z4J.o6I+D0+y4X+Z4J.Y8+Z4J.V2+n7I+Z4J.w1I+O3J+w8)]?T6:(w0I+Z4J.q2));this[Z4J.n6I][(u9+g6X+Q8I+Z4J.n6I)]=a;this[Z4J.n6I][b5X]=c;if((x8+M8J)===typeof a[j2]||(c8I+O3J+Z4J.V2+Z4J.i0I+Q7X+Z4J.F1I)===typeof a[j2])this[(V8X+Z4J.q2)](a[(t1I+q3I+Z4J.q2)]),a[(Z4J.i0I+Z9X+m0I)]=!E0;if((x8+Z4J.o6I+Y0o+Z8I)===typeof a[r8I]||Z4J.T5J===typeof a[r8I])this[r8I](a[r8I]),a[r8I]=!E0;(G8X+y6J)!==typeof a[(L5X+Z4J.i0I+H5)]&&(this[(N8+P2X+Z4J.w1I+Z4J.F1I+Z4J.n6I)](a[(L5X+B9I+Z4J.n6I)]),a[(L5X+E2I+Z4J.w1I+Z4J.F1I+Z4J.n6I)]=!E0);d(q)[(Z4J.w1I+Z4J.F1I)]("keydown"+e,function(c){var e5J="keyCo",a8J="pre",r0X="TE_For",W9J="are",p3I="onEsc",o2="entDe",U0J="nRet",g3="toLowerCase",C6I="lem",Q0X="tiveE",e=d(q[(Z4J.Y8+Z4J.V2+Q0X+C6I+q8+Z4J.i0I)]),f=e.length?e[0][L0o][g3]():null;d(e)[(Z4J.Y8+E2I+Z4J.o6I)]((y2J));if(b[Z4J.n6I][(H0J+Z4J.n6I+M7I+Z4J.Y8+j1+w8)]&&a[(Z4J.w1I+U0J+g5J+Z4J.F1I)]==="submit"&&c[D2J]===13&&f===(X4X+n4J)){c[(k6I+Z4J.o6I+Z4J.q2+g0J+o2+c8I+b7X)]();b[f0o]();}
else if(c[D2J]===27){c[F1]();switch(a[p3I]){case (B2X+Z4J.R0I+Z4J.o6I):b[(B2X+Z4J.R0I+Z4J.o6I)]();break;case (Z4J.V2+Z4J.z5I+j6):b[(Q4J+j6)]();break;case "submit":b[(V4+N8+o5I+S3I+Z4J.i0I)]();}
}
else e[(k6I+W9J+Z4J.F1I+Z4J.i0I+Z4J.n6I)]((Z4J.l0X+j3+r0X+o5I+b5I+u3X)).length&&(c[D2J]===37?e[(a8J+g0J)]((u0o+Z4J.i0I+t7))[(s8+Z4J.V2+Z4J.R0I+Z4J.n6I)]():c[(e5J+w8+Z4J.q2)]===39&&e[(c6X)]("button")[(O6I)]());}
);this[Z4J.n6I][(Z4J.V2+Z4J.z5I+k5+N8)]=function(){d(q)[(Z4J.w1I+f4)]((u3I+Z4J.q2+Z4J.g7I+Z4J.x4I+j0J+Z4J.F1I)+e);}
;return e;}
;f.prototype._legacyAjax=function(a,b,c){var A9="Aj",y9="gac";if(this[Z4J.n6I][(m0I+y9+Z4J.g7I+A9+Z4J.Y8+z0J)])if((Z4J.n6I+Z4J.q2+Z4J.F1I+w8)===a)if(d0I===b||(Z4J.q2+o6)===b){var e;d[(Z4J.q2+N4+y3I)](c.data,function(a){var f6J="cy",y3X="uppor";if(e!==h)throw (t6+u2+n4I+g6+i0J+F6X+Z4J.o6I+O2+W4J+Z4J.q2+w8+X3+Z4J.F1I+Z8I+W4J+S3I+Z4J.n6I+W4J+Z4J.F1I+T8+W4J+Z4J.n6I+y3X+I6I+w8+W4J+N8+Z4J.g7I+W4J+Z4J.i0I+y3I+Z4J.q2+W4J+Z4J.z5I+Z4J.q2+Z8I+Z4J.Y8+f6J+W4J+U4X+Y9I+W4J+w8+Z4J.Y8+B7+W4J+c8I+Z4J.w1I+Z4J.o6I+A9J+Z4J.i0I);e=a;}
);c.data=c.data[e];(R0J)===b&&(c[(S3I+w8)]=e);}
else c[J1J]=d[(o5I+e0)](c.data,function(a,b){return b;}
),delete  c.data;else c.data=!c.data&&c[o1]?[c[(k7X+j0J)]]:[];}
;f.prototype._optionsUpdate=function(a){var b=this;a[(Z4J.w1I+k6I+Z4J.i0I+S3I+Z4J.w1I+h3X)]&&d[(J5I+O9J)](this[Z4J.n6I][Y8I],function(c){if(a[(V7+Z4J.i0I+S3I+Z4J.w1I+Z4J.F1I+Z4J.n6I)][c]!==h){var e=b[(b9+Q9X)](c);e&&e[j5J]&&e[(Z4J.R0I+k6I+Z4J.C6J+I6I)](a[V6X][c]);}
}
);}
;f.prototype._message=function(a,b){var O9X="tabl";Z4J.T5J===typeof b&&(b=b(this,new r[m7J](this[Z4J.n6I][(O9X+Z4J.q2)])));a=d(a);!b&&this[Z4J.n6I][R8J]?a[(Z4J.n6I+Z4J.i0I+Z4J.w1I+k6I)]()[O7I](function(){a[(E4J+t3J)](g0I);}
):b?this[Z4J.n6I][R8J]?a[l8X]()[(y3I+f6)](b)[(c8I+Z4J.Y8+w8+Z4J.q2+s3X)]():a[(h0J+Z4J.z5I)](b)[(Z4J.V2+t8)]((w8+N9X+Z4J.g7I),(N8+Z4J.z5I+Z4J.w1I+z9J)):a[(y3I+Z4J.i0I+o5I+Z4J.z5I)](g0I)[v3J]((S0+M7I+Z4J.Y8+Z4J.g7I),(D9I));}
;f.prototype._multiInfo=function(){var U7="oSh",t1X="ields",a=this[Z4J.n6I][(c8I+S3I+Z4J.q2+Z4J.z5I+w5I)],b=this[Z4J.n6I][(Y0o+Z4J.V2+Z4J.z5I+Z4J.R0I+w8+Z4J.q2+o3+t1X)],c=!0;if(b)for(var e=0,d=b.length;e<d;e++)a[b[e]][q7X]()&&c?(a[b[e]][(p6+t1I+x1+Z4J.F1I+c8I+Z4J.w1I+x4+o0I)](c),c=!1):a[b[e]][(o5I+g8J+Z4J.i0I+I7J+c8I+U7+Z4J.w1I+g9I)](!1);}
;f.prototype._postopen=function(a){var q1I="iI",K0X="_mul",s2="focus.editor-focus",a9X="ernal",w9J="submit.editor-internal",E5X="Focus",U6="oll",b=this,c=this[Z4J.n6I][(p6J+G4X+Z4J.w1I+Z4J.F1I+U8I+U6+Q2)][(L7J+Q8I+g5J+Z4J.q2+E5X)];c===h&&(c=!E0);d(this[(w8+S7)][(s8+t6X)])[t9J](w9J)[(Z4J.w1I+Z4J.F1I)]((Z4J.n6I+u0J+o5I+Z9X+Z4J.l0X+Z4J.q2+w8+S3I+Q3I+Z4J.o6I+F6X+S3I+Z4J.F1I+Z4J.i0I+a9X),function(a){a[F1]();}
);if(c&&(e2J===a||(L5X+e6)===a))d(Q5X)[t7](s2,function(){var o7="setF",w9I="Foc",h0="iveEl",g7J="veElem";0===d(q[(d9X+g7J+Z4J.q2+Z4J.F1I+Z4J.i0I)])[(k6I+Z4J.Y8+Z4J.o6I+S9I+Z4J.n6I)]((Z4J.l0X+j3+X6+u3)).length&&0===d(q[(M1J+h0+Z4J.q2+o5I+q8+Z4J.i0I)])[p7I](".DTED").length&&b[Z4J.n6I][(Z4J.n6I+Z4J.q2+Z4J.i0I+w9I+q5J)]&&b[Z4J.n6I][(o7+P2+Z4J.n6I)][O6I]();}
);this[(K0X+Z4J.i0I+q1I+Z4J.F1I+c8I+Z4J.w1I)]();this[i2]((Z4J.w1I+A6X),[a,this[Z4J.n6I][(d9X+Z4J.w1I+Z4J.F1I)]]);return !E0;}
;f.prototype._preopen=function(a){var Z8="mic",O2X="arDyna";if(!N0===this[i2]((G0J+Z4J.q2+s1+k6I+Z4J.q2+Z4J.F1I),[a,this[Z4J.n6I][(M1J+s4)]]))return this[(W4I+Z4J.q2+O2X+Z8+x1+l1X+Z4J.w1I)](),!N0;this[Z4J.n6I][R8J]=a;return !E0;}
;f.prototype._processing=function(a){var c6="oce",p4="div.DTE",u8X="veC",Q1I="dCla",N4I="active",b=d(this[(w8+Z4J.w1I+o5I)][(i4I+Z4J.Y8+b4I+Z4J.o6I)]),c=this[(w8+S7)][y2X][e1J],e=this[T4][(p4J+N8I+B8J)][N4I];a?(c[p6J]=h3J,b[(b4+w8+G4X+Z4J.z5I+L1)](e),d((w8+P9X+Z4J.l0X+j3+X6+u3))[(b4+Q1I+t8)](e)):(c[p6J]=(o8X+Z4J.F1I+Z4J.q2),b[(Z4J.o6I+Z4J.q2+Z8J+u8X+Z4J.z5I+Z4J.Y8+t8)](e),d(p4)[R](e));this[Z4J.n6I][(G0J+Z4J.w1I+Z9J+Z4J.n6I+l6J+Z8I)]=a;this[i2]((k6I+Z4J.o6I+c6+t8+S3I+M5X),[a]);}
;f.prototype._submit=function(a,b,c,e){var v5X="_ajax",m7="_proces",O0="eSubm",A8J="acy",n3X="plet",a6X="_proce",o8="nge",F6I="llIfC",I9I="aF",q9X="ctD",J9I="_fnSetObje",f=this,k,g=!1,i={}
,n={}
,u=r[(Z4J.q2+z0J+Z4J.i0I)][k0J][(J9I+q9X+z1+I9I+Z4J.F1I)],m=this[Z4J.n6I][Y8I],j=this[Z4J.n6I][V8J],p=this[Z4J.n6I][b5X],o=this[Z4J.n6I][z4X],q=this[Z4J.n6I][(Z4J.q2+H0J+Z4J.i0I+O6+v1J)],s=this[Z4J.n6I][X5J],t=this[Z4J.n6I][M9],v=t[f0o],x={action:this[Z4J.n6I][V8J],data:{}
}
,y;this[Z4J.n6I][(m3)]&&(x[Q2X]=this[Z4J.n6I][(w8+N8+W+l3)]);if((Z4J.V2+Z4J.o6I+J5I+I6I)===j||"edit"===j)if(d[s8X](q,function(a,b){var U8J="mp",c={}
,e={}
;d[(J5I+O9J)](m,function(f,l){var w1="ny";if(b[(c8I+m1J+Z4J.n6I)][f]){var k=l[d4I](a),h=u(f),i=d[S8](k)&&f[(S3I+F9X+Z4J.q2+z0J+s1+c8I)]("[]")!==-1?u(f[(Z4J.o6I+Z4J.q2+k6I+l7I+Z4J.V2+Z4J.q2)](/\[.*$/,"")+(F6X+o5I+Z4J.Y8+w1+F6X+Z4J.V2+y4+g3X)):null;h(c,k);i&&i(c,k.length);if(j===(R0J)&&k!==s[f][a]){h(e,k);g=true;i&&i(e,k.length);}
}
}
);d[(S3I+r3X+o5I+k6I+O4I+s1+N8+Z4J.i5I+Z4J.V1I+Z4J.i0I)](c)||(i[a]=c);d[(S3I+r3X+U8J+O4I+s1+w3J+i8J)](e)||(n[a]=e);}
),"create"===j||"all"===v||(Z4J.Y8+F6I+y3I+Z4J.Y8+o8+w8)===v&&g)x.data=i;else if("changed"===v&&g)x.data=n;else{this[Z4J.n6I][V8J]=null;(Z4J.V2+K8I+u1)===t[Q4]&&(e===h||e)&&this[w3X](!1);a&&a[L5I](this);this[(a6X+Z4J.n6I+Z4J.n6I+B8J)](!1);this[(N9J+l9J+g3X)]((Z4J.n6I+F7X+C0+S7+n3X+Z4J.q2));return ;}
else(Z4J.o6I+Q8+a0X)===j&&d[(Z4J.q2+Z4J.Y8+Z4J.V2+y3I)](q,function(a,b){x.data[a]=b.data;}
);this[(T1J+P7+A8J+U4X+Y9I)]((Z4J.n6I+Z4J.q2+Z4J.F1I+w8),j,x);y=d[H3I](!0,{}
,x);c&&c(x);!1===this[i2]((k6I+Z4J.o6I+O0+Z9X),[x,j])?this[(m7+Z4J.n6I+S3I+M5X)](!1):this[v5X](x,function(c){var L2="Coun",q9J="ommi",p6I="aS",n5I="even",G0o="event",d7X="Sou",F8J="urc",S3X="eCr",W5X="taS",D1="Error",o9I="Errors",M5="acyAj",g;f[(F4+m0I+Z8I+M5+Z4J.Y8+z0J)]("receive",j,c);f[i2]((E7I+x8+R0+u0J+o5I+S3I+Z4J.i0I),[c,x,j]);if(!c.error)c.error="";if(!c[(b9+Z4J.q2+Z4J.z5I+w8+L8X+k7X+B9X)])c[z0o]=[];if(c.error||c[(g5I+o9I)].length){f.error(c.error);d[(Z4J.q2+K0J)](c[(b9+Z4J.q2+Z4J.z5I+w8+D1+Z4J.n6I)],function(a,b){var r1I="yC",c=m[b[(Z4J.F1I+Z4J.Y8+A1J)]];c.error(b[t9I]||(u3+Z4J.o6I+Z4J.o6I+u2));if(a===0){d(f[Z6J][(N8+Z4J.w1I+w8+r1I+Z4J.w1I+Z4J.F1I+I6I+Z4J.F1I+Z4J.i0I)],f[Z4J.n6I][a3J])[h2J]({scrollTop:d(c[o0o]()).position().top}
,500);c[O6I]();}
}
);b&&b[(Z4J.V2+Z4J.Y8+Z4J.z5I+Z4J.z5I)](f,c);}
else{var i={}
;f[(F4+w8+Z4J.Y8+W5X+Z4J.w1I+g5J+Z4J.V2+Z4J.q2)]("prep",j,o,y,c.data,i);if(j===(m3J+Z4J.q2+Z4J.Y8+Z4J.i0I+Z4J.q2)||j==="edit")for(k=0;k<c.data.length;k++){g=c.data[k];f[(R0o+q8+Z4J.i0I)]("setData",[c,g,j]);if(j==="create"){f[(F4+c5+Z4J.q2+Z4J.F1I+Z4J.i0I)]((G0J+S3X+R5I+Z4J.q2),[c,g]);f[(F4+w8+Z4J.Y8+Z4J.i0I+Z4J.Y8+b8+F8J+Z4J.q2)]((Z4J.V2+Z4J.o6I+Z4J.q2+z1+Z4J.q2),m,g,i);f[(F4+c5+Z4J.q2+Z4J.F1I+Z4J.i0I)]([(Z4J.V2+Z4J.o6I+Z4J.q2+z1+Z4J.q2),"postCreate"],[c,g]);}
else if(j==="edit"){f[i2]((k6I+C3X+x7J+S3I+Z4J.i0I),[c,g]);f[(F4+w8+Z4J.Y8+B7+d7X+k5X+Z4J.q2)]((Z4J.q2+w8+S3I+Z4J.i0I),o,m,g,i);f[i2](["edit",(k6I+F8+Z4J.i0I+x7J+Z9X)],[c,g]);}
}
else if(j==="remove"){f[(F4+G0o)]("preRemove",[c]);f[e9]("remove",o,m,i);f[(F4+n5I+Z4J.i0I)](["remove",(k6I+Z4J.w1I+x8+v0+Q8+I4+Z4J.q2)],[c]);}
f[(F0X+z1+p6I+Z4J.w1I+Z4J.R0I+h8X)]((Z4J.V2+q9J+Z4J.i0I),j,o,c.data,i);if(p===f[Z4J.n6I][(Z4J.q2+w8+Z9X+L2+Z4J.i0I)]){f[Z4J.n6I][(d9X+t7)]=null;t[(Z4J.w1I+Z4J.F1I+N7J+o5I+n3X+Z4J.q2)]==="close"&&(e===h||e)&&f[(G0X+Z4J.z5I+j6)](true);}
a&&a[L5I](f,c);f[(F4+n5I+Z4J.i0I)]((Z4J.n6I+Z4J.R0I+v2X+S3I+Z4J.i0I+R0+Z4J.R0I+Z4J.V2+Z4J.V2+Z4J.q2+Z4J.n6I+Z4J.n6I),[c,g]);}
f[(F4+p4J+Y2J+l6J+Z8I)](false);f[i2]((V4+N8+P+N7J+o5I+M7I+Y0X),[c,g]);}
,function(a,c,e){var F0o="lete",n4X="itC",a5X="system";f[(R0o+q8+Z4J.i0I)]("postSubmit",[a,c,e,x]);f.error(f[k1I].error[a5X]);f[(j6J+k7X+N8I+S3I+M5X)](false);b&&b[(L7J+q5I)](f,a,c,e);f[(R0o+S9I)](["submitError",(Z4+o5I+n4X+Z4J.w1I+o5I+k6I+F0o)],[a,c,e,x]);}
);}
;f.prototype._tidy=function(a){var m4="lur",R4="bbl",P8I="omple",u8J="bmitC",Q7="roces",H8J="Sid",L9I="Server",b=this,c=this[Z4J.n6I][(B7+N8+Z4J.z5I+Z4J.q2)]?new d[(c8I+Z4J.F1I)][(Z4J.C6J+Z4J.i0I+Z4J.Y8+X6+G1I+Z4J.q2)][(q1+S3I)](this[Z4J.n6I][Q2X]):c3X,e=!N0;c&&(e=c[R5J]()[E0][(Z4J.w1I+o3+J5I+Z4J.i0I+g5J+Z4J.q2+Z4J.n6I)][(N8+L9I+H8J+Z4J.q2)]);return this[Z4J.n6I][(k6I+Q7+Z4J.n6I+B8J)]?(this[j7J]((Z4J.n6I+Z4J.R0I+u8J+P8I+Z4J.i0I+Z4J.q2),function(){if(e)c[j7J](X4,a);else setTimeout(function(){a();}
,f2I);}
),!E0):(S3I+Z4J.F1I+Z4J.z5I+Y5J)===this[(w8+S3I+Z4J.n6I+E0I)]()||(L5X+R4+Z4J.q2)===this[p6J]()?(this[j7J]((Z4J.V2+Z4J.z5I+F8+Z4J.q2),function(){var p7="mitComple";if(b[Z4J.n6I][y2X])b[(t7+Z4J.q2)]((Z4J.n6I+u0J+p7+I6I),function(b,d){if(e&&d)c[(t7+Z4J.q2)]((L4I+j0J),a);else setTimeout(function(){a();}
,f2I);}
);else setTimeout(function(){a();}
,f2I);}
)[(N8+m4)](),!E0):!N0;}
;f[(w8+L8I+Z4J.R0I+S2J+Z4J.n6I)]={table:null,ajaxUrl:null,fields:[],display:(u1I+Z8I+y3I+c0I),ajax:null,idSrc:(j3+Q0+v0+Z4J.w1I+j0J+d0X),events:{}
,i18n:{create:{button:(E0o+j0J),title:(G4X+C3X+z1+Z4J.q2+W4J+Z4J.F1I+Z5+W4J+Z4J.q2+Z4J.F1I+O3I),submit:"Create"}
,edit:{button:"Edit",title:(u3+w8+Z9X+W4J+Z4J.q2+Z4J.F1I+O3I),submit:(g8X+Z4J.C6J+Z4J.i0I+Z4J.q2)}
,remove:{button:(S0J+b6X+Z4J.q2),title:"Delete",submit:(S0J+Z4J.z5I+Z4J.q2+I6I),confirm:{_:(X0+Z4J.q2+W4J+Z4J.g7I+y4+W4J+Z4J.n6I+Z4J.R0I+Z4J.o6I+Z4J.q2+W4J+Z4J.g7I+Z4J.w1I+Z4J.R0I+W4J+j0J+S3I+Z4J.n6I+y3I+W4J+Z4J.i0I+Z4J.w1I+W4J+w8+Z4J.q2+Z4J.z5I+Z4J.A4+Z4J.q2+l5+w8+W4J+Z4J.o6I+O2+Z4J.n6I+J2X),1:(O9I+W4J+Z4J.g7I+y4+W4J+Z4J.n6I+g5J+Z4J.q2+W4J+Z4J.g7I+y4+W4J+j0J+S3I+w5+W4J+Z4J.i0I+Z4J.w1I+W4J+w8+n6X+Z4J.q2+W4J+U1X+W4J+Z4J.o6I+Z4J.w1I+j0J+J2X)}
}
,error:{system:(D4+q2X+n9J+J4J+A9I+q2X+m8I+G9J+I3I+q2X+v0J+b6+q2X+d9I+B2I+D1J+U3J+z8X+q4I+q2X+c0X+L6+O7+i8X+p4I+M9X+v9I+b9I+k6J+v0J+G9J+N3+V0o+m2I+q4I+c0X+h1+m8J+A0+Y6+v9I+m8I+c0X+E6+c0X+v9I+E6+M1+c0+H6+R9+Q6J+m8I+q2X+T7I+D8+o1X+v9I+b0o+q4I+W0J)}
,multi:{title:(R3J+Z4J.z5I+Y5+Z4J.q2+W4J+g0J+e8),info:(A1+W4J+Z4J.n6I+Z4J.q2+m0I+Z4J.V2+U2X+W4J+S3I+Z4J.i0I+Z4J.q2+S5J+W4J+Z4J.V2+t7+B7+Y0o+W4J+w8+S3I+x0I+h8+W4J+g0J+X0I+O8+W4J+c8I+u2+W4J+Z4J.i0I+y3I+r9X+W4J+S3I+n8X+Z4J.R0I+Z4J.i0I+v2I+X6+Z4J.w1I+W4J+Z4J.q2+o6+W4J+Z4J.Y8+Z4J.F1I+w8+W4J+Z4J.n6I+Z4J.q2+Z4J.i0I+W4J+Z4J.Y8+Z4J.z5I+Z4J.z5I+W4J+S3I+I6I+o5I+Z4J.n6I+W4J+c8I+Z4J.w1I+Z4J.o6I+W4J+Z4J.i0I+y3I+S3I+Z4J.n6I+W4J+S3I+Z4J.F1I+W2I+W4J+Z4J.i0I+Z4J.w1I+W4J+Z4J.i0I+Q0I+W4J+Z4J.n6I+Z4J.Y8+o5I+Z4J.q2+W4J+g0J+B6X+Z4J.q2+p5X+Z4J.V2+q6I+W4J+Z4J.w1I+Z4J.o6I+W4J+Z4J.i0I+Z4J.Y8+k6I+W4J+y3I+Q2+Z4J.q2+p5X+Z4J.w1I+Z4J.i0I+y3I+Q2+j0J+r9X+Z4J.q2+W4J+Z4J.i0I+Q0I+Z4J.g7I+W4J+j0J+S3I+Z4J.z5I+Z4J.z5I+W4J+Z4J.o6I+i6I+S3I+Z4J.F1I+W4J+Z4J.i0I+y3I+Z4J.q2+s7X+W4J+S3I+Z4J.F1I+I1+S3I+W5I+Z4J.Y8+Z4J.z5I+W4J+g0J+B6X+B4+Z4J.l0X),restore:(D7+F9X+Z4J.w1I+W4J+Z4J.V2+y3I+Q+a5)}
,datetime:{previous:"Previous",next:(W1),months:(v8J+e1+W4J+o3+x6I+Z4J.o6I+e7I+Z4J.o6I+Z4J.g7I+W4J+g6+a4J+y3I+W4J+U4X+k6I+l2J+W4J+g6+Z4J.Y8+Z4J.g7I+W4J+r5+O3J+Z4J.q2+W4J+r5+V5I+W4J+U4X+Z4J.R0I+Z8I+q5J+Z4J.i0I+W4J+R0+M5I+N8+Z4J.q2+Z4J.o6I+W4J+s1+i8J+u0+Z4J.q2+Z4J.o6I+W4J+J1+a0X+P7J+Q2+W4J+j3+Z4J.q2+b9J+g9X+Z4J.o6I)[(H2+Z4J.z5I+Z9X)](" "),weekdays:(R0+O3J+W4J+g6+Z4J.w1I+Z4J.F1I+W4J+X6+N1J+W4J+j0I+Z4J.q2+w8+W4J+X6+l4J+W4J+o3+Z4J.o6I+S3I+W4J+R0+z1)[z5X](" "),amPm:["am",(Q9I)],unknown:"-"}
}
,formOptions:{bubble:d[(K8X+Z4J.F1I+w8)]({}
,f[(S4J+Z4J.q2+h4J)][(c8I+u2+p4X+S3I+Z4J.w1I+Z4J.F1I+Z4J.n6I)],{title:!1,message:!1,buttons:"_basic",submit:(O9J+Z4J.Y8+M5X+u9)}
),inline:d[(p5+N5X+w8)]({}
,f[(o5I+G1+Z4J.q2+h4J)][h3],{buttons:!1,submit:(v1+Z4J.F1I+i9)}
),main:d[H3I]({}
,f[(o5I+G1+Z4J.q2+Z4J.z5I+Z4J.n6I)][(c8I+u1X+s1+k6I+G5X+Z4J.n6I)])}
,legacyAjax:!1}
;var K=function(a,b,c){d[(s8X)](b,function(b,d){var N5="aSr",e3="Fr",f=d[(g0J+Z4J.Y8+Z4J.z5I+e3+S7+N8J+B7)](c);f!==h&&C(a,d[(w8+Z4J.Y8+Z4J.i0I+N5+Z4J.V2)]())[(s8X)](function(){var C4X="hild",c3I="childNodes";for(;this[c3I].length;)this[(Z4J.o6I+Z4J.q2+o5I+I4+X7I+C4X)](this[(b9+Z4J.o6I+Z4J.n6I+Z4J.i0I+G4X+w7X+w8)]);}
)[z6I](f);}
);}
,C=function(a,b){var J4X='ld',u3J='dito',c=v8===a?q:d((G3I+m2I+h1+q4I+m6+m8I+m2I+T7I+Z0X+G9J+m6+T7I+m2I+i8X)+a+(y6I));return d((G3I+m2I+j9J+m6+m8I+u3J+G9J+m6+c2I+T7I+m8I+J4X+i8X)+b+(y6I),c);}
,D=f[(Z4J.C6J+B7+b8+Z4J.R0I+h8X+Z4J.n6I)]={}
,E=function(a,b){var e9J="awTy",X9J="erSide",h6J="bSer",X0o="atures",V9X="oF";return a[R5J]()[E0][(V9X+Z4J.q2+X0o)][(h6J+g0J+X9J)]&&(o8X+G9X)!==b[Z4J.n6I][(E7J+Z4J.i0I+s1+Q8I+Z4J.n6I)][(w8+Z4J.o6I+e9J+g6I)];}
,L=function(a){a=d(a);setTimeout(function(){var s7J="highlight",r5J="dClas";a[(Z4J.Y8+w8+r5J+Z4J.n6I)](s7J);setTimeout(function(){var a1=550,J1I="noHighlight",G1X="dCl";a[(Z4J.Y8+w8+G1X+Z4J.Y8+Z4J.n6I+Z4J.n6I)](J1I)[(C3X+F2X+G4X+Z4J.z5I+Z1+Z4J.n6I)](s7J);setTimeout(function(){var K7="oHi";a[(C3X+o5I+a0X+G4X+p2J+Z4J.n6I)]((Z4J.F1I+K7+Z8I+y3I+Z4J.z5I+S3I+Z8I+E4J));}
,a1);}
,C3);}
,t2I);}
,F=function(a,b,c,e,d){var j8X="exes";b[(k7X+j0J+Z4J.n6I)](c)[(S3I+F9X+j8X)]()[(J5I+Z4J.V2+y3I)](function(c){var c=b[(k7X+j0J)](c),g=c.data(),i=d(g);i===h&&f.error((D7+Z4J.F1I+Z4J.Y8+N8+m0I+W4J+Z4J.i0I+Z4J.w1I+W4J+c8I+h5J+W4J+Z4J.o6I+O2+W4J+S3I+y9I+Z4J.F1I+t1I+c8I+S3I+Z4J.q2+Z4J.o6I),14);a[i]={idSrc:i,data:g,node:c[(Z4J.F1I+G1+Z4J.q2)](),fields:e,type:(Z4J.o6I+Z4J.w1I+j0J)}
;}
);}
,G=function(a,b,c,e,l,g){var o3X="indexes";b[G1J](c)[o3X]()[s8X](function(w){var z8J="ayFie",h9I="eNam",S0I="cif",M3I="eas",Y3="rmin",R1="isEmptyObject",n1X="itFi",E9I="aoColumns",s6="tings",I4X="column",i=b[a3](w),j=b[(Z4J.o6I+Z4J.w1I+j0J)](w[o1]).data(),j=l(j),u;if(!(u=g)){u=w[I4X];u=b[(u1+Z4J.i0I+s6)]()[0][E9I][u];var m=u[(E7J+P1+e6J+Z0I)]!==h?u[(u9+n1X+Q9X)]:u[(o5I+Z)],n={}
;d[(s8X)](e,function(a,b){var x6J="dataSrc";if(d[S8](m))for(var c=0;c<m.length;c++){var e=b,f=m[c];e[(w8+h2+B0I)]()===f&&(n[e[(i1X)]()]=e);}
else b[x6J]()===m&&(n[b[i1X]()]=b);}
);d[R1](n)&&f.error((D7+Z4J.F1I+Z4J.w2+Z4J.z5I+Z4J.q2+W4J+Z4J.i0I+Z4J.w1I+W4J+Z4J.Y8+n4J+Z4J.w1I+o5I+z1+M3J+X0I+n2J+W4J+w8+Z4J.A4+Z4J.q2+Y3+Z4J.q2+W4J+c8I+e6J+Z0I+W4J+c8I+Z4J.o6I+S7+W4J+Z4J.n6I+Z4J.w1I+Z4J.R0I+h8X+v2I+i1+Z4J.z5I+M3I+Z4J.q2+W4J+Z4J.n6I+k6I+Z4J.q2+S0I+Z4J.g7I+W4J+Z4J.i0I+Q0I+W4J+c8I+S3I+Z4J.q2+Z4J.z5I+w8+W4J+Z4J.F1I+Z4J.Y8+A1J+Z4J.l0X),11);u=n;}
F(a,b,w[(Z4J.o6I+O2)],e,l);a[j][a7I]="object"===typeof c&&c[(Z4J.F1I+Z4J.w1I+w8+h9I+Z4J.q2)]?[c]:[i[o0o]()];a[j][(H0J+Z4J.n6I+M7I+z8J+r7I)]=u;}
);}
;D[(M0I+Z4J.Y8+N8+Z4J.z5I+Z4J.q2)]={individual:function(a,b){var H2J="index",U9J="siv",b1="asCl",j4="ctDat",c=r[(Z4J.q2+z0J+Z4J.i0I)][(Z4J.w1I+q1+S3I)][(B9J+Z4J.F1I+b3+Z4J.q2+Z4J.i0I+q0I+Z4J.i5I+Z4J.q2+j4+Z4J.Y8+o3+Z4J.F1I)](this[Z4J.n6I][(S3I+w8+R0+Z4J.o6I+Z4J.V2)]),e=d(this[Z4J.n6I][(B7+N8+Z4J.z5I+Z4J.q2)])[(N8J+m0X+Z4J.Y8+N8+m0I)](),f=this[Z4J.n6I][(b9+w7+w5I)],g={}
,h,i;a[(W9I+P2I+Z4J.Y8+o5I+Z4J.q2)]&&d(a)[(y3I+b1+Z4J.Y8+t8)]("dtr-data")&&(i=a,a=e[(Z4J.o6I+B4+E7I+Z4J.F1I+U9J+Z4J.q2)][H2J](d(a)[(Z4J.V2+h9J+B4+Z4J.i0I)]("li")));b&&(d[(w2J+Z4J.o6I+Y8X+Z4J.g7I)](b)||(b=[b]),h={}
,d[(J5I+O9J)](b,function(a,b){h[b]=f[b];}
));G(g,e,a,f,c,h);i&&d[s8X](g,function(a,b){b[a7I]=[i];}
);return g;}
,fields:function(a){var a0I="mns",s5I="Object",B0J="Pla",Q1="aTabl",W0o="oA",b=r[s0X][(W0o+k6I+S3I)][h4I](this[Z4J.n6I][q7J]),c=d(this[Z4J.n6I][Q2X])[(j3+z1+Q1+Z4J.q2)](),e=this[Z4J.n6I][(c8I+s0J+w8+Z4J.n6I)],f={}
;d[(r9X+B0J+Y0o+s5I)](a)&&(a[C6X]!==h||a[d0]!==h||a[(a3+Z4J.n6I)]!==h)?(a[(C6X)]!==h&&F(f,c,a[(Z4J.o6I+Z4J.w1I+j0J+Z4J.n6I)],e,b),a[d0]!==h&&c[(Z9J+q5I+Z4J.n6I)](null,a[(f2J+U4J+a0I)])[(Y0o+w8+Z4J.q2+z0J+B4)]()[(e9I+y3I)](function(a){G(f,c,a,e,b);}
),a[G1J]!==h&&G(f,c,a[(Z4J.V2+w7+Z4J.z5I+Z4J.n6I)],e,b)):F(f,c,a,e,b);return f;}
,create:function(a,b){var c=d(this[Z4J.n6I][(Z4J.i0I+Z4J.Y8+B2X+Z4J.q2)])[g4X]();E(c,this)||(c=c[(k7X+j0J)][(b4+w8)](b),L(c[(o0o)]()));}
,edit:function(a,b,c,e){var m7X="wIds",C9J="nA",R6I="DataTa";b=d(this[Z4J.n6I][Q2X])[(R6I+N8+m0I)]();if(!E(b,this)){var f=r[(s0X)][(k0J)][h4I](this[Z4J.n6I][(J1J+B0I)]),g=f(c),a=b[(o1)]("#"+g);a[y7I]()||(a=b[(Z4J.o6I+O2)](function(a,b){return g==f(b);}
));a[y7I]()?(a.data(c),c=d[(S3I+C9J+W1I)](g,e[(o1+X7X)]),e[(k7X+m7X)][(H2+Z4J.z5I+S3I+Z4J.V2+Z4J.q2)](c,1)):a=b[o1][(b4+w8)](c);L(a[o0o]());}
}
,remove:function(a){var b=d(this[Z4J.n6I][(B7+N8+m0I)])[g4X]();E(b,this)||b[(k7X+j0J+Z4J.n6I)](a)[(Z4J.o6I+u9X)]();}
,prep:function(a,b,c,e,f){var e0I="rowId";"edit"===a&&(f[(e0I+Z4J.n6I)]=d[I0](c.data,function(a,b){var b2X="yObje";if(!d[(S3I+r3X+o5I+Q8I+b2X+i8J)](c.data[b]))return b;}
));}
,commit:function(a,b,c,e){var f5I="drawType",t2J="ject",W4="nGet",G2="rowIds";b=d(this[Z4J.n6I][(Z4J.i0I+Z4J.Y8+B2X+Z4J.q2)])[(j3+Z4J.Y8+m0X+Z4J.Y8+N8+Z4J.z5I+Z4J.q2)]();if((Z4J.q2+w8+S3I+Z4J.i0I)===a&&e[G2].length)for(var f=e[G2],g=r[s0X][(G5J+S3I)][(F4+c8I+W4+q0I+t2J+j3+Z4J.Y8+Z4J.i0I+Z4J.Y8+m0)](this[Z4J.n6I][q7J]),h=0,e=f.length;h<e;h++)a=b[(Z4J.o6I+Z4J.w1I+j0J)]("#"+f[h]),a[y7I]()||(a=b[(Z4J.o6I+O2)](function(a,b){return f[h]===g(b);}
)),a[(Z4J.Y8+Z4J.F1I+Z4J.g7I)]()&&a[V9I]();a=this[Z4J.n6I][(Z4J.q2+w8+S3I+Z4J.i0I+s1+Q8I+Z4J.n6I)][f5I];(Z4J.F1I+Z4J.w1I+G9X)!==a&&b[X4](a);}
}
;D[z6I]={initField:function(a){var Z1J='ito',b=d((G3I+m2I+q4I+e3J+m6+m8I+m2I+Z1J+G9J+m6+P7I+M9I+B5+i8X)+(a.data||a[(g7X+A1J)])+'"]');!a[s0I]&&b.length&&(a[s0I]=b[z6I]());}
,individual:function(a,b){var U6X="rom",K4J="termin",b8I="lly",E3I="omati",c2X="yless";if(a instanceof d||a[L0o])b||(b=[d(a)[(Z4J.Y8+Z4J.i0I+U8I)]((Z4J.l1+Z4J.Y8+F6X+Z4J.q2+w8+S3I+Z4J.i0I+Z4J.w1I+Z4J.o6I+F6X+c8I+S3I+Z4J.q2+Z0I))]),a=d(a)[(o8I+C3X+Z4J.F1I+Z4J.I2I)]("[data-editor-id]").data("editor-id");a||(a=(u3I+Z4J.q2+c2X));b&&!d[(S3I+Z4J.n6I+X0+Y8X+Z4J.g7I)](b)&&(b=[b]);if(!b||0===b.length)throw (G4X+Z4J.Y8+Z4J.F1I+Z4J.F1I+Z4J.w1I+Z4J.i0I+W4J+Z4J.Y8+Z4J.R0I+Z4J.i0I+E3I+L7J+b8I+W4J+w8+Z4J.q2+K4J+Z4J.q2+W4J+c8I+s0J+w8+W4J+Z4J.F1I+a0+Z4J.q2+W4J+c8I+U6X+W4J+w8+Z4J.Y8+Z4J.i0I+Z4J.Y8+W4J+Z4J.n6I+Z4J.w1I+g5J+Z4J.V2+Z4J.q2);var c=D[z6I][Y8I][(L7J+Z4J.z5I+Z4J.z5I)](this,a),e=this[Z4J.n6I][(v7+w8+Z4J.n6I)],f={}
;d[(s8X)](b,function(a,b){f[b]=e[b];}
);d[(Z4J.q2+Z4J.Y8+O9J)](c,function(c,g){var x2I="isplayF",i6J="toArray";g[(O4I+g6I)]="cell";for(var h=a,j=b,m=d(),n=0,p=j.length;n<p;n++)m=m[(Z4J.Y8+N9I)](C(h,j[n]));g[a7I]=m[i6J]();g[Y8I]=e;g[(w8+x2I+e6J+Z0I+Z4J.n6I)]=f;}
);return c;}
,fields:function(a){var G3J="keyle",b={}
,c={}
,e=this[Z4J.n6I][(v7+w5I)];a||(a=(G3J+t8));d[(Z4J.q2+Z4J.Y8+Z4J.V2+y3I)](e,function(b,e){var d=C(a,e[(w8+z1+Z4J.Y8+B0I)]())[(y3I+Z4J.i0I+o5I+Z4J.z5I)]();e[K6](c,null===d?h:d);}
);b[a]={idSrc:a,data:c,node:q,fields:e,type:(o1)}
;return b;}
,create:function(a,b){var i3='tor',c5X="GetOb";if(b){var c=r[s0X][(G5J+S3I)][(B9J+Z4J.F1I+c5X+A2J+Z4J.i0I+n7J+Z4J.Y8+o3+Z4J.F1I)](this[Z4J.n6I][(S3I+w8+R0+k5X)])(b);d((G3I+m2I+q4I+c0X+q4I+m6+m8I+m2I+T7I+i3+m6+T7I+m2I+i8X)+c+'"]').length&&K(c,a,b);}
}
,edit:function(a,b,c){a=r[s0X][(G5J+S3I)][h4I](this[Z4J.n6I][q7J])(c)||"keyless";K(a,b,c);}
,remove:function(a){d('[data-editor-id="'+a+(y6I))[(C3X+f1J+Z4J.q2)]();}
}
;f[T4]={wrapper:(j3+X7),processing:{indicator:(j3+a7+e8X+Z4J.n6I+S3I+v4+s3X+w8+S3I+Z4J.V2+Z4J.Y8+D6J),active:(j3+X6+u3+F4+i1+Z4J.o6I+Z4J.w1I+Z9J+Z4J.n6I+n5+Z4J.F1I+Z8I)}
,header:{wrapper:(j3+X7+x1X+Z4J.q2+Z4J.Y8+y9I+Z4J.o6I),content:(I6J+K7J+w7I+b4+Q2+F4+G4X+Z4J.w1I+d4J+Z4J.i0I)}
,body:{wrapper:"DTE_Body",content:"DTE_Body_Content"}
,footer:{wrapper:(X2J+V4X),content:"DTE_Footer_Content"}
,form:{wrapper:"DTE_Form",content:"DTE_Form_Content",tag:"",info:(I6J+R9I+B5I+x1+Z4J.F1I+s8),error:(j3+X7+o9X+Z4J.w1I+i9J),buttons:(j3+X6+u3+F4+F8I+p1X+Z4J.i0I+Q3I+h3X),button:"btn"}
,field:{wrapper:"DTE_Field",typePrefix:"DTE_Field_Type_",namePrefix:"DTE_Field_Name_",label:"DTE_Label",input:(I6J+l1I+Z4J.q2+Z4J.z5I+w9X+Z4J.F1I+k6I+Z4J.R0I+Z4J.i0I),inputControl:(I6J+I4I+S3I+Z4J.q2+Z4J.z5I+S9X+t7+U8I+Z4J.w1I+Z4J.z5I),error:(I6J+K7J+O6+w7+w8+F3X+Z4J.i0I+Z4J.Y8+Z4J.i0I+W2J),"msg-label":(v6J+H4I+Z4J.z5I+F4+x1+Z4J.F1I+s8),"msg-error":(j3+X6+K7J+I5J+K6I+M6),"msg-message":(j3+X6+k7J+Z0I+F4+n6J+t8+L9+Z4J.q2),"msg-info":"DTE_Field_Info",multiValue:(o5I+g8J+t1I+F6X+g0J+Z4J.Y8+B8I),multiInfo:(p6+Z4J.i0I+S3I+F6X+S3I+Z4J.F1I+s8),multiRestore:(d1I+F6X+Z4J.o6I+Z4J.q2+Z4J.n6I+Z4J.i0I+u2+Z4J.q2)}
,actions:{create:(j3+X7+F4+U4X+Z4J.V2+B2J+P6J+z1+Z4J.q2),edit:"DTE_Action_Edit",remove:"DTE_Action_Remove"}
,bubble:{wrapper:(I6J+u3+W4J+j3+X7+b5I+e6),liner:(j3+X6+u3+b5I+N8+N8+A2I+U5+S3I+F3I),table:(I6J+C8J+L7X+Z4J.z5I+q4X+Z4J.Y8+N8+m0I),close:(I6J+b7I+M0o+A8I),pointer:(j3+X6+u3+F4+y4X+Z4J.R0I+L7X+A2I+X6+I5I+Z8I+m0I),bg:(j3+X6+w0+Z8I+k7X+V)}
}
;if(r[(W+N8+I7I+Z4J.w1I+s3)]){var p=r[(Z4J.B3I+I7I+Z4J.w1I+s3)][A5X],H={sButtonText:c3X,editor:c3X,formTitle:c3X}
;p[(Z4J.q2+H0J+Q3I+m0o+C3X+Z4J.Y8+I6I)]=d[(s0X+Z4J.q2+Z4J.F1I+w8)](!E0,p[k0X],H,{formButtons:[{label:c3X,fn:function(){this[f0o]();}
}
],fnClick:function(a,b){var n4="edito",c=b[(n4+Z4J.o6I)],e=c[(S3I+G5+Z4J.F1I)][(A1X+Z4J.Y8+I6I)],d=b[e1I];if(!d[E0][(l7I+N8+w7)])d[E0][(Z4J.z5I+Z4J.w2+w7)]=e[f0o];c[(m3J+J5I+I6I)]({title:e[(Z4J.i0I+S3I+D3I)],buttons:d}
);}
}
);p[J7J]=d[H3I](!0,p[r1],H,{formButtons:[{label:null,fn:function(){this[(Z4+P)]();}
}
],fnClick:function(a,b){var c4J="Sel",c=this[(c8I+Z4J.F1I+b3+Z4J.A4+c4J+Z4J.q2+i8J+Z4J.q2+w8+s3X+w8+p5+Z4J.q2+Z4J.n6I)]();if(c.length===1){var e=b[(Z4J.q2+w8+T1+Z4J.o6I)],d=e[k1I][R0J],f=b[(y0o+y4X+Z4J.R0I+u3X)];if(!f[0][(l7I+N8+Z4J.q2+Z4J.z5I)])f[0][(l7I+N8+Z4J.q2+Z4J.z5I)]=d[(V4+v2X+Z9X)];e[R0J](c[0],{title:d[j2],buttons:f}
);}
}
}
);p[(Z4J.q2+w8+S3I+E7+Z4J.o6I+g0X+Z4J.q2)]=d[(Z4J.q2+z0J+Z4J.i0I+Z4J.q2+Z4J.F1I+w8)](!0,p[(u1+Z4J.z5I+Z4J.q2+Z4J.V2+Z4J.i0I)],H,{question:null,formButtons:[{label:null,fn:function(){var a=this;this[(Z4J.n6I+u0J+o5I+S3I+Z4J.i0I)](function(){var W1X="Sele",H9X="tab",X6J="fnGetInstance",F8X="bleToo";d[Z4J.h0I][g9][(W+F8X+Z4J.z5I+Z4J.n6I)][X6J](d(a[Z4J.n6I][(Z4J.i0I+Z4J.Y8+N8+m0I)])[g4X]()[(H9X+m0I)]()[o0o]())[(c8I+Z4J.F1I+W1X+Z4J.V2+Z4J.i0I+J1+t7+Z4J.q2)]();}
);}
}
],fnClick:function(a,b){var b1J="fir",Q7I="mB",L1I="xe",D2="lectedI",L8J="fnGet",c=this[(L8J+R0+Z4J.q2+D2+F9X+Z4J.q2+L1I+Z4J.n6I)]();if(c.length!==0){var e=b[G8],d=e[(D7I+B0o+Z4J.F1I)][(V9I)],f=b[(c8I+u2+Q7I+n4J+Y1J+Z4J.n6I)],g=typeof d[(Z4J.V2+Z4J.w1I+l1X+S3I+Z4J.o6I+o5I)]==="string"?d[(H0X+c8I+S3I+t6X)]:d[(Z4J.V2+Z4J.w1I+l1X+S3I+t6X)][c.length]?d[(H0X+b9+Z4J.o6I+o5I)][c.length]:d[(Z4J.V2+t7+b1J+o5I)][F4];if(!f[0][(Z4J.z5I+Z4J.Y8+N8+Z4J.q2+Z4J.z5I)])f[0][(b3I+Z4J.q2+Z4J.z5I)]=d[(V4+N8+u6J+Z4J.i0I)];e[V9I](c,{message:g[S7X](/%d/g,c.length),title:d[(j2)],buttons:f}
);}
}
}
);}
d[(p5+I6I+F9X)](r[(p5+Z4J.i0I)][(L5X+E2I+Z4J.w1I+Z4J.F1I+Z4J.n6I)],{create:{text:function(a,b,c){var r2X="butt",f0="reate";return a[k1I]((L5X+B9I+Z4J.n6I+Z4J.l0X+Z4J.V2+f0),c[G8][(k1I)][d0I][(r2X+t7)]);}
,className:(N8+Z4J.R0I+E2I+Z4J.w1I+Z4J.F1I+Z4J.n6I+F6X+Z4J.V2+C3X+G4),editor:null,formButtons:{label:function(a){return a[(S3I+U1X+B0o+Z4J.F1I)][(A1X+z1+Z4J.q2)][f0o];}
,fn:function(){this[(V4+v2X+Z9X)]();}
}
,formMessage:null,formTitle:null,action:function(a,b,c,e){var u5="itl",P1I="formTitle";a=e[G8];a[(Z4J.V2+Z4J.o6I+Z4J.q2+G4)]({buttons:e[e1I],message:e[(c8I+Z4J.w1I+Z4J.o6I+o5I+g6+B4+Z4J.n6I+i5)],title:e[P1I]||a[k1I][d0I][(Z4J.i0I+u5+Z4J.q2)]}
);}
}
,edit:{extend:(P2J+I6I+w8),text:function(a,b,c){return a[(S3I+G5+Z4J.F1I)]((N8+Z4J.R0I+E2I+p3J+Z4J.l0X+Z4J.q2+w8+S3I+Z4J.i0I),c[(Z4J.q2+H0J+D6J)][(D1X+Z4J.F1I)][R0J][(u0o+Z4J.i0I+t7)]);}
,className:(L5X+X4J+h3X+F6X+Z4J.q2+w8+Z9X),editor:null,formButtons:{label:function(a){return a[(S3I+U1X+B0o+Z4J.F1I)][R0J][(V3I+S3I+Z4J.i0I)];}
,fn:function(){var N0o="ubm";this[(Z4J.n6I+N0o+S3I+Z4J.i0I)]();}
}
,formMessage:null,formTitle:null,action:function(a,b,c,e){var Q7J="formMessage",u9J="xes",D2X="ell",i3I="indexe",a=e[G8],c=b[C6X]({selected:!0}
)[(S3I+Z4J.F1I+y9I+z0J+B4)](),d=b[d0]({selected:!0}
)[(i3I+Z4J.n6I)](),b=b[(Z4J.V2+D2X+Z4J.n6I)]({selected:!0}
)[(h5J+Z4J.q2+u9J)]();a[(Z4J.q2+o6)](d.length||b.length?{rows:c,columns:d,cells:b}
:c,{message:e[Q7J],buttons:e[(y0o+p1X+Z4J.i0I+Z4J.i0I+t7+Z4J.n6I)],title:e[(c8I+u2+R6X+q3I+Z4J.q2)]||a[(D1X+Z4J.F1I)][(Z4J.q2+w8+S3I+Z4J.i0I)][(Z4J.i0I+S3I+Z4J.i0I+Z4J.z5I+Z4J.q2)]}
);}
}
,remove:{extend:"selected",text:function(a,b,c){var Z2="18n";return a[k1I]("buttons.remove",c[G8][(S3I+Z2)][(Z4J.o6I+Z4J.q2+f1J+Z4J.q2)][(g8)]);}
,className:"buttons-remove",editor:null,formButtons:{label:function(a){return a[(D7I+R6)][V9I][(Z4+o5I+Z9X)];}
,fn:function(){this[f0o]();}
}
,formMessage:function(a,b){var l0J="irm",Y9X="confirm",u7J="nfirm",Y2="ows",c=b[(Z4J.o6I+Y2)]({selected:!0}
)[(h5J+Z4J.q2+z0J+B4)](),e=a[(S3I+G5+Z4J.F1I)][(C3X+f1J+Z4J.q2)];return ("string"===typeof e[(Z4J.V2+M7J+s7X+o5I)]?e[(f2J+u7J)]:e[Y9X][c.length]?e[(Z4J.V2+Z4J.w1I+Z4J.F1I+c8I+l0J)][c.length]:e[(P0I+l0J)][F4])[(Z4J.o6I+Z4J.q2+M7I+Y7I)](/%d/g,c.length);}
,formTitle:null,action:function(a,b,c,e){var g1="remov",Q3J="mMes",E9X="Buttons";a=e[G8];a[(Z4J.o6I+Z4J.q2+Z8J+l9J)](b[(Z4J.o6I+O2+Z4J.n6I)]({selected:!0}
)[(S3I+D7X+z0J+B4)](),{buttons:e[(s8+Z4J.o6I+o5I+E9X)],message:e[(c8I+Z4J.w1I+Z4J.o6I+Q3J+Z4J.n6I+Z4J.Y8+n6)],title:e[(c8I+Z4J.w1I+Z4J.o6I+R6X+Z4J.i0I+Z4J.z5I+Z4J.q2)]||a[(D7I+R6)][(g1+Z4J.q2)][j2]}
);}
}
}
);f[(c8I+S3I+k0o+Z4J.q2+Z4J.n6I)]={}
;f[(j3+z1+S5I+S3I+A1J)]=function(a,b){var X5X="calendar",t5X="matc",z2X="sta",D8X="-time",O4J="ndar",D3J="-date",k3="</div></div>",E3="<span>:</span>",Y6J='-time">',Y8J='lend',f9I='-year"/></div></div><div class="',g4J='th',r1X='</button></div><div class="',a4X='conRi',X2="evi",C5='nLeft',M9J='-title"><div class="',n1I='-label"><span/><select class="',s0o='ut',J5J="sed",K1="YYY",k1J="ntj",N6="tetim",n7X="YYYY-MM-DD",H8I="lassP";this[Z4J.V2]=d[H3I](!E0,{}
,f[H1J][(y9I+c8I+Z4J.Y8+g8J+Z4J.I2I)],b);var c=this[Z4J.V2][(Z4J.V2+H8I+Z4J.o6I+Z4J.q2+c8I+Y4X)],e=this[Z4J.V2][k1I];if(!j[H7I]&&n7X!==this[Z4J.V2][(c8I+Z4J.w1I+Z4J.o6I+A9J+Z4J.i0I)])throw (u3+o6+Z4J.w1I+Z4J.o6I+W4J+w8+Z4J.Y8+N6+Z4J.q2+n4I+j0I+S3I+Z4J.i0I+y3I+Z4J.w1I+n4J+W4J+o5I+S7+Z4J.q2+k1J+Z4J.n6I+W4J+Z4J.w1I+Z4J.F1I+Z4J.z5I+Z4J.g7I+W4J+Z4J.i0I+y3I+Z4J.q2+W4J+c8I+Z4J.w1I+t6X+Z4J.Y8+Z4J.i0I+c3+V9+K1+F6X+g6+g6+F6X+j3+j3+G4J+Z4J.V2+Q+W4J+N8+Z4J.q2+W4J+Z4J.R0I+J5J);var g=function(a){var x8I='utto',B1J='wn',i7X='Do',O0I='U',q6J='con',d0o='ck',f9X='lo',U0I='meb';return g8I+c+(m6+c0X+T7I+U0I+f9X+d0o+b0X+m2I+v3+q2X+B2I+P7I+o5X+i8X)+c+(m6+T7I+q6J+O0I+H7J+b0X+Z4I+t4X+y2)+e[(k6I+Z4J.o6I+Z4J.q2+g0J+Q7X+q5J)]+(b0o+Z4I+s0o+c0X+d9I+v9I+o9+m2I+T7I+Y7J+B6I+m2I+v3+q2X+B2I+Z2J+i8X)+c+n1I+c+F6X+a+(t3X+m2I+v3+B6I+m2I+v3+q2X+B2I+Z2J+i8X)+c+(m6+T7I+B2I+o8J+i7X+B1J+b0X+Z4I+x8I+v9I+y2)+e[c6X]+(P0o+N8+Z4J.R0I+Z4J.i0I+Z4J.i0I+t7+U+w8+S3I+g0J+U+w8+P9X+N2X);}
,g=d(g8I+c+(b0X+m2I+v3+q2X+B2I+P7I+q4I+n9J+n9J+i8X)+c+(m6+m2I+q4I+j2J+b0X+m2I+T7I+Y7J+q2X+B2I+P7I+b6+n9J+i8X)+c+M9J+c+(m6+T7I+A7X+C5+b0X+Z4I+B0X+c0X+c0X+o8J+y2)+e[(k6I+Z4J.o6I+X2+Z4J.w1I+Z4J.R0I+Z4J.n6I)]+(b0o+Z4I+s0o+Z0X+v9I+o9+m2I+T7I+Y7J+B6I+m2I+v3+q2X+B2I+P7I+q4I+e0J+i8X)+c+(m6+T7I+a4X+P0J+v0J+c0X+b0X+Z4I+t4X+y2)+e[c6X]+r1X+c+n1I+c+(m6+A9I+d9I+v9I+g4J+t3X+m2I+T7I+Y7J+B6I+m2I+T7I+Y7J+q2X+B2I+P7I+o5X+i8X)+c+n1I+c+f9I+c+(m6+B2I+q4I+Y8J+L6+t3X+m2I+v3+B6I+m2I+v3+q2X+B2I+U9+n9J+i8X)+c+Y6J+g(C1X)+E3+g(N2J)+E3+g(Z5I)+g(K9J)+k3);this[Z6J]={container:g,date:g[(b9+Z4J.F1I+w8)](Z4J.l0X+c+D3J),title:g[(b9+F9X)](Z4J.l0X+c+(F6X+Z4J.i0I+W6)),calendar:g[T9X](Z4J.l0X+c+(F6X+Z4J.V2+Z4J.Y8+Z4J.z5I+Z4J.q2+O4J)),time:g[T9X](Z4J.l0X+c+D8X),input:d(a)}
;this[Z4J.n6I]={d:c3X,display:c3X,namespace:(Z4J.q2+H0J+Z4J.i0I+Z4J.w1I+Z4J.o6I+F6X+w8+z1+Z4J.q2+v0o+Z4J.q2+F6X)+f[H1J][(z1J+Z4J.F1I+z2X+Z4J.F1I+Z9J)]++,parts:{date:c3X!==this[Z4J.V2][(c8I+u2+F6)][e6X](/[YMD]/),time:c3X!==this[Z4J.V2][o7J][(t5X+y3I)](/[Hhm]/),seconds:-N0!==this[Z4J.V2][(c8I+u1X+z1)][(h5J+p5+s1+c8I)](Z4J.n6I),hours12:c3X!==this[Z4J.V2][(c8I+u1X+Z4J.Y8+Z4J.i0I)][(A9J+Z4J.i0I+O9J)](/[haA]/)}
}
;this[(Z6J)][Q9J][(Z4J.Y8+k6I+k6I+q8+w8)](this[Z6J][(w8+Z4J.Y8+Z4J.i0I+Z4J.q2)])[(Z4J.Y8+k6I+k6I+q8+w8)](this[(w8+Z4J.w1I+o5I)][Y0I]);this[(w8+S7)][(w8+Z4J.Y8+I6I)][(Z4J.Y8+k6I+k6I+C5I)](this[Z6J][(Z4J.i0I+S3I+q3I+Z4J.q2)])[(l4X+w8)](this[Z6J][X5X]);this[t2X]();}
;d[(Z4J.q2+S8X)](f.DateTime.prototype,{destroy:function(){var S8I="iner";this[(F4+y3I+S3I+w8+Z4J.q2)]();this[(w8+Z4J.w1I+o5I)][(H0X+B7+S8I)]()[(Z4J.w1I+f4)]("").empty();this[(Z6J)][(S3I+r4)][t9J](".editor-datetime");}
,max:function(a){var R4X="ander",t0I="Titl",x7I="maxDate";this[Z4J.V2][x7I]=a;this[(L6J+Q8I+S3I+Z4J.w1I+h3X+t0I+Z4J.q2)]();this[(z6+C0+Z4J.Y8+Z4J.z5I+R4X)]();}
,min:function(a){var j9I="etC",Z3="_optionsTitle";this[Z4J.V2][R6J]=a;this[Z3]();this[(n8J+j9I+X0I+Q+w8+Z4J.q2+Z4J.o6I)]();}
,owns:function(a){return 0<d(a)[p7I]()[k6X](this[(Z6J)][(H0X+u2X+Z4J.o6I)]).length;}
,val:function(a,b){var A8X="Cal",b2="setTi",V1J="toString",V5J="oUt",E8I="toDa",E4I="Lo",a7X="ome",b0I="tc";if(a===h)return this[Z4J.n6I][w8];if(a instanceof Date)this[Z4J.n6I][w8]=this[z3J](a);else if(null===a||""===a)this[Z4J.n6I][w8]=null;else if("string"===typeof a)if(j[(Z8J+o5I+Z4J.q2+Z4J.F1I+Z4J.i0I)]){var c=j[H7I][(Z4J.R0I+b0I)](a,this[Z4J.V2][o7J],this[Z4J.V2][(o5I+a7X+Z4J.F1I+Z4J.i0I+E4I+Z4J.V2+w2X)],this[Z4J.V2][N3I]);this[Z4J.n6I][w8]=c[(S3I+Z4J.n6I+q7+Z4J.Y8+u1I+w8)]()?c[(E8I+Z4J.i0I+Z4J.q2)]():null;}
else c=a[e6X](/(\d{4})\-(\d{2})\-(\d{2})/),this[Z4J.n6I][w8]=c?new Date(Date[(G2J)](c[1],c[2]-1,c[3])):null;if(b||b===h)this[Z4J.n6I][w8]?this[j0o]():this[(Z6J)][j0X][(g0J+X0I)](a);this[Z4J.n6I][w8]||(this[Z4J.n6I][w8]=this[(F4+c1+X6+V5J+Z4J.V2)](new Date));this[Z4J.n6I][p6J]=new Date(this[Z4J.n6I][w8][V1J]());this[(F4+b2+Z4J.i0I+Z4J.z5I+Z4J.q2)]();this[(F4+Z4J.n6I+Z4J.q2+Z4J.i0I+A8X+Z4J.Y8+F9X+Z4J.q2+Z4J.o6I)]();this[(z6+Z4J.i0I+X6+v0o+Z4J.q2)]();}
,_constructor:function(){var J3J="_setTitle",k2="atetim",p1I="Pm",X9="cond",M3X="sInc",U3X="nut",q0o="_optionsTime",a7J="s1",A0X="onsT",t9X="sT",J5="ast",Q2J="eblo",C7X="tim",v4X="par",d6X="isp",P0X="ime",a=this,b=this[Z4J.V2][N7X],c=this[Z4J.V2][(D1X+Z4J.F1I)];this[Z4J.n6I][(k6I+Z4J.Y8+Z4J.o6I+Z4J.i0I+Z4J.n6I)][c1]||this[Z6J][(w8+G4)][v3J]((H0J+Z4J.n6I+V7I+Z4J.g7I),(w0I+Z4J.q2));this[Z4J.n6I][B8X][Y0I]||this[Z6J][(Z4J.i0I+P0X)][v3J]((w8+d6X+c5J),"none");this[Z4J.n6I][(v4X+Z4J.I2I)][(u1+Z4J.V2+t7+w8+Z4J.n6I)]||(this[(Z6J)][Y0I][(Z4J.V2+y3I+S3I+Z0I+C3X+Z4J.F1I)]("div.editor-datetime-timeblock")[(Z4J.q2+j1I)](2)[(Z4J.o6I+Z4J.q2+F2X)](),this[(Z6J)][(C7X+Z4J.q2)][(Z4J.V2+y3I+S3I+Z0I+C3X+Z4J.F1I)]("span")[(Z4J.q2+j1I)](1)[V9I]());this[Z4J.n6I][B8X][i4X]||this[Z6J][Y0I][I7X]((w8+P9X+Z4J.l0X+Z4J.q2+w8+Z9X+u2+F6X+w8+Z4J.Y8+Z4J.i0I+Z4J.q2+t1I+A1J+F6X+Z4J.i0I+S3I+o5I+Q2J+Z4J.V2+u3I))[(Z4J.z5I+J5)]()[V9I]();this[(L6J+k6I+t1I+t7+t9X+S3I+Z4J.i0I+Z4J.z5I+Z4J.q2)]();this[(F4+Z4J.w1I+k6I+Z4J.i0I+S3I+A0X+v0o+Z4J.q2)]("hours",this[Z4J.n6I][B8X][(y3I+Z4J.w1I+g5J+a7J+w6X)]?12:24,1);this[q0o]("minutes",60,this[Z4J.V2][(u6J+U3X+Z4J.q2+M3X+C3X+A1J+g3X)]);this[q0o]((Z4J.n6I+Z4J.V1I+t7+w8+Z4J.n6I),60,this[Z4J.V2][(u1+X9+Z4J.n6I+x1+Z4J.F1I+Z4J.V2+C3X+A1J+g3X)]);this[u8]("ampm",["am","pm"],c[(a0+p1I)]);this[Z6J][j0X][t7]((c8I+Z4J.w1I+E8+Z4J.l0X+Z4J.q2+H0J+Z4J.i0I+u2+F6X+w8+z1+Z4J.q2+Y0I+W4J+Z4J.V2+q6I+Z4J.l0X+Z4J.q2+w8+n2I+F6X+w8+Z4J.Y8+I6I+Z4J.i0I+v0o+Z4J.q2),function(){var B9="isabl";if(!a[(w8+Z4J.w1I+o5I)][(Q9J)][(S3I+Z4J.n6I)]((J0o+g0J+r9X+S3I+N8+Z4J.z5I+Z4J.q2))&&!a[(w8+Z4J.w1I+o5I)][j0X][(S3I+Z4J.n6I)]((J0o+w8+B9+u9))){a[y1](a[(w8+Z4J.w1I+o5I)][j0X][(e7J+Z4J.z5I)](),false);a[J2]();}
}
)[(t7)]((l6+Z4J.g7I+s3J+Z4J.l0X+Z4J.q2+o6+Z4J.w1I+Z4J.o6I+F6X+w8+k2+Z4J.q2),function(){var r3J="isib",H5J="ntai";a[Z6J][(Z4J.V2+Z4J.w1I+H5J+Z4J.F1I+Z4J.q2+Z4J.o6I)][(r9X)]((J0o+g0J+r3J+m0I))&&a[y1](a[Z6J][j0X][(g0J+X0I)](),false);}
);this[(Z6J)][Q9J][t7]((Z4J.V2+C3I+M5X+Z4J.q2),(Z4J.n6I+Z4J.q2+Z4J.z5I+Z4J.V1I+Z4J.i0I),function(){var I3J="itio",A4J="_setTime",N1="econ",b5="TCMi",F0="utp",K0="_wr",I0o="_set",r6="UTCHou",a3I="UT",j7X="mpm",h5I="art",F2I="Cla",x9X="has",D3="alander",N7="_correctMonth",c=d(this),f=c[(g0J+X0I)]();if(c[F4J](b+"-month")){a[N7](a[Z4J.n6I][p6J],f);a[J3J]();a[(F4+u1+Z4J.i0I+G4X+D3)]();}
else if(c[(x9X+X7J+L1)](b+(F6X+Z4J.g7I+Z4J.q2+v6))){a[Z4J.n6I][p6J][(Z4J.n6I+K5I+Q8J+Z4J.R0I+Z4J.z5I+D3X)](f);a[(z6+Z4J.i0I+W7I+q3I+Z4J.q2)]();a[(z6+C0+Z4J.Y8+l7I+Z4J.F1I+l8)]();}
else if(c[F4J](b+(F6X+y3I+E5J+Z4J.n6I))||c[(y3I+Z4J.Y8+Z4J.n6I+F2I+t8)](b+(F6X+Z4J.Y8+o5I+Q9I))){if(a[Z4J.n6I][(k6I+h5I+Z4J.n6I)][i4X]){c=d(a[Z6J][(f2J+Z4J.F1I+B7+S3I+G9X+Z4J.o6I)])[(K3J+w8)]("."+b+(F6X+y3I+Z4J.w1I+Z4J.R0I+B9X))[y1]()*1;f=d(a[Z6J][(Z4J.V2+Z4J.w1I+g3X+Z4J.Y8+S3I+Z4J.F1I+Q2)])[(c8I+Y0o+w8)]("."+b+(F6X+Z4J.Y8+j7X))[(g0J+X0I)]()===(Q9I);a[Z4J.n6I][w8][(Z4J.n6I+Z4J.A4+a3I+G4X+z8+Z4J.w1I+Z4J.R0I+Z4J.o6I+Z4J.n6I)](c===12&&!f?0:f&&c!==12?c+12:c);}
else a[Z4J.n6I][w8][(Z4J.n6I+Z4J.q2+Z4J.i0I+r6+Z4J.o6I+Z4J.n6I)](f);a[(I0o+X6+v0o+Z4J.q2)]();a[(K0+S3I+Z4J.i0I+Z4J.q2+s1+F0+n4J)](true);}
else if(c[(y3I+Z4J.Y8+Z4J.n6I+n1+Z4J.n6I)](b+"-minutes")){a[Z4J.n6I][w8][(u1+Z4J.i0I+D7+b5+Z5X+Z4J.i0I+Z4J.q2+Z4J.n6I)](f);a[(F4+u1+Z4J.i0I+X6+P0X)]();a[j0o](true);}
else if(c[F4J](b+(F6X+Z4J.n6I+N1+w5I))){a[Z4J.n6I][w8][(Z4J.n6I+Z4J.A4+R0+Z4J.V1I+Z4J.w1I+F9X+Z4J.n6I)](f);a[A4J]();a[j0o](true);}
a[(w8+S7)][(S3I+Z4J.F1I+W2I)][(c8I+Z4J.w1I+v5J+Z4J.n6I)]();a[(F4+m0J+I3J+Z4J.F1I)]();}
)[t7]("click",function(c){var l0="ocus",o5="eOut",h7J="rit",D0J="setUTCDate",k5J="Mo",c9X="setUTCFullYear",y5="dIn",m9J="cte",H6J="ption",f9J="nD",P4J="asC",U6I="edIn",Q5="dex",p9J="dI",d5="selectedIndex",Z5J="tTi",a5I="corre",U1="nRi",z0X="lan",F0I="CMon",d1X="etUT",Q0o="CM",e5X="setUT",E9="eft",D0X="onL",D5X="pag",I9X="Cas",k9X="we",F6J="toLo",C2X="arget",f=c[(Z4J.i0I+C2X)][L0o][(F6J+k9X+Z4J.o6I+I9X+Z4J.q2)]();if(f!==(T8J)){c[(Z4J.n6I+Z4J.i0I+Z4J.w1I+k6I+T3X+D5X+Z4J.Y8+Z4J.i0I+Q7X+Z4J.F1I)]();if(f==="button"){c=d(c[d6J]);f=c.parent();if(!f[(y3I+Z4J.Y8+Z4J.n6I+X7J+L1)]((w8+r9X+Z4J.Y8+B2X+Z4J.q2+w8)))if(f[(y3I+Z1+X7J+Z4J.Y8+Z4J.n6I+Z4J.n6I)](b+(F6X+S3I+Z4J.V2+D0X+E9))){a[Z4J.n6I][p6J][(e5X+Q0o+Z4J.w1I+g3X+y3I)](a[Z4J.n6I][p6J][(Z8I+d1X+F0I+U1I)]()-1);a[J3J]();a[(z6+C0+Z4J.Y8+z0X+y9I+Z4J.o6I)]();a[Z6J][(S3I+n8X+Z4J.R0I+Z4J.i0I)][O6I]();}
else if(f[F4J](b+(F6X+S3I+Z4J.V2+Z4J.w1I+U1+Z8I+y3I+Z4J.i0I))){a[(F4+a5I+i8J+g6+t7+U1I)](a[Z4J.n6I][(S0+k6I+Z4J.z5I+y3)],a[Z4J.n6I][(w8+S3I+A9X+Z4J.Y8+Z4J.g7I)][f5J]()+1);a[(n8J+Z4J.q2+Z5J+q3I+Z4J.q2)]();a[(n8J+Z4J.A4+G4X+X0I+Z4J.Y8+Z4J.F1I+l8)]();a[(w8+S7)][(S3I+n8X+n4J)][(O6I)]();}
else if(f[(C3I+Z4J.n6I+G4X+Z4J.z5I+Z1+Z4J.n6I)](b+(F6X+S3I+Z4J.V2+t7+g8X))){c=f.parent()[(T9X)]((I2J+K3X))[0];c[d5]=c[(Z4J.n6I+Z4J.q2+p5J+Z4J.q2+p9J+Z4J.F1I+Q5)]!==c[V6X].length-1?c[(Z4J.n6I+w7+K3X+U6I+w8+p5)]+1:0;d(c)[l2]();}
else if(f[(y3I+P4J+Z4J.z5I+L1)](b+(F6X+S3I+f2J+f9J+Z4J.w1I+g9I))){c=f.parent()[(K3J+w8)]((I2J+K3X))[0];c[d5]=c[(u1+Z4J.z5I+K3X+Z4J.q2+w8+x1+D7X+z0J)]===0?c[(Z4J.w1I+H6J+Z4J.n6I)].length-1:c[(Z4J.n6I+Z4J.q2+m0I+m9J+y5+w8+Z4J.q2+z0J)]-1;d(c)[l2]();}
else{if(!a[Z4J.n6I][w8])a[Z4J.n6I][w8]=a[z3J](new Date);a[Z4J.n6I][w8][c9X](c.data("year"));a[Z4J.n6I][w8][(Z4J.n6I+Z4J.A4+D7+W0I+k5J+Z4J.F1I+Z4J.i0I+y3I)](c.data((o5I+Z4J.w1I+r1J)));a[Z4J.n6I][w8][D0J](c.data((w8+y3)));a[(F4+j0J+h7J+o5+k6I+Z4J.R0I+Z4J.i0I)](true);setTimeout(function(){a[(F4+h1I+w8+Z4J.q2)]();}
,10);}
}
else a[(Z6J)][j0X][(c8I+l0)]();}
}
);}
,_compareDates:function(a,b){var Z3X="_dateToUtcString",X8X="cS",I8J="dateToUt";return this[(F4+I8J+X8X+Z4J.i0I+b7J+Z8I)](a)===this[Z3X](b);}
,_correctMonth:function(a,b){var N4X="Mont",K4="setUTCMonth",a1X="sI",c8J="_da",c=this[(c8J+Z4J.g7I+a1X+Z4J.F1I+g6+t7+Z4J.i0I+y3I)](a[W2X](),b),e=a[Y1I]()>c;a[K4](b);e&&(a[(Z4J.n6I+Z4J.q2+o1J+G4X+j3+z1+Z4J.q2)](c),a[(u1+m8+W0I+N4X+y3I)](b));}
,_daysInMonth:function(a,b){return [31,0===a%4&&(0!==a%100||0===a%400)?29:28,31,30,31,30,31,31,30,31,30,31][b];}
,_dateToUtc:function(a){var H9I="getS",t0X="getHours";return new Date(Date[G2J](a[D8J](),a[(Z8I+Z4J.A4+g6+S3J+y3I)](),a[(R5+j3+Z4J.Y8+I6I)](),a[t0X](),a[(R5+g6+S3I+Z5X+c1X)](),a[(H9I+Z4J.q2+Z4J.V2+t7+w5I)]()));}
,_dateToUtcString:function(a){var v4I="getU",q1J="tUTCMont",r8J="_pad",w1J="lYe";return a[(R5+D7+Q8J+g8J+w1J+v6)]()+"-"+this[r8J](a[(n6+q1J+y3I)]()+1)+"-"+this[(F4+k6I+b4)](a[(v4I+X6+G4X+N8J+Z4J.i0I+Z4J.q2)]());}
,_hide:function(){var e4I="clic",i5J="dow",r3I="esp",a=this[Z4J.n6I][(g7X+o5I+r3I+N4+Z4J.q2)];this[Z6J][(Z4J.V2+Z4J.w1I+Z4J.F1I+u2X+Z4J.o6I)][K7X]();d(j)[(Z4J.w1I+f4)]("."+a);d(q)[(Z4J.w1I+c8I+c8I)]((l6+Z4J.g7I+i5J+Z4J.F1I+Z4J.l0X)+a);d("div.DTE_Body_Content")[(Z4J.w1I+f4)]("scroll."+a);d((G8X+w8+Z4J.g7I))[t9J]((e4I+u3I+Z4J.l0X)+a);}
,_hours24To12:function(a){return 0===a?12:12<a?a-12:a;}
,_htmlDay:function(a){var S5='ay',q6X='tt',E5="day",B2="disa";if(a.empty)return '<td class="empty"></td>';var b=[(w8+y3)],c=this[Z4J.V2][N7X];a[(B2+N8+Z4J.z5I+Z4J.q2+w8)]&&b[q7I]((H0J+Z4J.n6I+Z4J.Y8+N8+P3I));a[(Z4J.i0I+G1+Z4J.Y8+Z4J.g7I)]&&b[q7I]("today");a[r4X]&&b[(l2I+w5)]("selected");return '<td data-day="'+a[(E5)]+(k6J+B2I+t8J+n9J+n9J+i8X)+b[W6I](" ")+'"><button class="'+c+(F6X+N8+Z4J.R0I+E2I+Z4J.w1I+Z4J.F1I+W4J)+c+(m6+m2I+q4I+F2J+k6J+c0X+H3J+i8X+Z4I+B0X+q6X+d9I+v9I+k6J+m2I+h1+q4I+m6+F2J+m8I+L6+i8X)+a[(j1+Z4J.Y8+Z4J.o6I)]+'" data-month="'+a[(Z8J+Z4J.F1I+U1I)]+(k6J+m2I+h1+q4I+m6+m2I+S5+i8X)+a[E5]+(H6)+a[(E5)]+(P0o+N8+n4J+Z4J.i0I+t7+U+Z4J.i0I+w8+N2X);}
,_htmlMonth:function(a,b){var Y9="><",a1I="Mon",c7I='ead',h6X="kN",e8I="showWeekNumber",p0I="refi",X3J="_htmlWeekOfYear",f3X="Nu",H4X="owWeek",d2J="_htmlDay",c4="fu",W5="etUTC",S0o="ys",q4J="sab",U6J="_compareDates",d3J="_comp",u4J="Secon",L1X="UTCMin",m5J="setUTCHours",g5="setSeconds",V0J="setUTCMinutes",T2="TCHo",S3="axDate",l7X="irstD",u8I="TCDa",i7J="_daysInMonth",c=new Date,e=this[i7J](a,b),f=(new Date(Date[G2J](a,b,1)))[(Z8I+Z4J.q2+m8+u8I+Z4J.g7I)](),g=[],h=[];0<this[Z4J.V2][G7I]&&(f-=this[Z4J.V2][(c8I+l7X+y3)],0>f&&(f+=7));for(var i=e+f,j=i;7<j;)j-=7;var i=i+(7-j),j=this[Z4J.V2][R6J],m=this[Z4J.V2][(o5I+S3)];j&&(j[(Z4J.n6I+K5I+T2+Z4J.R0I+B9X)](0),j[V0J](0),j[g5](0));m&&(m[m5J](23),m[(Z4J.n6I+Z4J.q2+Z4J.i0I+L1X+Z4J.R0I+c1X)](59),m[(Z4J.n6I+Z4J.q2+Z4J.i0I+u4J+w5I)](59));for(var n=0,p=0;n<i;n++){var o=new Date(Date[G2J](a,b,1+(n-f))),q=this[Z4J.n6I][w8]?this[(d3J+v6+Z4J.q2+N8J+c1X)](o,this[Z4J.n6I][w8]):!1,r=this[U6J](o,c),s=n<f||n>=e+f,t=j&&o<j||m&&o>m,v=this[Z4J.V2][(H0J+q4J+Z4J.z5I+Z4J.q2+j3+Z4J.Y8+S0o)];d[(r9X+X0+Z4J.o6I+y3)](v)&&-1!==d[(S3I+Z4J.F1I+U4X+Z4J.o6I+Y8X+Z4J.g7I)](o[(Z8I+W5+N8J+Z4J.g7I)](),v)?t=!0:(c4+M7X+Z4J.i0I+S3I+t7)===typeof v&&!0===v(o)&&(t=!0);h[(k6I+Z4J.R0I+w5)](this[d2J]({day:1+(n-f),month:b,year:a,selected:q,today:r,disabled:t,empty:s}
));7===++p&&(this[Z4J.V2][(Z4J.n6I+y3I+H4X+f3X+o5I+N8+Q2)]&&h[(Z4J.R0I+Z4J.F1I+Z4J.n6I+h1I+c8I+Z4J.i0I)](this[X3J](n-f,b,a)),g[q7I]("<tr>"+h[W6I]("")+(P0o+Z4J.i0I+Z4J.o6I+N2X)),h=[],p=0);}
c=this[Z4J.V2][(Z4J.V2+q2J+i1+p0I+z0J)]+(F6X+Z4J.i0I+Z4J.Y8+l3);this[Z4J.V2][e8I]&&(c+=(W4J+j0J+Z4J.q2+Z4J.q2+h6X+Z4J.R0I+P7J+Z4J.q2+Z4J.o6I));return (x5+c0X+M9I+K2X+q2X+B2I+P7I+b6+n9J+i8X)+c+(b0X+c0X+v0J+c7I+y2)+this[(F4+h0J+Z4J.z5I+a1I+Z4J.i0I+y3I+w7I+b4)]()+(P0o+Z4J.i0I+W7X+w8+Y9+Z4J.i0I+N8+i2X+N2X)+g[W6I]("")+(P0o+Z4J.i0I+N8+Z4J.w1I+g3I+U+Z4J.i0I+Z4J.w2+Z4J.z5I+Z4J.q2+N2X);}
,_htmlMonthHead:function(){var x5I="ush",v7I="Num",O2I="eek",a=[],b=this[Z4J.V2][G7I],c=this[Z4J.V2][(S3I+U1X+B0o+Z4J.F1I)],e=function(a){var T8I="weekdays";for(a+=b;7<=a;)a-=7;return c[T8I][a];}
;this[Z4J.V2][(Z4J.n6I+y3I+O2+j0I+O2I+v7I+N8+Z4J.q2+Z4J.o6I)]&&a[(k6I+x5I)]("<th></th>");for(var d=0;7>d;d++)a[(l2I+Z4J.n6I+y3I)]((M4X+Z4J.i0I+y3I+N2X)+e(d)+(P0o+Z4J.i0I+y3I+N2X));return a[(Z4J.i5I+Z4J.w1I+S3I+Z4J.F1I)]("");}
,_htmlWeekOfYear:function(a,b,c){var l3J="classPr",j8I="CDa",l7="ei",e=new Date(c,0,1),a=Math[(Z4J.V2+l7+Z4J.z5I)](((new Date(c,b,a)-e)/864E5+e[(Z8I+Z4J.q2+o1J+j8I+Z4J.g7I)]()+1)/7);return '<td class="'+this[Z4J.V2][(l3J+Z4J.q2+c8I+S3I+z0J)]+(m6+R7J+m8I+m8I+b9I+H6)+a+(P0o+Z4J.i0I+w8+N2X);}
,_options:function(a,b,c){var n8I="assP";c||(c=b);a=this[Z6J][(H0X+B7+S3I+F3I)][T9X]((u1+p5J+Z4J.l0X)+this[Z4J.V2][(Z4J.V2+Z4J.z5I+n8I+Z4J.o6I+Z4J.q2+b9+z0J)]+"-"+a);a.empty();for(var e=0,d=b.length;e<d;e++)a[w1X]('<option value="'+b[e]+(H6)+c[e]+(P0o+Z4J.w1I+k6I+Z4J.i0I+S3I+Z4J.w1I+Z4J.F1I+N2X));}
,_optionSet:function(a,b){var Z0o="unknown",B1I="ected",k2J="refix",w5X="clas",c=this[(w8+Z4J.w1I+o5I)][(f2J+g3X+Z4J.Y8+Y0o+Q2)][(c8I+h5J)]("select."+this[Z4J.V2][(w5X+x7X+k2J)]+"-"+a),e=c.parent()[(Z4J.V2+w7X+w8+Z4J.o6I+q8)]("span");c[y1](b);c=c[(c8I+Y0o+w8)]((Y7X+J0o+Z4J.n6I+w7+B1I));e[(E4J+o5I+Z4J.z5I)](0!==c.length?c[(I6I+z0J+Z4J.i0I)]():this[Z4J.V2][k1I][Z0o]);}
,_optionsTime:function(a,b,c){var x0J="fix",a=this[Z6J][(H0X+Z4J.i0I+Z4J.Y8+Y5J+Z4J.o6I)][T9X]((u1+m0I+i8J+Z4J.l0X)+this[Z4J.V2][(Q4J+Z1+Z4J.n6I+i1+Z4J.o6I+Z4J.q2+x0J)]+"-"+a),e=0,d=b,f=12===b?function(a){return a;}
:this[(j6J+Z4J.Y8+w8)];12===b&&(e=1,d=13);for(b=e;b<d;b+=c)a[(e0+k6I+Z4J.q2+Z4J.F1I+w8)]('<option value="'+b+'">'+f(b)+(P0o+Z4J.w1I+k6I+Z4J.i0I+S3I+Z4J.w1I+Z4J.F1I+N2X));}
,_optionsTitle:function(){var M1X="_range",H4J="hs",n3J="_r",w7J="mon",p9I="opt",V0X="yearRange",f9="Ye",o4="tFull",M6J="rRang",V5="yea",W0X="getF",a=this[Z4J.V2][(D7I+R6)],b=this[Z4J.V2][(o5I+S3I+Z4J.F1I+N8J+Z4J.i0I+Z4J.q2)],c=this[Z4J.V2][(A9J+z0J+n7J+Z4J.q2)],b=b?b[(n6+P1+Z4J.R0I+q5I+V9+Z4J.q2+v6)]():null,c=c?c[(W0X+g8J+D3X)]():null,b=null!==b?b:(new Date)[D8J]()-this[Z4J.V2][(V5+M6J+Z4J.q2)],c=null!==c?c:(new Date)[(n6+o4+f9+Z4J.Y8+Z4J.o6I)]()+this[Z4J.V2][V0X];this[(F4+p9I+s4+Z4J.n6I)]((w7J+Z4J.i0I+y3I),this[(n3J+Q+n6)](0,11),a[(w7J+Z4J.i0I+H4J)]);this[u8]("year",this[M1X](b,c));}
,_pad:function(a){return 10>a?"0"+a:a;}
,_position:function(){var e2X="ndTo",j5I="erHeight",E8J="out",G3X="onta",a=this[Z6J][(Y0o+W2I)][(t9J+Y9J)](),b=this[(Z6J)][(Z4J.V2+G3X+S3I+Z4J.F1I+Z4J.q2+Z4J.o6I)],c=this[(w8+S7)][(S3I+r4)][(E8J+j5I)]();b[v3J]({top:a.top+c,left:a[s2I]}
)[(Z4J.Y8+N0J+Z4J.q2+e2X)]("body");var e=b[u6I](),f=d("body")[(Z4J.n6I+Z4J.V2+P1X+g6J+k6I)]();a.top+c+e-f>d(j).height()&&(a=a.top-e,b[(Z4J.V2+Z4J.n6I+Z4J.n6I)]((Z4J.i0I+Z4J.w1I+k6I),0>a?0:a));}
,_range:function(a,b){for(var c=[],e=a;e<=b;e++)c[q7I](e);return c;}
,_setCalander:function(){var R8="isplay",f5="lM",p0="_htm";this[Z6J][(Z4J.V2+w2X+Z4J.F1I+Z4J.C6J+Z4J.o6I)].empty()[w1X](this[(p0+f5+t7+Z4J.i0I+y3I)](this[Z4J.n6I][(w8+R8)][W2X](),this[Z4J.n6I][(w8+S3I+Z4J.n6I+V7I+Z4J.g7I)][(Z8I+Z4J.A4+D7+W0I+g6+Z4J.w1I+r1J)]()));}
,_setTitle:function(){var c4I="lY",I7="CFul",H6X="displ";this[(F4+Z4J.w1I+k6I+Z4J.i0I+Q7X+Z4J.F1I+w9+Z4J.i0I)]((Z8J+g3X+y3I),this[Z4J.n6I][(H6X+Z4J.Y8+Z4J.g7I)][f5J]());this[L3I]((Z4J.g7I+H5I),this[Z4J.n6I][p6J][(Z8I+Z4J.q2+m8+X6+I7+c4I+Z4J.q2+Z4J.Y8+Z4J.o6I)]());}
,_setTime:function(){var z9I="optio",l1J="Mi",d7I="4T",j3J="_ho",s4I="hou",H8="ptionS",b5J="getUTCHours",a=this[Z4J.n6I][w8],b=a?a[b5J]():0;this[Z4J.n6I][B8X][i4X]?(this[(F4+Z4J.w1I+H8+Z4J.q2+Z4J.i0I)]((s4I+B9X),this[(j3J+g5J+Z4J.n6I+w6X+d7I+Z4J.w1I+U1X+w6X)](b)),this[L3I]("ampm",12>b?(Z4J.Y8+o5I):(k6I+o5I))):this[L3I]((I9J+g5J+Z4J.n6I),b);this[L3I]((o5I+S3I+Z4J.F1I+Z4J.R0I+c1X),a?a[(Z8I+Z4J.q2+m8+W0I+l1J+Z4J.F1I+n4J+Z4J.q2+Z4J.n6I)]():0);this[(F4+z9I+Z4J.F1I+R0+Z4J.q2+Z4J.i0I)]("seconds",a?a[(n6+Z4J.i0I+w9+H0X+w5I)]():0);}
,_show:function(){var t1="yd",u0I="scr",Y="_position",V1="esiz",F1X="mesp",a=this,b=this[Z4J.n6I][(g7X+F1X+Y7I)];this[(F4+E7I+Z4J.n6I+S3I+Z4J.i0I+s4)]();d(j)[t7]("scroll."+b+(W4J+Z4J.o6I+V1+Z4J.q2+Z4J.l0X)+b,function(){a[Y]();}
);d("div.DTE_Body_Content")[(Z4J.w1I+Z4J.F1I)]((u0I+A0I+Z4J.z5I+Z4J.l0X)+b,function(){a[Y]();}
);d(q)[t7]((l6+t1+o0I+Z4J.l0X)+b,function(b){var b8J="key",z3="ey",x9J="eyCo";(9===b[(u3I+x9J+y9I)]||27===b[(u3I+z3+G4X+O1X)]||13===b[(b8J+G4X+O1X)])&&a[(M4)]();}
);setTimeout(function(){d("body")[t7]("click."+b,function(b){var X1X="rg";!d(b[d6J])[(k6I+v6+q8+Z4J.i0I+Z4J.n6I)]()[k6X](a[(w8+Z4J.w1I+o5I)][(Z4J.V2+S3J+A7+F3I)]).length&&b[(B7+X1X+Z4J.A4)]!==a[(Z6J)][(Y0o+W2I)][0]&&a[M4]();}
);}
,10);}
,_writeOutput:function(a){var Y6I="_pa",a2J="Yea",T5I="momentLocale",p3="utc",b=this[Z4J.n6I][w8],b=j[(Z8J+o5I+Z4J.q2+Z4J.F1I+Z4J.i0I)]?j[H7I][p3](b,h,this[Z4J.V2][T5I],this[Z4J.V2][N3I])[o7J](this[Z4J.V2][o7J]):b[(n6+m8+X6+G4X+X5+q5I+a2J+Z4J.o6I)]()+"-"+this[(Y6I+w8)](b[f5J]()+1)+"-"+this[(j6J+Z4J.Y8+w8)](b[Y1I]());this[Z6J][(S3I+n8X+Z4J.R0I+Z4J.i0I)][(e7J+Z4J.z5I)](b);a&&this[Z6J][(S3I+Z4J.F1I+k6I+Z4J.R0I+Z4J.i0I)][O6I]();}
}
);f[(j3+z1+Z4J.q2+X6+S3I+A1J)][(F4+e9X+V3+Z4J.q2)]=E0;f[H1J][(w8+Z4J.q2+g5X+Z4J.n6I)]={classPrefix:L4J,disableDays:c3X,firstDay:N0,format:(V9+r8+V9+F6X+g6+g6+F6X+j3+j3),i18n:f[(w8+W9+Z4J.Y8+g8J+Z4J.I2I)][(D1X+Z4J.F1I)][(w8+Z4J.Y8+Z4J.i0I+O7J+Z4J.q2)],maxDate:c3X,minDate:c3X,minutesIncrement:N0,momentStrict:!E0,momentLocale:q8,secondsIncrement:N0,showWeekNumber:!N0,yearRange:f2I}
;var I=function(a,b){var Q1X="div.upload button",D4I="...",f4J="hoose",i6="uploadText";if(c3X===b||b===h)b=a[i6]||(G4X+f4J+W4J+c8I+S3I+Z4J.z5I+Z4J.q2+D4I);a[(L3X+l2I+Z4J.i0I)][(b9+F9X)](Q1X)[z6I](b);}
,M=function(a,b,c){var U2="]",Y2X="=",W7="[",b4J="nder",l3X="oDr",i7="E_Upl",i4="agex",w6I="eav",R3I="drop",I6X="Drag",n8="pT",y2I="gDro",A6="dragDrop",k0="eRea",n3I='ered',D0o='ell',v7X='ll',v2='ton',X='lue',y0I='V',a9='il',x6='yp',M1I='np',O9='" /><',L2X='load',c3J='_ta',z0I='itor_uplo',F5J="asses",e=a[(Z4J.V2+Z4J.z5I+F5J)][y0o][g8],g=d((x5+m2I+T7I+Y7J+q2X+B2I+P7I+q4I+n9J+n9J+i8X+m8I+m2I+z0I+q4I+m2I+b0X+m2I+T7I+Y7J+q2X+B2I+P7I+q4I+n9J+n9J+i8X+m8I+B0X+c3J+Z4I+K2X+b0X+m2I+v3+q2X+B2I+t8J+e0J+i8X+G9J+d9I+R7J+b0X+m2I+T7I+Y7J+q2X+B2I+P7I+q4I+n9J+n9J+i8X+B2I+B5+P7I+q2X+B0X+H7J+L2X+b0X+Z4I+t4X+q2X+B2I+P7I+o5X+i8X)+e+(O9+T7I+M1I+B0X+c0X+q2X+c0X+x6+m8I+i8X+c2I+a9+m8I+t3X+m2I+v3+B6I+m2I+T7I+Y7J+q2X+B2I+P7I+q4I+e0J+i8X+B2I+B5+P7I+q2X+B2I+K2X+L6+y0I+q4I+X+b0X+Z4I+B0X+c0X+v2+q2X+B2I+t8J+e0J+i8X)+e+(s4X+m2I+T7I+Y7J+o9+m2I+v3+B6I+m2I+T7I+Y7J+q2X+B2I+U9+n9J+i8X+G9J+d9I+R7J+q2X+n9J+m8I+A7X+v9I+m2I+b0X+m2I+v3+q2X+B2I+P7I+q4I+e0J+i8X+B2I+m8I+v7X+b0X+m2I+v3+q2X+B2I+P7I+b6+n9J+i8X+m2I+G9J+d9I+H7J+b0X+n9J+H7J+q4I+v9I+P8X+m2I+T7I+Y7J+o9+m2I+v3+B6I+m2I+v3+q2X+B2I+t8J+n9J+n9J+i8X+B2I+D0o+b0X+m2I+T7I+Y7J+q2X+B2I+t8J+e0J+i8X+G9J+V6+m2I+n3I+t3X+m2I+v3+o9+m2I+T7I+Y7J+o9+m2I+T7I+Y7J+o9+m2I+v3+y2));b[(F4+S3I+Z4J.F1I+l2I+Z4J.i0I)]=g;b[(E4+N8+m0I+w8)]=!E0;I(b);if(j[(o3+S3I+Z4J.z5I+k0+l8)]&&!N0!==b[A6]){g[T9X]((H0J+g0J+Z4J.l0X+w8+X6X+W4J+Z4J.n6I+o8I+Z4J.F1I))[(Z4J.i0I+s0X)](b[(J4I+Z4J.Y8+y2I+n8+Z4J.q2+z0J+Z4J.i0I)]||(I6X+W4J+Z4J.Y8+Z4J.F1I+w8+W4J+w8+Z4J.o6I+Z4J.w1I+k6I+W4J+Z4J.Y8+W4J+c8I+G6J+Z4J.q2+W4J+y3I+Q2+Z4J.q2+W4J+Z4J.i0I+Z4J.w1I+W4J+Z4J.R0I+M7I+y5J));var h=g[(c8I+S3I+Z4J.F1I+w8)]((w8+P9X+Z4J.l0X+w8+Z4J.o6I+Z4J.w1I+k6I));h[(t7)](R3I,function(e){var V6J="eClas",c9="dataTransfer",Z8X="lEv",L9X="orig";b[x4J]&&(f[(Z4J.R0I+A5I+b4)](a,b,e[(L9X+S3I+Z4J.F1I+Z4J.Y8+Z8X+Z4J.q2+Z4J.F1I+Z4J.i0I)][c9][G0I],I,c),h[(Z4J.o6I+i2J+g0J+V6J+Z4J.n6I)]((a0X+Z4J.o6I)));return !N0;}
)[t7]((L4I+Z8I+Z4J.z5I+w6I+Z4J.q2+W4J+w8+Z4J.o6I+i4+Z9X),function(){var o5J="over",O5I="oveC";b[x4J]&&h[(Z4J.o6I+Z4J.q2+o5I+O5I+q2J)](o5J);return !N0;}
)[(t7)]((J4I+L9+a0X+Z4J.o6I),function(){b[(F4+q8+Z4J.Y8+N8+P3I)]&&h[d8J]((a0X+Z4J.o6I));return !N0;}
);a[(Z4J.w1I+Z4J.F1I)](Y5X,function(){var m6X="_Upl",l9I="ver";d(Q5X)[t7]((L4I+Z8I+Z4J.w1I+l9I+Z4J.l0X+j3+X6+i7+Z4J.w1I+Z4J.Y8+w8+W4J+w8+k7X+k6I+Z4J.l0X+j3+X7+m6X+h6+w8),function(){return !N0;}
);}
)[(t7)](d5I,function(){var l6I="E_U",m7I="gov";d((N8+G1+Z4J.g7I))[(d6+c8I)]((w8+Z4J.o6I+Z4J.Y8+m7I+Q2+Z4J.l0X+j3+X6+i7+h6+w8+W4J+w8+Z4J.o6I+Z4J.w1I+k6I+Z4J.l0X+j3+X6+l6I+k6I+Z4J.z5I+Z4J.w1I+b4));}
);}
else g[d8J]((Z4J.F1I+l3X+Z4J.w1I+k6I)),g[(Z4J.Y8+N0J+Z4J.q2+F9X)](g[(c8I+S3I+Z4J.F1I+w8)]((w8+S3I+g0J+Z4J.l0X+Z4J.o6I+Z4J.q2+b4J+Z4J.q2+w8)));g[(b9+Z4J.F1I+w8)](I0I)[t7]((Z4J.V2+u1I+z9J),function(){f[j3I][r2][Y9J][L5I](a,b,g0I);}
);g[T9X]((Y0o+l2I+Z4J.i0I+W7+Z4J.i0I+Z4J.g7I+g6I+Y2X+c8I+S3I+Z4J.z5I+Z4J.q2+U2))[(t7)]((Z4J.V2+y3I+Z4J.Y8+M5X+Z4J.q2),function(){f[r2](a,b,this[(c8I+S3I+m0I+Z4J.n6I)],I,function(b){var M2="input[type=file]";c[(d5J+Z4J.z5I)](a,b);g[T9X](M2)[(g0J+Z4J.Y8+Z4J.z5I)](g0I);}
);}
);return g;}
,A=function(a){setTimeout(function(){var d0J="trigge";a[(d0J+Z4J.o6I)]((v1+Z4J.F1I+n6),{editor:!E0,editorSet:!E0}
);}
,E0);}
,s=f[(c8I+S3I+Z4J.q2+Z4J.z5I+w8+Y5I+k6I+B4)],p=d[(p5+Z4J.i0I+q8+w8)](!E0,{}
,f[(E1)][w8J],{get:function(a){return a[(F4+S3I+Z4J.F1I+k6I+n4J)][(g0J+X0I)]();}
,set:function(a,b){a[m8X][y1](b);A(a[(F4+S3I+Z4J.F1I+W2I)]);}
,enable:function(a){a[(m8X)][x3I]((S0+Z4J.Y8+N8+Z4J.z5I+u9),q9I);}
,disable:function(a){var e3X="isab";a[m8X][(x3I)]((w8+e3X+Z4J.z5I+u9),v3X);}
}
);s[e5]={create:function(a){a[(F4+y1)]=a[o0X];return c3X;}
,get:function(a){return a[C7];}
,set:function(a,b){a[(W5J+Z4J.Y8+Z4J.z5I)]=b;}
}
;s[A6I]=d[H3I](!E0,{}
,p,{create:function(a){a[(F4+Y0o+k6I+Z4J.R0I+Z4J.i0I)]=d((M4X+S3I+n8X+Z4J.R0I+Z4J.i0I+i9X))[l5X](d[H3I]({id:f[T0J](a[(J1J)]),type:(k0X),readonly:A6I}
,a[(z1+U8I)]||{}
));return a[(F4+S3I+P3J+Z4J.i0I)][E0];}
}
);s[k0X]=d[H3I](!E0,{}
,p,{create:function(a){a[(m8X)]=d((M4X+S3I+Z4J.F1I+k6I+Z4J.R0I+Z4J.i0I+i9X))[(Z4J.Y8+c2J)](d[H3I]({id:f[T0J](a[(J1J)]),type:(W6X+Z4J.i0I)}
,a[l5X]||{}
));return a[(F4+S3I+r4)][E0];}
}
);s[(o8I+Z4J.n6I+Z4J.n6I+j0J+Z4J.w1I+I3X)]=d[(Z4J.q2+z0J+Z4J.i0I+Z4J.q2+Z4J.F1I+w8)](!E0,{}
,p,{create:function(a){var e8J="word";a[m8X]=d((M4X+S3I+n8X+n4J+i9X))[l5X](d[(p5+Z4J.i0I+Z4J.q2+F9X)]({id:f[T0J](a[(S3I+w8)]),type:(o8I+t8+e8J)}
,a[(Z4J.Y8+Z4J.i0I+Z4J.i0I+Z4J.o6I)]||{}
));return a[m8X][E0];}
}
);s[P5X]=d[(Z4J.q2+e2+C5I)](!E0,{}
,p,{create:function(a){var g3J="tend",R1J="tar";a[(z1J+Z4J.F1I+k6I+n4J)]=d((M4X+Z4J.i0I+Z4J.q2+z0J+R1J+Z4J.q2+Z4J.Y8+i9X))[(Z4J.Y8+Z4J.i0I+Z4J.i0I+Z4J.o6I)](d[(p5+g3J)]({id:f[T0J](a[J1J])}
,a[l5X]||{}
));return a[(F4+Y0o+l2I+Z4J.i0I)][E0];}
}
);s[(I2J+K3X)]=d[(p5+I6I+F9X)](!0,{}
,p,{_addOptions:function(a,b){var Y4="placeholderDisabled",D7J="olderDi",X6I="ceh",u7="placeholderValue",R7X="rVa",u9I="olde",D9="eh",w3I="lac",n5J="eholde",c=a[(m8X)][0][V6X],e=0;c.length=0;if(a[(M7I+N4+n5J+Z4J.o6I)]!==h){e=e+1;c[0]=new Option(a[s4J],a[(k6I+w3I+D9+u9I+R7X+Z4J.z5I+Z4J.R0I+Z4J.q2)]!==h?a[u7]:"");var d=a[(k6I+Z4J.z5I+Z4J.Y8+X6I+D7J+Z4J.n6I+Z4J.Y8+B2X+Z4J.q2+w8)]!==h?a[Y4]:true;c[0][(y3I+J1J+w8+Z4J.q2+Z4J.F1I)]=d;c[0][c6I]=d;}
b&&f[z4J](b,a[d1],function(a,b,d){c[d+e]=new Option(b,a);c[d+e][z5J]=a;}
);}
,create:function(a){var P0="ipOpts",v9X="ele";a[m8X]=d((M4X+Z4J.n6I+v9X+Z4J.V2+Z4J.i0I+i9X))[l5X](d[(Z4J.q2+z0J+Z4J.i0I+C5I)]({id:f[T0J](a[J1J]),multiple:a[s8J]===true}
,a[(Z4J.Y8+c2J)]||{}
))[(t7)]((Z4J.V2+y3I+Z4J.Y8+Z4J.F1I+Z8I+Z4J.q2+Z4J.l0X+w8+Z4J.i0I+Z4J.q2),function(b,c){var o9J="_lastSet";if(!c||!c[(u9+S3I+Z4J.i0I+u2)])a[o9J]=s[T8J][(Z8I+Z4J.q2+Z4J.i0I)](a);}
);s[(u1+Z4J.z5I+Z4J.V1I+Z4J.i0I)][k3X](a,a[V6X]||a[P0]);return a[(L3X+W2I)][0];}
,update:function(a,b){var w3="lastS",Q4X="ddOp";s[(P2J+Z4J.i0I)][(y7J+Q4X+Z4J.i0I+S3I+Z4J.w1I+Z4J.F1I+Z4J.n6I)](a,b);var c=a[(F4+w3+Z4J.q2+Z4J.i0I)];c!==h&&s[T8J][(Z4J.n6I+Z4J.q2+Z4J.i0I)](a,c,true);A(a[(F4+Y0o+k6I+n4J)]);}
,get:function(a){var b=a[m8X][(b9+F9X)]((Z4J.w1I+Q8I+S3I+t7+J0o+Z4J.n6I+Z4J.q2+m0I+i8J+Z4J.q2+w8))[(A9J+k6I)](function(){return this[(F4+u9+S3I+Z4J.i0I+Z4J.w1I+Z4J.o6I+F4+y1)];}
)[(Q3I+T0)]();return a[s8J]?a[(Z4J.n6I+Z4J.q2+o8I+Y8X+Z4J.i0I+Z4J.w1I+Z4J.o6I)]?b[W6I](a[z1I]):b:b.length?b[0]:null;}
,set:function(a,b,c){var E1I="ple",A8="tS";if(!c)a[(T1J+Z1+A8+Z4J.A4)]=b;a[(x4X+Z4J.z5I+t1I+k6I+Z4J.z5I+Z4J.q2)]&&a[z1I]&&!d[(r9X+U4X+P8J+Z4J.g7I)](b)?b=b[z5X](a[(u1+k6I+Z4J.Y8+Y8X+Q3I+Z4J.o6I)]):d[S8](b)||(b=[b]);var e,f=b.length,g,h=false,i=a[(L3X+k6I+Z4J.R0I+Z4J.i0I)][T9X]("option");a[(z1J+n8X+n4J)][(c8I+Y0o+w8)]((V7+p9X+Z4J.F1I))[(s8X)](function(){g=false;for(e=0;e<f;e++)if(this[(F4+Z4J.q2+H0J+E7+y1)]==b[e]){h=g=true;break;}
this[r4X]=g;}
);if(a[s4J]&&!h&&!a[(o5I+I8I+S3I+E1I)]&&i.length)i[0][r4X]=true;c||A(a[(L3X+l2I+Z4J.i0I)]);return h;}
,destroy:function(a){a[(z1J+Z4J.F1I+k6I+Z4J.R0I+Z4J.i0I)][(Z4J.w1I+f4)]((v1+Z4J.F1I+n6+Z4J.l0X+w8+Z4J.i0I+Z4J.q2));}
}
);s[M2X]=d[(Z4J.q2+z0+F9X)](!0,{}
,p,{_addOptions:function(a,b){var d8X="sPa",c=a[(L3X+k6I+Z4J.R0I+Z4J.i0I)].empty();b&&f[(k6I+A7+B9X)](b,a[(V7+Z4J.i0I+Q7X+Z4J.F1I+d8X+S3I+Z4J.o6I)],function(b,g,h){var T2J="eId",I9="af";c[w1X]('<div><input id="'+f[(Z4J.n6I+I9+T2J)](a[(J1J)])+"_"+h+'" type="checkbox" /><label for="'+f[(Z4J.n6I+I9+Z4J.q2+x1+w8)](a[J1J])+"_"+h+(H6)+g+"</label></div>");d((h5+Z4J.i0I+J0o+Z4J.z5I+Z4J.Y8+Z4J.n6I+Z4J.i0I),c)[(Z4J.Y8+E2I+Z4J.o6I)]((g0J+X0I+Z4J.R0I+Z4J.q2),b)[0][z5J]=b;}
);}
,create:function(a){var D6="pti",n0="Op",k3I="kbo";a[m8X]=d((M4X+w8+P9X+t4I));s[(O9J+Z4J.V1I+k3I+z0J)][(F4+Z4J.Y8+w8+w8+n0+t1I+t7+Z4J.n6I)](a,a[(Z4J.w1I+D6+p3J)]||a[(H0o+n0+Z4J.I2I)]);return a[(L3X+k6I+n4J)][0];}
,get:function(a){var W3X="rato",i8="jo",b=[];a[m8X][(T9X)]("input:checked")[(Z4J.q2+Z4J.Y8+O9J)](function(){b[(l2I+Z4J.n6I+y3I)](this[z5J]);}
);return !a[(u1+k6I+Z4J.Y8+Z4J.o6I+Z4J.Y8+Q3I+Z4J.o6I)]?b:b.length===1?b[0]:b[(i8+S3I+Z4J.F1I)](a[(u1+o8I+W3X+Z4J.o6I)]);}
,set:function(a,b){var c=a[(F4+S3I+Z4J.F1I+k6I+Z4J.R0I+Z4J.i0I)][(b9+Z4J.F1I+w8)]((h5+Z4J.i0I));!d[S8](b)&&typeof b===(z6X+Y0o+Z8I)?b=b[(Z4J.n6I+k6I+Z4J.z5I+Z9X)](a[z1I]||"|"):d[S8](b)||(b=[b]);var e,f=b.length,g;c[s8X](function(){g=false;for(e=0;e<f;e++)if(this[z5J]==b[e]){g=true;break;}
this[(O9J+Z4J.V1I+u3I+Z4J.q2+w8)]=g;}
);A(c);}
,enable:function(a){a[(P6X+Z4J.i0I)][T9X]((Y0o+k6I+n4J))[(k6I+k7X+k6I)]((H0J+Z4J.n6I+Z4J.w2+P3I),false);}
,disable:function(a){a[m8X][T9X]((S3I+r4))[(G0J+V7)]("disabled",true);}
,update:function(a,b){var r4J="ddO",c=s[M2X],d=c[(Z8I+Z4J.q2+Z4J.i0I)](a);c[(F4+Z4J.Y8+r4J+Q8I+J5X)](a,b);c[(Z4J.n6I+Z4J.q2+Z4J.i0I)](a,d);}
}
);s[r7J]=d[H3I](!0,{}
,p,{_addOptions:function(a,b){var c=a[m8X].empty();b&&f[(k6I+Z4J.Y8+S3I+Z4J.o6I+Z4J.n6I)](b,a[d1],function(b,g,h){var P8='me',m3I='dio';c[(e0+K4X)]('<div><input id="'+f[T0J](a[J1J])+"_"+h+(k6J+c0X+H3J+i8X+G9J+q4I+m3I+k6J+v9I+q4I+P8+i8X)+a[(Z4J.F1I+a0+Z4J.q2)]+'" /><label for="'+f[T0J](a[(S3I+w8)])+"_"+h+'">'+g+(P0o+Z4J.z5I+Z4J.Y8+N8+w7+U+w8+S3I+g0J+N2X));d("input:last",c)[(Z4J.Y8+Z4J.i0I+Z4J.i0I+Z4J.o6I)]("value",b)[0][(F4+u9+T1+Z4J.o6I+W5J+X0I)]=b;}
);}
,create:function(a){var m4I="ptio",n0X="Opt";a[(z1J+n8X+Z4J.R0I+Z4J.i0I)]=d((M4X+w8+P9X+t4I));s[(Z4J.o6I+b4+Q7X)][(F4+Z4J.Y8+N9I+n0X+S3I+p3J)](a,a[(Z4J.w1I+m4I+Z4J.F1I+Z4J.n6I)]||a[(H0o+s1+Q8I+Z4J.n6I)]);this[(t7)]("open",function(){a[m8X][T9X]("input")[s8X](function(){var c6J="reC";if(this[(j6J+c6J+y3I+Z4J.q2+O0o+w8)])this[B6J]=true;}
);}
);return a[m8X][0];}
,get:function(a){a=a[(F4+S3I+r4)][(c8I+S3I+F9X)]((X4X+Z4J.R0I+Z4J.i0I+J0o+Z4J.V2+t7X+u3I+u9));return a.length?a[0][(F4+Z4J.q2+w8+Z9X+x2J+y1)]:h;}
,set:function(a,b){a[m8X][(b9+Z4J.F1I+w8)]((Y0o+k6I+n4J))[(Z4J.q2+Z4J.Y8+Z4J.V2+y3I)](function(){var n2X="eck",A1I="_preChecked";this[A1I]=false;if(this[(F4+Z4J.q2+w8+S3I+Z4J.i0I+Z4J.w1I+Z4J.o6I+F4+g0J+X0I)]==b)this[(F4+k6I+Z4J.o6I+X7I+t7X+u3I+u9)]=this[B6J]=true;else this[(F4+k6I+Z4J.o6I+Z4J.q2+G4X+y3I+n2X+Z4J.q2+w8)]=this[B6J]=false;}
);A(a[m8X][(c8I+S3I+Z4J.F1I+w8)]("input:checked"));}
,enable:function(a){a[(m8X)][(K3J+w8)]("input")[x3I]("disabled",false);}
,disable:function(a){a[m8X][(c8I+Y0o+w8)]((S3I+n8X+Z4J.R0I+Z4J.i0I))[(p4J+k6I)]("disabled",true);}
,update:function(a,b){var m2="eq",y8J="ilt",c=s[(Z4J.o6I+Z4J.Y8+H0J+Z4J.w1I)],d=c[(R5)](a);c[k3X](a,b);var f=a[m8X][T9X]("input");c[(Y9J)](a,f[(c8I+y8J+Q2)]('[value="'+d+'"]').length?d:f[(m2)](0)[(Z4J.Y8+Z4J.i0I+Z4J.i0I+Z4J.o6I)]("value"));}
}
);s[(w8+Z4J.Y8+Z4J.i0I+Z4J.q2)]=d[H3I](!0,{}
,p,{create:function(a){var z2="../../",g2J="teIm",k9="mage",q0J="eI",i6X="822",p8="_2",T4X="ker",X5I="For",C9="dateFormat",L0X="dC";a[(F4+S3I+Z4J.F1I+k6I+Z4J.R0I+Z4J.i0I)]=d((M4X+S3I+n8X+n4J+t4I))[l5X](d[H3I]({id:f[T0J](a[J1J]),type:(Z4J.i0I+Z4J.q2+z0J+Z4J.i0I)}
,a[(z1+Z4J.i0I+Z4J.o6I)]));if(d[(w8+Z4J.Y8+I6I+k6I+M3J+l6+Z4J.o6I)]){a[(F4+S3I+n8X+Z4J.R0I+Z4J.i0I)][(Z4J.Y8+w8+L0X+Z4J.z5I+Z4J.Y8+Z4J.n6I+Z4J.n6I)]("jqueryui");if(!a[C9])a[(Z4J.C6J+I6I+X5I+A9J+Z4J.i0I)]=d[(c1+S1I+Z4J.V2+T4X)][(v0+o3+G4X+p8+i6X)];if(a[(w8+z1+q0J+k9)]===h)a[(Z4J.C6J+g2J+Z4J.Y8+Z8I+Z4J.q2)]=(z2+S3I+o5I+L9+Z4J.q2+Z4J.n6I+w0X+Z4J.V2+Z4J.Y8+Z4J.z5I+q8+w8+Z4J.q2+Z4J.o6I+Z4J.l0X+k6I+Z4J.F1I+Z8I);setTimeout(function(){var y7X="dateImage",P6="Fo";d(a[(L3X+l2I+Z4J.i0I)])[(Z4J.l1+i3X+Z4J.V2+l6+Z4J.o6I)](d[H3I]({showOn:(N8+Z4J.w1I+U1I),dateFormat:a[(Z4J.l1+Z4J.q2+P6+Z4J.o6I+o5I+z1)],buttonImage:a[y7X],buttonImageOnly:true}
,a[(l5J)]));d("#ui-datepicker-div")[v3J]("display",(w0I+Z4J.q2));}
,10);}
else a[m8X][(Z4J.Y8+E2I+Z4J.o6I)]("type",(Z4J.l1+Z4J.q2));return a[(z1J+P3J+Z4J.i0I)][0];}
,set:function(a,b){var n1J="etDa",E4X="atep";d[o0J]&&a[(F4+S3I+Z4J.F1I+k6I+n4J)][F4J]((C3I+Z4J.n6I+j3+E4X+S3I+Z4J.V2+u3I+Q2))?a[m8X][o0J]((Z4J.n6I+n1J+Z4J.i0I+Z4J.q2),b)[l2]():d(a[(z1J+P3J+Z4J.i0I)])[y1](b);}
,enable:function(a){d[o0J]?a[(z1J+n8X+Z4J.R0I+Z4J.i0I)][o0J]("enable"):d(a[(z1J+Z4J.F1I+l2I+Z4J.i0I)])[(G0J+V7)]("disabled",false);}
,disable:function(a){d[(Z4J.l1+i3X+O0o+Z4J.o6I)]?a[(F4+Y0o+l2I+Z4J.i0I)][o0J]("disable"):d(a[(z1J+P3J+Z4J.i0I)])[(p4J+k6I)]((H0J+Z4J.n6I+Z4J.Y8+l3+w8),true);}
,owns:function(a,b){var f6I="epick",f8J="nts",s2J="icker",m6J="paren";return d(b)[(m6J+Z4J.I2I)]((w8+S3I+g0J+Z4J.l0X+Z4J.R0I+S3I+F6X+w8+z1+W2+s2J)).length||d(b)[(o8I+C3X+f8J)]((H0J+g0J+Z4J.l0X+Z4J.R0I+S3I+F6X+w8+Z4J.Y8+Z4J.i0I+f6I+Z4J.q2+Z4J.o6I+F6X+y3I+h7I+Q2)).length?true:false;}
}
);s[P4]=d[(Z4J.q2+e2+C5I)](!E0,{}
,p,{create:function(a){var E3X="cker";a[(Z0+n4J)]=d((M4X+S3I+Z4J.F1I+W2I+t4I))[(Z4J.Y8+Z4J.i0I+U8I)](d[(Z4J.q2+z0J+Z4J.i0I+C5I)](v3X,{id:f[T0J](a[(S3I+w8)]),type:(W6X+Z4J.i0I)}
,a[l5X]));a[(F4+k6I+S3I+E3X)]=new f[(N8J+I6I+W7I+o5I+Z4J.q2)](a[(L3X+W2I)],d[H3I]({format:a[o7J],i18n:this[(D7I+B0o+Z4J.F1I)][(w8+z1+Z4J.q2+Y0I)]}
,a[l5J]));return a[(L3X+W2I)][E0];}
,set:function(a,b){a[(F4+S1I+z9J+Z4J.q2+Z4J.o6I)][(y1)](b);A(a[m8X]);}
,owns:function(a,b){return a[(j6J+S3I+z9J+Q2)][v2J](b);}
,destroy:function(a){var K3="stroy",F4I="_picker";a[F4I][(y9I+K3)]();}
,minDate:function(a,b){a[(F4+k6I+M3J+l6+Z4J.o6I)][(u6J+Z4J.F1I)](b);}
,maxDate:function(a,b){a[(F4+k6I+S3I+O0o+Z4J.o6I)][(o5I+Z4J.Y8+z0J)](b);}
}
);s[(Z4J.R0I+A5I+Z4J.Y8+w8)]=d[(Z4J.q2+z0J+N5X+w8)](!E0,{}
,p,{create:function(a){var b=this;return M(b,a,function(c){var x2="Type";f[(c8I+S3I+Z4J.q2+Z0I+x2+Z4J.n6I)][(Z4J.R0I+M7I+Z4J.w1I+Z4J.Y8+w8)][Y9J][(Z4J.V2+Z4J.Y8+q5I)](b,a,c[E0]);}
);}
,get:function(a){return a[(F4+g0J+X0I)];}
,set:function(a,b){var i9I="dito",T2I="dl",n3="ger",e5I="trig",Q6X="noClear",d9J="rT",X8I="lea",H1="FileT",A2X="div.rendered";a[(F4+g0J+Z4J.Y8+Z4J.z5I)]=b;var c=a[(z1J+n8X+Z4J.R0I+Z4J.i0I)];if(a[(w8+N9X+Z4J.g7I)]){var d=c[T9X](A2X);a[(F4+e7J+Z4J.z5I)]?d[(E4J+o5I+Z4J.z5I)](a[(w8+S3I+H2+l7I+Z4J.g7I)](a[C7])):d.empty()[(e0+k6I+Z4J.q2+Z4J.F1I+w8)]((M4X+Z4J.n6I+k6I+Z4J.Y8+Z4J.F1I+N2X)+(a[(Z4J.F1I+Z4J.w1I+H1+Z4J.q2+z0J+Z4J.i0I)]||"No file")+"</span>");}
d=c[T9X](I0I);if(b&&a[(Q4J+Z4J.q2+Z4J.Y8+Z4J.o6I+X6+Z4J.q2+z0J+Z4J.i0I)]){d[z6I](a[(Z4J.V2+X8I+d9J+p5+Z4J.i0I)]);c[(J8I+Z4J.w1I+g0J+X7I+Z4J.z5I+Z4J.Y8+Z4J.n6I+Z4J.n6I)]((Z4J.F1I+Z4J.w1I+X7J+H5I));}
else c[(b8X+p2J+Z4J.n6I)](Q6X);a[(P6X+Z4J.i0I)][T9X]((X4X+Z4J.R0I+Z4J.i0I))[(e5I+n3+z8+Z4J.Y8+Z4J.F1I+T2I+Z4J.q2+Z4J.o6I)]((r2+Z4J.l0X+Z4J.q2+i9I+Z4J.o6I),[a[(C7)]]);}
,enable:function(a){a[m8X][T9X]((S3I+r4))[(x3I)]((H0J+Z4J.n6I+Z4J.Y8+N8+P3I),q9I);a[(E4+N8+P3I)]=v3X;}
,disable:function(a){var w4X="_en";a[(F4+S3I+r4)][T9X]((X4X+n4J))[x3I](c6I,v3X);a[(w4X+Z4J.Y8+l3+w8)]=q9I;}
}
);s[(r2+g6+Q+Z4J.g7I)]=d[(s0X+Z4J.q2+F9X)](!0,{}
,p,{create:function(a){var T9="uploadMany",b=this,c=M(b,a,function(c){var M7="ldT";a[C7]=a[(W5J+X0I)][o1I](c);f[(c8I+S3I+Z4J.q2+M7+O7X+B4)][T9][Y9J][(d5J+Z4J.z5I)](b,a,a[(F4+e7J+Z4J.z5I)]);}
);c[(Z4J.Y8+w8+w8+G4X+Z4J.z5I+L1)]((p6+Z4J.i0I+S3I))[(t7)]("click",(u0o+Z4J.i0I+Z4J.w1I+Z4J.F1I+Z4J.l0X+Z4J.o6I+Z4J.q2+f1J+Z4J.q2),function(c){var D4J="stopPropagation";c[D4J]();c=d(this).data((S3I+w8+z0J));a[C7][(Z4J.n6I+k6I+u1I+Z9J)](c,1);f[j3I][T9][Y9J][(L7J+Z4J.z5I+Z4J.z5I)](b,a,a[(W5J+X0I)]);}
);return c;}
,get:function(a){return a[(W5J+X0I)];}
,set:function(a,b){var J9X="_va",S7J="noFileText",k3J="appendTo",L7="ust",t3I="lec",b1I="Uplo";b||(b=[]);if(!d[S8](b))throw (b1I+b4+W4J+Z4J.V2+A0I+t3I+G5X+Z4J.n6I+W4J+o5I+L7+W4J+y3I+Z4J.Y8+l9J+W4J+Z4J.Y8+Z4J.F1I+W4J+Z4J.Y8+Z4J.o6I+Y8X+Z4J.g7I+W4J+Z4J.Y8+Z4J.n6I+W4J+Z4J.Y8+W4J+g0J+X0I+N1J);a[(F4+g0J+X0I)]=b;var c=this,e=a[m8X];if(a[(S0+k6I+c5J)]){e=e[(K3J+w8)]((I1+Z4J.l0X+Z4J.o6I+Z4J.q2+Z4J.F1I+w8+Q2+Z4J.q2+w8)).empty();if(b.length){var f=d("<ul/>")[k3J](e);d[s8X](b,function(b,d){var z9='dx',i1J='ov';f[(e0+k6I+Z4J.q2+Z4J.F1I+w8)]((M4X+Z4J.z5I+S3I+N2X)+a[p6J](d,b)+' <button class="'+c[T4][y0o][g8]+(q2X+G9J+m8I+A9I+i1J+m8I+k6J+m2I+h1+q4I+m6+T7I+z9+i8X)+b+'">&times;</button></li>');}
);}
else e[(Z4J.Y8+X1I+w8)]((M4X+Z4J.n6I+k6I+Q+N2X)+(a[S7J]||"No files")+(P0o+Z4J.n6I+o8I+Z4J.F1I+N2X));}
a[(Z0+n4J)][T9X]("input")[g4I]("upload.editor",[a[(J9X+Z4J.z5I)]]);}
,enable:function(a){var V7X="bled";a[m8X][(K3J+w8)]((S3I+r4))[(k6I+X6X)]("disabled",false);a[(N9J+g7X+V7X)]=true;}
,disable:function(a){a[m8X][T9X]("input")[(G0J+Z4J.w1I+k6I)]((w8+S3I+i0+N8+Z4J.z5I+u9),true);a[x4J]=false;}
}
);r[(p5+Z4J.i0I)][D5I]&&d[H3I](f[(b9+Z4J.q2+Z0I+X6+Z4J.g7I+g6I+Z4J.n6I)],r[s0X][D5I]);r[(s0X)][(Z4J.q2+H0J+Z4J.i0I+Z4J.w1I+g1J+S3I+w7+w5I)]=f[(v7+h8J+m5+Z4J.n6I)];f[(c8I+G6J+Z4J.q2+Z4J.n6I)]={}
;f.prototype.CLASS=P9J;f[L7I]=(U1X+Z4J.l0X+z7X+Z4J.l0X+n9X);return f;}
);

/*! Responsive 2.1.0
 * 2014-2016 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     Responsive
 * @description Responsive tables plug-in for DataTables
 * @version     2.1.0
 * @file        dataTables.responsive.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     www.sprymedia.co.uk/contact
 * @copyright   Copyright 2014-2016 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/**
 * Responsive is a plug-in for the DataTables library that makes use of
 * DataTables' ability to change the visibility of columns, changing the
 * visibility of columns so the displayed columns fit into the table container.
 * The end result is that complex tables will be dynamically adjusted to fit
 * into the viewport, be it on a desktop, tablet or mobile browser.
 *
 * Responsive for DataTables has two modes of operation, which can used
 * individually or combined:
 *
 * * Class name based control - columns assigned class names that match the
 *   breakpoint logic can be shown / hidden as required for each breakpoint.
 * * Automatic control - columns are automatically hidden when there is no
 *   room left to display them. Columns removed from the right.
 *
 * In additional to column visibility control, Responsive also has built into
 * options to use DataTables' child row display to show / hide the information
 * from the table that has been hidden. There are also two modes of operation
 * for this child row display:
 *
 * * Inline - when the control element that the user can use to show / hide
 *   child rows is displayed inside the first column of the table.
 * * Column - where a whole column is dedicated to be the show / hide control.
 *
 * Initialisation of Responsive is performed by:
 *
 * * Adding the class `responsive` or `dt-responsive` to the table. In this case
 *   Responsive will automatically be initialised with the default configuration
 *   options when the DataTable is created.
 * * Using the `responsive` option in the DataTables configuration options. This
 *   can also be used to specify the configuration options, or simply set to
 *   `true` to use the defaults.
 *
 *  @class
 *  @param {object} settings DataTables settings object for the host table
 *  @param {object} [opts] Configuration options
 *  @requires jQuery 1.7+
 *  @requires DataTables 1.10.3+
 *
 *  @example
 *      $('#example').DataTable( {
 *        responsive: true
 *      } );
 *    } );
 */
var Responsive = function ( settings, opts ) {
	// Sanity check that we are using DataTables 1.10 or newer
	if ( ! DataTable.versionCheck || ! DataTable.versionCheck( '1.10.3' ) ) {
		throw 'DataTables Responsive requires DataTables 1.10.3 or newer';
	}

	this.s = {
		dt: new DataTable.Api( settings ),
		columns: [],
		current: []
	};

	// Check if responsive has already been initialised on this table
	if ( this.s.dt.settings()[0].responsive ) {
		return;
	}

	// details is an object, but for simplicity the user can give it as a string
	// or a boolean
	if ( opts && typeof opts.details === 'string' ) {
		opts.details = { type: opts.details };
	}
	else if ( opts && opts.details === false ) {
		opts.details = { type: false };
	}
	else if ( opts && opts.details === true ) {
		opts.details = { type: 'inline' };
	}

	this.c = $.extend( true, {}, Responsive.defaults, DataTable.defaults.responsive, opts );
	settings.responsive = this;
	this._constructor();
};

$.extend( Responsive.prototype, {
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Constructor
	 */

	/**
	 * Initialise the Responsive instance
	 *
	 * @private
	 */
	_constructor: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var dtPrivateSettings = dt.settings()[0];
		var oldWindowWidth = $(window).width();

		dt.settings()[0]._responsive = this;

		// Use DataTables' throttle function to avoid processor thrashing on
		// resize
		$(window).on( 'resize.dtr orientationchange.dtr', DataTable.util.throttle( function () {
			// iOS has a bug whereby resize can fire when only scrolling
			// See: http://stackoverflow.com/questions/8898412
			var width = $(window).width();

			if ( width !== oldWindowWidth ) {
				that._resize();
				oldWindowWidth = width;
			}
		} ) );

		// DataTables doesn't currently trigger an event when a row is added, so
		// we need to hook into its private API to enforce the hidden rows when
		// new data is added
		dtPrivateSettings.oApi._fnCallbackReg( dtPrivateSettings, 'aoRowCreatedCallback', function (tr, data, idx) {
			if ( $.inArray( false, that.s.current ) !== -1 ) {
				$('td, th', tr).each( function ( i ) {
					var idx = dt.column.index( 'toData', i );

					if ( that.s.current[idx] === false ) {
						$(this).css('display', 'none');
					}
				} );
			}
		} );

		// Destroy event handler
		dt.on( 'destroy.dtr', function () {
			dt.off( '.dtr' );
			$( dt.table().body() ).off( '.dtr' );
			$(window).off( 'resize.dtr orientationchange.dtr' );

			// Restore the columns that we've hidden
			$.each( that.s.current, function ( i, val ) {
				if ( val === false ) {
					that._setColumnVis( i, true );
				}
			} );
		} );

		// Reorder the breakpoints array here in case they have been added out
		// of order
		this.c.breakpoints.sort( function (a, b) {
			return a.width < b.width ? 1 :
				a.width > b.width ? -1 : 0;
		} );

		this._classLogic();
		this._resizeAuto();

		// Details handler
		var details = this.c.details;

		if ( details.type !== false ) {
			that._detailsInit();

			// DataTables will trigger this event on every column it shows and
			// hides individually
			dt.on( 'column-visibility.dtr', function (e, ctx, col, vis) {
				that._classLogic();
				that._resizeAuto();
				that._resize();
			} );

			// Redraw the details box on each draw which will happen if the data
			// has changed. This is used until DataTables implements a native
			// `updated` event for rows
			dt.on( 'draw.dtr', function () {
				that._redrawChildren();
			} );

			$(dt.table().node()).addClass( 'dtr-'+details.type );
		}

		dt.on( 'column-reorder.dtr', function (e, settings, details) {
			that._classLogic();
			that._resizeAuto();
			that._resize();
		} );

		// Change in column sizes means we need to calc
		dt.on( 'column-sizing.dtr', function () {
			that._resizeAuto();
			that._resize();
		});

		dt.on( 'init.dtr', function (e, settings, details) {
			that._resizeAuto();
			that._resize();

			// If columns were hidden, then DataTables needs to adjust the
			// column sizing
			if ( $.inArray( false, that.s.current ) ) {
				dt.columns.adjust();
			}
		} );

		// First pass - draw the table for the current viewport size
		this._resize();
	},


	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Private methods
	 */

	/**
	 * Calculate the visibility for the columns in a table for a given
	 * breakpoint. The result is pre-determined based on the class logic if
	 * class names are used to control all columns, but the width of the table
	 * is also used if there are columns which are to be automatically shown
	 * and hidden.
	 *
	 * @param  {string} breakpoint Breakpoint name to use for the calculation
	 * @return {array} Array of boolean values initiating the visibility of each
	 *   column.
	 *  @private
	 */
	_columnsVisiblity: function ( breakpoint )
	{
		var dt = this.s.dt;
		var columns = this.s.columns;
		var i, ien;

		// Create an array that defines the column ordering based first on the
		// column's priority, and secondly the column index. This allows the
		// columns to be removed from the right if the priority matches
		var order = columns
			.map( function ( col, idx ) {
				return {
					columnIdx: idx,
					priority: col.priority
				};
			} )
			.sort( function ( a, b ) {
				if ( a.priority !== b.priority ) {
					return a.priority - b.priority;
				}
				return a.columnIdx - b.columnIdx;
			} );

		// Class logic - determine which columns are in this breakpoint based
		// on the classes. If no class control (i.e. `auto`) then `-` is used
		// to indicate this to the rest of the function
		var display = $.map( columns, function ( col ) {
			return col.auto && col.minWidth === null ?
				false :
				col.auto === true ?
					'-' :
					$.inArray( breakpoint, col.includeIn ) !== -1;
		} );

		// Auto column control - first pass: how much width is taken by the
		// ones that must be included from the non-auto columns
		var requiredWidth = 0;
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( display[i] === true ) {
				requiredWidth += columns[i].minWidth;
			}
		}

		// Second pass, use up any remaining width for other columns. For
		// scrolling tables we need to subtract the width of the scrollbar. It
		// may not be requires which makes this sub-optimal, but it would
		// require another full redraw to make complete use of those extra few
		// pixels
		var scrolling = dt.settings()[0].oScroll;
		var bar = scrolling.sY || scrolling.sX ? scrolling.iBarWidth : 0;
		var widthAvailable = dt.table().container().offsetWidth - bar;
		var usedWidth = widthAvailable - requiredWidth;

		// Control column needs to always be included. This makes it sub-
		// optimal in terms of using the available with, but to stop layout
		// thrashing or overflow. Also we need to account for the control column
		// width first so we know how much width is available for the other
		// columns, since the control column might not be the first one shown
		for ( i=0, ien=display.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				usedWidth -= columns[i].minWidth;
			}
		}

		// Allow columns to be shown (counting by priority and then right to
		// left) until we run out of room
		var empty = false;
		for ( i=0, ien=order.length ; i<ien ; i++ ) {
			var colIdx = order[i].columnIdx;

			if ( display[colIdx] === '-' && ! columns[colIdx].control && columns[colIdx].minWidth ) {
				// Once we've found a column that won't fit we don't let any
				// others display either, or columns might disappear in the
				// middle of the table
				if ( empty || usedWidth - columns[colIdx].minWidth < 0 ) {
					empty = true;
					display[colIdx] = false;
				}
				else {
					display[colIdx] = true;
				}

				usedWidth -= columns[colIdx].minWidth;
			}
		}

		// Determine if the 'control' column should be shown (if there is one).
		// This is the case when there is a hidden column (that is not the
		// control column). The two loops look inefficient here, but they are
		// trivial and will fly through. We need to know the outcome from the
		// first , before the action in the second can be taken
		var showControl = false;

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( ! columns[i].control && ! columns[i].never && ! display[i] ) {
				showControl = true;
				break;
			}
		}

		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columns[i].control ) {
				display[i] = showControl;
			}
		}

		// Finally we need to make sure that there is at least one column that
		// is visible
		if ( $.inArray( true, display ) === -1 ) {
			display[0] = true;
		}

		return display;
	},


	/**
	 * Create the internal `columns` array with information about the columns
	 * for the table. This includes determining which breakpoints the column
	 * will appear in, based upon class names in the column, which makes up the
	 * vast majority of this method.
	 *
	 * @private
	 */
	_classLogic: function ()
	{
		var that = this;
		var calc = {};
		var breakpoints = this.c.breakpoints;
		var dt = this.s.dt;
		var columns = dt.columns().eq(0).map( function (i) {
			var column = this.column(i);
			var className = column.header().className;
			var priority = dt.settings()[0].aoColumns[i].responsivePriority;

			if ( priority === undefined ) {
				var dataPriority = $(column.header()).data('priority');

				priority = dataPriority !== undefined ?
					dataPriority * 1 :
					10000;
			}

			return {
				className: className,
				includeIn: [],
				auto:      false,
				control:   false,
				never:     className.match(/\bnever\b/) ? true : false,
				priority:  priority
			};
		} );

		// Simply add a breakpoint to `includeIn` array, ensuring that there are
		// no duplicates
		var add = function ( colIdx, name ) {
			var includeIn = columns[ colIdx ].includeIn;

			if ( $.inArray( name, includeIn ) === -1 ) {
				includeIn.push( name );
			}
		};

		var column = function ( colIdx, name, operator, matched ) {
			var size, i, ien;

			if ( ! operator ) {
				columns[ colIdx ].includeIn.push( name );
			}
			else if ( operator === 'max-' ) {
				// Add this breakpoint and all smaller
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width <= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'min-' ) {
				// Add this breakpoint and all larger
				size = that._find( name ).width;

				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].width >= size ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
			else if ( operator === 'not-' ) {
				// Add all but this breakpoint
				for ( i=0, ien=breakpoints.length ; i<ien ; i++ ) {
					if ( breakpoints[i].name.indexOf( matched ) === -1 ) {
						add( colIdx, breakpoints[i].name );
					}
				}
			}
		};

		// Loop over each column and determine if it has a responsive control
		// class
		columns.each( function ( col, i ) {
			var classNames = col.className.split(' ');
			var hasClass = false;

			// Split the class name up so multiple rules can be applied if needed
			for ( var k=0, ken=classNames.length ; k<ken ; k++ ) {
				var className = $.trim( classNames[k] );

				if ( className === 'all' ) {
					// Include in all
					hasClass = true;
					col.includeIn = $.map( breakpoints, function (a) {
						return a.name;
					} );
					return;
				}
				else if ( className === 'none' || col.never ) {
					// Include in none (default) and no auto
					hasClass = true;
					return;
				}
				else if ( className === 'control' ) {
					// Special column that is only visible, when one of the other
					// columns is hidden. This is used for the details control
					hasClass = true;
					col.control = true;
					return;
				}

				$.each( breakpoints, function ( j, breakpoint ) {
					// Does this column have a class that matches this breakpoint?
					var brokenPoint = breakpoint.name.split('-');
					var re = new RegExp( '(min\\-|max\\-|not\\-)?('+brokenPoint[0]+')(\\-[_a-zA-Z0-9])?' );
					var match = className.match( re );

					if ( match ) {
						hasClass = true;

						if ( match[2] === brokenPoint[0] && match[3] === '-'+brokenPoint[1] ) {
							// Class name matches breakpoint name fully
							column( i, breakpoint.name, match[1], match[2]+match[3] );
						}
						else if ( match[2] === brokenPoint[0] && ! match[3] ) {
							// Class name matched primary breakpoint name with no qualifier
							column( i, breakpoint.name, match[1], match[2] );
						}
					}
				} );
			}

			// If there was no control class, then automatic sizing is used
			if ( ! hasClass ) {
				col.auto = true;
			}
		} );

		this.s.columns = columns;
	},


	/**
	 * Show the details for the child row
	 *
	 * @param  {DataTables.Api} row    API instance for the row
	 * @param  {boolean}        update Update flag
	 * @private
	 */
	_detailsDisplay: function ( row, update )
	{
		var that = this;
		var dt = this.s.dt;
		var details = this.c.details;

		if ( details && details.type !== false ) {
			var res = details.display( row, update, function () {
				return details.renderer(
					dt, row[0], that._detailsObj(row[0])
				);
			} );

			if ( res === true || res === false ) {
				$(dt.table().node()).triggerHandler( 'responsive-display.dt', [dt, row, res, update] );
			}
		}
	},


	/**
	 * Initialisation for the details handler
	 *
	 * @private
	 */
	_detailsInit: function ()
	{
		var that    = this;
		var dt      = this.s.dt;
		var details = this.c.details;

		// The inline type always uses the first child as the target
		if ( details.type === 'inline' ) {
			details.target = 'td:first-child, th:first-child';
		}

		// Keyboard accessibility
		dt.on( 'draw.dtr', function () {
			that._tabIndexes();
		} );
		that._tabIndexes(); // Initial draw has already happened

		$( dt.table().body() ).on( 'keyup.dtr', 'td, th', function (e) {
			if ( e.keyCode === 13 && $(this).data('dtr-keyboard') ) {
				$(this).click();
			}
		} );

		// type.target can be a string jQuery selector or a column index
		var target   = details.target;
		var selector = typeof target === 'string' ? target : 'td, th';

		// Click handler to show / hide the details rows when they are available
		$( dt.table().body() )
			.on( 'click.dtr mousedown.dtr mouseup.dtr', selector, function (e) {
				// If the table is not collapsed (i.e. there is no hidden columns)
				// then take no action
				if ( ! $(dt.table().node()).hasClass('collapsed' ) ) {
					return;
				}

				// Check that the row is actually a DataTable's controlled node
				if ( ! dt.row( $(this).closest('tr') ).length ) {
					return;
				}

				// For column index, we determine if we should act or not in the
				// handler - otherwise it is already okay
				if ( typeof target === 'number' ) {
					var targetIdx = target < 0 ?
						dt.columns().eq(0).length + target :
						target;

					if ( dt.cell( this ).index().column !== targetIdx ) {
						return;
					}
				}

				// $().closest() includes itself in its check
				var row = dt.row( $(this).closest('tr') );

				// Check event type to do an action
				if ( e.type === 'click' ) {
					// The renderer is given as a function so the caller can execute it
					// only when they need (i.e. if hiding there is no point is running
					// the renderer)
					that._detailsDisplay( row, false );
				}
				else if ( e.type === 'mousedown' ) {
					// For mouse users, prevent the focus ring from showing
					$(this).css('outline', 'none');
				}
				else if ( e.type === 'mouseup' ) {
					// And then re-allow at the end of the click
					$(this).blur().css('outline', '');
				}
			} );
	},


	/**
	 * Get the details to pass to a renderer for a row
	 * @param  {int} rowIdx Row index
	 * @private
	 */
	_detailsObj: function ( rowIdx )
	{
		var that = this;
		var dt = this.s.dt;

		return $.map( this.s.columns, function( col, i ) {
			// Never and control columns should not be passed to the renderer
			if ( col.never || col.control ) {
				return;
			}

			return {
				title:       dt.settings()[0].aoColumns[ i ].sTitle,
				data:        dt.cell( rowIdx, i ).render( that.c.orthogonal ),
				hidden:      dt.column( i ).visible() && !that.s.current[ i ],
				columnIndex: i,
				rowIndex:    rowIdx
			};
		} );
	},


	/**
	 * Find a breakpoint object from a name
	 *
	 * @param  {string} name Breakpoint name to find
	 * @return {object}      Breakpoint description object
	 * @private
	 */
	_find: function ( name )
	{
		var breakpoints = this.c.breakpoints;

		for ( var i=0, ien=breakpoints.length ; i<ien ; i++ ) {
			if ( breakpoints[i].name === name ) {
				return breakpoints[i];
			}
		}
	},


	/**
	 * Re-create the contents of the child rows as the display has changed in
	 * some way.
	 *
	 * @private
	 */
	_redrawChildren: function ()
	{
		var that = this;
		var dt = this.s.dt;

		dt.rows( {page: 'current'} ).iterator( 'row', function ( settings, idx ) {
			var row = dt.row( idx );

			that._detailsDisplay( dt.row( idx ), true );
		} );
	},


	/**
	 * Alter the table display for a resized viewport. This involves first
	 * determining what breakpoint the window currently is in, getting the
	 * column visibilities to apply and then setting them.
	 *
	 * @private
	 */
	_resize: function ()
	{
		var that = this;
		var dt = this.s.dt;
		var width = $(window).width();
		var breakpoints = this.c.breakpoints;
		var breakpoint = breakpoints[0].name;
		var columns = this.s.columns;
		var i, ien;
		var oldVis = this.s.current.slice();

		// Determine what breakpoint we are currently at
		for ( i=breakpoints.length-1 ; i>=0 ; i-- ) {
			if ( width <= breakpoints[i].width ) {
				breakpoint = breakpoints[i].name;
				break;
			}
		}
		
		// Show the columns for that break point
		var columnsVis = this._columnsVisiblity( breakpoint );
		this.s.current = columnsVis;

		// Set the class before the column visibility is changed so event
		// listeners know what the state is. Need to determine if there are
		// any columns that are not visible but can be shown
		var collapsedClass = false;
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			if ( columnsVis[i] === false && ! columns[i].never && ! columns[i].control ) {
				collapsedClass = true;
				break;
			}
		}

		$( dt.table().node() ).toggleClass( 'collapsed', collapsedClass );

		var changed = false;

		dt.columns().eq(0).each( function ( colIdx, i ) {
			if ( columnsVis[i] !== oldVis[i] ) {
				changed = true;
				that._setColumnVis( colIdx, columnsVis[i] );
			}
		} );

		if ( changed ) {
			this._redrawChildren();

			// Inform listeners of the change
			$(dt.table().node()).trigger( 'responsive-resize.dt', [dt, this.s.current] );
		}
	},


	/**
	 * Determine the width of each column in the table so the auto column hiding
	 * has that information to work with. This method is never going to be 100%
	 * perfect since column widths can change slightly per page, but without
	 * seriously compromising performance this is quite effective.
	 *
	 * @private
	 */
	_resizeAuto: function ()
	{
		var dt = this.s.dt;
		var columns = this.s.columns;

		// Are we allowed to do auto sizing?
		if ( ! this.c.auto ) {
			return;
		}

		// Are there any columns that actually need auto-sizing, or do they all
		// have classes defined
		if ( $.inArray( true, $.map( columns, function (c) { return c.auto; } ) ) === -1 ) {
			return;
		}

		// Clone the table with the current data in it
		var tableWidth   = dt.table().node().offsetWidth;
		var columnWidths = dt.columns;
		var clonedTable  = dt.table().node().cloneNode( false );
		var clonedHeader = $( dt.table().header().cloneNode( false ) ).appendTo( clonedTable );
		var clonedBody   = $( dt.table().body() ).clone( false, false ).empty().appendTo( clonedTable ); // use jQuery because of IE8

		// Header
		var headerCells = dt.columns()
			.header()
			.filter( function (idx) {
				return dt.column(idx).visible();
			} )
			.to$()
			.clone( false )
			.css( 'display', 'table-cell' );

		// Body rows - we don't need to take account of DataTables' column
		// visibility since we implement our own here (hence the `display` set)
		$(clonedBody)
			.append( $(dt.rows( { page: 'current' } ).nodes()).clone( false ) )
			.find( 'th, td' ).css( 'display', '' );

		// Footer
		var footer = dt.table().footer();
		if ( footer ) {
			var clonedFooter = $( footer.cloneNode( false ) ).appendTo( clonedTable );
			var footerCells = dt.columns()
				.footer()
				.filter( function (idx) {
					return dt.column(idx).visible();
				} )
				.to$()
				.clone( false )
				.css( 'display', 'table-cell' );

			$('<tr/>')
				.append( footerCells )
				.appendTo( clonedFooter );
		}

		$('<tr/>')
			.append( headerCells )
			.appendTo( clonedHeader );

		// In the inline case extra padding is applied to the first column to
		// give space for the show / hide icon. We need to use this in the
		// calculation
		if ( this.c.details.type === 'inline' ) {
			$(clonedTable).addClass( 'dtr-inline collapsed' );
		}
		
		// It is unsafe to insert elements with the same name into the DOM
		// multiple times. For example, cloning and inserting a checked radio
		// clears the chcecked state of the original radio.
		$( clonedTable ).find( '[name]' ).removeAttr( 'name' );
		
		var inserted = $('<div/>')
			.css( {
				width: 1,
				height: 1,
				overflow: 'hidden'
			} )
			.append( clonedTable );

		inserted.insertBefore( dt.table().node() );

		// The cloned header now contains the smallest that each column can be
		headerCells.each( function (i) {
			var idx = dt.column.index( 'fromVisible', i );
			columns[ idx ].minWidth =  this.offsetWidth || 0;
		} );

		inserted.remove();
	},

	/**
	 * Set a column's visibility.
	 *
	 * We don't use DataTables' column visibility controls in order to ensure
	 * that column visibility can Responsive can no-exist. Since only IE8+ is
	 * supported (and all evergreen browsers of course) the control of the
	 * display attribute works well.
	 *
	 * @param {integer} col      Column index
	 * @param {boolean} showHide Show or hide (true or false)
	 * @private
	 */
	_setColumnVis: function ( col, showHide )
	{
		var dt = this.s.dt;
		var display = showHide ? '' : 'none'; // empty string will remove the attr

		$( dt.column( col ).header() ).css( 'display', display );
		$( dt.column( col ).footer() ).css( 'display', display );
		dt.column( col ).nodes().to$().css( 'display', display );
	},


	/**
	 * Update the cell tab indexes for keyboard accessibility. This is called on
	 * every table draw - that is potentially inefficient, but also the least
	 * complex option given that column visibility can change on the fly. Its a
	 * shame user-focus was removed from CSS 3 UI, as it would have solved this
	 * issue with a single CSS statement.
	 *
	 * @private
	 */
	_tabIndexes: function ()
	{
		var dt = this.s.dt;
		var cells = dt.cells( { page: 'current' } ).nodes().to$();
		var ctx = dt.settings()[0];
		var target = this.c.details.target;

		cells.filter( '[data-dtr-keyboard]' ).removeData( '[data-dtr-keyboard]' );

		var selector = typeof target === 'number' ?
			':eq('+target+')' :
			target;

		$( selector, dt.rows( { page: 'current' } ).nodes() )
			.attr( 'tabIndex', ctx.iTabIndex )
			.data( 'dtr-keyboard', 1 );
	}
} );


/**
 * List of default breakpoints. Each item in the array is an object with two
 * properties:
 *
 * * `name` - the breakpoint name.
 * * `width` - the breakpoint width
 *
 * @name Responsive.breakpoints
 * @static
 */
Responsive.breakpoints = [
	{ name: 'desktop',  width: Infinity },
	{ name: 'tablet-l', width: 1024 },
	{ name: 'tablet-p', width: 768 },
	{ name: 'mobile-l', width: 480 },
	{ name: 'mobile-p', width: 320 }
];


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.display = {
	childRow: function ( row, update, render ) {
		if ( update ) {
			if ( $(row.node()).hasClass('parent') ) {
				row.child( render(), 'child' ).show();

				return true;
			}
		}
		else {
			if ( ! row.child.isShown()  ) {
				row.child( render(), 'child' ).show();
				$( row.node() ).addClass( 'parent' );

				return true;
			}
			else {
				row.child( false );
				$( row.node() ).removeClass( 'parent' );

				return false;
			}
		}
	},

	childRowImmediate: function ( row, update, render ) {
		if ( (! update && row.child.isShown()) || ! row.responsive.hasHidden() ) {
			// User interaction and the row is show, or nothing to show
			row.child( false );
			$( row.node() ).removeClass( 'parent' );

			return false;
		}
		else {
			// Display
			row.child( render(), 'child' ).show();
			$( row.node() ).addClass( 'parent' );

			return true;
		}
	},

	// This is a wrapper so the modal options for Bootstrap and jQuery UI can
	// have options passed into them. This specific one doesn't need to be a
	// function but it is for consistency in the `modal` name
	modal: function ( options ) {
		return function ( row, update, render ) {
			if ( ! update ) {
				// Show a modal
				var close = function () {
					modal.remove(); // will tidy events for us
					$(document).off( 'keypress.dtr' );
				};

				var modal = $('<div class="dtr-modal"/>')
					.append( $('<div class="dtr-modal-display"/>')
						.append( $('<div class="dtr-modal-content"/>')
							.append( render() )
						)
						.append( $('<div class="dtr-modal-close">&times;</div>' )
							.click( function () {
								close();
							} )
						)
					)
					.append( $('<div class="dtr-modal-background"/>')
						.click( function () {
							close();
						} )
					)
					.appendTo( 'body' );

				$(document).on( 'keyup.dtr', function (e) {
					if ( e.keyCode === 27 ) {
						e.stopPropagation();

						close();
					}
				} );
			}
			else {
				$('div.dtr-modal-content')
					.empty()
					.append( render() );
			}

			if ( options && options.header ) {
				$('div.dtr-modal-content').prepend(
					'<h2>'+options.header( row )+'</h2>'
				);
			}
		};
	}
};


/**
 * Display methods - functions which define how the hidden data should be shown
 * in the table.
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.renderer = {
	listHidden: function () {
		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				return col.hidden ?
					'<li data-dtr-index="'+col.columnIndex+'" data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<span class="dtr-title">'+
							col.title+
						'</span> '+
						'<span class="dtr-data">'+
							col.data+
						'</span>'+
					'</li>' :
					'';
			} ).join('');

			return data ?
				$('<ul data-dtr-index="'+rowIdx+'"/>').append( data ) :
				false;
		}
	},

	tableAll: function ( options ) {
		options = $.extend( {
			tableClass: ''
		}, options );

		return function ( api, rowIdx, columns ) {
			var data = $.map( columns, function ( col ) {
				return '<tr data-dt-row="'+col.rowIndex+'" data-dt-column="'+col.columnIndex+'">'+
						'<td>'+col.title+':'+'</td> '+
						'<td>'+col.data+'</td>'+
					'</tr>';
			} ).join('');

			return $('<table class="'+options.tableClass+'" width="100%"/>').append( data );
		}
	}
};

/**
 * Responsive default settings for initialisation
 *
 * @namespace
 * @name Responsive.defaults
 * @static
 */
Responsive.defaults = {
	/**
	 * List of breakpoints for the instance. Note that this means that each
	 * instance can have its own breakpoints. Additionally, the breakpoints
	 * cannot be changed once an instance has been creased.
	 *
	 * @type {Array}
	 * @default Takes the value of `Responsive.breakpoints`
	 */
	breakpoints: Responsive.breakpoints,

	/**
	 * Enable / disable auto hiding calculations. It can help to increase
	 * performance slightly if you disable this option, but all columns would
	 * need to have breakpoint classes assigned to them
	 *
	 * @type {Boolean}
	 * @default  `true`
	 */
	auto: true,

	/**
	 * Details control. If given as a string value, the `type` property of the
	 * default object is set to that value, and the defaults used for the rest
	 * of the object - this is for ease of implementation.
	 *
	 * The object consists of the following properties:
	 *
	 * * `display` - A function that is used to show and hide the hidden details
	 * * `renderer` - function that is called for display of the child row data.
	 *   The default function will show the data from the hidden columns
	 * * `target` - Used as the selector for what objects to attach the child
	 *   open / close to
	 * * `type` - `false` to disable the details display, `inline` or `column`
	 *   for the two control types
	 *
	 * @type {Object|string}
	 */
	details: {
		display: Responsive.display.childRow,

		renderer: Responsive.renderer.listHidden(),

		target: 0,

		type: 'inline'
	},

	/**
	 * Orthogonal data request option. This is used to define the data type
	 * requested when Responsive gets the data to show in the child row.
	 *
	 * @type {String}
	 */
	orthogonal: 'display'
};


/*
 * API
 */
var Api = $.fn.dataTable.Api;

// Doesn't do anything - work around for a bug in DT... Not documented
Api.register( 'responsive()', function () {
	return this;
} );

Api.register( 'responsive.index()', function ( li ) {
	li = $(li);

	return {
		column: li.data('dtr-index'),
		row:    li.parent().data('dtr-index')
	};
} );

Api.register( 'responsive.rebuild()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._classLogic();
		}
	} );
} );

Api.register( 'responsive.recalc()', function () {
	return this.iterator( 'table', function ( ctx ) {
		if ( ctx._responsive ) {
			ctx._responsive._resizeAuto();
			ctx._responsive._resize();
		}
	} );
} );

Api.register( 'responsive.hasHidden()', function () {
	var ctx = this.context[0];

	return ctx._responsive ?
		$.inArray( false, ctx._responsive.s.current ) !== -1 :
		false;
} );


/**
 * Version information
 *
 * @name Responsive.version
 * @static
 */
Responsive.version = '2.1.0';


$.fn.dataTable.Responsive = Responsive;
$.fn.DataTable.Responsive = Responsive;

// Attach a listener to the document which listens for DataTables initialisation
// events so we can automatically initialise
$(document).on( 'preInit.dt.dtr', function (e, settings, json) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	if ( $(settings.nTable).hasClass( 'responsive' ) ||
		 $(settings.nTable).hasClass( 'dt-responsive' ) ||
		 settings.oInit.responsive ||
		 DataTable.defaults.responsive
	) {
		var init = settings.oInit.responsive;

		if ( init !== false ) {
			new Responsive( settings, $.isPlainObject( init ) ? init : {}  );
		}
	}
} );


return Responsive;
}));


/*! Select for DataTables 1.2.0
 * 2015-2016 SpryMedia Ltd - datatables.net/license/mit
 */

/**
 * @summary     Select for DataTables
 * @description A collection of API methods, events and buttons for DataTables
 *   that provides selection options of the items in a DataTable
 * @version     1.2.0
 * @file        dataTables.select.js
 * @author      SpryMedia Ltd (www.sprymedia.co.uk)
 * @contact     datatables.net/forums
 * @copyright   Copyright 2015-2016 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license/mit
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net/extensions/select
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


// Version information for debugger
DataTable.select = {};

DataTable.select.version = '1.2.0';

DataTable.select.init = function ( dt ) {
	var ctx = dt.settings()[0];
	var init = ctx.oInit.select;
	var defaults = DataTable.defaults.select;
	var opts = init === undefined ?
		defaults :
		init;

	// Set defaults
	var items = 'row';
	var style = 'api';
	var blurable = false;
	var info = true;
	var selector = 'td, th';
	var className = 'selected';

	ctx._select = {};

	// Initialisation customisations
	if ( opts === true ) {
		style = 'os';
	}
	else if ( typeof opts === 'string' ) {
		style = opts;
	}
	else if ( $.isPlainObject( opts ) ) {
		if ( opts.blurable !== undefined ) {
			blurable = opts.blurable;
		}

		if ( opts.info !== undefined ) {
			info = opts.info;
		}

		if ( opts.items !== undefined ) {
			items = opts.items;
		}

		if ( opts.style !== undefined ) {
			style = opts.style;
		}

		if ( opts.selector !== undefined ) {
			selector = opts.selector;
		}

		if ( opts.className !== undefined ) {
			className = opts.className;
		}
	}

	dt.select.selector( selector );
	dt.select.items( items );
	dt.select.style( style );
	dt.select.blurable( blurable );
	dt.select.info( info );
	ctx._select.className = className;


	// Sort table based on selected rows. Requires Select Datatables extension
	$.fn.dataTable.ext.order['select-checkbox'] = function ( settings, col ) {
		return this.api().column( col, {order: 'index'} ).nodes().map( function ( td ) {
			if ( settings._select.items === 'row' ) {
				return $( td ).parent().hasClass( settings._select.className );
			} else if ( settings._select.items === 'cell' ) {
				return $( td ).hasClass( settings._select.className );
			}
			return false;
		});
	};

	// If the init options haven't enabled select, but there is a selectable
	// class name, then enable
	if ( $( dt.table().node() ).hasClass( 'selectable' ) ) {
		dt.select.style( 'os' );
	}
};

/*

Select is a collection of API methods, event handlers, event emitters and
buttons (for the `Buttons` extension) for DataTables. It provides the following
features, with an overview of how they are implemented:

## Selection of rows, columns and cells. Whether an item is selected or not is
   stored in:

* rows: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoData` object for each row
* columns: a `_select_selected` property which contains a boolean value of the
  DataTables' `aoColumns` object for each column
* cells: a `_selected_cells` property which contains an array of boolean values
  of the `aoData` object for each row. The array is the same length as the
  columns array, with each element of it representing a cell.

This method of using boolean flags allows Select to operate when nodes have not
been created for rows / cells (DataTables' defer rendering feature).

## API methods

A range of API methods are available for triggering selection and de-selection
of rows. Methods are also available to configure the selection events that can
be triggered by an end user (such as which items are to be selected). To a large
extent, these of API methods *is* Select. It is basically a collection of helper
functions that can be used to select items in a DataTable.

Configuration of select is held in the object `_select` which is attached to the
DataTables settings object on initialisation. Select being available on a table
is not optional when Select is loaded, but its default is for selection only to
be available via the API - so the end user wouldn't be able to select rows
without additional configuration.

The `_select` object contains the following properties:

```
{
	items:string     - Can be `rows`, `columns` or `cells`. Defines what item 
	                   will be selected if the user is allowed to activate row
	                   selection using the mouse.
	style:string     - Can be `none`, `single`, `multi` or `os`. Defines the
	                   interaction style when selecting items
	blurable:boolean - If row selection can be cleared by clicking outside of
	                   the table
	info:boolean     - If the selection summary should be shown in the table
	                   information elements
}
```

In addition to the API methods, Select also extends the DataTables selector
options for rows, columns and cells adding a `selected` option to the selector
options object, allowing the developer to select only selected items or
unselected items.

## Mouse selection of items

Clicking on items can be used to select items. This is done by a simple event
handler that will select the items using the API methods.

 */


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Local functions
 */

/**
 * Add one or more cells to the selection when shift clicking in OS selection
 * style cell selection.
 *
 * Cell range is more complicated than row and column as we want to select
 * in the visible grid rather than by index in sequence. For example, if you
 * click first in cell 1-1 and then shift click in 2-2 - cells 1-2 and 2-1
 * should also be selected (and not 1-3, 1-4. etc)
 * 
 * @param  {DataTable.Api} dt   DataTable
 * @param  {object}        idx  Cell index to select to
 * @param  {object}        last Cell index to select from
 * @private
 */
function cellRange( dt, idx, last )
{
	var indexes;
	var columnIndexes;
	var rowIndexes;
	var selectColumns = function ( start, end ) {
		if ( start > end ) {
			var tmp = end;
			end = start;
			start = tmp;
		}
		
		var record = false;
		return dt.columns( ':visible' ).indexes().filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) { // not else if, as start might === end
				record = false;
				return true;
			}

			return record;
		} );
	};

	var selectRows = function ( start, end ) {
		var indexes = dt.rows( { search: 'applied' } ).indexes();

		// Which comes first - might need to swap
		if ( indexes.indexOf( start ) > indexes.indexOf( end ) ) {
			var tmp = end;
			end = start;
			start = tmp;
		}

		var record = false;
		return indexes.filter( function (i) {
			if ( i === start ) {
				record = true;
			}
			
			if ( i === end ) {
				record = false;
				return true;
			}

			return record;
		} );
	};

	if ( ! dt.cells( { selected: true } ).any() && ! last ) {
		// select from the top left cell to this one
		columnIndexes = selectColumns( 0, idx.column );
		rowIndexes = selectRows( 0 , idx.row );
	}
	else {
		// Get column indexes between old and new
		columnIndexes = selectColumns( last.column, idx.column );
		rowIndexes = selectRows( last.row , idx.row );
	}

	indexes = dt.cells( rowIndexes, columnIndexes ).flatten();

	if ( ! dt.cells( idx, { selected: true } ).any() ) {
		// Select range
		dt.cells( indexes ).select();
	}
	else {
		// Deselect range
		dt.cells( indexes ).deselect();
	}
}

/**
 * Disable mouse selection by removing the selectors
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function disableMouseSelection( dt )
{
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	$( dt.table().body() )
		.off( 'mousedown.dtSelect', selector )
		.off( 'mouseup.dtSelect', selector )
		.off( 'click.dtSelect', selector );

	$('body').off( 'click.dtSelect' );
}

/**
 * Attach mouse listeners to the table to allow mouse selection of items
 *
 * @param {DataTable.Api} dt DataTable to remove events from
 * @private
 */
function enableMouseSelection ( dt )
{
	var body = $( dt.table().body() );
	var ctx = dt.settings()[0];
	var selector = ctx._select.selector;

	body
		.on( 'mousedown.dtSelect', selector, function(e) {
			// Disallow text selection for shift clicking on the table so multi
			// element selection doesn't look terrible!
			if ( e.shiftKey || e.metaKey || e.ctrlKey ) {
				body
					.css( '-moz-user-select', 'none' )
					.one('selectstart.dtSelect', selector, function () {
						return false;
					} );
			}
		} )
		.on( 'mouseup.dtSelect', selector, function() {
			// Allow text selection to occur again, Mozilla style (tested in FF
			// 35.0.1 - still required)
			body.css( '-moz-user-select', '' );
		} )
		.on( 'click.dtSelect', selector, function ( e ) {
			var items = dt.select.items();
			var idx;

			// If text was selected (click and drag), then we shouldn't change
			// the row's selected state
			if ( window.getSelection && window.getSelection().toString() ) {
				return;
			}

			var ctx = dt.settings()[0];

			// Ignore clicks inside a sub-table
			if ( $(e.target).closest('div.dataTables_wrapper')[0] != dt.table().container() ) {
				return;
			}

			var cell = dt.cell( $(e.target).closest('td, th') );

			// Check the cell actually belongs to the host DataTable (so child
			// rows, etc, are ignored)
			if ( ! cell.any() ) {
				return;
			}

			var event = $.Event('user-select.dt');
			eventTrigger( dt, event, [ items, cell, e ] );

			if ( event.isDefaultPrevented() ) {
				return;
			}

			var cellIndex = cell.index();
			if ( items === 'row' ) {
				idx = cellIndex.row;
				typeSelect( e, dt, ctx, 'row', idx );
			}
			else if ( items === 'column' ) {
				idx = cell.index().column;
				typeSelect( e, dt, ctx, 'column', idx );
			}
			else if ( items === 'cell' ) {
				idx = cell.index();
				typeSelect( e, dt, ctx, 'cell', idx );
			}

			ctx._select_lastCell = cellIndex;
		} );

	// Blurable
	$('body').on( 'click.dtSelect', function ( e ) {
		if ( ctx._select.blurable ) {
			// If the click was inside the DataTables container, don't blur
			if ( $(e.target).parents().filter( dt.table().container() ).length ) {
				return;
			}

			// Don't blur in Editor form
			if ( $(e.target).parents('div.DTE').length ) {
				return;
			}

			clear( ctx, true );
		}
	} );
}

/**
 * Trigger an event on a DataTable
 *
 * @param {DataTable.Api} api      DataTable to trigger events on
 * @param  {boolean}      selected true if selected, false if deselected
 * @param  {string}       type     Item type acting on
 * @param  {boolean}      any      Require that there are values before
 *     triggering
 * @private
 */
function eventTrigger ( api, type, args, any )
{
	if ( any && ! api.flatten().length ) {
		return;
	}

	if ( typeof type === 'string' ) {
		type = type +'.dt';
	}

	args.unshift( api );

	$(api.table().node()).triggerHandler( type, args );
}

/**
 * Update the information element of the DataTable showing information about the
 * items selected. This is done by adding tags to the existing text
 * 
 * @param {DataTable.Api} api DataTable to update
 * @private
 */
function info ( api )
{
	var ctx = api.settings()[0];

	if ( ! ctx._select.info || ! ctx.aanFeatures.i ) {
		return;
	}

	var output  = $('<span class="select-info"/>');
	var add = function ( name, num ) {
		output.append( $('<span class="select-item"/>').append( api.i18n(
			'select.'+name+'s',
			{ _: '%d '+name+'s selected', 0: '', 1: '1 '+name+' selected' },
			num
		) ) );
	};

	add( 'row',    api.rows( { selected: true } ).flatten().length );
	add( 'column', api.columns( { selected: true } ).flatten().length );
	add( 'cell',   api.cells( { selected: true } ).flatten().length );

	// Internal knowledge of DataTables to loop over all information elements
	$.each( ctx.aanFeatures.i, function ( i, el ) {
		el = $(el);

		var exisiting = el.children('span.select-info');
		if ( exisiting.length ) {
			exisiting.remove();
		}

		if ( output.text() !== '' ) {
			el.append( output );
		}
	} );
}

/**
 * Initialisation of a new table. Attach event handlers and callbacks to allow
 * Select to operate correctly.
 *
 * This will occur _after_ the initial DataTables initialisation, although
 * before Ajax data is rendered, if there is ajax data
 *
 * @param  {DataTable.settings} ctx Settings object to operate on
 * @private
 */
function init ( ctx ) {
	var api = new DataTable.Api( ctx );

	// Row callback so that classes can be added to rows and cells if the item
	// was selected before the element was created. This will happen with the
	// `deferRender` option enabled.
	// 
	// This method of attaching to `aoRowCreatedCallback` is a hack until
	// DataTables has proper events for row manipulation If you are reviewing
	// this code to create your own plug-ins, please do not do this!
	ctx.aoRowCreatedCallback.push( {
		fn: function ( row, data, index ) {
			var i, ien;
			var d = ctx.aoData[ index ];

			// Row
			if ( d._select_selected ) {
				$( row ).addClass( ctx._select.className );
			}

			// Cells and columns - if separated out, we would need to do two
			// loops, so it makes sense to combine them into a single one
			for ( i=0, ien=ctx.aoColumns.length ; i<ien ; i++ ) {
				if ( ctx.aoColumns[i]._select_selected || (d._selected_cells && d._selected_cells[i]) ) {
					$(d.anCells[i]).addClass( ctx._select.className );
				}
			}
		},
		sName: 'select-deferRender'
	} );

	// On Ajax reload we want to reselect all rows which are currently selected,
	// if there is an rowId (i.e. a unique value to identify each row with)
	api.on( 'preXhr.dt.dtSelect', function () {
		// note that column selection doesn't need to be cached and then
		// reselected, as they are already selected
		var rows = api.rows( { selected: true } ).ids( true ).filter( function ( d ) {
			return d !== undefined;
		} );

		var cells = api.cells( { selected: true } ).eq(0).map( function ( cellIdx ) {
			var id = api.row( cellIdx.row ).id( true );
			return id ?
				{ row: id, column: cellIdx.column } :
				undefined;
		} ).filter( function ( d ) {
			return d !== undefined;
		} );

		// On the next draw, reselect the currently selected items
		api.one( 'draw.dt.dtSelect', function () {
			api.rows( rows ).select();

			// `cells` is not a cell index selector, so it needs a loop
			if ( cells.any() ) {
				cells.each( function ( id ) {
					api.cells( id.row, id.column ).select();
				} );
			}
		} );
	} );

	// Update the table information element with selected item summary
	api.on( 'draw.dtSelect.dt select.dtSelect.dt deselect.dtSelect.dt info.dt', function () {
		info( api );
	} );

	// Clean up and release
	api.on( 'destroy.dtSelect', function () {
		disableMouseSelection( api );
		api.off( '.dtSelect' );
	} );
}

/**
 * Add one or more items (rows or columns) to the selection when shift clicking
 * in OS selection style
 *
 * @param  {DataTable.Api} dt   DataTable
 * @param  {string}        type Row or column range selector
 * @param  {object}        idx  Item index to select to
 * @param  {object}        last Item index to select from
 * @private
 */
function rowColumnRange( dt, type, idx, last )
{
	// Add a range of rows from the last selected row to this one
	var indexes = dt[type+'s']( { search: 'applied' } ).indexes();
	var idx1 = $.inArray( last, indexes );
	var idx2 = $.inArray( idx, indexes );

	if ( ! dt[type+'s']( { selected: true } ).any() && idx1 === -1 ) {
		// select from top to here - slightly odd, but both Windows and Mac OS
		// do this
		indexes.splice( $.inArray( idx, indexes )+1, indexes.length );
	}
	else {
		// reverse so we can shift click 'up' as well as down
		if ( idx1 > idx2 ) {
			var tmp = idx2;
			idx2 = idx1;
			idx1 = tmp;
		}

		indexes.splice( idx2+1, indexes.length );
		indexes.splice( 0, idx1 );
	}

	if ( ! dt[type]( idx, { selected: true } ).any() ) {
		// Select range
		dt[type+'s']( indexes ).select();
	}
	else {
		// Deselect range - need to keep the clicked on row selected
		indexes.splice( $.inArray( idx, indexes ), 1 );
		dt[type+'s']( indexes ).deselect();
	}
}

/**
 * Clear all selected items
 *
 * @param  {DataTable.settings} ctx Settings object of the host DataTable
 * @param  {boolean} [force=false] Force the de-selection to happen, regardless
 *     of selection style
 * @private
 */
function clear( ctx, force )
{
	if ( force || ctx._select.style === 'single' ) {
		var api = new DataTable.Api( ctx );
		
		api.rows( { selected: true } ).deselect();
		api.columns( { selected: true } ).deselect();
		api.cells( { selected: true } ).deselect();
	}
}

/**
 * Select items based on the current configuration for style and items.
 *
 * @param  {object}             e    Mouse event object
 * @param  {DataTables.Api}     dt   DataTable
 * @param  {DataTable.settings} ctx  Settings object of the host DataTable
 * @param  {string}             type Items to select
 * @param  {int|object}         idx  Index of the item to select
 * @private
 */
function typeSelect ( e, dt, ctx, type, idx )
{
	var style = dt.select.style();
	var isSelected = dt[type]( idx, { selected: true } ).any();

	if ( style === 'os' ) {
		if ( e.ctrlKey || e.metaKey ) {
			// Add or remove from the selection
			dt[type]( idx ).select( ! isSelected );
		}
		else if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			// No cmd or shift click - deselect if selected, or select
			// this row only
			var selected = dt[type+'s']( { selected: true } );

			if ( isSelected && selected.flatten().length === 1 ) {
				dt[type]( idx ).deselect();
			}
			else {
				selected.deselect();
				dt[type]( idx ).select();
			}
		}
	} else if ( style == 'multi+shift' ) {
		if ( e.shiftKey ) {
			if ( type === 'cell' ) {
				cellRange( dt, idx, ctx._select_lastCell || null );
			}
			else {
				rowColumnRange( dt, type, idx, ctx._select_lastCell ?
					ctx._select_lastCell[type] :
					null
				);
			}
		}
		else {
			dt[ type ]( idx ).select( ! isSelected );
		}
	}
	else {
		dt[ type ]( idx ).select( ! isSelected );
	}
}



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables selectors
 */

// row and column are basically identical just assigned to different properties
// and checking a different array, so we can dynamically create the functions to
// reduce the code size
$.each( [
	{ type: 'row', prop: 'aoData' },
	{ type: 'column', prop: 'aoColumns' }
], function ( i, o ) {
	DataTable.ext.selector[ o.type ].push( function ( settings, opts, indexes ) {
		var selected = opts.selected;
		var data;
		var out = [];

		if ( selected === undefined ) {
			return indexes;
		}

		for ( var i=0, ien=indexes.length ; i<ien ; i++ ) {
			data = settings[ o.prop ][ indexes[i] ];

			if ( (selected === true && data._select_selected === true) ||
			     (selected === false && ! data._select_selected )
			) {
				out.push( indexes[i] );
			}
		}

		return out;
	} );
} );

DataTable.ext.selector.cell.push( function ( settings, opts, cells ) {
	var selected = opts.selected;
	var rowData;
	var out = [];

	if ( selected === undefined ) {
		return cells;
	}

	for ( var i=0, ien=cells.length ; i<ien ; i++ ) {
		rowData = settings.aoData[ cells[i].row ];

		if ( (selected === true && rowData._selected_cells && rowData._selected_cells[ cells[i].column ] === true) ||
		     (selected === false && ( ! rowData._selected_cells || ! rowData._selected_cells[ cells[i].column ] ) )
		) {
			out.push( cells[i] );
		}
	}

	return out;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * DataTables API
 *
 * For complete documentation, please refer to the docs/api directory or the
 * DataTables site
 */

// Local variables to improve compression
var apiRegister = DataTable.Api.register;
var apiRegisterPlural = DataTable.Api.registerPlural;

apiRegister( 'select()', function () {
	return this.iterator( 'table', function ( ctx ) {
		DataTable.select.init( new DataTable.Api( ctx ) );
	} );
} );

apiRegister( 'select.blurable()', function ( flag ) {
	if ( flag === undefined ) {
		return this.context[0]._select.blurable;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.blurable = flag;
	} );
} );

apiRegister( 'select.info()', function ( flag ) {
	if ( info === undefined ) {
		return this.context[0]._select.info;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.info = flag;
	} );
} );

apiRegister( 'select.items()', function ( items ) {
	if ( items === undefined ) {
		return this.context[0]._select.items;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.items = items;

		eventTrigger( new DataTable.Api( ctx ), 'selectItems', [ items ] );
	} );
} );

// Takes effect from the _next_ selection. None disables future selection, but
// does not clear the current selection. Use the `deselect` methods for that
apiRegister( 'select.style()', function ( style ) {
	if ( style === undefined ) {
		return this.context[0]._select.style;
	}

	return this.iterator( 'table', function ( ctx ) {
		ctx._select.style = style;

		if ( ! ctx._select_init ) {
			init( ctx );
		}

		// Add / remove mouse event handlers. They aren't required when only
		// API selection is available
		var dt = new DataTable.Api( ctx );
		disableMouseSelection( dt );
		
		if ( style !== 'api' ) {
			enableMouseSelection( dt );
		}

		eventTrigger( new DataTable.Api( ctx ), 'selectStyle', [ style ] );
	} );
} );

apiRegister( 'select.selector()', function ( selector ) {
	if ( selector === undefined ) {
		return this.context[0]._select.selector;
	}

	return this.iterator( 'table', function ( ctx ) {
		disableMouseSelection( new DataTable.Api( ctx ) );

		ctx._select.selector = selector;

		if ( ctx._select.style !== 'api' ) {
			enableMouseSelection( new DataTable.Api( ctx ) );
		}
	} );
} );



apiRegisterPlural( 'rows().select()', 'row().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'row', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoData[ idx ]._select_selected = true;
		$( ctx.aoData[ idx ].nTr ).addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().select()', 'column().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'column', function ( ctx, idx ) {
		clear( ctx );

		ctx.aoColumns[ idx ]._select_selected = true;

		var column = new DataTable.Api( ctx ).column( idx );

		$( column.header() ).addClass( ctx._select.className );
		$( column.footer() ).addClass( ctx._select.className );

		column.nodes().to$().addClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().select()', 'cell().select()', function ( select ) {
	var api = this;

	if ( select === false ) {
		return this.deselect();
	}

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		clear( ctx );

		var data = ctx.aoData[ rowIdx ];

		if ( data._selected_cells === undefined ) {
			data._selected_cells = [];
		}

		data._selected_cells[ colIdx ] = true;

		if ( data.anCells ) {
			$( data.anCells[ colIdx ] ).addClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'select', [ 'cell', api[i] ], true );
	} );

	return this;
} );


apiRegisterPlural( 'rows().deselect()', 'row().deselect()', function () {
	var api = this;

	this.iterator( 'row', function ( ctx, idx ) {
		ctx.aoData[ idx ]._select_selected = false;
		$( ctx.aoData[ idx ].nTr ).removeClass( ctx._select.className );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'row', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'columns().deselect()', 'column().deselect()', function () {
	var api = this;

	this.iterator( 'column', function ( ctx, idx ) {
		ctx.aoColumns[ idx ]._select_selected = false;

		var api = new DataTable.Api( ctx );
		var column = api.column( idx );

		$( column.header() ).removeClass( ctx._select.className );
		$( column.footer() ).removeClass( ctx._select.className );

		// Need to loop over each cell, rather than just using
		// `column().nodes()` as cells which are individually selected should
		// not have the `selected` class removed from them
		api.cells( null, idx ).indexes().each( function (cellIdx) {
			var data = ctx.aoData[ cellIdx.row ];
			var cellSelected = data._selected_cells;

			if ( data.anCells && (! cellSelected || ! cellSelected[ cellIdx.column ]) ) {
				$( data.anCells[ cellIdx.column  ] ).removeClass( ctx._select.className );
			}
		} );
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'column', api[i] ], true );
	} );

	return this;
} );

apiRegisterPlural( 'cells().deselect()', 'cell().deselect()', function () {
	var api = this;

	this.iterator( 'cell', function ( ctx, rowIdx, colIdx ) {
		var data = ctx.aoData[ rowIdx ];

		data._selected_cells[ colIdx ] = false;

		// Remove class only if the cells exist, and the cell is not column
		// selected, in which case the class should remain (since it is selected
		// in the column)
		if ( data.anCells && ! ctx.aoColumns[ colIdx ]._select_selected ) {
			$( data.anCells[ colIdx ] ).removeClass( ctx._select.className );
		}
	} );

	this.iterator( 'table', function ( ctx, i ) {
		eventTrigger( api, 'deselect', [ 'cell', api[i] ], true );
	} );

	return this;
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Buttons
 */
function i18n( label, def ) {
	return function (dt) {
		return dt.i18n( 'buttons.'+label, def );
	};
}

$.extend( DataTable.ext.buttons, {
	selected: {
		text: i18n( 'selected', 'Selected' ),
		className: 'buttons-selected',
		init: function ( dt ) {
			var that = this;

			// .DT namespace listeners are removed by DataTables automatically
			// on table destroy
			dt.on( 'draw.dt.DT select.dt.DT deselect.dt.DT', function () {
				var enable = that.rows( { selected: true } ).any() ||
				             that.columns( { selected: true } ).any() ||
				             that.cells( { selected: true } ).any();

				that.enable( enable );
			} );

			this.disable();
		}
	},
	selectedSingle: {
		text: i18n( 'selectedSingle', 'Selected single' ),
		className: 'buttons-selected-single',
		init: function ( dt ) {
			var that = this;

			dt.on( 'draw.dt.DT select.dt.DT deselect.dt.DT', function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count === 1 );
			} );

			this.disable();
		}
	},
	selectAll: {
		text: i18n( 'selectAll', 'Select all' ),
		className: 'buttons-select-all',
		action: function () {
			var items = this.select.items();
			this[ items+'s' ]().select();
		}
	},
	selectNone: {
		text: i18n( 'selectNone', 'Deselect all' ),
		className: 'buttons-select-none',
		action: function () {
			clear( this.settings()[0], true );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'draw.dt.DT select.dt.DT deselect.dt.DT', function () {
				var count = dt.rows( { selected: true } ).flatten().length +
				            dt.columns( { selected: true } ).flatten().length +
				            dt.cells( { selected: true } ).flatten().length;

				that.enable( count > 0 );
			} );

			this.disable();
		}
	}
} );

$.each( [ 'Row', 'Column', 'Cell' ], function ( i, item ) {
	var lc = item.toLowerCase();

	DataTable.ext.buttons[ 'select'+item+'s' ] = {
		text: i18n( 'select'+item+'s', 'Select '+lc+'s' ),
		className: 'buttons-select-'+lc+'s',
		action: function () {
			this.select.items( lc );
		},
		init: function ( dt ) {
			var that = this;

			dt.on( 'selectItems.dt.DT', function ( e, ctx, items ) {
				that.active( items === lc );
			} );
		}
	};
} );



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Initialisation
 */

// DataTables creation - check if select has been defined in the options. Note
// this required that the table be in the document! If it isn't then something
// needs to trigger this method unfortunately. The next major release of
// DataTables will rework the events and address this.
$(document).on( 'preInit.dt.dtSelect', function (e, ctx) {
	if ( e.namespace !== 'dt' ) {
		return;
	}

	DataTable.select.init( new DataTable.Api( ctx ) );
} );


return DataTable.select;
}));


