

function Form_Load(  )
{
    WShtAC_1.Toolbar_Visible("query", false);
    WShtAC_1.Toolbar_Visible("ok", false);
    WShtAC_1.Toolbar_Visible("cancel", false);
    
    WShtAC_1.Toolbar_Add("select", "선택", 1);
    
    WShtAC_1.FitColToGridWidth();
    
    var parts_type = Form.DialogParamGet("parts_type");
    
    if ( parts_type == "t" )
    {
        WShtAC_1.SetFieldProperty("query", "parts_code", "Label_Val", "테이블");
        WShtAC_1.TopHead_SetCellTextByName("parts_code", 0, "테이블");
    }
    
    WShtAC_1.SetFieldData("query", "parts_type", Form.DialogParamGet("parts_type"));
    if ( parts_type == "" )
        WShtAC_1.SetFieldData("query", "parts_type", "odw");
    
    WShtAC_1.SetFieldFocus("query", "EFormNm");
    WShtAC_1.SetFieldData("query", "LV", 3);
    
    WShtAC_1.UseColumnAllCheck("GRID_YN", 0, false);
    
    WShtAC_1.RunQuery();
    
}

function WShtAC_1_OnToolbarClick( btn_id )
{
    if( btn_id == "select" )
    {
        var row = WShtAC_1.GetCurrentRow();
        for ( var i = 0 ; i < WShtAC_1.GetColCount() ; i++ )
        {
            var col_name = WShtAC_1.GetColumnName(i);
            Form.DialogParamSet(col_name, WShtAC_1.GetGridCellText(col_name, row));
        }
        Form.CloseView(1);
    }
}

function WShtAC_1_OnCellDoubleClick( col_name, col, row, val )
{
    WShtAC_1_OnToolbarClick("select");
}

function Form_OnKeyDown( key_val, key_name, ctrl_key, alt_key, shift_key, ctrl_name, widget_name, panel_name )
{
    if ( key_name == "RETURN" )
    {
        if ( panel_name == "query" )
        {
            WShtAC_1.RunQuery();
        }
    }
}