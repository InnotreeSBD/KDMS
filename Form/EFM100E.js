

function Form_Load(  )
{
    Get_UserInfo();
    
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    
    //combo
    var odw_combo = Form.GetNewODW("");
    odw_combo.BatchQueryInit();
    odw_combo.BatchQueryAdd("CmpyCd", "BACmpy", "CustCd", "CustNm", "WHERE CmpyYN='1'");
    
    if( !odw_combo.BatchQueryRun() )
    {
        Form.Alert(odw_combo.GetError());
        return;
    }
    WMDA_1.SetSelectRecordData("query", "CmpyCd", odw_combo, "CmpyCd");
    
    var CustCd = Form.GetViewData("CustCd");
    if( CustCd == "" )    CustCd = "0000";
    
    WMDA_1.SetFieldData("query", "CmpyCd", 0, CustCd);
    
    WMDA_1.Toolbar_Visible("ST01", "save_record", false);
    WMDA_1.Toolbar_Visible("ST02", "save_record", false);
    WMDA_1.Toolbar_Visible("ST03", "save_record", false);
    
    WMDA_1.FitColToGridWidth("ST01");
    WMDA_1.FitColToGridWidth("ST02");
    WMDA_1.FitColToGridWidth("ST03");
    
    WMDA_1.RunQueryMaster(false);
}

function Form_OnKeyDown( key_val, key_name, ctrl_key, alt_key, shift_key, ctrl_name, widget_name, panel_name )
{
    if( widget_name == "WMDA_1" )
    {
        if( panel_name == "query" )
        {
            if( key_name == "RETURN" )
            {
                WMDA_1.RunQueryMaster(false);
            }
        }
    }
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    if( result )
    {
        WMDA_1.GridFocusRow("master_grid", 0);
    }
}

function WMDA_1_OnQueryDetailEnd( result, row )
{
    if( result )
    {
        if( WMDA_1.GetRowCount("ST01") == 0 )
        {
            WMDA_1.ClearWidgetPanel("ST02");
            WMDA_1.ClearWidgetPanel("ST03");
        }
        
        for( var i = 0 ; i < WMDA_1.GetRowCount("ST01") ; i++ )
        {
            WMDA_1.SetCellReadonly("ST01", "CatCd", i, true);
        }

        for( var i = 0 ; i < WMDA_1.GetRowCount("ST02") ; i++ )
        {
            WMDA_1.SetCellReadonly("ST02", "CatCd", i, true);
        }
        
        for( var i = 0 ; i < WMDA_1.GetRowCount("ST03") ; i++ )
        {
            WMDA_1.SetCellReadonly("ST03", "CatCd", i, true);
        }
        
        WMDA_1.GridFocusRow("ST01", 0);
    }
}

function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if( panel_name == "ST01" )
    {
        if( btn_id == "del_record" )
        {
            for( var i = 0 ; i < WMDA_1.GetRowCount("ST02") ; i++ )
            {
                var CatCd = WMDA_1.GetFieldData("ST01", "CatCd", WMDA_1.GetCurrentRow("ST01"));
                var ParentCd = WMDA_1.GetFieldData("ST02", "ParentCd", i);
                
                if( CatCd == ParentCd )
                {
                    if( WMDA_1.GetModifyFlag("ST02", i) != 3 )
                    {
                        WMDA_1.Toolbar_SkipExecute("ST01");
                        Form.Alert("하위 항목이 있어 삭제할 수 없습니다.");
                        return;
                    }
                }
            }
        }
    }
    
    else if( panel_name == "ST02" )
    {
        if( btn_id == "add_record" )
        {
            var CatCd_1 = WMDA_1.GetFieldData("ST01", "CatCd", WMDA_1.GetCurrentRow("ST01"));
            if( CatCd_1 == "" )
            {
                WMDA_1.Toolbar_SkipExecute("ST02");
                Form.Alert("상위 항목의 분류코드를 먼저 입력해주세요.");
                WMDA_1.StartEditCell("ST01", "CatCd", WMDA_1.GetCurrentRow("ST01"));
            }
        }
        
        else if( btn_id == "del_record" )
        {
            var CatCd_1 = WMDA_1.GetFieldData("ST01", "CatCd", WMDA_1.GetCurrentRow("ST01"));
            var ParentCd_2 = WMDA_1.GetFieldData("ST02", "ParentCd", WMDA_1.GetCurrentRow("ST02"));
            if( CatCd_1 != ParentCd_2 )
            {
                WMDA_1.Toolbar_SkipExecute("ST02");
                return;
            }
            
            
            for( var i = 0 ; i < WMDA_1.GetRowCount("ST03") ; i++ )
            {
                var CatCd_2 = WMDA_1.GetFieldData("ST02", "CatCd", WMDA_1.GetCurrentRow("ST02"));
                var ParentCd_3 = WMDA_1.GetFieldData("ST03", "ParentCd", i);
                
                if( CatCd_2 == ParentCd_3 )
                {
                    if( WMDA_1.GetModifyFlag("ST03", i) != 3 )
                    {
                        WMDA_1.Toolbar_SkipExecute("ST03");
                        Form.Alert("하위 항목이 있어 삭제할 수 없습니다.");
                        return;
                    }
                }
            }
        
        }
    }
    
    else if( panel_name == "ST03" )
    {
        if( btn_id == "add_record" )
        {
            var CatCd_1 = WMDA_1.GetFieldData("ST01", "CatCd", WMDA_1.GetCurrentRow("ST01"));
            var CatCd_2 = WMDA_1.GetFieldData("ST02", "CatCd", WMDA_1.GetCurrentRow("ST02"));
            
            var ParentCd_2 = WMDA_1.GetFieldData("ST02", "ParentCd", WMDA_1.GetCurrentRow("ST02"));
            var ParentCd_3 = WMDA_1.GetFieldData("ST03", "ParentCd", WMDA_1.GetCurrentRow("ST03"));
            
            if( CatCd_1 != ParentCd_2 )
            {
                WMDA_1.Toolbar_SkipExecute("ST03");
                Form.Alert("상위 항목을 먼저 입력해주세요.");
                return;
            }
            
            if( CatCd_2 == "" )
            {
                WMDA_1.Toolbar_SkipExecute("ST03");
                Form.Alert("상위 항목의 분류코드를 먼저 입력해주세요.");
                WMDA_1.StartEditCell("ST02", "CatCd", WMDA_1.GetCurrentRow("ST02"));
                return;
            }
        }
        
        else if( btn_id == "del_record" )
        {
            if( CatCd_2 != ParentCd_3 )
            {
                WMDA_1.Toolbar_SkipExecute("ST03");
                return;
            }
        }
    }
}

function WMDA_1_OnToolbarClick_After( panel_name, btn_id, row )
{
    if( panel_name == "ST01" )
    {
        if( btn_id == "add_record" )
        {
            WMDA_1.SetFieldData("ST01", "CmpyCd", row, WMDA_1.GetFieldData("query", "CmpyCd", 0)); 
            WMDA_1.SetFieldData("ST01", "Lv", row, "1"); 
            
            WMDA_1.StartEditCell("ST01", "CatCd", row);
        }
    }
    else if( panel_name == "ST02" )
    {
        if( btn_id == "add_record" )
        {
            WMDA_1.SetFieldData("ST02", "CmpyCd", row, WMDA_1.GetFieldData("query", "CmpyCd", 0));
            WMDA_1.SetFieldData("ST02", "ParentCd", row, WMDA_1.GetFieldData("ST01", "CatCd", WMDA_1.GetCurrentRow("ST01")));
            WMDA_1.SetFieldData("ST02", "Lv", row, "2"); 
            
            WMDA_1.StartEditCell("ST02", "CatCd", row);
        }
    }
    else if( panel_name == "ST03" )
    {
        if( btn_id == "add_record" )
        {
            WMDA_1.SetFieldData("ST03", "CmpyCd", row, WMDA_1.GetFieldData("query", "CmpyCd", 0));
            WMDA_1.SetFieldData("ST03", "ParentCd", row, WMDA_1.GetFieldData("ST02", "CatCd", WMDA_1.GetCurrentRow("ST02")));
            WMDA_1.SetFieldData("ST03", "Lv", row, "3"); 
            
            WMDA_1.StartEditCell("ST03", "CatCd", row);
        }
    }
}

function WMDA_1_OnSelectRecordChanged( panel_name, col_name, col, row )
{
    if( panel_name == "ST01" )
    {
        var seq = 0;
        var first_row = "";
        var is_first_row = false;
        
        for( var i = 0 ; i < WMDA_1.GetRowCount("ST02") ; i++ )
        {
            var CatCd = WMDA_1.GetFieldData("ST01", "CatCd", WMDA_1.GetCurrentRow("ST01"));
            var ParentCd = WMDA_1.GetFieldData("ST02", "ParentCd", i);
            
            if( CatCd == ParentCd )
            {
                if( !is_first_row )
                {
                    first_row = i;
                    is_first_row = true;
                    
                    WMDA_1.GridFocusRow("ST02", i);
                    WMDA_1_OnSelectRecordChanged("ST02", "", "", i);
                }
                WMDA_1.SetRowHeight("ST02", i, 22);
                WMDA_1.SetFieldData("ST02", "Seq", i, seq+1);
                seq++;
            }
            else
            {
                WMDA_1.SetRowHeight("ST02", i, 0);
            }
        }
        
        if( first_row === "" )
        {
            for( var i = 0 ; i < WMDA_1.GetRowCount("ST03") ; i++ )
            {
                WMDA_1.SetRowHeight("ST03", i, 0);
            }
        }
    }
    
    else if( panel_name == "ST02" )
    {
        var seq = 0;
        var first_row = "";
        var is_first_row = false;
        
        if( WMDA_1.GetFieldData("ST01", "CatCd", WMDA_1.GetCurrentRow("ST01")) != WMDA_1.GetFieldData("ST02", "ParentCd", row) )
            return;
        
        for( var i = 0 ; i < WMDA_1.GetRowCount("ST03") ; i++ )
        {
            var CatCd = WMDA_1.GetFieldData("ST02", "CatCd", WMDA_1.GetCurrentRow("ST02"));
            var ParentCd = WMDA_1.GetFieldData("ST03", "ParentCd", i);
            
            if( CatCd == ParentCd )
            {
                if( !is_first_row )
                {
                    first_row = i;
                    is_first_row = true;
                    
                    WMDA_1.GridFocusRow("ST03", i);
                }
                WMDA_1.SetRowHeight("ST03", i, 22);
                WMDA_1.SetFieldData("ST03", "Seq", i, seq+1);
                seq++;
            }
            else
            {
                WMDA_1.SetRowHeight("ST03", i, 0);
            }
        }
    }
}

function WMDA_1_OnEditChanged( panel_name, ctrl_name, val )
{
    if( panel_name == "query" )
    {
        if( ctrl_name == "CmpyCd" )
        {
            WMDA_1.RunQueryMaster(false);
        }
    }
}

