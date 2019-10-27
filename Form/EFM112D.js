

function Form_Load(  )
{
    WMDA_1.Toolbar_Visible("master_grid", "query", false);
    WMDA_1.Toolbar_Visible("master_grid", "ok", false);
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    WMDA_1.Toolbar_Add("master_grid", "select", "선택", 1);
    
    WMDA_1.FitColToGridWidth("master_grid");
    
    WMDA_1.SetFieldData("query", "parts_type", 0, "t");
    
    for ( var i = 0 ; i < Number(Form.DialogParamGet("ReturnCount")) ; i++ )
    {
        var row = WMDA_1.InsertRow("master_grid", -1);
        WMDA_1.SetFieldData("master_grid", "parts_code", row, Form.DialogParamGet("parts_code"+i));
        WMDA_1.SetFieldData("master_grid", "parts_name", row, Form.DialogParamGet("parts_code"+i));
        WMDA_1.SetFieldData("master_grid", "TableAlias", row, Form.DialogParamGet("TableAlias"+i));
        WMDA_1.SetFieldData("master_grid", "parts_type", row, "t");
    }
    if ( WMDA_1.GetRowCount("master_grid") > 0 )
        WMDA_1.GridFocusRow("master_grid", 0);
}

function Form_OnKeyDown( key_val, key_name, ctrl_key, alt_key, shift_key, ctrl_name, widget_name, panel_name )
{
    if ( key_name == "RETURN" )
    {
        if ( panel_name == "query" )
        {
            
        }
    }
}

function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if ( panel_name == "master_grid" )
    {
        if ( btn_id == "select" )
        {
            var mst_row = WMDA_1.GetCurrentRow("master_grid");
            var row = WMDA_1.GetCurrentRow("fields");
            Form.DialogParamSet("parts_code", WMDA_1.GetFieldData("master_grid", "parts_code", mst_row));
            Form.DialogParamSet("parts_type", WMDA_1.GetFieldData("master_grid", "parts_type", mst_row));
            Form.DialogParamSet("TableAlias", WMDA_1.GetFieldData("master_grid", "TableAlias", mst_row));
            Form.Trace(Form.DialogParamGet("parts_code")+"_"+Form.DialogParamGet("parts_type")+"_"+Form.DialogParamGet("TableAlias"));
            for ( var i = 0 ; i < WMDA_1.GetColumnCount("fields") ; i++ )
            {
                var col_name = WMDA_1.GetColumnName("fields", i);
                Form.DialogParamSet(col_name, WMDA_1.GetFieldData("fields", col_name, row));
            }
            Form.DialogParamSet("ReturnCount", 1);
            Form.CloseView(1);
        }
    }
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    if ( !result ) return;
    if ( row_count == 0 ) return;
    WMDA_1.GridFocusRow("master_grid", 0);
}

function WMDA_1_OnCellDoubleClick( panel_name, col_name, col, row, val )
{
    if ( panel_name == "fields" )
    {
        WMDA_1_OnToolbarClick( "master_grid", "select" );
    }
}