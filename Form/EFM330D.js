
var set_info = "";
var AutoType = "";
function Form_Load(  )
{
    WMDA_1.Toolbar_Visible("master_grid", "ok", false);
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    
    WMDA_1.Toolbar_Add("master_grid", "ok2", "확인", 1);
    
    //combo
    var odw_combo = Form.GetNewODW("");
    odw_combo.BatchQueryInit();
    odw_combo.BatchQueryAddLocal("row_sum", 0, 0, "0");
    odw_combo.BatchQueryAddLocal("row_sum", 1, 0, "표시안함 ");
    odw_combo.BatchQueryAddLocal("row_sum", 0, 1, "1");
    odw_combo.BatchQueryAddLocal("row_sum", 1, 1, "상단 ");
    odw_combo.BatchQueryAddLocal("row_sum", 0, 2, "2");
    odw_combo.BatchQueryAddLocal("row_sum", 1, 2, "하단 ");
    
    odw_combo.BatchQueryAddLocal("col_sum", 0, 0, "0");
    odw_combo.BatchQueryAddLocal("col_sum", 1, 0, "표시안함 ");
    odw_combo.BatchQueryAddLocal("col_sum", 0, 1, "1");
    odw_combo.BatchQueryAddLocal("col_sum", 1, 1, "좌측 ");
    odw_combo.BatchQueryAddLocal("col_sum", 0, 2, "2");
    odw_combo.BatchQueryAddLocal("col_sum", 1, 2, "우측 ");
    
    WMDA_1.SetSelectRecordData("query", "row_sum", odw_combo, "row_sum");
    WMDA_1.SetSelectRecordData("query", "col_sum", odw_combo, "col_sum");
    
    WMDA_1.UseColumnAllCheck("master_grid", "cols_row", 0, false);
    WMDA_1.UseColumnAllCheck("master_grid", "cols_col", 0, false);
    WMDA_1.UseColumnAllCheck("master_grid", "cols_hidden", 0, false);
    WMDA_1.UseColumnAllCheck("master_grid", "cols_data", 0, false);
    
    WMDA_1.SetFieldProperty("query", "row_sum", "RadioDirection", "2");
    WMDA_1.SetFieldProperty("query", "col_sum", "RadioDirection", "2");
    
//    WMDA_1.SetFieldData("query", "EFormID", 0, "33");
//    WMDA_1.SetFieldData("query", "EFormNm", 0, "주문정보 ver1 #");
    WMDA_1.SetFieldData("query", "EFormID", 0, Form.DialogParamGet("EFormID"));
    WMDA_1.SetFieldData("query", "EFormNm", 0, Form.DialogParamGet("EFormNm"));
    WMDA_1.SetFieldData("query", "GRID_YN", 0, Form.DialogParamGet("GRID_YN"));
    
    
//    WMDA_1.SetFieldData("query", "FieldTp", 0, "grid_column");
    
    WMDA_1.SetFieldProperty("query", "row_sum", "Visible", 1);
    WMDA_1.SetFieldProperty("query", "col_sum", "Visible", 1);
    WMDA_1.SetColumnVisible("master_grid", "cols_row", true);
    WMDA_1.SetColumnVisible("master_grid", "cols_col", true);
    WMDA_1.SetColumnVisible("master_grid", "cols_hidden", true);
    WMDA_1.SetColumnVisible("master_grid", "cols_data", true);
    WMDA_1.SetColumnVisible("master_grid", "field_type", false);
        
    WMDA_1.SetFieldData("query", "row_sum", 0, 0);
    WMDA_1.SetFieldData("query", "col_sum", 0, 0);
    
    set_info = Form.DialogParamGet("set_info");
    if ( set_info == "" || set_info == null ) 
    	WMDA_1.RunQueryMaster(false);
    else
    {
    	SET_PARAM(  );
    }
    
}

function Form_OnKeyDown( key_val, key_name, ctrl_key, alt_key, shift_key, ctrl_name, widget_name, panel_name )
{
    if ( key_name == "RETURN" )
    {
        if ( widget_name == "WMDA_1" )
        {
            if ( panel_name == "query" )
            {
                if ( ctrl_name.toLowerCase() == "parts_code" )
                {
                    WMDA_1.RunQueryMaster(false);
                }
            }
        }
    }
}

function Form_OnCloseDialog( view_code, dialog_result )
{
    if ( dialog_result != "1" )
    {
        Form.DialogClear();
        return;
    }
    
    if( view_code == "EFM331D" )
    {
        WMDA_1.SetFieldData("query", "EFormNm", 0, Form.DialogParamGet("EFormNm"));
        WMDA_1.SetFieldData("query", "EFormID", 0, Form.DialogParamGet("EFormID"));
        WMDA_1.SetFieldData("query", "EFormCd", 0, Form.DialogParamGet("EFormCd"));
        
        WMDA_1.SetFieldData("query", "GRID_YN", 0, Form.DialogParamGet("GRID_YN"));
        
        Form_OnKeyDown("", "RETURN", "", "", "", "parts_code", "WMDA_1", "query");
    }
}

function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if ( panel_name == "master_grid" )
    {
        if ( btn_id == "ok2" )
        {
            if ( WMDA_1.GetFieldData("query", "EFormNm", 0) == "" )
            {
                WMDA_1.SetFieldFocus("query", "EFormNm");
                Form.Alert("[서식]은(는) 필수입력항목입니다.");
                return;
            }

//            if ( AutoType == "spring" )
//            {
//                if ( WMDA_1.GetFieldData("query", "URL", 0) == "" )
//                {
//                    WMDA_1.SetFieldFocus("query", "URL");
//                    Form.Alert("[URL]을 선택해주세요.");
//                    return;
//                }
//            }
//            else if ( AutoType == "t" )
//            {
//                // Empty
//            }
//            else
//            {
//                if ( WMDA_1.GetFieldData("query", "op_name_sub", 0) == "" )
//                {
//                    WMDA_1.SetFieldFocus("query", "op_name_sub");
//                    Form.Alert("[Operation]를 선택해주세요.");
//                    return;
//                }
//            }
            
            set_info = new Object();
            set_info["parts_code"] = WMDA_1.GetFieldData("query", "parts_code", 0);
            set_info["op_name_sub"] = WMDA_1.GetFieldData("query", "op_name_sub", 0);
            set_info["URL"] = WMDA_1.GetFieldData("query", "URL", 0);
            set_info["row_sum"] = WMDA_1.GetFieldData("query", "row_sum", 0);
            set_info["col_sum"] = WMDA_1.GetFieldData("query", "col_sum", 0);
            set_info["query"] = new Array();
            set_info["grid"] = new Array();
            set_info["cols_data"] = new Array();
            set_info["cols_row"] = new Array();
            set_info["cols_col"] = new Array();
            set_info["cols_hidden"] = new Array();
            var Cnt = 0;
            var condition_cnt = 0;
            var grid_cnt = 0;
            var cols_row_cnt = 0;
            var cols_col_cnt = 0;
            var cols_hidden_cnt = 0;
            var cols_data_cnt = 0;
            for ( var i = 0 ; i < WMDA_1.GetRowCount("master_grid") ; i++ )
            {
                var field_name = WMDA_1.GetFieldData("master_grid", "FieldCd", i);
                var field_desc = WMDA_1.GetFieldData("master_grid", "FieldNm", i);
                if ( field_desc == "" ) field_desc = field_name;
                if ( WMDA_1.GetFieldData("master_grid", "condition_yn", i) == "1" )
                {
                    set_info["query"][condition_cnt] = new Object();
                    set_info["query"][condition_cnt]["field_name"] = WMDA_1.GetFieldData("master_grid", "FieldCd", i);
                    set_info["query"][condition_cnt]["field_desc"] = field_desc;
                    set_info["query"][condition_cnt]["condition_val"] = WMDA_1.GetFieldData("master_grid", "condition_val", i);
                    condition_cnt++;
                }
                
                if ( WMDA_1.GetFieldData("master_grid", "grid_yn", i) == "1" )
                {
                    set_info["grid"][grid_cnt] = new Object();
                    set_info["grid"][grid_cnt]["field_name"] = WMDA_1.GetFieldData("master_grid", "FieldCd", i);
                    set_info["grid"][grid_cnt]["field_desc"] = field_desc;
                    set_info["grid"][grid_cnt]["field_type"] = WMDA_1.GetFieldData("master_grid", "field_type2", i);
                    grid_cnt++;
                    
                    if ( WMDA_1.GetFieldData("master_grid", "field_type2", i) == "cols_row" )
                    {
                        set_info["cols_row"][cols_row_cnt] = WMDA_1.GetFieldData("master_grid", "FieldCd", i);
                        cols_row_cnt++;
                    }
                    else if ( WMDA_1.GetFieldData("master_grid", "field_type2", i) == "cols_col" )
                    {
                        set_info["cols_col"][cols_col_cnt] = WMDA_1.GetFieldData("master_grid", "FieldCd", i);
                        cols_col_cnt++;
                    }
                    else if ( WMDA_1.GetFieldData("master_grid", "field_type2", i) == "cols_hidden" )
                    {
                        set_info["cols_hidden"][cols_hidden_cnt] = WMDA_1.GetFieldData("master_grid", "FieldCd", i);
                        cols_hidden_cnt++;
                    }
                    else if ( WMDA_1.GetFieldData("master_grid", "field_type2", i) == "cols_data" )
                    {
                        set_info["cols_data"][cols_data_cnt] = WMDA_1.GetFieldData("master_grid", "FieldCd", i);
                        cols_data_cnt++;
                    }
                }
            }
            
            Form.DialogParamSet("set_info", set_info);
            Form.DialogParamSet("ReturnCount", "1");
            Form.DialogParamSet("GRID_YN", WMDA_1.GetFieldData("query", "GRID_YN", 0));
            Form.DialogParamSet("EFormID", WMDA_1.GetFieldData("query", "EFormID", 0));
            Form.CloseView(1);
//            ODW_2.ResetODW(); // AutoInfo
//            ODW_2.SetParam("AutoType", 0, AutoType);
//            ODW_2.SetParam("AutoInfo", 0, JSON.stringify(set_info));
//            ODW_2.Update("update_sc");
        }
    }
}

function WMDA_1_OnButtonDown( panel_name, ctrl_name, row )
{
    if ( panel_name == "query" )
    {
        if ( ctrl_name == "BTN_Search" )
        {
            WMDA_1.RunQueryMaster(false);
        }
        else if ( ctrl_name == "BTN_URL" )
        {
        }
        else if( ctrl_name == "BTN_eform" )
        {
        	Form.DialogParamSet("a", "a");
            Form.ShowDialog("EFM331D");
        }
    }
}

function WMDA_1_OnQueryMasterSend( row )
{
//    WMDA_1.ClearWidget();
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    if ( !result ) return;
    
    return;
	
    var parts_code = WMDA_1.GetFieldData("query", "parts_code", 0);
    ODW_1.ResetODW(); // od_parts_method
    ODW_1.SetParam("parts_code", 0, parts_code);
    ODW_1.SetParam("parts_type", 0, "odw");
    ODW_1.SetParam("op_name", 0, "query");
    if ( !ODW_1.Query("query_rn") )
    {
        Form.Alert(ODW_1.GetError());
        return;
    }
    
    for ( var i = 0 ; i < ODW_1.GetCount() ; i++ )
    {
        ODW_1.BatchQueryAddLocal(parts_code, 0, i, ODW_1.GetParam("op_name_sub", i));
        ODW_1.BatchQueryAddLocal(parts_code, 1, i, ODW_1.GetParam("op_name_sub", i));
    }
    WMDA_1.SetSelectRecordData("query", "op_name_sub", ODW_1, parts_code);
    
    //if ( set_info != "" && set_info != null )
    if ( Form.GetViewData("SET_PARAM") == "Y" )
    {
        Form.SetViewData("SET_PARAM", "");
        SET_PARAM2();
    }
}

function WMDA_1_OnCellValueChanged_After( panel_name, col_name, col, row, val )
{
    var cols_arr = new Array("cols_row", "cols_col", "cols_hidden", "cols_data");
    if ( panel_name == "master_grid" )
    {
        if ( col_name == "condition_yn" )
        {
            if ( val == "1" )
            {
                WMDA_1.GridFocusCell("master_grid", "condition_val", row);
                WMDA_1.StartEditCell("master_grid", "condition_val", row);
            }
        }
        if ( col_name == "cols_row" || col_name == "cols_col" || col_name == "cols_hidden" || col_name == "cols_data" )
        {
            if ( val == "1" )
            {
                for ( var i = 0 ; i < cols_arr.length ; i++ )
                {
                    if ( col_name != cols_arr[i] )
                        WMDA_1.SetFieldData("master_grid", cols_arr[i], row, "0");
                }
                WMDA_1.SetFieldData("master_grid", "field_type2", row, col_name);
                WMDA_1.SetFieldData("master_grid", "grid_yn", row, "1");
            }
            else
            {
                WMDA_1.SetFieldData("master_grid", "field_type2", row, "");
            }
        }
    }
}

function SET_PARAM(  )
{
    if ( set_info == "" || set_info == null ) return;
    
    for ( var i = 0 in set_info.grid )
    {
    	var row_data = set_info.grid[i]; // obj
    	
    	var insert_row = WMDA_1.InsertRow("master_grid", -1);
    	
    	var field_name = row_data["field_name"];
    	var field_desc = row_data["field_desc"];
    	var field_type = row_data["field_type"];
    	WMDA_1.SetFieldData("master_grid", "FieldCd", insert_row, field_name);
    	WMDA_1.SetFieldData("master_grid", "FieldNm", insert_row, field_desc);
    	WMDA_1.SetFieldData("master_grid", "grid_yn", insert_row, "1");
    	WMDA_1.SetFieldData("master_grid", "grid_yn", insert_row, "1");

    	if ( field_type != "" )
    	{
    		WMDA_1.SetFieldData("master_grid", field_type, insert_row, "1");
    		WMDA_1.SetFieldData("master_grid", "field_type2", insert_row, field_type);
    	}
    }
    
//    Form.SetViewData("SET_PARAM", "Y");
//    WMDA_1.SetFieldData("query", "parts_code", 0, set_info["parts_code"]);
//    WMDA_1.SetFieldData("query", "URL", 0, set_info["URL"]);
//    WMDA_1.SetFieldData("query", "row_sum", 0, set_info["row_sum"]);
//    WMDA_1.SetFieldData("query", "col_sum", 0, set_info["col_sum"]);
//    WMDA_1.RunQueryMaster(false);

}

function SET_PARAM2(  )
{
    WMDA_1.SetFieldData("query", "op_name_sub", 0, set_info["op_name_sub"]);
    for ( var i = 0 ; i < set_info["query"].length ; i++ )
    {
        for ( var j = 0 ; j < WMDA_1.GetRowCount("master_grid") ; j++ )
        {
            if ( set_info["query"][i]["field_name"] == WMDA_1.GetFieldData("master_grid", "field_name", j) )
            {
                WMDA_1.SetFieldData("master_grid", "condition_yn", j, "1");
                WMDA_1.SetFieldData("master_grid", "field_desc", j, set_info["query"][i]["field_desc"]);
                WMDA_1.SetFieldData("master_grid", "condition_val", j, set_info["query"][i]["condition_val"]);
                break;
            }
        }
    }
    for ( var i = 0 ; i < set_info["grid"].length ; i++ )
    {
        for ( var j = 0 ; j < WMDA_1.GetRowCount("master_grid") ; j++ )
        {
            if ( set_info["grid"][i]["field_name"] == WMDA_1.GetFieldData("master_grid", "field_name", j) )
            {
                WMDA_1.SetFieldData("master_grid", "grid_yn", j, "1");
                WMDA_1.SetFieldData("master_grid", "field_type", j, set_info["grid"][i]["field_type"]);
                var field_type = set_info["grid"][i]["field_type"];
                if( field_type == "cols_row" )
                    WMDA_1.SetFieldData("master_grid", "cols_row", j, 1);
                else if( field_type == "cols_col" )
                    WMDA_1.SetFieldData("master_grid", "cols_col", j, 1);
                else if( field_type == "cols_hidden" )
                    WMDA_1.SetFieldData("master_grid", "cols_hidden", j, 1);
                else if( field_type == "cols_data" )
                    WMDA_1.SetFieldData("master_grid", "cols_data", j, 1);
                break;
            }
        }
    }
}

