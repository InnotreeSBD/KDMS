

var is_open = false;
var g_instance_row;

function Form_Load(  )
{
    DGN_Design.InitMode( true, 800, 600 );

    WMDA_1.Toolbar_Visible("master_grid", "ok", false);
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    WMDA_1.Toolbar_Visible("master_grid", "insert", false);
    
//    WMDA_1.Toolbar_Visible("master_grid", "query", false);
    
    WMDA_1.Toolbar_Add("master_grid", "insert2", "입력", 0);
    WMDA_1.Toolbar_Add("master_grid", "ok2", "저장", 0);
    WMDA_1.Toolbar_Add("master_grid", "delete2", "삭제", 0);
    WMDA_1.Toolbar_Add("master_grid", "cancel2", "취소", 0);
//    WMDA_1.Toolbar_Add("master_grid", "cancel2", "취소", 0);
//    WMDA_1.Toolbar_Add("master_grid", "back", "이전", 0);
    
//    WMDA_1.Toolbar_Add("master_grid", "print2", "통합문서출력", 1);
//    WMDA_1.Toolbar_Add("master_grid", "print", "출력", 1);
	WMDA_1.Toolbar_Enable("master_grid", "ok2", false);
	WMDA_1.Toolbar_Enable("master_grid", "insert2", false);
    
    WMDA_1.Toolbar_Enable("master_grid", "insert2", false );
    WMDA_1.Toolbar_Enable("master_grid", "delete2", false );
    WMDA_1.Toolbar_Enable("master_grid", "cancel2", false );
    
    var odw_combo = Form.GetNewODW("");
    odw_combo.BatchQueryInit();
    odw_combo.BatchQueryAdd("CmpyCd", "BACmpy", "CustCd", "CustNm", "WHERE CmpyYN = '1' ");
    odw_combo.BatchQueryRun();
    
    WMDA_1.SetSelectRecordData("query", "CmpyCd", odw_combo, "CmpyCd");
    
    WMDA_1.SetFieldData("query", "CmpyCd", 0, odw_combo.BatchQueryGetCellVal("CmpyCd", 0, 0));
    
	DATE_temp.AddMonths(-1);
	var StDt = DATE_temp.GetValue();
	
	WMDA_1.SetFieldData("query", "StDt", 0, StDt);
	WGSheet_1.SetFieldData("query", "StDt", StDt);
	DATE_temp.AddMonths(1);
	DATE_temp.AddDays(1);
	
	WMDA_1.SetFieldData("query", "EndDt", 0, DATE_temp.GetValue());
	WGSheet_1.SetFieldData("query", "EndDt", DATE_temp.GetValue());
	
    WMDA_1.RunQueryMaster(false);
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
	WMDA_1.Toolbar_SkipExecute("master_grid");
	
	TRE_1.NodeDeleteAll();
	
	ODW_1.ResetODW();
	if( !ODW_1.Query("query_rn_root") )
		Form.Alert( ODW_1.GetError() );
	
	for( var i = 0 ; i < ODW_1.GetCount() ; i++ )
	{
		TRE_1.NodeInsertByKey("", ODW_1.GetParam("EFormID", i), ODW_1.GetParam("EFormNm", i), -1, 0, 0);
		TRE_1.NodeSetCell(ODW_1.GetParam("EFormID", i), 5, "1" ) 
	}
	
//	TRE_1.NodeInsertByKey("", 999, "영업부", -1, 0, 0);
	
	for ( var i = 0 ; i < WMDA_1.GetRowCount("master_grid") ; i++ )
	{
		var parent_id = WMDA_1.GetFieldData("master_grid", "ParentID", i);
		var EFormID = WMDA_1.GetFieldData("master_grid", "EFormID", i);
		var EFormNm = WMDA_1.GetFieldData("master_grid", "EFormNm", i);
		TRE_1.NodeInsertByKey(parent_id, EFormID, EFormNm, -1, 0, 0);
		TRE_1.NodeSetCell(EFormID, 1, EFormID);
		TRE_1.NodeSetCell(EFormID, 2, ODW_1.GetParam("doc_code", i));
		TRE_1.NodeSetCell(EFormID, 3, EFormNm);
		TRE_1.NodeSetCell(EFormID, 4, WMDA_1.GetFieldData("master_grid", "LV", i));
		TRE_1.NodeSetCell(EFormID, 5, WMDA_1.GetFieldData("master_grid", "DispSeq", i));
		TRE_1.NodeSetCell(EFormID, 6, WMDA_1.GetFieldData("master_grid", "EFormXML", i));
		TRE_1.NodeSetCell(EFormID, 7, WMDA_1.GetFieldData("master_grid", "CmpyCd", i));
		

		if( parseInt(WMDA_1.GetFieldData("master_grid", "LV", i)) < 4 )
			TRE_1.ExpandNode(parent_id, true);
		
	}
	TRE_1.SelectNode("0");
	
	// 마지막 노드에 focus 
	if( TRE_1.NodeExist("1") )
		TRE_1.SelectNode("1");
	
}


var g_node_key = 0; 
function TRE_1_OnSelectChanged( node_key )
{
	
	var EFormID = TRE_1.NodeGetCell(node_key, 1);
	var EFormCd = TRE_1.NodeGetCell(node_key, 2);
	var EFormNm = TRE_1.NodeGetCell(node_key, 3);
	
	var LV = TRE_1.NodeGetCell(node_key, 4);
	var DispSeq = TRE_1.NodeGetCell(node_key, 5);
	var EFormXML = TRE_1.NodeGetCell(node_key, 6);

	
	GetDesign( EFormID );
	
	WGSheet_1.SetFieldData("query", "CmpyCd", WMDA_1.GetFieldData("query", "CmpyCd", 0));
	WGSheet_1.SetFieldData("query", "StDt", WMDA_1.GetFieldData("query", "StDt", 0));
	WGSheet_1.SetFieldData("query", "EndDt", WMDA_1.GetFieldData("query", "EndDt", 0));
	WGSheet_1.SetFieldData("query", "DataNm", WMDA_1.GetFieldData("query", "DataNm", 0));
	WGSheet_1.SetFieldData("query", "EFormID", EFormID);
	WGSheet_1.RunQuery();
	
	
	toobar_control( LV, "query" );
	

}


function toobar_control( lv, status )
{
	if( lv < 3 )
	{
		WMDA_1.Toolbar_Enable("master_grid", "insert2", false);
		WMDA_1.Toolbar_Enable("master_grid", "ok2", false);
		WMDA_1.Toolbar_Enable("master_grid", "delete2", false);
		WMDA_1.Toolbar_Enable("master_grid", "cancel2", false);
		
		    _set_DGNWidget( false );
	}
	else if( status == "insert" )
	{
		WGSheet_1.SetEnabled(false);
		WMDA_1.Toolbar_Enable("master_grid", "insert2", false);
		WMDA_1.Toolbar_Enable("master_grid", "ok2", true);
		WMDA_1.Toolbar_Enable("master_grid", "delete2", false);
		WMDA_1.Toolbar_Enable("master_grid", "cancel2", true);
		
		    _set_DGNWidget( true );
		
	}
	else // query or nomal
	{
		WGSheet_1.SetEnabled(true);
		if( WGSheet_1.GetRowCount() > 0 )
		{
			WMDA_1.Toolbar_Enable("master_grid", "insert2", true);
			WMDA_1.Toolbar_Enable("master_grid", "ok2", true);
			WMDA_1.Toolbar_Enable("master_grid", "delete2", true);
			WMDA_1.Toolbar_Enable("master_grid", "cancel2", false);
			
		    _set_DGNWidget( true );
		}
		else
		{
			WMDA_1.Toolbar_Enable("master_grid", "insert2", true);
			WMDA_1.Toolbar_Enable("master_grid", "ok2", false);
			WMDA_1.Toolbar_Enable("master_grid", "delete2", false);
			WMDA_1.Toolbar_Enable("master_grid", "cancel2", false);
			
		    _set_DGNWidget( false );
		    
		}
	}
}


//function GetDesign ( dgn_code )
function GetDesign ( node_key )
{
	var EFormXML = TRE_1.NodeGetCell(node_key, 6);
	if( EFormXML != "" )
	{
		is_open = true;
		WMDA_1.Toolbar_Enable("master_grid", "ok2", true);
	}
	else
	{
		WMDA_1.Toolbar_Enable("master_grid", "ok2", false);
	}	
	
	DGN_Design.SetDesignLayout( EFormXML, "" );
	var ctrl_list = DGN_Design.MetaGetNameList();
	for( var i = 0 ; i < ctrl_list.length ; i++ )
	{
		DGN_Design.MetaSetProperty(ctrl_list[i], "map_name", ctrl_list[i]);
	}
}

function _set_DGNWidget( enabled )
{
	var list = DGN_Design.MetaGetNameList();
	for( var i = 0 ; i < list.length ; i++ )
	{
	    DGN_Design.MetaSetProperty( list[i], "Enabled", enabled );
	}
}

function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
	if ( panel_name == "master_grid" )
	{
		if ( btn_id == "query" )
		{
			WMDA_1.Toolbar_SkipExecute("master_grid");
			WMDA_1.RunQueryMaster(false);
			return;
		}
		else if ( btn_id == "insert2" )
		{
			WMDA_1.Toolbar_SkipExecute("master_grid");
			
			g_instance_row = WGSheet_1.InsertRow(0);

			WGSheet_1.SetGridCellText("EFormID", g_instance_row, TRE_1.CurrentNodeKey());
			WGSheet_1.SetGridCellText("CmpyCd", g_instance_row, TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 7));
			GetDesign ( TRE_1.CurrentNodeKey() );
			
			Run_Init();
			toobar_control( 3, "insert" );
		}
		else if( btn_id == "ok2" ) // 저장버튼        
		{
			var msg = "";
			
			var cur_row = WGSheet_1.GetCurrentRow();
			// 입력 data 저장.
			
			var DataID = WGSheet_1.GetGridCellText("DataID", cur_row);
//			var CmpyCd = WGSheet_1.GetGridCellText("CmpyCd", cur_row); // CmpyCd 
			var CmpyCd = WMDA_1.GetFieldData("query", "CmpyCd", 0); // CmpyCd 
			var EFormID = TRE_1.CurrentNodeKey();
			var DataNm = DGN_Design.GetFieldData("", "edit_1", 0); // title
			var Remarks = DGN_Design.GetFieldData("", "edit_2", 0); // desc
			
			var save_data = DGN_Design.GetInputData("xml"); // 데이터 가공후 sub로 보내기
			
			WGSheet_1.SetGridCellText("DataNm", cur_row, DataNm);
			WGSheet_1.SetGridCellText("Remarks", cur_row, Remarks);
			
			ODW_3.ResetODW();
			// key로 insert/update 구분
			ODW_3.SetParam("DataID", 0, WGSheet_1.GetGridCellText("DataID", cur_row));
			ODW_3.SetParam("CmpyCd", 0, CmpyCd);
			ODW_3.SetParam("EFormID", 0, EFormID);
			ODW_3.SetParam("DataNm", 0, DataNm);
			ODW_3.SetParam("Remarks", 0, Remarks);
			ODW_3.SetParam("UpUserID", 0, WGSheet_1.GetGridCellText("UpUserID", cur_row));
			ODW_3.SetParam("UpDt", 0, WGSheet_1.GetGridCellText("UpDt", cur_row));
			
//			save_data
			
			// ODW_3 의 sub에 Line Item 세팅
			g_sub_ST01_row = 0; //
			GetSaveData(save_data);
			
			var query_str = "update_sc";
			if( !ODW_3.Update(query_str) )
				Form.Alert( ODW_3.GetError());
			
			WGSheet_1.SetGridCellText("DataID", cur_row, ODW_3.GetParam("DataID", 0));
			WGSheet_1.SetGridCellText("ApDt", cur_row, ODW_3.GetParam("ApDt", 0));
			WGSheet_1.SetGridCellText("ApUserID", cur_row, ODW_3.GetParam("ApUserID", 0));
			WGSheet_1.SetGridCellText("UpDt", cur_row, ODW_3.GetParam("UpDt", 0));
			WGSheet_1.SetGridCellText("UpUserID", cur_row, ODW_3.GetParam("UpUserID", 0));
			
			toobar_control( 3, "query" );
			
		}
//		else if( btn_id == "back" ) // 이전버튼
//		{
//			Form.SendMenuMessage("JOB100E", "검사결과등록", "", "", "", "", "", "");
//			Form.CloseView(1);
//		}
//		else if( btn_id == "print" ) // 출력
//		{
//			g_toolbar = "print";
////			var doc_inst_id = TXT_doc_inst_id.GetText();
//			var doc_inst_id = "";
////			PrintFile( doc_inst_id );
//		}
		else if( btn_id == "delete2" ) // 데이터 (inst) 삭제
		{
			var DataID = WGSheet_1.GetGridCellText("DataID", WGSheet_1.GetCurrentRow());
			var del_row = WGSheet_1.GetCurrentRow();
			
			ODW_3.ResetODW();
			ODW_3.SetParam("DataID", 0, DataID);
			
			if( !ODW_3.Delete("delete_sc" ) )
			{
				Form.Alert( ODW_3.GetError() );
			}
			TRE_1.NodeSetCell(TRE_1.CurrentNodeKey(), 7, "");

			Form.Alert("삭제 완료");
			
			if( del_row - 1 >= 0 )
			{
				WGSheet_1.GridFocusRow(del_row - 1);
			}
			
			WGSheet_1.DeleteRow(del_row);
			GetDesign(TRE_1.CurrentNodeKey());
		}
		else if( btn_id == "cancel2" ) // 데이터 (inst) 삭제
		{
			var cur_row = WGSheet_1.GetCurrentRow();
			if( WGSheet_1.ModifyGet(cur_row) == "1" )
				WGSheet_1.DeleteRow(cur_row);
			toobar_control(3, "query");
		}
	}
}


// 에러안나게, 추후 Action이나 SQL 붙일곳
function Run_Init (  )
{
}

var g_sub_ST01_row = 0;
function GetSaveData(save_data)
{
//	Form.Alert(save_data);
//	ODW_3.SUB_SetCellData("ST01", "save_data", 0, save_data);
//	Form.Alert(ODW_3.SUB_GetCellData("ST01", "save_data", 0));
	
//	ReadDgnLayout( xml_str )
	ReadDgnLayout( save_data );
}



function ReadDgnLayout( xml_str )
{
	var xml_layout = xml_str;
	var ml_doc = Form.GetXmlDocument("root");
	ml_doc.LoadXml(xml_layout);
	
	var ele_layout = ml_doc.SelectSingleNode("/ods_data");
	var ele_list_ctrl = ele_layout;
	if (ele_layout != null) 
	{
//		var ele_list_ctrl = ele_layout.SelectSingleNode("childNodes");
		ReadDgnLayout_OpenLayout(ele_list_ctrl, "");
	}

}



function ReadDgnLayout_OpenLayout(ele_list_ctrl, parent_name)
{
	var count = ele_list_ctrl.GetCount();
	if( count == 0 )
		return;

	for (var i = 0; i < count; i++) 
	{
		var ele_ctrl = ele_list_ctrl.GetItem(i);
		
		if ( parent_name == "" )
		{
			var map_name = ele_ctrl.GetAttribute("map_name");
			var uid = ele_ctrl.GetAttribute("uid");
			var gid = ele_ctrl.GetAttribute("gid");
			var ui_type = ele_ctrl.GetAttribute("ui_type");
			
			if( ele_ctrl.GetAttribute("ui_type") == "grid" )
			{
				ReadDgnLayout_OpenLayout(ele_ctrl, uid);
				continue;
			}
			
			if ( ui_type == "group" || ui_type == "" || ui_type == "button" || ui_type == "label" )
			{
				continue;
			}
			var value = ele_ctrl.GetValue();
			
			if ( ui_type == "image" )
			{
				var img_data = value;
				if( img_data.indexOf( "&") >= 0 )
				{
					var img_arr = img_data.split('&');
					var file_name = img_arr[0];
					img_data=img_arr[1];
				}
				ODW_3.SUB_SetCellData("ST01", "FieldVal", g_sub_ST01_row, file_name);
				ODW_3.SUB_SetCellData("ST01", "ImgData", g_sub_ST01_row, img_data);
			}
			else
			{
			
				ODW_3.SUB_SetCellData("ST01", "FieldVal", g_sub_ST01_row, value);
			}
	//		console.log( uid+"/../"+ui_type+"/../"+map_name+"/../"+gid+"/../"+value);
			ODW_3.SUB_SetCellData("ST01", "FieldCd", g_sub_ST01_row, uid);
			ODW_3.SUB_SetCellData("ST01", "FieldTp", g_sub_ST01_row, ui_type);
			ODW_3.SUB_SetCellData("ST01", "GridCd", g_sub_ST01_row, parent_name);
			g_sub_ST01_row++;
		}
		else if ( parent_name != "" )
		{
			for ( var col_idx = 0 ; col_idx < ele_ctrl._element.attributes.length ; col_idx++ )
			{
				var name = ele_ctrl._element.attributes[col_idx]["name"];
				var value = ele_ctrl._element.attributes[col_idx]["value"];
				
				ODW_3.SUB_SetCellData("ST01", "FieldCd", g_sub_ST01_row, name);
				ODW_3.SUB_SetCellData("ST01", "FieldVal", g_sub_ST01_row, value);
				ODW_3.SUB_SetCellData("ST01", "RowNo", g_sub_ST01_row, i);
//				ODW_3.SUB_SetCellData("ST01", "FieldTp", g_sub_ST01_row, parent_name);
				ODW_3.SUB_SetCellData("ST01", "FieldTp", g_sub_ST01_row, "column");
				ODW_3.SUB_SetCellData("ST01", "GridCd", g_sub_ST01_row, parent_name);
				g_sub_ST01_row++;
			}
		}
	}
}

function WGSheet_1_OnSelectRecordChanged( col_name, col, row )
{
	var DataID = WGSheet_1.GetGridCellText("DataID", row);
	if( DataID == "" )
		return;
	DGN_Design.SetDesignLayout(TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 6), "");
	LoadJobDataODS( DataID );
}


function LoadJobDataODS( DataID )
{
//	DGN_Design.ClearGrid("grid_1")
//	return;
	ODW_3.ResetODW();
	ODW_3.SetParam( "DataID", 0, DataID );
//	ODW_3.SetParam( "CmpyCd", 0, CmpyCd );
	if( !ODW_3.Query( "query_detail" ) ) // sub : ST01
	{
		Form.Alert( ODW_3.GetError() );		
		return;
	}
//	Form.Alert(ODW_3.SUB_GetRecordCount("ST01"));
	for ( var i = 0 ; i < ODW_3.SUB_GetRecordCount("ST01") ; i++ )
	{
		var FieldCd = ODW_3.SUB_GetCellData("ST01", "FieldCd", i);
		var FieldTp = ODW_3.SUB_GetCellData("ST01", "FieldTp", i);
		var RowNo = ODW_3.SUB_GetCellData("ST01", "RowNo", i);
		var FieldVal = ODW_3.SUB_GetCellData("ST01", "FieldVal", i);
		var GridCd = ODW_3.SUB_GetCellData("ST01", "GridCd", i);
		var ImgData = ODW_3.SUB_GetCellData("ST01", "ImgData", i);
		
		if ( FieldTp == "edit" || FieldTp == "combo" || FieldTp == "datetime" || FieldTp == "check" )
			DGN_Design.SetFieldData("", FieldCd, 0, FieldVal);
		else if ( FieldTp == "column" )
			DGN_Design.SetFieldData(GridCd, FieldCd, parseInt(RowNo), FieldVal);
		else if ( FieldTp == "image" )
			DGN_Design.SetFieldData("", FieldCd, 0, ImgData);
	}
	
	
	return;
	/*
	var saved_data = ODW_3.GetParam( "doc_contents" , 0 );	
//	Form.Alert(saved_data);
	var ctrl_list = DGN_Design.MetaGetNameList();
	if( saved_data != "" )
	{
		for( var i = 0 ; i < ctrl_list.length ; i++ )
		{
			if( DGN_Design.MetaGetCtrlType( ctrl_list[i] ) == "grid" )
				DGN_Design.ClearGrid(ctrl_list[i]);
			else
				DGN_Design.SetFieldData("", ctrl_list[i], 0, "");
		}
		
		DGN_Design.SetInputData( "xml", saved_data );
	}
	else
	{
		for( var i = 0 ; i < ctrl_list.length ; i++ )
		{
			DGN_Design.SetFieldData("", ctrl_list[i], 0, "");
		}
		DGN_Design.SetInputData( "xml", "" );
	}
	*/
}