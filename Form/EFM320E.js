
var g_widget_mode = true; // 편집에서는 초기 false

var dgn_width = 1200;
var dgn_height = 1000;

function Form_Load(  )
{
    DGN_Design.MetaShowLayout( "toolbar_ctrl", false );
	
	DGN_Design.SetPropertyTool( DGN_PPT, false );
    DGN_Design.AddInitProperty( "SearchTp", "string", "" ); // stdt, enddt
	DGN_PPT.UseCtrlTypeChange( true, ["edit", "grid_column", "check", "datetime", "combo", "label", "image"] );
	DGN_Design.InitMode(g_widget_mode, 1200, 800);
    
    DGN_Design.SetLayoutSize( dgn_width, dgn_height );
    
	WMDA_1.Toolbar_Add("master_grid", "init", "초기화", 0); // contents 비우기
	if ( g_widget_mode )
	{
		WMDA_1.Toolbar_Visible("master_grid", "init", false);
	}
	
    WMDA_1.SetFieldData("query", "EFormTp", 0, "20");
    WMDA_1.RunQueryMaster(false);
    BTN_1.SetVisible(true);
    
//    Form.Alert();
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
	BTN_1_Click(  );
}


function GetEForm( contents )
{
//	Form.Alert(contents);
    DGN_Design.SetLayoutSize( dgn_width, dgn_height );
	
	if( contents != "" )
	{
		DGN_Design.SetDesignLayout(contents, "");
    	DGN_Design.SetLayoutSize( dgn_width, dgn_height );
    	
	var ctrl_list = DGN_Design.MetaGetNameList();
	for( var i = 0 ; i<ctrl_list.length ;i++)
	{
		//console.log(ctrl_list[i])
		if( ctrl_list[i].indexOf("_From") > -1)
	    {
			DGN_Design.SetFieldData("", ctrl_list[i], 0, Form.SubString(Form.GetServerDate("yyyy-mm-dd"), 0, 7)+"-01");
	    }
	}
		
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
    	WMDA_1.SetFieldData("STMST", "EFormXML", 0, DGN_Design.GetDesignLayout("xml"));
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
    	DGN_Design.SetDesignLayout("", "xml");
    	GetEForm("");
    }
}


function WMDA_1_OnUpdateEnd( result, row )
{
    WMDA_1.RecordFromPanel("STMST", "master_grid", row);
}
//var Data;
function BTN_1_Click(  )
{
//	DGN_Design.SetDesignLayout("", "");

	// 초기화 하는방법 어떤게 나을지???
//	var contents = WMDA_1.GetFieldData("master_grid", "EFormXML", WMDA_1.GetCurrentRow("master_grid"))
//	GetEForm( contents );
	DGN_Design.ClearGrid("grid_1");
	
	ODW_1.ResetODW();
    ODW_1.SetParam("EFormID", 0, WMDA_1.GetFieldData("master_grid", "ParentID", WMDA_1.GetCurrentRow("master_grid")));
    
    if( !ODW_1.Query("query_rn_search") )
    {
    	Form.Alert(ODW_1.GetError());
    }
    
//var sql ="SELECT LineID, DataID, EFormID \r\n"
//         +"    , CmpyCd, FieldCd, FieldTp \r\n"
//         +"    , GridCd, RowNo, FieldVal \r\n"
//         +"    , ImgData, ApUserID, ApDt \r\n"
//         +"    , UpUserID, UpDt \r\n"
         
    // 데이터 가공 (Data(ODW의 JSON화))
    var FieldList = [];
    var DataLine = [];
    
    var Data = [];
	var Data_row = {};
    
    var row_idx = 0;
    for ( var i = 0 ; i < ODW_1.GetCount() ; i++ )
    {
    	var DataLine_row = {};
//    	Data_row = {};
    	
    	var DataID = ODW_1.GetParam("DataID", i);
    	var FieldCd = ODW_1.GetParam("FieldCd", i);
    	var FieldTp = ODW_1.GetParam("FieldTp", i);
    	var RowNo = ODW_1.GetParam("RowNo", i);
    	var FieldVal = ODW_1.GetParam("FieldVal", i);
    	var ImgData = ODW_1.GetParam("ImgData", i);
    	
//    	DataLine_row["DataID"] = DataID;
//    	DataLine_row["FieldCd"] = FieldCd;
//    	DataLine_row["FieldTp"] = FieldTp;
//    	DataLine_row["RowNo"] = RowNo;
//    	DataLine_row["FieldVal"] = FieldVal;
//    	DataLine_row["ImgData"] = ImgData;
//    	
//    	DataLine.push( Data_row )
    	if ( FieldList.indexOf(FieldCd) < 0 )
    		FieldList.push(FieldCd);
    	
    	
    	Data_row[FieldCd] = FieldVal;
    	// 다음항목을 체크해서 add함
    	if( ODW_1.GetParam("DataID", i+1) != DataID || ODW_1.GetParam("RowNo", i+1) != RowNo )
    	{
    		Data_row["idx"] = row_idx;
    		Data.push(Data_row);
    		Data_row = {};
    		row_idx++;
    	}
    }
    
    // 조건검색 Data(ODW의 JSON화) -> SearchData
    var SearchData = [];
    var ctrl_list = DGN_Design.MetaGetNameList();
    for ( var data_idx = 0 ; data_idx < Data.length ; data_idx++)
    {
    	var search_flag = true;
	    for ( var i = 0 ; i < ctrl_list.length ; i++ )
	    {
	    	var ctrl_name = ctrl_list[i];
	    	var ctrl_type = DGN_Design.MetaGetCtrlObject(ctrl_name)._ctrl_type;
	    	var SearchTp = DGN_Design.MetaGetProperty(ctrl_name, "SearchTp");
	    	if ( ctrl_type == "grid" || ctrl_type == "grid_column" || ctrl_type == "group" )
	    	{
	    		continue;
	    	}
	    	else if ( ctrl_type == "edit" )
	    	{
	    		// edit
	    		var search_val = DGN_Design.GetFieldData("", ctrl_name, 0)
	    		if( DGN_Design.GetFieldData("", ctrl_name, 0) != "" && SearchTp == "" )
	    		{
	    			if( search_val != Data[data_idx][ctrl_name] )
    					search_flag = false;
	    		}
	    		else if( DGN_Design.GetFieldData("", ctrl_name, 0) != "" && SearchTp == "like" )
	    		{	
	    			if( Data[data_idx][ctrl_name].indexOf(DGN_Design.GetFieldData("", ctrl_name, 0)) == -1 )
	    			{
    					search_flag = false;
	    				
	    			}
	    		}
	    		else if( DGN_Design.GetFieldData("", ctrl_name, 0) != "" && SearchTp == "like_first" )
	    		{	
	    			if( search_val != Data[data_idx][ctrl_name].substring(0,search_val.length) )
	    			{
    					search_flag = false;
	    			}
	    		}
	    	}
	    	else if ( ctrl_type == "datetime" )
	    	{
				var search_val = DGN_Design.GetFieldData("", ctrl_name, 0);
	    		if( DGN_Design.GetFieldData("", ctrl_name, 0) != "" && SearchTp == "" )
	    		{
	    			if( search_val != Data[data_idx][ctrl_name] )
    					search_flag = false;
	    		}
	    		else if ( DGN_Design.GetFieldData("", ctrl_name, 0) != "" && SearchTp == "date_from" )
	    		{
					// xxx_From -> xxx
	    			ctrl_name = ctrl_name.replace(/_From/gi,"");
	    			var date_from = DGN_Design.GetFieldData("", ctrl_name+"_From", 0);
	    			var date_to = DGN_Design.GetFieldData("", ctrl_name+"_To", 0);
//					console.log(date_from)
//					console.log(date_to)
					if ( Data[data_idx][ctrl_name] < date_from || Data[data_idx][ctrl_name] > date_to )
					{
    					search_flag = false;
					}
	    		}
	    	}
	    }
	    if ( search_flag )
	    	SearchData.push(Data[data_idx]);
    }
	
	
	// 출력
    for ( var data_idx = 0 ; data_idx < SearchData.length ; data_idx++)
    {
    	var insert_row = DGN_Design.InsertRow("grid_1", -1);
    	for ( var FieldList_idx = 0 ; FieldList_idx < FieldList.length ; FieldList_idx++ )
    	{
    		var value = SearchData[data_idx][FieldList[FieldList_idx]];
    		DGN_Design.SetFieldData("grid_1", "grid_column_"+FieldList[FieldList_idx], insert_row, value);
    		//console.log(insert_row +"//"+FieldList[FieldList_idx]+value)
    	}
    }
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    //WMDA_1.GridFocusRow("master_grid", 0);
}