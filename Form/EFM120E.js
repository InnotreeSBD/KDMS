

function Form_Load(  )
{
    Get_UserInfo();
    
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    
    WShtAC_1.Toolbar_Visible("query", false);
    WShtAC_1.Toolbar_Visible("ok", false);
    WShtAC_1.Toolbar_Visible("cancel", false);
    WShtAC_1.Toolbar_Add("add", "추가", 1);
    WShtAC_1.Toolbar_Add("del", "삭제", 1);
    
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
    WMDA_1.SetFieldData("query", "CmpyCd", 0, odw_combo.BatchQueryGetCellVal("CmpyCd", 0, 0));
    
    WMDA_1.RunQueryMaster(true);
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    TRE_1.NodeDeleteAll();
    WShtAC_1.ClearWidget();
    
    if ( !result ) return;
    
    ODW_1.ResetODW();
    if( !ODW_1.Query("query_rn_root") )
        Form.Alert( ODW_1.GetError() );
    
    for( var i = 0 ; i < ODW_1.GetCount() ; i++ )
    {
        TRE_1.NodeInsertByKey("", ODW_1.GetParam("EFormID", i), ODW_1.GetParam("EFormNm", i), -1, 0, 0);
        TRE_1.NodeSetCell(ODW_1.GetParam("EFormID", i), 4, "1" )// 
    }
    
    for ( var i = 0 ; i < row_count ; i++ )
    {
        var ParentID = WMDA_1.GetFieldData("master_grid", "ParentID", i);
        var EFormID = WMDA_1.GetFieldData("master_grid", "EFormID", i);
        var EFormNm = WMDA_1.GetFieldData("master_grid", "EFormNm", i);
        
        TRE_1.NodeInsertByKey(ParentID, EFormID, EFormNm, -1, 0, 0);
        TRE_1.NodeSetCell(EFormID, 1, EFormID);
        TRE_1.NodeSetCell(EFormID, 2, WMDA_1.GetFieldData("master_grid", "EFormCd", i));
        TRE_1.NodeSetCell(EFormID, 3, EFormNm);
        TRE_1.NodeSetCell(EFormID, 4, WMDA_1.GetFieldData("master_grid", "LV", i));
        TRE_1.NodeSetCell(EFormID, 5, WMDA_1.GetFieldData("master_grid", "DispSeq", i));
        TRE_1.NodeSetCell(EFormID, 6, WMDA_1.GetFieldData("master_grid", "EFormXML", i)); // 담을지말지
        TRE_1.NodeSetCell(EFormID, 7, WMDA_1.GetFieldData("master_grid", "CmpyCd", i)); // 담을지말지
        
        if( parseInt(WMDA_1.GetFieldData("master_grid", "LV", i)) < 4 )
            TRE_1.ExpandNode(ParentID, true);
    }
    TRE_1.SelectNode("1");
}

function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if( panel_name == "master_grid" )
    {
        if( btn_id == "ok" )
        {
            WMDA_1.Toolbar_SkipExecute("master_grid");
            WShtAC_1.RunUpdateAll("update_all", false);
        }
    }
}

function TRE_1_OnSelectChanged( node_key )
{
    var EFormID = TRE_1.NodeGetCell(node_key, 1);
    if( EFormID != "" )
    {
        WShtAC_1.SetFieldData("query", "CmpyCd", WMDA_1.GetFieldData("query", "CmpyCd", 0));
        WShtAC_1.SetFieldData("query", "EFormID", EFormID);
        WShtAC_1.RunQuery();
    }
    else
    {
        WShtAC_1.ClearWidget();
    }
}

function WShtAC_1_OnToolbarClick( btn_id )
{
    if( btn_id == "add" )
    {
        if( TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 1) == "" )
        {
            Form.Alert("서식을 선택해주세요.");
            return;
        }
        Form.ShowDialog("NOA260Dn");
    }
    else if( btn_id == "del" )
    {
        WShtAC_1.DeleteRowHide(WShtAC_1.GetCurrentRow());
    }
}

function Form_OnCloseDialog( view_code, dialog_result )
{
    if( !dialog_result )
        return;
    
    if( Form.DialogParamGet("ReturnCount") > 0 )
    {
        if( view_code == "NOA260Dn" )
        {
            for( var i = 0 ; i < Form.DialogParamGet("ReturnCount") ; i++ )
            {
                if( !WShtAC_1.IsGridValueExist("HrCd", Form.DialogParamGet("HrCd"+i), false) )
                {
                    var row = WShtAC_1.InsertRow(-1);
                    WShtAC_1.SetGridCellText("CmpyCd", row, WShtAC_1.GetFieldData("query", "CmpyCd"));
                    WShtAC_1.SetGridCellText("EFormID", row, TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 1));
                    WShtAC_1.SetGridCellText("HrCd", row, Form.DialogParamGet("HrCd"+i));
                    WShtAC_1.SetGridCellText("HrNm", row, Form.DialogParamGet("HrNm"+i));
                }
            }
        }
    }
    Form.DialogClear();
}
