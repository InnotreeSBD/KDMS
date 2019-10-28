
var g_widget_mode = false; // 편집에서는 초기 false

var dgn_width = 1200;
var dgn_height = 1000;

function Form_Load(  )
{
	
	
	var odw_combo = Form.GetNewODW("");
    odw_combo.BatchQueryInit();
    odw_combo.BatchQueryAdd("CmpyCd", "BACmpy", "CustCd", "CustNm", "WHERE CmpyYN = '1' ");
    odw_combo.BatchQueryRun();
	
	odw_combo.BatchQueryAddLocal("SearchTp", 0, 0, "");
	odw_combo.BatchQueryAddLocal("SearchTp", 1, 0, "Equal To");
	odw_combo.BatchQueryAddLocal("SearchTp", 0, 1, "from_to");
	odw_combo.BatchQueryAddLocal("SearchTp", 1, 1, "From To");
	odw_combo.BatchQueryAddLocal("SearchTp", 0, 2, "like_first");
	odw_combo.BatchQueryAddLocal("SearchTp", 1, 2, "Like First");
	odw_combo.BatchQueryAddLocal("SearchTp", 0, 3, "like");
	odw_combo.BatchQueryAddLocal("SearchTp", 1, 3, "Like");
	
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 0, "edit");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 0, "edit");
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 1, "datetime");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 1, "datetime");
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 2, "check");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 2, "check");
	
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 3, "combo");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 3, "combo");
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 4, "button");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 4, "button");
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 5, "label");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 5, "label");
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 6, "group");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 6, "group");
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 7, "grid");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 7, "grid");
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 8, "tab");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 8, "tab");
	odw_combo.BatchQueryAddLocal("FieldTp", 0, 9, "image");
	odw_combo.BatchQueryAddLocal("FieldTp", 1, 9, "image");
	
    WMDA_1.SetSelectRecordData("query", "CmpyCd", odw_combo, "CmpyCd");
	WMDA_1.SetSelectRecordData("ST01", "SearchTp", odw_combo, "SearchTp");
	WMDA_1.SetSelectRecordData("ST01", "FieldTp", odw_combo, "FieldTp");
    WMDA_1.SetFieldData("query", "CmpyCd", 0, odw_combo.BatchQueryGetCellVal("CmpyCd", 0, 0));
    
    
    DGN_Design.MetaShowLayout("form_border", false);
    DGN_Design.MetaShowLayout( "toolbar_ctrl", false );
	
	DGN_Design.SetPropertyTool( DGN_PPT, true );
    DGN_Design.AddInitProperty( "SearchTp", "string", "" ); // stdt, enddt
	DGN_PPT.UseCtrlTypeChange( true, ["edit", "grid_column", "check", "datetime", "combo", "label", "image"] );
	DGN_Design.InitMode(false, 1200, 800);
    
    DGN_Design.SetLayoutSize( dgn_width, dgn_height );
    
    WMDA_1.Toolbar_Add("ST01", "apply", "적용", 1);
    WMDA_1.Toolbar_Visible("ST01", "apply", false);
    WMDA_1.Toolbar_Visible("ST01", "add_record", false);
    WMDA_1.Toolbar_Visible("ST01", "save_record", false);
    
	WMDA_1.SetFieldData("query", "EFormTp", 0, "20");
    WMDA_1.RunQueryMaster(false);
    WMDA_1.UseColumnAllCheck("ST01", "SearchYN", 0, false);
    WMDA_1.UseColumnAllCheck("ST01", "ColumnYN", 0, false);
}

function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if ( panel_name == "master_grid" )
    {
        if ( btn_id == "query" )
        {
            
        }
        else if ( btn_id == "insert" )
        {
            WMDA_1.Toolbar_SkipExecute(panel_name);
            Form.DialogParamSet("ReturnCount", 0);
            Form.DialogParamSet("CmpyCd", WMDA_1.GetFieldData("query", "CmpyCd", 0));
            Form.ShowDialog("EFM110D"); // 회사서식선택
        }
    	else if (  btn_id == "ok" )
    	{
    		WMDA_1.SetFieldData("STMST", "EFormXML", 0, DGN_Design.GetDesignLayout(""));
    	}
    }
    else if ( panel_name == "ST01" && btn_id == "apply" )
    {
		BTN_apply_Click();
    }
}


function Form_OnCloseDialog( view_code, dialog_result )
{
//	Form.Alert(dialog_result);
    if ( !dialog_result )
    {
        Form.DialogClear();
        return;
    }
    if ( view_code == "EFM110D" )
    {
    	
		var insert_row = WMDA_1.InsertRow("master_grid", -1);
		WMDA_1.GridFocusRow("master_grid", insert_row);

        WMDA_1.SetWidgetEditMode(1);
		
		DGN_Design.SetDesignLayout("", "");
    	DGN_Design.SetLayoutSize( dgn_width, dgn_height );
		g_insert_mode = true;
    }
}

var g_insert_mode = false;

function WMDA_1_OnWidgetEditModeChanged( edit_mode )
{
	
}

function WMDA_1_OnQueryDetailEnd( result, row )
{
	// 입력 팝업 선택후 mode 변경 시
    if ( g_insert_mode == true )
    {
//		Form.Alert(Form.DialogParamGet("EFormNm"));
//		WMDA_1.SetFieldData("STMST", "EFormID", 0, Form.DialogParamGet("EFormID"));
//		WMDA_1.SetFieldData("STMST", "EFormCd", 0, Form.DialogParamGet("EFormCd"));
		WMDA_1.SetFieldData("STMST", "CmpyCd", 0, Form.DialogParamGet("CmpyCd"));
		WMDA_1.SetFieldData("STMST", "EFormNm", 0, Form.DialogParamGet("EFormNm") + " #");
		WMDA_1.SetFieldData("STMST", "EFormTp", 0, "20");
//		WMDA_1.SetFieldData("STMST", "EFormXML", 0, Form.DialogParamGet("EFormXML"));
		WMDA_1.SetFieldData("STMST", "MapSQL", 0, Form.DialogParamGet("MapSQL"));
		WMDA_1.SetFieldData("STMST", "CatCd1", 0, Form.DialogParamGet("CatCd1"));
		WMDA_1.SetFieldData("STMST", "CatCd2", 0, Form.DialogParamGet("CatCd2"));
		WMDA_1.SetFieldData("STMST", "ParentID", 0, Form.DialogParamGet("EFormID"));
		WMDA_1.SetFieldData("STMST", "ParentNm", 0, Form.DialogParamGet("EFormNm"));
		WMDA_1.SetFieldData("STMST", "Lv", 0, "4");
//		WMDA_1.SetFieldData("STMST", "DispSeq", 0, Form.DialogParamGet("DispSeq"));
//		WMDA_1.SetFieldData("STMST", "Remarks", 0, Form.DialogParamGet("Remarks"));
		WMDA_1.SetFieldData("STMST", "DicID", 0, Form.DialogParamGet("DicID"));
		WMDA_1.SetFieldData("STMST", "CallType", 0, Form.DialogParamGet("CallType"));
		WMDA_1.SetFieldData("STMST", "ParentParentNm", 0, Form.DialogParamGet("ParentNm"));
//			Form.DialogParamSet("ParentNm", TRE_1.NodeGetCell(TRE_1.GetKey_ParentNode(EFormID), 3));
		
		
		// EFormSQLMapper
		ODW_1.ResetODW();
		ODW_1.SetParam("CmpyCd", 0, Form.DialogParamGet("CmpyCd"));
		ODW_1.SetParam("EFormID", 0, Form.DialogParamGet("EFormID"));
		
		ODW_1.Query("query_rn");
		WMDA_1.ODWSet("ST01", ODW_1, true, 1);
		
		for ( var i = 0 ; i < ODW_1.GetCount() ; i++ )
		{
			WMDA_1.SetFieldData("ST01", "MapID", i, "");
			WMDA_1.SetFieldData("ST01", "EFormID", i, "");
			WMDA_1.SetFieldData("ST01", "FieldTp", i, "edit");
			
			var FieldTp = WMDA_1.GetFieldData("ST01", "FieldTp", i);
			switch ( FieldTp )
			{
				case "":
				break;
				case "":
				break;
				case "":
				break;
				case "":
				break;
			}
		}
		Form.DialogClear();
		g_insert_mode = false;
		GetEForm("");
		return;
	}
	
	// 일반 detailEnd
	DGN_Design.InitMode(g_widget_mode, 1200, 800);
	DGN_Design.ClearGrid("grid_1");
	
	if( WMDA_1.GetRowCount("ST01") == 0 )
	{
		WMDA_1.Toolbar_Enable("master_grid", "ok", false);
		return;
	}
	else
		WMDA_1.Toolbar_Enable("master_grid", "ok", true);
	
	var contents = WMDA_1.GetFieldData("master_grid", "EFormXML", WMDA_1.GetCurrentRow("master_grid"));
	GetEForm( contents );
}





function WMDA_1_OnInsertEnd( result, row )
{
    WMDA_1.RecordFromPanel("STMST", "master_grid", row);
}
function WMDA_1_OnUpdateEnd( result, row )
{
    WMDA_1.RecordFromPanel("STMST", "master_grid", row);
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    WMDA_1.GridFocusRow("master_grid", 0);
}


function GetEForm( contents )
{
//	Form.Alert(contents);
    DGN_Design.SetLayoutSize( dgn_width, dgn_height );
	
	if( contents != "" )
	{
		DGN_Design.SetDesignLayout(contents, "");
    	DGN_Design.SetLayoutSize( dgn_width, dgn_height );
		
	}
	else
	{
		var search_cnt = 1;
		
		var search_top = -12;
		var search_left = 24;
		
		var top_add = 24; // 증가상수
		var left_add = 204; // 증가상수
	//	ctrl_inst = DGN_Design.CreateControl("grid", ctrl_name, ctrl_name, "", 12, 60, 804, 400, " ");
		var date_count = 0;
		for( var i = 0 ; i < WMDA_1.GetRowCount("ST01") ; i++ )
		{
			// sql 제거 로직
			if( WMDA_1.GetFieldData("ST01", "FieldTp", i) == "label" || WMDA_1.GetFieldData("ST01", "FieldTp", i) == "group"
			    || WMDA_1.GetFieldData("ST01", "FieldTp", i) == "grid" || WMDA_1.GetFieldData("ST01", "FieldTp", i) == "tab"
			    || WMDA_1.GetFieldData("ST01", "FieldTp", i) == "img" )
				continue;
				
			if( WMDA_1.GetFieldData("ST01", "SearchYN", i) == "1" )
			{
			
				if( (search_cnt-1) % 4 == 0 )
				{
					search_top += top_add;
					search_left = 12;
					date_count = 0;
				}	
				search_left = 12 + ((search_cnt-1) % 4 ) * 204 + (date_count * 144);
				search_left = 12 + ((search_cnt-1) % 4 ) * 204;
				var SearchTp = WMDA_1.GetFieldData("ST01", "SearchTp", i);
				if( SearchTp == "from_to" )
				{
					var FieldCd = WMDA_1.GetFieldData("ST01", "FieldCd", i)+"_From";
//					var ctrl_inst = DGN_Design.CreateControl(WMDA_1.GetFieldData("ST01", "FieldTp", i), FieldCd, FieldCd, WMDA_1.GetFieldData("ST01", "FieldNm", i), search_left, search_top, 204, 24, "");
					var ctrl_inst = DGN_Design.CreateControl("datetime", FieldCd, FieldCd, WMDA_1.GetFieldData("ST01", "FieldNm", i), search_left, search_top, 204, 24, "");
					DGN_Design.MetaSetProperty(FieldCd, "SearchTp", "date_from");
					ctrl_inst.SetProperty( "map_name", WMDA_1.GetFieldData("ST01", "FieldCd", i) );
					
					var FieldCd = WMDA_1.GetFieldData("ST01", "FieldCd", i)+"_To";
					search_left=search_left+204;
//					var ctrl_inst = DGN_Design.CreateControl(WMDA_1.GetFieldData("ST01", "FieldTp", i), FieldCd, FieldCd, "~", search_left, search_top, 144, 24, "");
					var ctrl_inst = DGN_Design.CreateControl("datetime", FieldCd, FieldCd, "~", search_left, search_top, 144, 24, "");
					
					DGN_Design.MetaSetProperty(FieldCd, "Style", "date20");
					DGN_Design.MetaSetProperty(FieldCd, "SearchTp", "date_to");
//					DGN_Design.MetaSetProperty(FieldCd, "Map_Name", WMDA_1.GetFieldData("ST01", "FieldCd", i));
					ctrl_inst.SetProperty( "map_name", WMDA_1.GetFieldData("ST01", "FieldCd", i) );
					search_left=search_left+48;
					
					date_count++;
					search_cnt++;
				}
				else
				{
					var FieldCd = WMDA_1.GetFieldData("ST01", "FieldCd", i);
					var ctrl_inst = DGN_Design.CreateControl(WMDA_1.GetFieldData("ST01", "FieldTp", i), FieldCd, FieldCd, WMDA_1.GetFieldData("ST01", "FieldNm", i), search_left, search_top, 204, 24, "");
					DGN_Design.MetaSetProperty(FieldCd, "SearchTp", WMDA_1.GetFieldData("ST01", "SearchTp", i));
//					DGN_Design.MetaSetProperty(FieldCd, "Map_Name", WMDA_1.GetFieldData("ST01", "FieldCd", i));
//					ctrl_inst.SetProperty( "map_name", WMDA_1.GetFieldData("ST01", "FieldCd", i) );
					
					
				}
				search_cnt++;
			}
		}
		
	//a = search_top
		
		var column_cnt = 1;
		
		var column_top = search_top;
		var column_left = 0;
		
		var top_add = 0; // 증가상수
		var left_add = 84; // 증가상수
		
		
		
		var grid_top = column_top+36;
		var ctrl_name = "grid_1";
		ctrl_inst = DGN_Design.CreateControl("grid", ctrl_name, ctrl_name, "", 12, grid_top, 1152, 420 - grid_top, " ");
		DGN_Design.MetaSetProperty(ctrl_name, "Style", "grid_no_toolbar");
		
		// 포지션 계산 때문에 따로 돌린다.
		for( var i = 0 ; i < WMDA_1.GetRowCount("ST01") ; i++ )
		{
			if( WMDA_1.GetFieldData("ST01", "ColumnYN", i) == "1" )
			{
				if( (column_cnt-1) % 8 == 0 )
				{
					column_top += top_add;
					column_left = 0;
				}	
				
				column_left = 0 + ((column_cnt-1) % 8 ) * left_add;
				var ctrl_name = "grid_column_"+WMDA_1.GetFieldData("ST01", "FieldCd", i);
	//			Form.Alert(column_left);
				ctrl_inst = DGN_Design.CreateControl("grid_column", "grid_1", ctrl_name, WMDA_1.GetFieldData("ST01", "FieldNm", i), column_left, column_top-12, 84, 24, "");
				column_cnt++;
			}
		}
		
	}
}


function BTN_apply_Click(  )
{
		DGN_Design.InitMode(g_widget_mode, 1200, 800);
		DGN_Design.ClearGrid("grid_1");
		
		if( WMDA_1.GetRowCount("ST01") == 0 )
		{
			WMDA_1.Toolbar_Enable("master_grid", "ok", false);
			return;
		}
		else
			WMDA_1.Toolbar_Enable("master_grid", "ok", true);
		
		var contents = WMDA_1.GetFieldData("master_grid", "EFormXML", WMDA_1.GetCurrentRow("master_grid"));
		var contents = "";
		GetEForm( contents );
}