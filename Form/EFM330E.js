
var set_info = "";
function Form_Load(  )
{
    WMDA_1.Toolbar_Visible("master_grid", "ok", false);
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    WMDA_1.Toolbar_Add("master_grid", "run", "조회", 0);
    WMDA_1.Toolbar_Add("master_grid", "setting", "서비스설정", 1);
}

function Form_OnKeyDown( key_val, key_name, ctrl_key, alt_key, shift_key, ctrl_name, widget_name, panel_name )
{
    
}

function Form_OnCloseDialog( view_code, dialog_result )
{
    if ( dialog_result != "1" || Form.DialogParamGet("ReturnCount") == "0" )
    {
//        Form.DialogClear();
//		set_info = "";
        return;
    }
    
    var panel_name = Form.GetViewData("panel_name");
    var ctrl_name = Form.GetViewData("ctrl_name");
    if ( view_code == "EFM330D" )
    {
        set_info = Form.DialogParamGet("set_info");
        if ( set_info != "" || set_info != null )
        {
            GRD_1.ClearGrid();
            GRD_1.InsertColumn(-1, "Seq", "No", 1, 50, "sequence");
        }
        
        var ODW = set_info["parts_code"]; //odw명
        var op_name_sub = set_info["op_name_sub"]; //operation명
        for ( var i = 0 ; i < set_info["grid"].length ; i++ )
        {
            GRD_1.InsertColumn(-1, set_info["grid"][i]["field_name"], set_info["grid"][i]["field_desc"], 1, 120, "edit");
        }
        
        //pivot 설정
        var row_sum = set_info["row_sum"]; //0-none, 1-top, 2-bottom
        var col_sum = set_info["col_sum"]; //0-none, 1-left, 2-right
        PIVOT_1.ShowSumPos( row_sum, col_sum ); //합계 위치를 설정.
        
        var cols_data = set_info["cols_data"]
        var cols_row_grouping = set_info["cols_row"]
        var cols_col_grouping = set_info["cols_col"]
        var cols_col_hidden = set_info["cols_hidden"]
        
        PIVOT_1.RunPivotInit( GRD_1, GRD_2,  cols_data, cols_row_grouping, cols_col_grouping, cols_col_hidden );
        GRD_2.SetVisible(true);
        Form.SetViewData("EFormID", Form.DialogParamGet("EFormID"));
        
//        if ( Form.DialogParamGet("call_type") == "run" )
//        {
            WMDA_1_OnToolbarClick( "master_grid", "run" );
//        }
    }
//    Form.DialogClear();
//	set_info = "";
}

function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if ( panel_name == "master_grid" )
    {
        if ( btn_id == "run" )
        {
            GRD_1.ClearData();
            if ( set_info == "" || set_info == null )
            {
                Form.DialogParamSet("call_type", "run");
                WMDA_1_OnToolbarClick( "master_grid", "setting" );
                return;
            }
            
            var odw_temp = Form.GetNewODW("EFormDataLine");
            
            if ( Form.GetViewData("EFormID") == "" )
            {
            	Form.Alert(Form.GetViewData("EFormID"));
            	return;
            }
            odw_temp.SetParam("EFormID", 0, Form.GetViewData("EFormID"));
            
//            odw_temp.SetParam("EFormID", 0, 33);
			if ( Form.DialogParamGet("GRID_YN") == "1" )
			{
            	odw_temp.SetParam("FieldTp", 0, "column");
            }
            
            if ( !odw_temp.Query("query_rn") )
            {
            	Form.Alert( odw_temp.GetError() );
            	return;
            }
			    var Data = [];
				var Data_row = {};
			    
			    var row_idx = 0;
			    for ( var i = 0 ; i < odw_temp.GetCount() ; i++ )
			    {
			    	var DataID = odw_temp.GetParam("DataID", i);
			    	var FieldCd = odw_temp.GetParam("FieldCd", i);
			    	var FieldTp = odw_temp.GetParam("FieldTp", i);
			    	var RowNo = odw_temp.GetParam("RowNo", i);
			    	var FieldVal = odw_temp.GetParam("FieldVal", i);
			    	var ImgData = odw_temp.GetParam("ImgData", i);
			    	
			    	
			    	Data_row[FieldCd] = FieldVal;
			    	// 다음항목을 체크해서 add함
			    	if( odw_temp.GetParam("DataID", i+1) != DataID || odw_temp.GetParam("RowNo", i+1) != RowNo )
			    	{
			    		Data_row["idx"] = row_idx;
			    		Data.push(Data_row);
			    		Data_row = {};
			    		row_idx++;
			    	}
			    }
			    
			    for ( var idx in Data )
			    {
					for ( var idx2 in Data[idx] )
			        {
			    		GRD_1.SetCellTextByName(idx2, idx, Data[idx][idx2]);
			        }
			    }
            
            PIVOT_1.RunPivot();
        }
        else if ( btn_id == "setting" )
        {
            Form.SetViewData("panel_name", "master_grid");
            Form.SetViewData("ctrl_name", "setting");
            Form.DialogParamSet("AutoType", "pivot");
            
            if ( Form.DialogParamGet("EFormID") == "" )
            {
            	Form.DialogParamSet("EFormID", "3");
            	Form.DialogParamSet("EFormNm", "주문정보 ver.1 #");
            	Form.DialogParamSet("GRID_YN", "0");
            }
            
            Form.DialogParamSet("ReturnCount", 0);
            Form.DialogParamSet("set_info", set_info);
            Form.ShowDialog("EFM330D");
        }
    }
}