
var dgn_width = 800;
var dgn_height = 600;
var g_dgn_type = "dgn";
var init_mode = true;
function Form_Load(  )
{
    // 런타임시 gid 속성 추가
    DGN_Design.AddInitProperty( "action", "button", "" );
    
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    WMDA_1.Toolbar_Visible("master_grid", "ok", false);
    WMDA_1.Toolbar_Add("master_grid", "select", "선택", 1); 
    
    DGN_Design.SetPropertyTool( DGN_PPT, true );
    DGN_Design.InitMode(init_mode, 800, 600);
    DGN_Design.MetaShowLayout("form_border", false );
    
    // UI TYPE
    DGN_PPT.UseCtrlTypeChange( true, ["edit", "grid_column", "check", "datetime", "combo", "label", "image"] );
    
    // Default Toolbar
    DGNWidget_toolbar_visable( false );
    
    TRE_1.AddMenu("AddRoot", Form.RES_String("MSG_msg10"));
    TRE_1.AddMenu("DelRoot", Form.RES_String("MSG_msg11"));
    TRE_1.AddMenu("Add", Form.RES_String("MSG_msg12"));
    TRE_1.AddMenu("Update", Form.RES_String("MSG_msg13"));
    TRE_1.AddMenu("Del", Form.RES_String("MSG_msg14"));
    TRE_1.AddMenuEnd();
    
    WMDA_1.RunQueryMaster(true); // tree info query 
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    TRE_1.NodeDeleteAll();
    if ( !result ) return;
    
    ODW_1.ResetODW();
    if( !ODW_1.Query("query_rn_root") )
        Form.Alert( ODW_1.GetError() );
    
    for( var i = 0 ; i < ODW_1.GetCount() ; i++ )
    {
        TRE_1.NodeInsertByKey("", ODW_1.GetParam("DicID", i), ODW_1.GetParam("DicNm", i), -1, 0, 0);
        TRE_1.NodeSetCell(ODW_1.GetParam("DicID", i), 4, "1")
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
        TRE_1.NodeSetCell(DicID, 6, WMDA_1.GetFieldData("master_grid", "DicXML", i));
        
        if( parseInt(WMDA_1.GetFieldData("master_grid", "LV", i)) < 4 )
            TRE_1.ExpandNode(ParentID, true);
    }
    TRE_1.SelectNode("1");
}

function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if ( panel_name == "master_grid" )
    {
        if ( btn_id == "select" ) 
        {
            WMDA_1.Toolbar_SkipExecute("master_grid");
            
            var DicID = TRE_1.CurrentNodeKey();
            var Lv = TRE_1.NodeGetCell(DicID, 4);
            
            if( Lv != 3 )
            {
                Form.Alert("화면 메뉴만 선택할 수 있습니다.");
                return;
            }
            Form.DialogParamSet("DicID", DicID);
            Form.DialogParamSet("DicCd", TRE_1.NodeGetCell(DicID, 2));
            Form.DialogParamSet("DicNm", TRE_1.NodeGetCell(DicID, 3));
            Form.DialogParamSet("LV", TRE_1.NodeGetCell(DicID, 4));
            Form.DialogParamSet("DispSeq", TRE_1.NodeGetCell(DicID, 5));
            Form.DialogParamSet("DicXML", TRE_1.NodeGetCell(DicID, 6));
            Form.DialogParamSet("ReturnCount", 1);
            Form.CloseView(1);
        }
    }
}

var g_node_key = 0; 
function TRE_1_OnSelectChanged( node_key )
{
    if( parseInt(TRE_1.NodeGetCell( node_key, 4 )) == 3 )
    {
        InitDGNWidget();
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
    
    DGN_Design.InitMode( init_mode, 800, 600 );
    DGN_Design.SetDesignLayout( DicXML, "" );
    if( DicXML == "" ) // 사용자가 툴바에서 직접 화면양식을 디자인한 경우 
    {
        DGN_Design.SetLayoutSize( dgn_width, dgn_height );
        return;
    }
    else
    {
        DGN_Design.SetLayoutSize( dgn_width, dgn_height );
    }
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
    DGN_Design.Tool_Clear("");
}
