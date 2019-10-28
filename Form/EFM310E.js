
var g_widget_mode = false; // 편집에서는 초기 false

var dgn_width = 1200;
var dgn_height = 1000;

function Form_Load(  )
{
    
    var odw_combo = Form.GetNewODW("");
    odw_combo.BatchQueryInit();
    odw_combo.BatchQueryAdd("CmpyCd", "BACmpy", "CustCd", "CustNm", "WHERE CmpyYN = '1' ");
    odw_combo.BatchQueryRun();
    
    WMDA_1.SetSelectRecordData("query", "CmpyCd", odw_combo, "CmpyCd");
    WMDA_1.SetFieldData("query", "CmpyCd", 0, odw_combo.BatchQueryGetCellVal("CmpyCd", 0, 0));
    
    DGN_Design.MetaShowLayout( "toolbar_ctrl", false );
	
	DGN_Design.SetPropertyTool( DGN_PPT, false );
    DGN_Design.AddInitProperty( "SearchTp", "string", "" ); // stdt, enddt
	DGN_PPT.UseCtrlTypeChange( true, ["edit", "grid_column", "check", "datetime", "combo", "label", "image"] );
	DGN_Design.InitMode(false, 1200, 800);
    
    DGN_Design.SetLayoutSize( dgn_width, dgn_height );
    
	WMDA_1.Toolbar_Add("master_grid", "init", "초기화", 0); // contents 비우기
	
    WMDA_1.SetFieldData("query", "EFormTp", 0, "20");
    WMDA_1.RunQueryMaster(false);
}


function WMDA_1_OnQueryDetailEnd( result, row )
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
	GetEForm( contents );
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
					var ctrl_inst = DGN_Design.CreateControl(WMDA_1.GetFieldData("ST01", "FieldTp", i), FieldCd, FieldCd, WMDA_1.GetFieldData("ST01", "FieldNm", i), search_left, search_top, 204, 24, "");
					DGN_Design.MetaSetProperty(FieldCd, "SearchTp", "date_from");
					
					var FieldCd = WMDA_1.GetFieldData("ST01", "FieldCd", i)+"_To";
					search_left=search_left+204;
					var ctrl_inst = DGN_Design.CreateControl(WMDA_1.GetFieldData("ST01", "FieldTp", i), FieldCd, FieldCd, "~", search_left, search_top, 144, 24, "");
					DGN_Design.MetaSetProperty(FieldCd, "Style", "date20");
					DGN_Design.MetaSetProperty(FieldCd, "SearchTp", "date_to");
					search_left=search_left+48;
					
					date_count++;
					search_cnt++;
				}
				else
				{
				
					var FieldCd = WMDA_1.GetFieldData("ST01", "FieldCd", i);
					var ctrl_inst = DGN_Design.CreateControl(WMDA_1.GetFieldData("ST01", "FieldTp", i), FieldCd, FieldCd, WMDA_1.GetFieldData("ST01", "FieldNm", i), search_left, search_top, 204, 24, "");
					DGN_Design.MetaSetProperty(FieldCd, "SearchTp", WMDA_1.GetFieldData("ST01", "SearchTp", i));
				}
				search_cnt++;
			}
		}
		
	//a = search_top
		
		var column_cnt = 1;
		
		var column_top = search_top;
		var column_left = 36;
		
		var top_add = 36; // 증가상수
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
					column_left = 36;
				}	
				
				column_left = 36 + ((column_cnt-1) % 8 ) * left_add;
				var ctrl_name = "grid_column_"+WMDA_1.GetFieldData("ST01", "FieldCd", i);
	//			Form.Alert(column_left);
				ctrl_inst = DGN_Design.CreateControl("grid_column", "grid_1", ctrl_name, WMDA_1.GetFieldData("ST01", "FieldNm", i), column_left, column_top, 84, 24, "");
				column_cnt++;
			}
		}
		
	}
}


function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if( panel_name == "master_grid" && btn_id == "ok" )
    {
    	WMDA_1.SetFieldData("STMST", "EFormXML", 0, DGN_Design.GetDesignLayout());
    	WMDA_1.RunSaveMaster(false, WMDA_1.GetCurrentRow("master_grid"));
    }
    else if( ( panel_name == "master_grid" && btn_id == "run_mode" ) || ( panel_name == "master_grid" && btn_id == "dgn_mode" ))
    {
    	if( g_widget_mode )	
    	{
    		g_widget_mode = false;
    		WMDA_1.Toolbar_Visible("master_grid", "dgn_mode", false);
    		WMDA_1.Toolbar_Visible("master_grid", "run_mode", true);
//    		BTN_1.SetVisible(false);
    	}
    	else
    	{
    		g_widget_mode = true;
    		WMDA_1.Toolbar_Visible("master_grid", "dgn_mode", true);
    		WMDA_1.Toolbar_Visible("master_grid", "run_mode", false);
//    		BTN_1.SetVisible(true);
			
    	}
//    	setTimeout(function(){
    		WMDA_1_OnQueryDetailEnd( true, WMDA_1.GetCurrentRow("master_grid") );
//    		GetJobDataBunch( )
//    	}, 300);
    	
    }
    else if( panel_name == "master_grid" && btn_id == "init" )
    {
//    	ODW_2.ResetODW();
//    	ODW_2.SetParam("set_id", 0, WMDA_1.GetFieldData("master_grid", "dgn_contents", WMDA_1.GetCurrentRow("master_grid")));
//    	
//    	if( !ODW_2.Update("update_contents_init") )
//    	{
//    		Form.Alert( ODW_2.GetError() );
//    		return;
//    	} 
    	WMDA_1.SetFieldData("master_grid", "EFormXML", WMDA_1.GetCurrentRow("master_grid"), "");
    	WMDA_1.SetFieldData("STMST", "EFormXML", WMDA_1.GetCurrentRow("master_grid"), "");
    	DGN_Design.SetDesignLayout("");
    	GetEForm("");
    }
}


function WMDA_1_OnUpdateEnd( result, row )
{
    WMDA_1.RecordFromPanel("STMST", "master_grid", row);
}