

var odw_combo = Form.GetNewODW("");
function Form_Load(  )
{
    WMDA_SQL.Toolbar_Visible("STTable", "save_record", false);
    WMDA_SQL.Toolbar_Visible("STColumn", "save_record", false);
    WMDA_SQL.Toolbar_Visible("STJoin", "save_record", false);
    WMDA_SQL.Toolbar_Visible("STWhere", "save_record", false);
    //WMDA_SQL.Toolbar_Add("master_grid", "MakeSql", "MakeSql", 1);
    
    WMDA_SQL.Toolbar_Add("master_grid", "close", "닫기", 1);
    
    WShtAC_SQL.Toolbar_Visible("query", false);
    WShtAC_SQL.Toolbar_Visible("ok", false);
    WShtAC_SQL.Toolbar_Visible("cancel", false);
    WShtAC_SQL.Toolbar_Add("add", "추가", 1);
    WShtAC_SQL.Toolbar_Add("del", "삭제", 1);
    
    odw_combo.BatchQueryAddLocal("Condition", 0, 0, "INNER");
    odw_combo.BatchQueryAddLocal("Condition", 1, 0, "INNER JOIN");
    odw_combo.BatchQueryAddLocal("Condition", 0, 1, "LEFT");
    odw_combo.BatchQueryAddLocal("Condition", 1, 1, "LEFT OUTER JOIN");
    odw_combo.BatchQueryAddLocal("Condition", 0, 2, "RIGHT");
    odw_combo.BatchQueryAddLocal("Condition", 1, 2, "RIGHT OUTER JOIN");
    odw_combo.BatchQueryAddLocal("Condition", 0, 3, "FULL");
    odw_combo.BatchQueryAddLocal("Condition", 1, 3, "FULL OUTER JOIN");
    
    odw_combo.BatchQueryAddLocal("WhereTp", 0, 0, "AND");
    odw_combo.BatchQueryAddLocal("WhereTp", 1, 0, "AND");
    odw_combo.BatchQueryAddLocal("WhereTp", 0, 1, "OR");
    odw_combo.BatchQueryAddLocal("WhereTp", 1, 1, "OR");
    
    odw_combo.BatchQueryAddLocal("Condition2", 0, 0, "=");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 0, "=");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 1, "<>");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 1, "<>");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 2, ">");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 2, ">");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 3, ">=");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 3, ">=");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 4, "<");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 4, "<");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 5, "<=");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 5, "<=");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 6, "IN");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 6, "IN");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 7, "NOTIN");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 7, "NOT IN");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 8, "ISNULL");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 8, "IS NULL");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 9, "ISNOTNULL");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 9, "IS NOT NULL");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 10, "BETWEEN");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 10, "BETWEEN");
    odw_combo.BatchQueryAddLocal("Condition2", 0, 11, "LIKE");
    odw_combo.BatchQueryAddLocal("Condition2", 1, 11, "LIKE");
    
    odw_combo.BatchQueryAddLocal("SQLTp", 0, 0, "query");
    odw_combo.BatchQueryAddLocal("SQLTp", 1, 0, "Query");
    odw_combo.BatchQueryAddLocal("SQLTp", 0, 1, "insert");
    odw_combo.BatchQueryAddLocal("SQLTp", 1, 1, "Insert");
    odw_combo.BatchQueryAddLocal("SQLTp", 0, 2, "update");
    odw_combo.BatchQueryAddLocal("SQLTp", 1, 2, "Update");
    odw_combo.BatchQueryAddLocal("SQLTp", 0, 3, "delete");
    odw_combo.BatchQueryAddLocal("SQLTp", 1, 3, "Delete");
    
    WMDA_SQL.SetSelectRecordData("STJoin", "Condition", odw_combo, "Condition");
    WMDA_SQL.SetSelectRecordData("STWhere", "WhereTp", odw_combo, "WhereTp");
    WMDA_SQL.SetSelectRecordData("STWhere", "Condition", odw_combo, "Condition2");
    
    WShtAC_SQL.SetSelectRecordData("grid", "SQLTp", odw_combo, "SQLTp");
    
    WMDA_SQL.UseColumnAllCheck("STTable", "BasTableTp", 0, false);
    WShtAC_Table.UseColumnAllCheck("BasTableTp", 0, false);
    
    TopHead();
    
    Form.SetViewData("cur_tab", "STColumn");
    
    var EFormID = Form.DialogParamGet("EFormID");
    var CmpyCd = Form.DialogParamGet("CmpyCd");
    var EFormNm = Form.DialogParamGet("EFormNm");
    if ( EFormID == "" ) // test
    {
    	EFormID = 28;
    	CmpyCd = "0000";
    }
    WMDA_SQL.SetFieldData("query", "CmpyCd", 0, CmpyCd);
    WMDA_SQL.SetFieldData("query", "EFormID", 0, EFormID);
    WMDA_SQL.SetFieldData("query", "EFormNm", 0, EFormNm);
    WMDA_SQL.RunQueryMaster(true);
}

function TopHead (  )
{
    var Condition = WMDA_SQL.TopHead_GetCellTextByName("STJoin", "Condition", 0);
    var AddCondition = WMDA_SQL.TopHead_GetCellTextByName("STJoin", "AddCondition", 0);
    
    WMDA_SQL.TopHead_InsertRow("STJoin", 0);
    WMDA_SQL.TopHead_MergeCell("STJoin", "Seq", 0, "Seq", 1);
    WMDA_SQL.TopHead_MergeCell("STJoin", "Condition", 0, "Condition", 1);
    WMDA_SQL.TopHead_MergeCell("STJoin", "LTableCd", 0, "LColumnCd", 0);
    WMDA_SQL.TopHead_MergeCell("STJoin", "RTableCd", 0, "RColumnCd", 0);
    WMDA_SQL.TopHead_MergeCell("STJoin", "AddCondition", 0, "AddCondition", 1);
    
    WMDA_SQL.TopHead_SetCellTextByName("STJoin", "Seq", 0, "No");
    WMDA_SQL.TopHead_SetCellTextByName("STJoin", "Condition", 0, Condition);
    WMDA_SQL.TopHead_SetCellTextByName("STJoin", "LTableCd", 0, "Base Table");
    WMDA_SQL.TopHead_SetCellTextByName("STJoin", "RTableCd", 0, "JOIN Table");
    WMDA_SQL.TopHead_SetCellTextByName("STJoin", "AddCondition", 0, AddCondition);
}

function Form_OnKeyDown( key_val, key_name, ctrl_key, alt_key, shift_key, ctrl_name, widget_name, panel_name )
{
    
}

function Form_OnConfirmResult( confirm_id, result )
{
    
}

function Form_OnCloseDialog( view_code, dialog_result )
{
    if ( dialog_result != "1" || Form.DialogParamGet("ReturnCount") == "0" )
    {
        Form.DialogClear();
        return;
    }
    
    var panel_name = Form.GetViewData("panel_name");
    var ctrl_name = Form.GetViewData("ctrl_name");
    var ReturnCount = Number(Form.DialogParamGet("ReturnCount"));
    if ( view_code == "EFM111Dn" )
    {
        if ( panel_name == "STColumn" && ctrl_name == "add_record" )
        {
            for ( var i = 0 ; i < ReturnCount ; i++ )
            {
                var FindFlag = false;
                for ( var j = 0 ; j < WMDA_SQL.GetRowCount("STColumn") ; j++ )
                {
                    if ( WMDA_SQL.GetModifyFlag("STColumn", j) != 3
                        && WMDA_SQL.GetFieldData("STColumn", "TableCd", j) == Form.DialogParamGet("TableCd"+i)
                        && WMDA_SQL.GetFieldData("STColumn", "TableAlias", j) == Form.DialogParamGet("TableAlias"+i)
                        && WMDA_SQL.GetFieldData("STColumn", "ColumnCd", j) == Form.DialogParamGet("ColumnCd"+i)
                        && WMDA_SQL.GetFieldData("STColumn", "ColumnAlias", j) == Form.DialogParamGet("ColumnAlias"+i)
                        )
                    {
                        FindFlag = true;
                        break;
                    }
                }
                if ( FindFlag ) continue;
                var row = WMDA_SQL.InsertRow("STColumn", -1);
                WMDA_SQL.SetFieldData("STColumn", "EFormID", row, WMDA_SQL.GetFieldData("master_grid", "EFormID", WMDA_SQL.GetCurrentRow("master_grid")));
                WMDA_SQL.SetFieldData("STColumn", "CmpyCd", row, WMDA_SQL.GetFieldData("master_grid", "CmpyCd", WMDA_SQL.GetCurrentRow("master_grid")));
                WMDA_SQL.SetFieldData("STColumn", "TableCd", row, Form.DialogParamGet("TableCd"+i));
                WMDA_SQL.SetFieldData("STColumn", "TableAlias", row, Form.DialogParamGet("TableAlias"+i));
                WMDA_SQL.SetFieldData("STColumn", "ColumnCd", row, Form.DialogParamGet("ColumnCd"+i));
                WMDA_SQL.SetFieldData("STColumn", "ColumnNm", row, Form.DialogParamGet("ColumnNm"+i));
                WMDA_SQL.SetFieldData("STColumn", "ColumnAlias", row, Form.DialogParamGet("ColumnAlias"+i));
                WMDA_SQL.SetFieldData("STColumn", "BasTableTp", row, Form.DialogParamGet("BasTableTp"+i));
            }
            SetTable();
        }
    }
    else if ( view_code == "EFM112D" )
    {
        if ( panel_name == "STJoin" && ctrl_name == "BTN_LColumn" )
        {
            var row = WMDA_SQL.GetCurrentRow("STJoin");
            WMDA_SQL.SetFieldData("STJoin", "LTableCd", row, Form.DialogParamGet("parts_code"));
            WMDA_SQL.SetFieldData("STJoin", "LTableAlias", row, Form.DialogParamGet("TableAlias"));
            WMDA_SQL.SetFieldData("STJoin", "LColumnCd", row, Form.DialogParamGet("field_name"));
            WMDA_SQL.SetFieldData("STJoin", "LColumnNm", row, Form.DialogParamGet("field_desc"));
            WMDA_SQL.SetFieldData("STJoin", "LTable", row, Form.DialogParamGet("parts_code") + " AS " + Form.DialogParamGet("TableAlias"));
        }
        else if ( panel_name == "STJoin" && ctrl_name == "BTN_RColumn" )
        {
            var row = WMDA_SQL.GetCurrentRow("STJoin");
            WMDA_SQL.SetFieldData("STJoin", "RTableCd", row, Form.DialogParamGet("parts_code"));
            WMDA_SQL.SetFieldData("STJoin", "RTableAlias", row, Form.DialogParamGet("TableAlias"));
            WMDA_SQL.SetFieldData("STJoin", "RColumnCd", row, Form.DialogParamGet("field_name"));
            WMDA_SQL.SetFieldData("STJoin", "RColumnNm", row, Form.DialogParamGet("field_desc"));
            WMDA_SQL.SetFieldData("STJoin", "RTable", row, Form.DialogParamGet("parts_code") + " AS " + Form.DialogParamGet("TableAlias"));
        }
        else if ( panel_name == "STWhere" && ctrl_name == "add_record" )
        {
            var mst_row = WMDA_SQL.GetCurrentRow("master_grid");
            var row = WMDA_SQL.InsertRow("STWhere", -1);
            WMDA_SQL.SetFieldData("STWhere", "EFormID", row, WMDA_SQL.GetFieldData("master_grid", "EFormID", mst_row));
            WMDA_SQL.SetFieldData("STWhere", "CmpyCd", row, WMDA_SQL.GetFieldData("master_grid", "CmpyCd", mst_row));
            WMDA_SQL.SetFieldData("STWhere", "TableCd", row, Form.DialogParamGet("parts_code"));
            WMDA_SQL.SetFieldData("STWhere", "TableAlias", row, Form.DialogParamGet("TableAlias"));
            WMDA_SQL.SetFieldData("STWhere", "ColumnCd", row, Form.DialogParamGet("field_name"));
            WMDA_SQL.SetFieldData("STWhere", "Table", row, Form.DialogParamGet("parts_code") + " AS " + Form.DialogParamGet("TableAlias"));
        }
    }
    Form.DialogClear();
}

function WMDA_SQL_OnToolbarClick( panel_name, btn_id )
{
    if ( panel_name == "master_grid" )
    {
        if ( btn_id == "ok" )
        {
            var mst_row = WMDA_SQL.GetCurrentRow("master_grid");
            //WMDA_SQL.ClearWidgetPanel("STTable");
            for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STColumn") ; i++ )
            {
                if ( WMDA_SQL.GetModifyFlag("STColumn", i) == 3 ) continue;
                for ( var j = i+1 ; j < WMDA_SQL.GetRowCount("STColumn") ; j++ )
                {
                    if ( WMDA_SQL.GetModifyFlag("STColumn", j) == 3 ) continue;
                    if ( WMDA_SQL.GetFieldData("STColumn", "TableCd", i) != WMDA_SQL.GetFieldData("STColumn", "TableCd", j)
                        && WMDA_SQL.GetFieldData("STColumn", "TableAlias", i) == WMDA_SQL.GetFieldData("STColumn", "TableAlias", j)
                        )
                    {
                        WMDA_SQL.Toolbar_SkipExecute(panel_name);
                        WMDA_SQL.GridFocusCell("STColumn", "TableAlias", j);
                        Form.Alert("동일한 테이블Alias를 다른 테이블에서 사용하고 있습니다.");
                        return;
                    }
                    
                    if ( WMDA_SQL.GetFieldData("STColumn", "ColumnAlias", i) == WMDA_SQL.GetFieldData("STColumn", "ColumnAlias", j) )
                    {
                        WMDA_SQL.Toolbar_SkipExecute(panel_name);
                        WMDA_SQL.GridFocusCell("STColumn", "ColumnAlias", j);
                        Form.Alert("컬럼Alias는 중복될 수 없습니다.");
                        return;
                    }
                }
            }
            
            for ( var i = 0 ; i < WShtAC_SQL.GetRowCount() ; i++ )
            {
                if ( WShtAC_SQL.ModifyGet(i) == 3 ) continue;
                var FindFlag = false;
                if ( WShtAC_SQL.GetGridCellText("SQLID", i) != "" )
                {
                    for ( var j = 0 ; j < WMDA_SQL.GetRowCount("STSQL") ; j++ )
                    {
                        if ( WShtAC_SQL.GetGridCellText("SQLID", i) == WMDA_SQL.GetFieldData("STSQL", "SQLID", j) )
                        {
                            FindFlag = true;
                            WMDA_SQL.SetRowData("STSQL", j, WShtAC_SQL.GetRowData(i));
                            if ( WMDA_SQL.GetModifyFlag("STSQL", j) == 0 ) WMDA_SQL.SetModifyFlag("STSQL", j, 2);
                            break;
                        }
                    }
                }
                
                if ( FindFlag ) continue;
                var row = WMDA_SQL.InsertRow("STSQL", -1);
                WMDA_SQL.SetRowData("STSQL", row, WShtAC_SQL.GetRowData(i));
            }
        }
        else if ( btn_id == "close" )
        {
        	Form.DialogParamSet("ReturnCount", "1"); // 얘는 특별히 그냥 닫아도 쿼리시켜주기
        	Form.CloseView(true);
        }
        else if ( btn_id == "MakeSql" )
        {
            MakeSql_Auto("");
        }
    }
    else if ( panel_name == "STColumn" )
    {
        if ( btn_id == "add_record" )
        {
            WMDA_SQL.Toolbar_SkipExecute(panel_name);
            Form.SetViewData("panel_name", panel_name);
            Form.SetViewData("ctrl_name", btn_id);
            
            GetBasTable();
            var BasTableCd = Form.GetViewData("BasTableCd");
            var BasTableAlias = Form.GetViewData("BasTableAlias");
            Form.DialogParamSet("BasTableCd", BasTableCd);
            Form.DialogParamSet("BasTableAlias", BasTableAlias);
            var Cnt = 0;
            for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STColumn") ; i++ )
            {
                if ( WMDA_SQL.GetModifyFlag("STColumn", i) == 3 ) continue;
                Form.DialogParamSet("TableCd"+i, WMDA_SQL.GetFieldData("STColumn", "TableCd", i));
                Form.DialogParamSet("TableAlias"+i, WMDA_SQL.GetFieldData("STColumn", "TableAlias", i));
                Form.DialogParamSet("ColumnCd"+i, WMDA_SQL.GetFieldData("STColumn", "ColumnCd", i));
                Form.DialogParamSet("ColumnNm"+i, WMDA_SQL.GetFieldData("STColumn", "ColumnNm", i));
                Form.DialogParamSet("ColumnAlias"+i, WMDA_SQL.GetFieldData("STColumn", "ColumnAlias", i));
                Form.DialogParamSet("BasTableTp"+i, WMDA_SQL.GetFieldData("STColumn", "BasTableTp", i));
                
//                if ( WMDA_SQL.GetFieldData("STColumn", "TableCd", i) == BasTableCd
//                    && WMDA_SQL.GetFieldData("STColumn", "TableAlias", i) == BasTableAlias )
//                {
//                    Form.DialogParamSet("BasTableTp"+i, "1");
//                }
//                else
//                {
//                    Form.DialogParamSet("BasTableTp"+i, "0");
//                }
                
                Cnt++;
            }
            Form.DialogParamSet("ReturnCount", Cnt);
            Form.ShowDialog("EFM111Dn");
        }
    }
    else if ( panel_name == "STWhere" )
    {
        if ( btn_id == "add_record" )
        {
            WMDA_SQL.Toolbar_SkipExecute(panel_name);
            Form.SetViewData("panel_name", panel_name);
            Form.SetViewData("ctrl_name", btn_id);
            
            var Cnt = 0;
            for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STTable") ; i++ )
            {
                Form.DialogParamSet("parts_code"+Cnt, WMDA_SQL.GetFieldData("STTable", "TableCd", i));
                Form.DialogParamSet("TableAlias"+Cnt, WMDA_SQL.GetFieldData("STTable", "TableAlias", i));
                Cnt++;
            }
            Form.DialogParamSet("ReturnCount", Cnt);
            Form.ShowDialog("EFM112D");
        }
    }
}

function WMDA_SQL_OnToolbarClick_After( panel_name, btn_id, row )
{
    if ( panel_name == "STColumn" )
    {
        if ( btn_id == "del_record" )
        {
            SetTable();
        }
    }
    else if ( panel_name == "STJoin" )
    {
        if ( btn_id == "add_record" )
        {
            var mst_row = WMDA_SQL.GetCurrentRow("master_grid");
            WMDA_SQL.SetFieldData("STJoin", "EFormID", row, WMDA_SQL.GetFieldData("master_grid", "EFormID", mst_row));
            WMDA_SQL.SetFieldData("STJoin", "CmpyCd", row, WMDA_SQL.GetFieldData("master_grid", "CmpyCd", mst_row));
            WMDA_SQL.SetFieldData("STJoin", "BTN_LColumn", row, "ods_image://upload/btn/search_btn.png");
            WMDA_SQL.SetFieldData("STJoin", "BTN_RColumn", row, "ods_image://upload/btn/search_btn.png");
        }
    }
}

function WMDA_SQL_OnQueryMasterSend( row )
{
    WShtAC_SQL.ClearWidget();
    WShtAC_Table.ClearWidget();
    WShtAC_Column_List.ClearWidget();
    TXT_SQL.SetText("");
}

function WMDA_SQL_OnQueryMasterEnd( result, row_count )
{
    if ( !result ) return;
    if ( row_count == 0 ) return;
    WMDA_SQL.GridFocusRow("master_grid", 0);
}

function WMDA_SQL_OnQueryDetailEnd( result, row )
{
    if ( !result ) return;
    var EFormID = WMDA_SQL.GetFieldData("master_grid", "EFormID", row);
    odw_table = Form.GetNewODW("");
    odw_table.BatchQueryInit();
    odw_table.BatchQueryAdd("Table", "EFormSQLTable", "TableCd", "TableCd + ' AS ' + TableAlias", "WHERE EFormID = "+EFormID+" ");
    if ( !odw_table.BatchQueryRun() ) Form.Alert(odw_table.GetError());
    
    WMDA_SQL.SetSelectRecordData("STJoin", "LTableCd", odw_table, "Table");
    WMDA_SQL.SetSelectRecordData("STJoin", "RTableCd", odw_table, "Table");
    WMDA_SQL.SetSelectRecordData("STWhere", "TableCd", odw_table, "Table");
    
    for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STTable") ; i++ )
    {
        var new_row = WShtAC_Table.InsertRow(-1);
        WShtAC_Table.SetGridCellText("TableCd", new_row, WMDA_SQL.GetFieldData("STTable", "TableCd", i));
        WShtAC_Table.SetGridCellText("TableAlias", new_row, WMDA_SQL.GetFieldData("STTable", "TableAlias", i));
        WShtAC_Table.SetGridCellText("BasTableTp", new_row, WMDA_SQL.GetFieldData("STTable", "BasTableTp", i));
    }
    WShtAC_Table.GridFocusRow(0);
    
    for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STJoin") ; i++ )
    {
        WMDA_SQL.SetFieldData("STJoin", "LTable", i, WMDA_SQL.GetFieldData("STJoin", "LTableCd", i)+ " AS " +WMDA_SQL.GetFieldData("STJoin", "LTableAlias", i));
        WMDA_SQL.SetFieldData("STJoin", "RTable", i, WMDA_SQL.GetFieldData("STJoin", "RTableCd", i)+ " AS " +WMDA_SQL.GetFieldData("STJoin", "RTableAlias", i));
        WMDA_SQL.SetFieldData("STJoin", "BTN_LColumn", i, "ods_image://upload/btn/search_btn.png");
        WMDA_SQL.SetFieldData("STJoin", "BTN_RColumn", i, "ods_image://upload/btn/search_btn.png");
    }
    
    for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STWhere") ; i++ )
    {
        WMDA_SQL.SetFieldData("STWhere", "Table", i, WMDA_SQL.GetFieldData("STWhere", "TableCd", i)+ " AS " +WMDA_SQL.GetFieldData("STWhere", "TableAlias", i));
        if ( WMDA_SQL.GetFieldData("STWhere", "Condition", i) == "ISNULL" || WMDA_SQL.GetFieldData("STWhere", "Condition", i) == "ISNOTNULL" )
        {
            WMDA_SQL.SetCellReadonly("STWhere", "Value", i, true);
        }
    }
    
    WShtAC_SQL.ClearWidget();
    for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STSQL") ; i++ )
    {
        var new_row = WShtAC_SQL.InsertRow(-1);
        var row_data = WMDA_SQL.GetRowData("STSQL", i);
        WShtAC_SQL.SetRowData(new_row, row_data);
        WShtAC_SQL.ModifySet(new_row, 0);
    }
    WShtAC_SQL.GridFocusRow(0);
    WShtAC_SQL_OnSelectRecordChanged("", 0, 0);
}

function WMDA_SQL_OnInsertEnd( result, row )
{
    
}

function WMDA_SQL_OnUpdateEnd( result, row )
{
    if ( !result ) return;
    Form.Trace("AA");
    var cur_row = WShtAC_SQL.GetCurrentRow();
    WShtAC_SQL.ClearWidget();
    for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STSQL") ; i++ )
    {
        var new_row = WShtAC_SQL.InsertRow(-1);
        var row_data = WMDA_SQL.GetRowData("STSQL", i);
        WShtAC_SQL.SetRowData(new_row, row_data);
        WShtAC_SQL.ModifySet(new_row, 0);
    }
    WShtAC_SQL.GridFocusRow(cur_row);
    WShtAC_SQL_OnSelectRecordChanged("", 0, cur_row);
}

function WMDA_SQL_OnDeleteEnd( result, row )
{
    
}

function WMDA_SQL_OnSelectRecordChanged( panel_name, col_name, col, row )
{
    
}

function WMDA_SQL_OnCellClick( panel_name, col_name, col, row, val )
{
    if ( panel_name == "STJoin" )
    {
        if ( col_name == "BTN_LColumn" || col_name == "BTN_RColumn" )
        {
            Form.SetViewData("panel_name", panel_name);
            Form.SetViewData("ctrl_name", col_name);
            var Cnt = 0;
            for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STTable") ; i++ )
            {
                Form.DialogParamSet("parts_code"+Cnt, WMDA_SQL.GetFieldData("STTable", "TableCd", i));
                Form.DialogParamSet("TableAlias"+Cnt, WMDA_SQL.GetFieldData("STTable", "TableAlias", i));
                Cnt++;
            }
            Form.DialogParamSet("ReturnCount", Cnt);
            Form.ShowDialog("EFM112D");
        }
    }
}

function WMDA_SQL_OnCellValueChanged_After( panel_name, col_name, col, row, val )
{
    if ( panel_name == "STColumn" )
    {
        if ( col_name == "TableAlias" )
        {
            SetTable();
        }
    }
    else if ( panel_name == "STJoin" )
    {
        if ( col_name == "LTableCd" )
        {
            var TableAlias = odw_table.BatchQueryGetCellValByCode("Table", val, 1);
            TableAlias = TableAlias.split(" AS ");
            WMDA_SQL.SetFieldData("STJoin", "LTableAlias", row, TableAlias[1]);
        }
        else if ( col_name == "RTableCd" )
        {
            var TableAlias = odw_table.BatchQueryGetCellValByCode("Table", val, 1);
            TableAlias = TableAlias.split(" AS ");
            WMDA_SQL.SetFieldData("STJoin", "RTableAlias", row, TableAlias[1]);
        }
    }
    else if ( panel_name == "STWhere" )
    {
        if ( col_name == "TableCd" )
        {
            var TableAlias = odw_table.BatchQueryGetCellValByCode("Table", val, 1);
            TableAlias = TableAlias.split(" AS ");
            TableAlias = TableAlias[1];
            WMDA_SQL.SetFieldData("STWhere", "TableAlias", row, TableAlias);
        }
        else if ( col_name == "Condition" )
        {
            WMDA_SQL.SetCellReadonly("STWhere", "Value", row, false);
            if ( val == "=" || val == "<>" || val == ">" || val == ">=" || val == "<" || val == "<=" )
            {
                WMDA_SQL.SetFieldData("STWhere", "Value", row, "'10'");
            }
            else if ( val == "IN" || val == "NOTIN" )
            {
                WMDA_SQL.SetFieldData("STWhere", "Value", row, "'10', '20'");
            }
            else if ( val == "ISNULL" || val == "ISNOTNULL" )
            {
                WMDA_SQL.SetFieldData("STWhere", "Value", row, "");
                WMDA_SQL.SetCellReadonly("STWhere", "Value", row, true);
            }
            else if ( val == "BETWEEN" )
            {
                WMDA_SQL.SetFieldData("STWhere", "Value", row, "'10' AND '20'");
            }
            else if ( val == "LIKE" )
            {
                WMDA_SQL.SetFieldData("STWhere", "Value", row, "'%Value%'");
            }
        }
    }
}

function WMDA_SQL_OnButtonDown( panel_name, ctrl_name, row )
{
    if ( panel_name == "STJoin" )
    {
        if ( ctrl_name == "BTN_LColumn" || ctrl_name == "BTN_RColumn" )
        {
            Form.SetViewData("panel_name", panel_name);
            Form.SetViewData("ctrl_name", ctrl_name);
            var Cnt = 0;
            for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STTable") ; i++ )
            {
                Form.DialogParamSet("parts_code"+Cnt, WMDA_SQL.GetFieldData("STTable", "TableCd", i));
                Form.DialogParamSet("TableAlias"+Cnt, WMDA_SQL.GetFieldData("STTable", "TableAlias", i));
                Cnt++;
            }
            Form.DialogParamSet("ReturnCount", Cnt);
            Form.ShowDialog("EFM112D");
        }
    }
}

function WMDA_SQL_OnTabChanged( tab_index, sub_table )
{
    Form.SetViewData("cur_tab", sub_table);
}

function WShtAC_SQL_OnToolbarClick( btn_id )
{
    if ( btn_id == "add" )
    {
        var mst_row = WMDA_SQL.GetCurrentRow("master_grid");
        var row = WShtAC_SQL.InsertRow(-1);
        WShtAC_SQL.SetGridCellText("EFormID", row, WMDA_SQL.GetFieldData("master_grid", "EFormID", mst_row));
        WShtAC_SQL.SetGridCellText("CmpyCd", row, WMDA_SQL.GetFieldData("master_grid", "CmpyCd", mst_row));
    }
    else if ( btn_id == "del" )
    {
        var row = WShtAC_SQL.GetCurrentRow();
        var SQLID = WShtAC_SQL.GetGridCellText("SQLID", row);
        for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STSQL") ; i++ )
        {
            if ( SQLID == WMDA_SQL.GetFieldData("STSQL", "SQLID", i) )
            {
                WMDA_SQL.DeleteRow("STSQL", i);
                break;
            }
        }
        WShtAC_SQL.DeleteRow(row);
    }
}

function WShtAC_SQL_OnSelectRecordChanged( col_name, col, row )
{
    TXT_SQL.SetText(WShtAC_SQL.GetGridCellText("SQL", row));
}

function WShtAC_Table_OnSelectRecordChanged( col_name, col, row )
{
    if ( WShtAC_Table.GetGridCellText("TableCd", row) == "" ) return;
    WShtAC_Column_List.SetFieldData("query", "parts_code", WShtAC_Table.GetGridCellText("TableCd", row));
    WShtAC_Column_List.SetFieldData("query", "parts_type", "t");
    WShtAC_Column_List.RunQuery();
}

function WShtAC_Column_List_OnQueryEnd( result, row_count )
{
    if ( !result ) return;
    if ( row_count == 0 ) return;
    for ( var i = 0 ; i < row_count ; i++ )
    {
        WShtAC_Column_List.SetGridCellText("Chk_pk", i, (WShtAC_Column_List.GetGridCellText("is_pk", i) == "Y" ? "1" : "0"));
        WShtAC_Column_List.SetGridCellText("Chk_col", i, "1");
    }
}

function TXT_SQL_TextChanged(  )
{
    var row = WShtAC_SQL.GetCurrentRow();
    WShtAC_SQL.SetGridCellText("SQL", row, TXT_SQL.GetText());
}

function BTN_MakeSQL_Auto_Click(  )
{
    MakeSql_Auto(WShtAC_SQL.GetGridCellText("SQLTp", WShtAC_SQL.GetCurrentRow()));
}

function BTN_MakeSQL_Select_Click(  )
{
    MakeSql_Select(WShtAC_SQL.GetGridCellText("SQLTp", WShtAC_SQL.GetCurrentRow()));
}

function GetBasTable (  )
{
    var BasTableCd = "";
    var BasTableAlias = "";
    
    for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STTable") ; i++ )
    {
        if ( WMDA_SQL.GetFieldData("STTable", "BasTableTp", i) == "1" )
        {
            BasTableCd = WMDA_SQL.GetFieldData("STTable", "TableCd", i);
            BasTableAlias = WMDA_SQL.GetFieldData("STTable", "TableAlias", i);
            break;
        }
    }
    
    Form.SetViewData("BasTableCd", BasTableCd);
    Form.SetViewData("BasTableAlias", BasTableAlias);
}

var odw_table = null;
function SetTable (  )
{
    WMDA_SQL.ClearWidgetPanel("STTable");
    WShtAC_Table.ClearWidget();
    odw_table = Form.GetNewODW("");
    var Cnt = 0;
    for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STColumn") ; i++ )
    {
        if ( WMDA_SQL.GetModifyFlag("STColumn", i) == 3 ) continue;
        var FindFlag = false;
        for ( var j = 0 ; j < WMDA_SQL.GetRowCount("STTable") ; j++ )
        {
            if ( WMDA_SQL.GetFieldData("STColumn", "TableCd", i) == WMDA_SQL.GetFieldData("STTable", "TableCd", j)
                && WMDA_SQL.GetFieldData("STColumn", "TableAlias", i) == WMDA_SQL.GetFieldData("STTable", "TableAlias", j)
                )
            {
                FindFlag = true;
                break;
            }
        }
        if ( FindFlag ) continue;
        
        var TableCd = WMDA_SQL.GetFieldData("STColumn", "TableCd", i);
        var TableAlias = WMDA_SQL.GetFieldData("STColumn", "TableAlias", i);
        
        var row = WMDA_SQL.InsertRow("STTable", -1);
        WMDA_SQL.SetFieldData("STTable", "EFormID", row, WMDA_SQL.GetFieldData("master_grid", "EFormID", WMDA_SQL.GetCurrentRow("master_grid")));
        WMDA_SQL.SetFieldData("STTable", "CmpyCd", row, WMDA_SQL.GetFieldData("master_grid", "CmpyCd", WMDA_SQL.GetCurrentRow("master_grid")));
        WMDA_SQL.SetFieldData("STTable", "TableCd", row, WMDA_SQL.GetFieldData("STColumn", "TableCd", i));
        WMDA_SQL.SetFieldData("STTable", "TableAlias", row, WMDA_SQL.GetFieldData("STColumn", "TableAlias", i));
        WMDA_SQL.SetFieldData("STTable", "BasTableTp", row, WMDA_SQL.GetFieldData("STColumn", "BasTableTp", i));
        
        row = WShtAC_Table.InsertRow(-1);
        WShtAC_Table.SetGridCellText("TableCd", row, WMDA_SQL.GetFieldData("STColumn", "TableCd", i));
        WShtAC_Table.SetGridCellText("TableAlias", row, WMDA_SQL.GetFieldData("STColumn", "TableAlias", i));
        WShtAC_Table.SetGridCellText("BasTableTp", row, WMDA_SQL.GetFieldData("STColumn", "BasTableTp", i));
        
        odw_table.BatchQueryAddLocal("Table", 0, Cnt, TableCd);
        odw_table.BatchQueryAddLocal("Table", 1, Cnt, TableCd+" AS "+TableAlias);
        Cnt++;
    }
    WMDA_SQL.SetSelectRecordData("STJoin", "LTableCd", odw_table, "Table");
    WMDA_SQL.SetSelectRecordData("STJoin", "RTableCd", odw_table, "Table");
    WMDA_SQL.SetSelectRecordData("STWhere", "TableCd", odw_table, "Table");
    WShtAC_Column_List.GridFocusRow(0);
}

function MakeSql_Select ( Type )
{
    //var row = WShtAC_SQL.GetCurrentRow();
    //var Type = WShtAC_SQL.GetGridCellText("SQLTp", row);
    if ( Type == "" )
    {
        Form.Alert("SQL구분을 먼저 선택해주시기 바랍니다.");
        return;
    }
    
    var sql = "";
    var sql_col = "";
    var sql_where = "";
    if ( Type == "query" )
    {
        for ( var i = 0 ; i < WShtAC_Column_List.GetRowCount(); i++ )
        {
            if ( WShtAC_Column_List.GetGridCellText("Chk_col", i) == "1" )
            {
                if ( sql_col != "" ) sql_col = sql_col + "      , ";
                sql_col = sql_col + WShtAC_Column_List.GetGridCellText("field_name", i) + "\r\n";
            }
            if ( WShtAC_Column_List.GetGridCellText("Chk_pk", i) == "1" )
            {
                if ( sql_where != "" ) sql_where = sql_where + "   AND ";
                sql_where = sql_where + WShtAC_Column_List.GetGridCellText("field_name", i) + " = @" + WShtAC_Column_List.GetGridCellText("field_name", i);
            }
        }
        sql ="SELECT " + sql_col + "\r\n"
            +"  FROM " + WShtAC_Table.GetGridCellText("TableCd", WShtAC_Table.GetCurrentRow()) + "\r\n"
            +" WHERE " + sql_where + "\r\n";
        
        TXT_SQL.SetText(sql);
    }
    else if ( Type == "insert" )
    {
        var sql_val = "";
        for ( var i = 0 ; i < WShtAC_Column_List.GetRowCount(); i++ )
        {
            if ( WShtAC_Column_List.GetGridCellText("Chk_col", i) == "1" )
            {
                if ( sql_col != "" ) sql_col = sql_col + "      , ";
                sql_col = sql_col + WShtAC_Column_List.GetGridCellText("field_name", i) + "\r\n";
                if ( sql_val != "" ) sql_val = sql_val + "      , ";
                sql_val = sql_val + "@" + WShtAC_Column_List.GetGridCellText("field_name", i) + "\r\n";
            }
        }
        sql ="INSERT INTO " + WShtAC_Table.GetGridCellText("TableCd", WShtAC_Table.GetCurrentRow()) + "\r\n"
            +"     (" + sql_col + " )\r\n"
            +"VALUES ( " + sql_val + " )\r\n";
        
        TXT_SQL.SetText(sql);
    }
    else if ( Type == "update" )
    {
        for ( var i = 0 ; i < WShtAC_Column_List.GetRowCount(); i++ )
        {
            if ( WShtAC_Column_List.GetGridCellText("Chk_col", i) == "1" )
            {
                if ( sql_col != "" ) sql_col = sql_col + "     , ";
                sql_col = sql_col + WShtAC_Column_List.GetGridCellText("field_name", i) + " = @" + WShtAC_Column_List.GetGridCellText("field_name", i) + "\r\n";
            }
            if ( WShtAC_Column_List.GetGridCellText("Chk_pk", i) == "1" )
            {
                if ( sql_where != "" ) sql_where = sql_where + "   AND ";
                sql_where = sql_where + WShtAC_Column_List.GetGridCellText("field_name", i) + " = @" + WShtAC_Column_List.GetGridCellText("field_name", i) + "\r\n";
            }
        }
        sql ="UPDATE " + WShtAC_Table.GetGridCellText("TableCd", WShtAC_Table.GetCurrentRow()) + "\r\n"
            +"   SET " + sql_col + "\r\n"
            +" WHERE " + sql_where + "\r\n";
            
        TXT_SQL.SetText(sql);
    }
    else if ( Type == "delete" )
    {
        for ( var i = 0 ; i < WShtAC_Column_List.GetRowCount(); i++ )
        {
            if ( WShtAC_Column_List.GetGridCellText("Chk_pk", i) == "1" )
            {
                if ( sql_where != "" ) sql_where = sql_where + "   AND ";
                sql_where = sql_where + WShtAC_Column_List.GetGridCellText("field_name", i) + " = @" + WShtAC_Column_List.GetGridCellText("field_name", i);
            }
        }
        sql ="DELETE FROM " + WShtAC_Table.GetGridCellText("TableCd", WShtAC_Table.GetCurrentRow()) + "\r\n"
            +" WHERE " + sql_where + "\r\n";
        
        TXT_SQL.SetText(sql);
    }
}

function MakeSql_Auto ( Type )
{
    var mst_row = WMDA_SQL.GetCurrentRow("master_grid");
    
    if ( Type == "" )
    {
        Form.Alert("SQL구분을 먼저 선택해주시기 바랍니다.");
        return;
    }
    MakeSql_Sub(Type);
    
    //if ( Type == "" )
    //{
    //    MakeSql_Sub("query");
    //    MakeSql_Sub("insert");
    //    MakeSql_Sub("update");
    //    MakeSql_Sub("delete");
    //}
    //else
    //{
    //    MakeSql_Sub(Type);
    //}
}

function MakeSql_Sub ( Type  )
{
    var sql = "";
    GetBasTable();
    if ( Type == "query" )
    {
        sql ="SELECT ";
        for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STColumn") ; i++ )
        {
            if ( WMDA_SQL.GetModifyFlag("STColumn", i) == 3 ) continue;
            var TableCd = WMDA_SQL.GetFieldData("STColumn", "TableCd", i);
            var TableAlias = WMDA_SQL.GetFieldData("STColumn", "TableAlias", i);
            var ColumnCd = WMDA_SQL.GetFieldData("STColumn", "ColumnCd", i);
            var ColumnAlias = WMDA_SQL.GetFieldData("STColumn", "ColumnAlias", i);
            
            if ( i > 0 ) sql = sql + "\r\n     , ";
            sql = sql + TableAlias+"."+ColumnCd + " AS " + ColumnAlias;
        }
        sql = sql + "\r\n  FROM ";
        sql = sql + Form.GetViewData("BasTableCd") + "\r\n       ";
        for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STJoin") ; i++ )
        {
            if ( WMDA_SQL.GetModifyFlag("STJoin", i) == 3 ) continue;
            var Condition = WMDA_SQL.GetFieldData("STJoin", "Condition", i);
            Condition = odw_combo.BatchQueryGetCellValByCode("Condition", Condition, 1);
            var LTableCd = WMDA_SQL.GetFieldData("STJoin", "LTableCd", i);
            var LTableAlias = WMDA_SQL.GetFieldData("STJoin", "LTableAlias", i);
            var LColumnCd = WMDA_SQL.GetFieldData("STJoin", "LColumnCd", i);
            var RTableCd = WMDA_SQL.GetFieldData("STJoin", "RTableCd", i);
            var RTableAlias = WMDA_SQL.GetFieldData("STJoin", "RTableAlias", i);
            var RColumnCd = WMDA_SQL.GetFieldData("STJoin", "RColumnCd", i);
            
            sql = sql + Condition + " " + RTableCd + " AS " + RTableAlias
                      + " ON " + RTableAlias + "." + RColumnCd + " = " + LTableAlias + "." + LColumnCd
                      + "\r\n";
        }
        sql = sql + " WHERE 1=1\r\n";
        for ( var i = 0 ; i < WMDA_SQL.GetRowCount("STWhere") ; i++ )
        {
            if ( WMDA_SQL.GetModifyFlag("STWhere", i) == 3 ) continue;
            var TableCd = WMDA_SQL.GetFieldData("STWhere", "TableCd", i);
            var TableAlias = WMDA_SQL.GetFieldData("STWhere", "TableAlias", i);
            var ColumnCd = WMDA_SQL.GetFieldData("STWhere", "ColumnCd", i);
            var Condition = WMDA_SQL.GetFieldData("STWhere", "Condition", i);
            var Value = WMDA_SQL.GetFieldData("STWhere", "Value", i);
            if ( Value == "" ) Value = "@"+ColumnCd;
            else Value = "'" + Value + "'";
            var WhereTp = WMDA_SQL.GetFieldData("STWhere", "WhereTp", i);
            
            sql = sql + "   " + WhereTp + " " + TableAlias + "." + ColumnCd + " " + Condition + " " + Value +"\r\n";
        }
    }
    else if ( Type == "insert" )
    {
        ODW_1.ResetODW(); // od_parts_field
        ODW_1.SetParam("parts_code", 0, Form.GetViewData("BasTableCd"));
        ODW_1.SetParam("parts_type", 0, "t");
        ODW_1.Query("query_rn");
        
        sql = "INSERT INTO " + Form.GetViewData("BasTableCd") + "\r\n"
            + "       (\r\n        "
        for ( var i = 0 ; i < ODW_1.GetCount() ; i++ )
        {
            if ( i > 0 ) sql =sql + "      , ";
            sql = sql + ODW_1.GetParam("field_name", i) + "\r\n";
        }
        sql = sql + "        )\r\n"
                 + "VALUES (\r\n        "
        for ( var i = 0 ; i < ODW_1.GetCount() ; i++ )
        {
            if ( i > 0 ) sql =sql + "      , ";
            sql = sql + "@" + ODW_1.GetParam("field_name", i) + "\r\n";
        }
        sql = sql + "        )\r\n"
    }
    else if ( Type == "update" )
    {
        ODW_1.ResetODW(); // od_parts_field
        ODW_1.SetParam("parts_code", 0, Form.GetViewData("BasTableCd"));
        ODW_1.SetParam("parts_type", 0, "t");
        ODW_1.Query("query_rn");
        
        var sql_where = "";
        
        sql = "UPDATE " + Form.GetViewData("BasTableCd") + "\r\n"
            + "   SET "
        for ( var i = 0 ; i < ODW_1.GetCount() ; i++ )
        {
            if ( i > 0 ) sql =sql + "     , ";
            sql =sql + ODW_1.GetParam("field_name", i) + " = @" + ODW_1.GetParam("field_name", i) + "\r\n";
            
            if ( ODW_1.GetParam("is_pk", i) == "Y" )
            {
                if ( sql_where != "" ) sql_where = sql_where + "   AND ";
                sql_where = sql_where + ODW_1.GetParam("field_name", i) + " = @" + ODW_1.GetParam("field_name", i);
            }
        }
        sql = sql + " WHERE " + sql_where;
    }
    else if ( Type == "delete" )
    {
        ODW_1.ResetODW(); // od_parts_field
        ODW_1.SetParam("parts_code", 0, Form.GetViewData("BasTableCd"));
        ODW_1.SetParam("parts_type", 0, "t");
        ODW_1.SetParam("is_pk", 0, "Y");
        ODW_1.Query("query_rn");
        
        var sql_where = "";
        for ( var i = 0 ; i < ODW_1.GetCount() ; i++ )
        {
            if ( sql_where != "" ) sql_where = sql_where + "   AND ";
            sql_where = sql_where + ODW_1.GetParam("field_name", i) + " = @" + ODW_1.GetParam("field_name", i);
        }
        
        sql ="DELETE FROM "
        sql = sql + Form.GetViewData("BasTableCd") + "\r\n"
                  + " WHERE " + sql_where;
    }
    
    WShtAC_SQL.SetGridCellText("SQL", WShtAC_SQL.GetCurrentRow(), sql);
    if ( WShtAC_SQL.ModifyGet(WShtAC_SQL.GetCurrentRow()) == 0 ) WShtAC_SQL.ModifySet(WShtAC_SQL.GetCurrentRow(), 2);
    TXT_SQL.SetText(sql);
}
