var dgn_width = 1000;
var dgn_height = 800;
var g_dgn_type = "dgn";

function Form_Load(  )
{
    // 런타임시 gid 속성 추가
    DGN_Design.AddInitProperty( "action", "button", "" );
    
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    WMDA_1.Toolbar_Add("master_grid", "preview", Form.RES_String("MSG_PREVIEW"), 1); 
    WMDA_1.Toolbar_Enable("master_grid", "ok", false);
    
    var odw_combo = Form.GetNewODW("");
    odw_combo.BatchQueryInit();
    odw_combo.BatchQueryAdd("CmpyCd", "BACmpy", "CustCd", "CustNm", "WHERE CmpyYN = '1' ");
    odw_combo.BatchQueryRun();
    
    WMDA_1.SetSelectRecordData("query", "CmpyCd", odw_combo, "CmpyCd");
    
    DGN_Design.SetPropertyTool( DGN_PPT, true );
    DGN_Design.InitMode(false, dgn_width, 1000);
    DGN_Design.MetaShowLayout("form_border", false );
    
    // UI TYPE
    DGN_PPT.UseCtrlTypeChange( true, ["edit", "grid_column", "check", "datetime", "combo", "label", "image"] );
    
    // Default Toolbar
    DGNWidget_toolbar_visable( false );
    InitDGNWidget();
    
    // 
    TRE_1.AddMenu("AddRoot", Form.RES_String("MSG_msg10"));
    TRE_1.AddMenu("DelRoot", Form.RES_String("MSG_msg11"));
    TRE_1.AddMenu("Add", Form.RES_String("MSG_msg12"));
    TRE_1.AddMenu("Update", Form.RES_String("MSG_msg13"));
    TRE_1.AddMenu("Del", Form.RES_String("MSG_msg14"));
    TRE_1.AddMenuEnd();
    
    WMDA_1.SetFieldData("query", "CmpyCd", 0, odw_combo.BatchQueryGetCellVal("CmpyCd", 0, 0));
    WMDA_1.RunQueryMaster(true); // tree info query 
}


// -----------------------------------------------------------------------------
function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if ( panel_name == "master_grid" )
    {
        if ( btn_id == "ok" ) 
        {
            WMDA_1.Toolbar_SkipExecute("master_grid");
            var DicID = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 1);
            if ( DicID == "" || DicID == 0 )
            {
                Form.Alert(Form.RES_String("MSG_msg15"));
                return;
            }
            
            var DicID = TRE_1.CurrentNodeKey();
            var DicXML = DGN_Design.GetDesignLayout("");
            
            // Save OpenDraft 
            ODW_1.ResetODW();
            ODW_1.SetParam( "DicXML", 0 , DicXML );
            ODW_1.SetParam( "DicID", 0, DicID );
            if( !ODW_1.Update( "update_sc_dgn" ) )
            {
                Form.Alert( ODW_1.GetError() );
                return;
            }
            TRE_1.NodeSetCell(DicID, 6, DicXML); // 담을지말지
                
//            else
//            {
//                if( !ODW_1.Insert( "insert_sc" ) )
//                {
//                    Form.Alert( ODW_1.GetError() );
//                    return;
//                }
//                dgn_code = ODW_1.GetParam("dgn_code", 0);
//
//                
//                // OpenDraft form 저장소에 양식 내용 저장.
//                ODW_1.ResetODW();
//                ODW_1.SetParam("doc_id", 0, TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 1));
//                ODW_1.SetParam("dgn_code", 0, dgn_code);
//                if( ! ODW_1.Update("update_sc_dgn") )
//                {
//                    Form.Alert( ODW_1.GetError() ) 
//                    return; 
//                }
//                TRE_1.NodeSetCell(TRE_1.CurrentNodeKey(), 4, ODW_1.GetParam("dgn_code", 0));
//                
//                var Contents = DGN_Design.GetDesignLayout("");
//                Form.Alert(Form.RES_String("MSG_SAVED"));
//            }
        }
        if ( btn_id == "preview" ) // 미리보기
        {
            if( TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 6) == "" )
            {
                Form.Alert(Form.RES_String("MSG_msg15"));
                return;
            }
            Form.DialogParamSet("DicID", TRE_1.CurrentNodeKey());
            Form.DialogParamSet("DicNm", TRE_1.NodeGetCell( TRE_1.CurrentNodeKey(), 3) );
            //Form.ShowDialog("EFM110D");
            Form.ShowDialog("EFM013D");
        }
    }
    Form.SetViewData("root_flag", 0);
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    TRE_1.NodeDeleteAll();
    if ( !result ) return;
    
    ODW_1.ResetODW();
    ODW_1.SetParam("CmpyCd", 0 , WMDA_1.GetFieldData("query", "CmpyCd", 0));
    if( !ODW_1.Query("query_rn_root") )
        Form.Alert( ODW_1.GetError() );
    
    for( var i = 0 ; i < ODW_1.GetCount() ; i++ )
    {
        TRE_1.NodeInsertByKey("", ODW_1.GetParam("DicID", i), ODW_1.GetParam("DicNm", i), -1, 0, 0);
        TRE_1.NodeSetCell(ODW_1.GetParam("DicID", i), 4, "1" )// 
    }
    
    for ( var i = 0 ; i < row_count ; i++ )
    {
        var ParentID = WMDA_1.GetFieldData("master_grid", "ParentID", i);
        var DicID = WMDA_1.GetFieldData("master_grid", "DicID", i);
        var DicNm = WMDA_1.GetFieldData("master_grid", "DicNm", i);
        TRE_1.NodeInsertByKey(ParentID, DicID, DicNm, -1, 0, 0);
        TRE_1.NodeSetCell(DicID, 1, DicID);
        TRE_1.NodeSetCell(DicID, 2, WMDA_1.GetFieldData("master_grid", "DicCd", i));
        TRE_1.NodeSetCell(DicID, 3, DicNm);
        TRE_1.NodeSetCell(DicID, 4, WMDA_1.GetFieldData("master_grid", "LV", i));
        TRE_1.NodeSetCell(DicID, 5, WMDA_1.GetFieldData("master_grid", "DispSeq", i));
        TRE_1.NodeSetCell(DicID, 6, WMDA_1.GetFieldData("master_grid", "DicXML", i)); // 담을지말지

        if( parseInt(WMDA_1.GetFieldData("master_grid", "LV", i)) < 4 )
            TRE_1.ExpandNode(ParentID, true);
    }
    TRE_1.SelectNode("1");
}

function InitDGNWidget( )
{
    DGNWidget_toolbar_visable( true );
    
    DGN_Design.Tool_Add("label", "Label", "", "", "");
    DGN_Design.Tool_Add("edit", "Edit", "", "", "");
    DGN_Design.Tool_Add("group", "Group", "", "", "");
    DGN_Design.Tool_Add("grid", "Grid", "", "", "");
    DGN_Design.Tool_Add("grid_column", "Grid Col", "", "", "");
    DGN_Design.Tool_Add("tab", "Tab", "", "", "");
    DGN_Design.Tool_Add("button", "Button", "", "", "");
    DGN_Design.Tool_Add("split", "Split", "", "", "");
    DGN_Design.Tool_Add("check", "CheckBox", "", "", "");
    DGN_Design.Tool_Add("datetime", "DateTime", "", "", "");
    DGN_Design.Tool_Add("combo", "ComboBox", "", "", "");
    DGN_Design.Tool_Add("image", "Image", "", "", "");
}

function DGNWidget_toolbar_visable( bool )
{
    DGN_Design.MetaShowLayout( "toolbar_ctrl", bool   );
    //DGN_Design.Tool_Clear("");
}

function BTN_AddRoot_Click(  )
{
    Form.SetViewData("root_flag", 1);
    WSG_1.RunInsert();
}

function WSG_1_OnInsertPopup(  )
{
    if( Form.GetViewData("root_flag") == 1 )
    {
        var node_key = 0;
        var LV = 1;
        WSG_1.SetFieldData("insert", "ParentID", node_key);
        WSG_1.SetFieldData("insert", "LV", LV);
        WSG_1.SetFieldData("insert", "CmpyCd", WMDA_1.GetFieldData("query", "CmpyCd", 0));
    }
    else
    {
        var node_key = TRE_1.CurrentNodeKey();
        if ( node_key == "" )
            node_key = 0;
        var LV = Number(TRE_1.NodeGetCell(node_key, 4));
        if ( LV == "" || isNaN(LV) )
            LV = 1;
        WSG_1.SetFieldData("insert", "ParentID", node_key);
        WSG_1.SetFieldData("insert", "LV", LV+1);
        WSG_1.SetFieldData("insert", "CmpyCd", WMDA_1.GetFieldData("query", "CmpyCd", 0));
    }
    
    /* 
    // 문서선택등 RO 처리
    if( parseInt(lv) == 2 )
    {
        WSG_1.SetFieldProperty("insert", "doc_select", "Enabled", true);
        WSG_1.SetFieldProperty("insert", "doc_select_cancel", "Enabled", true);
    }
    else
    {
        WSG_1.SetFieldProperty("insert", "doc_select", "Enabled", false);
        WSG_1.SetFieldProperty("insert", "doc_select_cancel", "Enabled", false);
    }
    */
}


function WSG_1_OnInsertEnd( row )
{
    var ParentID = WSG_1.GetFieldData("insert", "ParentID");
    var DicID = WSG_1.GetFieldData("insert", "DicID");
    var DicNm = WSG_1.GetFieldData("insert", "DicNm");
    
    if( Form.GetViewData("root_flag") == 1 )
        TRE_1.NodeInsertByKey("", DicID, DicNm, -1, 0, 0);
    else
        TRE_1.NodeInsertByKey(ParentID, DicID, DicNm, -1, 0, 0);
    TRE_1.NodeSetCell(DicID, 1, DicID);
    TRE_1.NodeSetCell(DicID, 2, WSG_1.GetFieldData("insert", "DicCd"));
    TRE_1.NodeSetCell(DicID, 3, DicNm);
    TRE_1.NodeSetCell(DicID, 4, WSG_1.GetFieldData("insert", "LV"));
    TRE_1.NodeSetCell(DicID, 5, WSG_1.GetFieldData("insert", "DispSeq"));
    TRE_1.NodeSetCell(DicID, 6, WSG_1.GetFieldData("insert", "DicXML")); // 담을지 말지

    TRE_1.ExpandNode(ParentID, true);

    TRE_1.SelectNode(DicID);
    Form.SetViewData("root_flag", 0);
}


function TRE_1_OnMenuClick( menu_code, menu_label, node_key, node_label )
{
    if ( menu_code == "AddRoot" )
    {
        Form.SetViewData("root_flag", 1);
        WSG_1.RunInsert();
    }
    else if ( menu_code == "DelRoot" )
    {
        var node_key = TRE_1.CurrentNodeKey();
        
        if( TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 4) != "1" )
        {
            Form.Alert(Form.RES_String("MSG_msg18"));
            return;
        }
        if ( node_key == "" )
        {
            Form.Alert(Form.RES_String("MSG_msg19"));
            return;
        }
        
        if( TRE_1.NodeChildCount(node_key) > 0 )
        {
            Form.Alert(Form.RES_String("MSG_msg20"));
            return;
        }
        
        // 최초 생성된 tree 는 삭제 못하게 , id = "1" 유지 목적, 트리명은 수정으로 변경하여 사용
        if( node_key == "1" )
        {
            Form.Alert(Form.RES_String("MSG_msg21"));
            return;
        }
        
        ODW_1.ResetODW(); // TBL_100
        ODW_1.SetParam("DicID", 0, node_key);
        if( ! ODW_1.Delete("delete_sc_root") ) 
        {
            Form.Alert( ODW_1.GetError() );
            return; 
        }
        
        TRE_1.NodeDelete(node_key);
    }
    else if ( menu_code == "Add" )
    {
        if( TRE_1.CurrentNodeKey() == "" )
        {
            Form.Alert(Form.RES_String("MSG_msg17"));
            return;
        }
        WSG_1.RunInsert();
    }
    else if ( menu_code == "Update" )
    {
        var node_key = TRE_1.CurrentNodeKey();
        if ( node_key == "" || node_key == 0 )
            return;
        WSG_1.SetFieldData("query", "DicID", node_key);
        WSG_1.RunQuery();
    }
    else if ( menu_code == "Del" )
    {
        Form.ConfirmAsync("delete", Form.RES_String("MSG_msg20"),Form.RES_String("MSG_LBL_DELETE"));
    }
}

var g_node_key = 0; 
function TRE_1_OnSelectChanged( node_key )
{
    if( parseInt(TRE_1.NodeGetCell( node_key, 4 )) == 3 )
    {
        //InitDGNWidget();
        WMDA_1.Toolbar_Enable("master_grid", "ok", true);
    }
    else
    {
        DGNWidget_toolbar_visable( false );
        WMDA_1.Toolbar_Enable("master_grid", "ok", false);
    }
    
    // 첫실행, insert popup 후 두번타는 에러 제거
    if( g_node_key == node_key ) 
        return;
    g_node_key = node_key;
    
    var DicID = TRE_1.NodeGetCell(node_key, 1);
    var DicCd = TRE_1.NodeGetCell(node_key, 2);
    var DicNm = TRE_1.NodeGetCell(node_key, 3);
    var LV = TRE_1.NodeGetCell(node_key, 4);
    var DispSeq = TRE_1.NodeGetCell(node_key, 5);
    var DicXML = TRE_1.NodeGetCell(node_key, 6);

    DGN_Design.InitMode( false, dgn_width, dgn_height );
    if( DicXML == "" ) // 사용자가 툴바에서 직접 화면양식을 디자인한 경우 
    {
//        DGN_Design.SetDesignLayout("<>","xml");
        DGN_Design.SetDesignLayout("","xml");
        DGN_Design.SetLayoutSize( dgn_width, dgn_height );
        return;
    }
    else
    {
        DGN_Design.SetDesignLayout( DicXML, "" );
        DGN_Design.SetLayoutSize( dgn_width, dgn_height );
    }
}

function Form_OnConfirmResult( confirm_id, result )
{
    if ( !result ) return;
    
    if ( confirm_id == "delete" )
    {
        var node_key = TRE_1.CurrentNodeKey();
        if ( node_key == "" )
        {
            Form.Alert(Form.RES_String("MSG_msg19"));
            return;
        }
        if( TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 4) == "1" ) // LV check
        {
            Form.Alert(Form.RES_String("MSG_msg22"));
            return;
        }
        if( TRE_1.NodeChildCount(node_key) > 0 ) // child check
        {
            Form.Alert(Form.RES_String("MSG_msg20"));
            return;
        }
        
        ODW_1.ResetODW(); 
        ODW_1.SetParam("DicID", 0, node_key);
        if( ! ODW_1.Delete("delete_sc") ) 
        {
            Form.Alert( ODW_1.GetError() );
            return; 
        }
        
        var ParentID = TRE_1.GetKey_ParentNode(TRE_1.CurrentNodeKey());
        TRE_1.NodeDelete(node_key);
        TRE_1.SelectNode(ParentID);
        
        DGN_Design.InitMode( false, dgn_width, dgn_height );
        DGN_Design.SetLayoutSize( dgn_width, dgn_height );
    }
}

// WSG update 처리
function WSG_1_OnQueryEnd( row_count )
{
    if ( row_count == 0 )
        return;

    WSG_1.GridFocusRow(0);
    WSG_1.RunUpdate();
}


function WSG_1_OnUpdateEnd( row )
{
    Form.Alert("저장완료");
    
    var ParentID = WSG_1.GetFieldData("update", "ParentID");
    var DicID = WSG_1.GetFieldData("update", "DicID");
    var DicNm = WSG_1.GetFieldData("update", "DicNm");
    
    // 현재는 이름만 바뀌면 된다
    TRE_1.NodeSetCell(DicID, 0, DicNm);
//    TRE_1.NodeSetCell(DicID, 1, DicID);
//    TRE_1.NodeSetCell(DicID, 2, WSG_1.GetFieldData("update", "DicCd"));
//    TRE_1.NodeSetCell(DicID, 3, DicNm);
//    TRE_1.NodeSetCell(DicID, 4, WSG_1.GetFieldData("update", "LV"));
//    TRE_1.NodeSetCell(DicID, 5, WSG_1.GetFieldData("update", "DispSeq"));
//    TRE_1.NodeSetCell(DicID, 6, WSG_1.GetFieldData("update", "DicXML"));

    TRE_1.ExpandNode(ParentID, true);

    TRE_1.SelectNode(DicID);
}
