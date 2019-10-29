var Prefix = "__Encode";
var is_open = false;
var ux_dom = null;
var dgn_width = 1000;
var dgn_height = 1200;
var recursive_element = [];

// 저장을 OD Database에 자장할 것인지, popstore에 저장할 것인지 결정하기 위한 변수 설정

function Form_Load(  )
{	
	
    // 런타임시 gid 속성 추가
    DGN_Design.AddInitProperty( "gid", "string", "" ); // gid 추가 ( 2018-03-31, jshan ) 
    DGN_Design.AddInitProperty( "grid_gid", "string", "" ); // gid 추가 ( 2018-04-10, yhlim ) 
    DGN_Design.AddInitProperty( "search_name", "string", "" ); // search_name 추가 ( 2018-04-26, yhlim ) 
    DGN_Design.AddInitProperty( "action", "button", "" );
    
//    console.log("Form_Load : Start");
    WMDA_1.Toolbar_Visible("master_grid", "ok", false);
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    WMDA_1.Toolbar_Add("master_grid", "ok2", "저장", 0); // save xml data on popstore
    WMDA_1.Toolbar_Add("master_grid", "preview", "미리보기", 1); 
    WMDA_1.Toolbar_Enable("master_grid", "ok2", false);
    //WMDA_1.Toolbar_Add("master_grid", "map2gid", "map 2 gid", 1);  // gid 추가로 데이타 변경 

    DGN_Design.SetPropertyTool( DGN_PPT, true );
    DGN_Design.InitMode(false, 1500, 1500);
//    DGN_Design.SetDesignLayout("<ods_design></ods_design>", "xml");
    // UI TYPE
    DGN_PPT.UseCtrlTypeChange( true, ["edit", "grid_column", "check", "datetime", "combo", "label", "image"] );
    
    // Default Toolbar
    WMDA_1.RunQueryMaster(true); // tree info query 
//    DGN_Design.MetaShowLayout( "toolbox_ctrl", false );
//    DGN_Design.MetaShowLayout( "toolbar_ctrl", true );
    DGN_Design.MetaShowLayout( "form_border", false );
    DGNWidget_toolbar_visable( false );
    InitDGNWidget();
}

function InitDGNWidget( )
//
// Purpose : Design Widget 초기화
//
{
    DGNWidget_toolbar_visable( true );

//    DGN_Design.Tool_Clear("edit");
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

// -----------------------------------------------------------------------------
function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if ( panel_name == "master_grid" )
    {
        if ( btn_id == "ok2" ) // popStore에 화면데이타(xml) 저장
        {
            var doc_id = TXT_doc_id.GetText();
            if ( doc_id == "" || doc_id == 0 )
            {
                Form.Alert("TREE가 선택되지 않았습니다.");
                return;
            }
            
            var dgn_code = TXT_Code.GetText();
            var Hashcode = TRE_1.NodeGetCell( TRE_1.CurrentNodeKey(), 7) ; // Get HashCode 
            var Title = TRE_1.NodeGetCell( TRE_1.CurrentNodeKey(), 3) ;

            // Design Layout의 데이터를 XML Object로 Return 받음
            var Contents = DGN_Design.GetDesignLayoutXML();
            // XML Object를 JSON Object로 변환
            var Cont_JS = {};
            Cont_JS[Contents._dom.children[0].nodeName] = {};
            Cont_JS[Contents._dom.children[0].nodeName] = xmlToJson(Contents._dom.children[0]);
            
            // Save OpenDraft 
            ODW_2.ResetODW();
            ODW_2.SetParam( "dgn_contents", 0 , DGN_Design.GetDesignLayout() );
            ODW_2.SetParam( "dgn_code", 0, dgn_code );
            ODW_2.SetParam( "dgn_name", 0, TRE_1.NodeGetCell( TRE_1.CurrentNodeKey(), 0 ) );
    
            if( is_open )
            {
                if( !ODW_2.Update( "update" ) )
                {
                    Form.Alert( ODW_2.GetError() );
                    return;
                }
                
//                SaveItemBunch(dgn_code, Title, JSON.stringify(Cont_JS), Hashcode);
                SaveItemBunch(dgn_code, Title, Cont_JS, Hashcode);
            }
            else
            {
                if( !ODW_2.Insert( "insert_seq" ) )
                {
                    Form.Alert( ODW_2.GetError() );
                    return;
                }
                var dgn_code = ODW_2.GetParam("dgn_code", 0);
                TXT_Code.SetText(dgn_code);
                
                // OpenDraft form 저장소에 양식 내용 저장.
                ODW_1.ResetODW();
                ODW_1.SetParam("doc_id", 0, TXT_doc_id.GetText());
                ODW_1.SetParam("dgn_code", 0, dgn_code);
                
                if( ! ODW_1.Update("update_sc_dgn") )
                {
                    Form.Alert( ODW_1.GetError() ) 
                    return; 
                }
                TRE_1.NodeSetCell(TRE_1.CurrentNodeKey(), 4, ODW_1.GetParam("dgn_code", 0));
                
                var Hashcode = "";
                SaveItemBunch(dgn_code, Title, Cont_JS, Hashcode);
            }
        }
        if ( btn_id == "preview" ) // 미리보기
        {
            if( TXT_Code.GetText() == "" )
            {
                Form.Alert("선택된 항목의 내용이 없습니다.");
                return;
            }
            Form.DialogParamSet("dgn_code", TXT_Code.GetText());
            Form.DialogParamSet("dgn_name", TRE_1.NodeGetCell( TRE_1.CurrentNodeKey(), 3) );
            Form.DialogParamSet("hash_code", TRE_1.NodeGetCell( TRE_1.CurrentNodeKey(), 7) );
            Form.ShowDialog("OOS_ITEM101D");
        }
    }
    Form.SetViewData("root_flag", 0);
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    // popstore에서 불러온 자료를 기준으로 새로운 Tree 생성
    // 모든 저장을 popstore에 저장하기 위한 변수 필요성 검토 및 변수에 따라 수정
    TRE_1.NodeDeleteAll();
    if ( !result ) return;
    
    ODW_1.ResetODW();
    if( !ODW_1.Query("query_tree_root") )
        Form.Alert( ODW_1.GetError() );
    
    for( var i = 0 ; i < ODW_1.GetCount() ; i++ )
    {
        TRE_1.NodeInsertByKey("", ODW_1.GetParam("doc_id", i), ODW_1.GetParam("doc_name", i), -1, 0, 0);
        TRE_1.NodeSetCell(ODW_1.GetParam("doc_id", i), 5, "1" ) 
    }
    
    TRE_1.ColumnAdd(7, "Hashcode", 100); // hash code
    
    for ( var i = 0 ; i < row_count ; i++ )
    {
        var parent_id = WMDA_1.GetFieldData("master_grid", "parent_id", i);
        var doc_id = WMDA_1.GetFieldData("master_grid", "doc_id", i);
        var doc_name = WMDA_1.GetFieldData("master_grid", "doc_name", i);
        TRE_1.NodeInsertByKey(parent_id, doc_id, doc_name, -1, 0, 0);
        TRE_1.NodeSetCell(doc_id, 1, doc_id);
        TRE_1.NodeSetCell(doc_id, 2, WMDA_1.GetFieldData("master_grid", "doc_code", i));
        TRE_1.NodeSetCell(doc_id, 3, doc_name);
        TRE_1.NodeSetCell(doc_id, 4, WMDA_1.GetFieldData("master_grid", "dgn_code", i));
        TRE_1.NodeSetCell(doc_id, 5, WMDA_1.GetFieldData("master_grid", "lv", i));
        TRE_1.NodeSetCell(doc_id, 6, WMDA_1.GetFieldData("master_grid", "disp_seq", i));
        TRE_1.NodeSetCell(doc_id, 7, WMDA_1.GetFieldData("master_grid", "hash_code", i));
        TRE_1.NodeSetCell(doc_id, 8, WMDA_1.GetFieldData("master_grid", "doc_hash_code", i)); // DOC hash_code

        if( parseInt(WMDA_1.GetFieldData("master_grid", "lv", i)) < 3 )
            TRE_1.ExpandNode(parent_id, true);
        
    }
    TRE_1.SelectNode("0");
}

// -----------------------------------------------------------------------------
function BTN_AddTree_Click(  )
{
    WSG_1.RunInsert();
}

function BTN_UpdateTree_Click(  )
{
    var node_key = TRE_1.CurrentNodeKey();
    if ( node_key == "" || node_key == 0 )
        return;
    WSG_1.SetFieldData("query", "doc_id", node_key);
    WSG_1.RunQuery();
}

function BTN_DeleteTree_Click(  )
{
    var hash_code= TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 7);
    var node_key = TRE_1.CurrentNodeKey();
    if ( node_key == "" )
    {
        Form.Alert("선택되지 않았습니다")
        return;
    }
    if( TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 5) == "1" )
    {
        Form.Alert("최상위 항목은 삭제할수 없습니다")
        return;
    }
    if( TRE_1.NodeChildCount(node_key) > 0 )
    {
        Form.Alert("하위 양식을 제거후 삭제해 주세요");
        return;
    }
    
    ODW_1.ResetODW(); // TBL_100
    ODW_1.SetParam("doc_id", 0, node_key);
    if( ! ODW_1.Delete("delete_sc") ) 
    {
        Form.Alert( ODW_1.GetError() );
        return; 
    }
    
    var parent_id = TRE_1.GetKey_ParentNode(TRE_1.CurrentNodeKey());
    TRE_1.NodeDelete(ODW_1.GetParam("doc_id", 0));
    TRE_1.SelectNode(parent_id);
    
    DGN_Design.InitMode( false, 800, 600 );
    // DGN_Design.SetDesignLayout("<ods_design><catalog form_width=\"800\" form_height=\"600\"/><layout><list_ctrl></list_ctrl></layout><action/></ods_design>");
    DGN_Design.SetLayoutSize( dgn_width, dgn_height );

    is_open = false;
    
    TXT_Code.SetEnabled(false);
    TXT_doc_id.SetText("");
    TXT_Code.SetText("");
    
    DeleteItemBunch( hash_code )
}

function DeleteItemBunch( hash_code )
//
// Purpose : Redis DB에 저장되어 있는 화면 앵식 삭제
//
{
    if( hash_code == "" )
        return;
    
    ODW_3.ResetODW();
    ODW_3.SetParam("key_name", 0, hash_code);
    if( ! ODW_3.Delete("del_data") )
    {
        Form.Alert( ODW_3.GetError() );
        return; 
    }
}

var g_node_key = 0; 
var g_dgn_code;
function TRE_1_OnSelectChanged( node_key )
{
    if( parseInt(TRE_1.NodeGetCell( node_key, 5 )) == 3 )
    {
        BTN_UpdateTree_0.SetEnabled(true);
        BTN_DeleteTree.SetEnabled(true);
        WMDA_1.Toolbar_Enable("master_grid", "ok2", true);
    }
    else
    {
        BTN_UpdateTree_0.SetEnabled(false);
        BTN_DeleteTree.SetEnabled(true);
        WMDA_1.Toolbar_Enable("master_grid", "ok2", false);
    }
    
    if( parseInt(TRE_1.NodeGetCell( node_key, 5 )) > 2 )
        BTN_AddTree.SetEnabled(false);
    else
        BTN_AddTree.SetEnabled(true);
        
    // 첫실행, insert popup 후 두번타는 에러 제거
    if( g_node_key == node_key ) 
        return;
    g_node_key = node_key;
    
//    console.log("TRE_1_OnSelectChanged : Start (node key = " + node_key + ")");
    var doc_id = TRE_1.NodeGetCell(node_key, 1);
    var doc_code = TRE_1.NodeGetCell(node_key, 2);
    var doc_name = TRE_1.NodeGetCell(node_key, 3);
    var dgn_code = TRE_1.NodeGetCell(node_key, 4);
    var lv = TRE_1.NodeGetCell(node_key, 5);
    var disp_seq = TRE_1.NodeGetCell(node_key, 6);
    var Hash_Code = TRE_1.NodeGetCell(node_key, 7);
    var doc_hash_code = TRE_1.NodeGetCell(node_key, 8);

    if(Hash_Code == "" || Hash_Code == null)
    {
        TXT_doc_id.SetText(doc_id);
        TXT_Code.SetText(dgn_code);
        TXT_Code.SetEnabled(false);
//        InitDGNWidget( );
    
        g_dgn_code = dgn_code;
        if( doc_hash_code != "" ) // 문서 자동로드한 경우
        {
            ODW_3.ResetODW(); 
            ODW_3.SetParam("hash", 0, doc_hash_code);
            ODW_3.SetParam("key_name", 0, "item_data");
            if( ! ODW_3.Query("hget_data") )
            {
                Form.Alert( ODW_3.GetError() );
                return; 
            }
            var data = ODW_3.GetParam("json_result", 0);

//    DGN_Design.InitMode(false, 800, 600);
//            Init_DesignWidget();
    DGNWidget_toolbar_visable( false );
        DGN_Design.SetDesignLayout("","xml");
            is_open = false;
            MakeUxToolbar( JSON.parse(data) );

return;        
            if( g_dgn_code != "" )
                GetDesign(g_dgn_code, Hash_Code);
        }
        else
        {
            if( dgn_code == "" ) // 사용자가 툴바에서 직접 화면양식을 디자인한 경우 
            {
                DGN_Design.InitMode( false, 800, 600 );
                DGN_Design.SetLayoutSize( dgn_width, dgn_height );
                is_open = false;
            
                TXT_Code.SetEnabled(true);
                return;
            }
            else
            {
                TXT_Code.SetEnabled(false);
            }
            GetDesign(dgn_code, Hash_Code );
        }
    }
    else
    {
        is_open = true;
        TXT_doc_id.SetText(doc_id);
        TXT_Code.SetText(dgn_code);
        TXT_Code.SetEnabled(false);
    
        InitDGNWidget( );
        DGN_Design.InitMode( false, 800, 600 );
        DGN_Design.SetLayoutSize( dgn_width, dgn_height );
        GetDesign(dgn_code, Hash_Code );

    }
}

// -----------------------------------------------------------------------------
function WSG_1_OnQueryEnd( row_count )
{
    if ( row_count == 0 )
        return;

    WSG_1.GridFocusRow(0);
    WSG_1.RunUpdate();
}

function WSG_1_OnInsertPopup(  )
{
    if( Form.GetViewData("root_flag") == 1 )
    {
        var node_key = 0;
        var lv = 1;
        WSG_1.SetFieldData("insert", "parent_id", node_key);
        WSG_1.SetFieldData("insert", "lv", lv);
    }
    else
    {
        var node_key = TRE_1.CurrentNodeKey();
        if ( node_key == "" )
            node_key = 0;
        var lv = Number(TRE_1.NodeGetCell(node_key, 5));
        if ( lv == "" || isNaN(lv) )
            lv = 1;
        WSG_1.SetFieldData("insert", "parent_id", node_key);
        WSG_1.SetFieldData("insert", "lv", lv+1);
    }
    
    if( parseInt(lv) == 2 )
    {
        WSG_1.SetFieldProperty("insert", "doc_select", "Enabled", true);
        WSG_1.SetFieldProperty("insert", "doc_select_cancel", "Enabled", true);
        WSG_1.SetFieldProperty("insert", "btn_ref_doc", "Enabled", true);
    }
    else
    {
        WSG_1.SetFieldProperty("insert", "doc_select", "Enabled", false);
        WSG_1.SetFieldProperty("insert", "doc_select_cancel", "Enabled", false);
        WSG_1.SetFieldProperty("insert", "btn_ref_doc", "Enabled", false);
    }
}

function WSG_1_OnInsertEnd( row )
{
//    InitDGNWidget( );
    
    var parent_id = WSG_1.GetFieldData("insert", "parent_id");
    var doc_id = WSG_1.GetFieldData("insert", "doc_id");
    var doc_name = WSG_1.GetFieldData("insert", "doc_name");
    
    if( Form.GetViewData("root_flag") == 1 )
        TRE_1.NodeInsertByKey("", doc_id, doc_name, -1, 0, 0);
    else
        TRE_1.NodeInsertByKey(parent_id, doc_id, doc_name, -1, 0, 0);
    TRE_1.NodeSetCell(doc_id, 1, doc_id);
    TRE_1.NodeSetCell(doc_id, 2, WSG_1.GetFieldData("insert", "doc_code"));
    TRE_1.NodeSetCell(doc_id, 3, doc_name);
    TRE_1.NodeSetCell(doc_id, 4, WSG_1.GetFieldData("insert", "dgn_code"));
    TRE_1.NodeSetCell(doc_id, 5, WSG_1.GetFieldData("insert", "lv"));
    TRE_1.NodeSetCell(doc_id, 6, WSG_1.GetFieldData("insert", "disp_seq"));
    TRE_1.NodeSetCell(doc_id, 7, "");
    TRE_1.NodeSetCell(doc_id, 8, WSG_1.GetFieldData("insert", "doc_hash_code"));

    TRE_1.SelectNode(doc_id);
    Form.SetViewData("root_flag", 0);
}

function WSG_1_OnUpdateEnd( row )
{
//    Form.Alert("저장완료");
    
    var parent_id = WSG_1.GetFieldData("update", "parent_id");
    var doc_id = WSG_1.GetFieldData("update", "doc_id");
    var doc_name = WSG_1.GetFieldData("update", "doc_name");
    TRE_1.NodeSetCell(doc_id, 1, doc_id);
    TRE_1.NodeSetCell(doc_id, 2, WSG_1.GetFieldData("update", "doc_code"));
    TRE_1.NodeSetCell(doc_id, 3, doc_name);
    TRE_1.NodeSetCell(doc_id, 4, WSG_1.GetFieldData("update", "dgn_code"));
    TRE_1.NodeSetCell(doc_id, 5, WSG_1.GetFieldData("update", "lv"));
    TRE_1.NodeSetCell(doc_id, 6, WSG_1.GetFieldData("update", "disp_seq"));
    TRE_1.NodeSetCell(doc_id, 7, "");

    TRE_1.ExpandNode(parent_id, true);

    TRE_1.SelectNode(doc_id);
}

//------------------------------------------------------------------------------

function SaveItemBunch( Dgn_Code, Title, Contents, Hashcode )
//
// Purpose : 화면 양식 데이터를 Redis DB에 저장
//
{
    if(Contents == null || Contents == "")
    {
        Form.Alert("SaveItemBunch : End by null");
        return;
    }
    var meta_obj = {};
    meta_obj["title"] = Title;
    meta_obj["Dgn_Code"] = Dgn_Code;
    meta_obj["reg_date"] = Form.GetServerDate("yyyy-MM-dd HH:mm:ss");
    meta_obj["reg_nm"] = Form.GetUserName();
    meta_obj["category"] = "Item";
    if(Hashcode == "")
        var Hash_Code = sha1(Dgn_Code);
    else
        var Hash_Code = Hashcode;

    if(write_data(Hash_Code, "meta", JSON.stringify(meta_obj)) == false)
        return;

    var Doc_Obj = {};  
    Doc_Obj["Dgn_Code"] = Dgn_Code;
    Doc_Obj["Doc_Hash_Code"] = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 8);
    Doc_Obj["Title"] = Title;
    Doc_Obj["Contents"] = Contents;
    
    if(write_data(Hash_Code, "contents", JSON.stringify(Doc_Obj)) == false)
        return;

    TRE_1.NodeSetCell(TRE_1.CurrentNodeKey(), 7, Hash_Code);
      
    // hash code를 트리에 반영.
    ODW_1.ResetODW();
    ODW_1.SetParam("doc_id", 0, TXT_doc_id.GetText());
    ODW_1.SetParam("hash_code", 0, Hash_Code);
        
    if( !ODW_1.Update("update_hash") )
    {
        Form.Alert( ODW_1.GetError() );
    }
}

//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
function GetDesign ( dgn_code, hash_code )
//
// Purpose : Redis DB에 저장되어 있는 화면 양식 불러오기
//
{
    ODW_3.ResetODW();
    ODW_3.SetParam("hash", 0, hash_code);
    ODW_3.SetParam("key_name", 0, "contents");
    if( ! ODW_3.Query("hget_data") )
    {
        Form.Alert( ODW_3.GetError() );
        return; 
    }
    
    var data = JSON.parse( ODW_3.GetParam( "json_result", 0 ) );
    
    var contents = data.Contents;
    if(typeof(contents) == "object")
    {
        contents = json2xml(contents);
        DGN_Design.SetDesignLayout( contents );
        is_open = true;
    }
    else
    {
        if(contents.indexOf(Prefix) == 0)
        {
            contents = contents.substr(Prefix.length);
            contents = Form.Base64Decode( contents )
        }
        if(contents.substring(0,1) != "<")
            contents = json2xml(JSON.parse(contents ));
        DGN_Design.SetDesignLayout( contents );
        is_open = true;
    }
}

function WSG_1_OnButtonDown( panel_name, ctrl_name )
{
    if( panel_name == "insert" && ctrl_name == "doc_select" )
    {
        Form.DialogParamSet("return_count", 0);
        Form.ShowDialog("OOS_DOC100E");
    }
    else if( panel_name == "insert" && ctrl_name == "doc_select_cancel" )
    {
        WSG_1.SetFieldData("insert", "doc_hash_code", "");
        WSG_1.SetFieldData("insert", "doc_title", "");
    }
}

function Form_OnCloseDialog( view_code, dialog_result )
{
    if( !dialog_result )
    {
        return;
    }
    
    if ( view_code == "OOS_DOC100E" )
    {
        WSG_1.SetFieldData("insert", "doc_hash_code", Form.DialogParamGet("doc_hash_code"));
        WSG_1.SetFieldData("insert", "doc_title", Form.DialogParamGet("doc_title"));
    }
    Form.DialogClear();
}

var ms_excel;
function MakeUxToolbar( ux )
//
// Purpose : 양식 문서에 정의된 field를 button 생상
//
{
    if(ux["Type"] == "hwp")
    {
        var loop_cnt = 0;
        for(var idx in ux.field_data)
        {
            DGN_Design.Tool_Add("edit", ux.field_data[idx].title, "", "", "Design");
            ctrl_inst = DGN_Design.CreateControl("edit", "", "edit_"+idx, ux.field_data[idx].title, 12, 12 + loop_cnt * 36, 300, 24, "");
            loop_cnt++;
        }
    }
    else if(ux["Type"] == "doc")
    {
        for(var idx in ux.field_data)
        {
            var gid = ux.field_data[idx].gid;
            var label = ux.field_data[idx].label;
            var map_name = ux.field_data[idx].map_name;
            if(typeof(ux.field_data[idx].search_name) == "undefined")
                var search_name = "";
            else
                var search_name = ux.field_data[idx].search_name;
            DGN_Design.Tool_Add("edit", label, "", "", gid.toString());
            var ctrl_name = "edit_"+gid;
            ctrl_inst = DGN_Design.CreateControl("edit", "", ctrl_name, label, 12, 12 + parseInt(idx) * 36, 300, 24, "");
            ctrl_inst.RunInstance();
            ctrl_inst.SetProperty( "gid", gid );
            ctrl_inst.SetProperty( "map_name", map_name );
            ctrl_inst.SetProperty( "search_name", search_name );
        }
    }
return;

    TXT_1.SetText( "Start check ux source"+ "\r\n"  );
    var reuse = false;
    var hash_code = WSG_1.GetFieldData("insert", "ref_dgn_hash_code");
    if(hash_code.length != 0)
    {
        var reuse_item = Check_Reuse(hash_code);
        reuse = true;
        var contents =  JSON.parse(reuse_item.find_item);
        if(typeof(contents) != "object")
        {
            if(contents.substr(Prefix) == 0)
            {
                contents = contents.substr(Prefix.length);
                contents = Form.Base64Decode( contents )
            }
            if(contents[0] != "<")
            {
                contents = JSON.parse(contents);
            }
        }
    }
    if( ux["nodeName"] == "xlsxBody" )
    {
        var wt = getElementByNodeName(ux, "Data");
        var loop_cnt = 0;
        for(var idx in wt)
        {
            if(typeof(wt[idx].map_name) != "undefined")
            {
                var gid = wt[idx].gid;
                var grid_gid = wt[idx].grid_gid;
                var label = wt[idx].textValue;
                var map_name = wt[idx].map_name;
                if(typeof(wt[idx].search_name) == "undefined")
                    var search_name = "";
                else
                    var search_name = wt[idx].search_name;
                DGN_Design.Tool_Add("edit", label, "", "", gid.toString());
                var ctrl_name = "edit_"+gid;
                if (reuse)
                {
                    var ctrl = Get_Doc_Name(dgn_data, map_name);
                    if(ctrl != null)
                    {
                        var position = ctrl["@position"].split(":");
                        ctrl_inst = DGN_Design.CreateControl(ctrl["@ctrl_type"], ctrl_name, ctrl_name, label, 
                            parseInt(position[0]), parseInt(position[1]), 
                            parseInt(position[2]) - parseInt(position[0]), parseInt(position[3]) - parseInt(position[1]), "");
                        for(var idx in ctrl.ppts["ppt"])
                        {
                            if(ctrl.ppts["ppt"][idx]["@name"] != "Map_Name" &&
                                ctrl.ppts["ppt"][idx]["@name"] != "TabStop" &&
                                ctrl.ppts["ppt"][idx]["@name"] != "TabIndex" &&
                                ctrl.ppts["ppt"][idx]["@name"] != "gid" &&
                                ctrl.ppts["ppt"][idx]["@name"] != "Label")
                                ctrl_inst.SetProperty( ctrl.ppts["ppt"][idx]["@name"], ctrl.ppts["ppt"][idx]["@val"] );
                        }
                    }
                    else
                        ctrl_inst = DGN_Design.CreateControl("edit", ctrl_name, ctrl_name, label, 12, 12 + loop_cnt * 36, 300, 24, "");
                }
                else
                    ctrl_inst = DGN_Design.CreateControl("edit", ctrl_name, ctrl_name, label, 12, 12 + loop_cnt * 36, 300, 24, "");
                ctrl_inst.SetProperty( "gid", gid );
                ctrl_inst.SetProperty( "grid_gid", grid_gid );
                loop_cnt++;
                ctrl_inst.SetProperty( "map_name", map_name );
                ctrl_inst.SetProperty( "search_name", search_name );
            }
        }
    }
    else
    {
        if(ux["nodeName"] == "BODY")
            var wt = getElementByNodeName(ux, "CHAR");
        else
            var wt = getElementByNodeName(ux, "w:t");
        var loop_cnt = 0;

        for(var idx in wt)
        {
            if(typeof(wt[idx].map_name) != "undefined")
            {
                var gid = wt[idx].gid;
                var label = wt[idx].textValue;
                var map_name = wt[idx].map_name;
                if(typeof(wt[idx].search_name) == "undefined")
                    var search_name = "";
                else
                    var search_name = wt[idx].search_name;
                DGN_Design.Tool_Add("edit", label, "", "", gid.toString());
                var ctrl_name = "edit_"+gid;
                if (reuse)
                {
                    var ctrl = Get_Doc_Name(dgn_data, map_name);
                    if(ctrl != null)
                    {
                        var position = ctrl["@position"].split(":");
                        ctrl_inst = DGN_Design.CreateControl(ctrl["@ctrl_type"], ctrl_name, ctrl_name, label, 
                            parseInt(position[0]), parseInt(position[1]), 
                            parseInt(position[2]) - parseInt(position[0]), parseInt(position[3]) - parseInt(position[1]), "");
                        for(var idx in ctrl.ppts["ppt"])
                        {
                            if(ctrl.ppts["ppt"][idx]["@name"] != "Map_Name" &&
                                ctrl.ppts["ppt"][idx]["@name"] != "TabStop" &&
                                ctrl.ppts["ppt"][idx]["@name"] != "TabIndex" &&
                                ctrl.ppts["ppt"][idx]["@name"] != "gid" &&
                                ctrl.ppts["ppt"][idx]["@name"] != "Label")
                                ctrl_inst.SetProperty( ctrl.ppts["ppt"][idx]["@name"], ctrl.ppts["ppt"][idx]["@val"] );
                        }
                    }
                    else
                        ctrl_inst = DGN_Design.CreateControl("edit", ctrl_name, ctrl_name, label, 12, 12 + loop_cnt * 36, 300, 24, "");
                }
                else
                    ctrl_inst = DGN_Design.CreateControl("edit", ctrl_name, ctrl_name, label, 12, 12 + loop_cnt * 36, 300, 24, "");
                ctrl_inst.SetProperty( "gid", gid );
//                ctrl_inst.SetProperty( "grid_gid", grid_gid );
                loop_cnt++;
                ctrl_inst.SetProperty( "map_name", map_name );
                ctrl_inst.SetProperty( "search_name", search_name );
            }
        }
    }
}
var grid_list = new Array;

function CheckTextNode(  key_dom, dom_obj , depth, list_check_gid,  list_check_text, list_check_grid_gid )
//
// Purpose : XML 데이터에서 $Label$ 형식의 데이터인 경우 해당 Label 및 widget type을 Check
//
{
    // 과도한 재귀로 스택 오버 플로 되는 경우가 있음.
    // 일단 depth 30까지만.
    if( depth > 30 )
    {
        TXT_1.AddText( "재귀 한계 도달.\r\n" );
        return;
    }
    
    // attribute
    var gid = "";
    var label_check = "";
    var grid_gid = "";
    var map_name = "";
    var search_name = "";
    for( var key in dom_obj )
    {
    
        var val_obj = dom_obj[key];    
        if( key.toLowerCase() == "textvalue" )
        {
            var text_value = String(val_obj).trim();
            if( text_value.length < 3 )
                continue;
            
            var pos1 = text_value.indexOf( "$" )
            var pos2 = text_value.indexOf( "$", 1 )
            
            if( pos1 == 0 && pos2 == text_value.length-1)
            {
                label_check = text_value.substr( pos1 + 1, pos2-1 );
            }
        }
        else if( key.toLowerCase() == "gid" )
        {
            gid = String(val_obj);
        }
        else if( key.toLowerCase() == "grid_gid" )
        {
            grid_gid = String(val_obj);
        }
        else if( key.toLowerCase() == "map_name" )
        {
            map_name = String(val_obj);
        }
        else if( key.toLowerCase() == "search_name" )
        {
            search_name = String(val_obj);
        }
        
    }
    if( gid != "" && label_check != "" )
    {
        list_check_gid.push( gid );
        list_check_text.push( label_check );
        list_check_grid_gid.push( grid_gid );
        list_check_map_name.push( map_name );
        list_check_search_name.push( search_name );
    }
    
    for( var key in dom_obj )
    {
        var val_obj = dom_obj[key];
        if(  typeof val_obj == 'object' )
        {
            CheckTextNode(  key, val_obj, depth + 1, list_check_gid, list_check_text, list_check_grid_gid );
        }
    }
}


function BTN_AddTree_0_Click(  )
{
    
    Form.SetViewData("root_flag", 1);
    WSG_1.RunInsert();
    Form.SetViewData("root_flag", 0);
}

function BTN_UpdateTree_0_Click(  )
{
    var node_key = TRE_1.CurrentNodeKey();
    if ( node_key == "" )
    {
        Form.Alert("선택되지 않았습니다")
        return;
    }
    if( TRE_1.NodeChildCount(node_key) > 0 )
    {
        Form.Alert("하위 양식을 제거후 삭제해 주세요");
        return;
    }
    
    ODW_1.ResetODW(); // TBL_100
    ODW_1.SetParam("doc_id", 0, node_key);
    if( ! ODW_1.Delete("delete_sc_root") ) 
    {
        Form.Alert( ODW_1.GetError() );
        return; 
    }
    
    TRE_1.NodeDelete(node_key);
}

function getElementByNodeName_rec (object, tag)
//
// Purpose : tag에 해당하는 object array 선택
//
{
    if(typeof(object) == "string" || typeof(object) == "number" || typeof(object) == "undefined")
    {
        return;
    }

    if(object["nodeName"] == tag)
    {
        recursive_element.push(object);
    }
    else
    {
        for(var item in object)
        {
            if(item == "parent")
                continue;
            if(tag == "" || tag == null)
            {
                object[item]["parent"] = object;
            }
            else if(tag == "Delete")
            {
                if(object[item] != null)
                {
                    delete object[item]['parent'];  // deleteNode
                }
            }
            getElementByNodeName_rec(object[item], tag);
        }
    }
}

function getElementByNodeName (object, tag)
//
// Purpose : tag에 해당하는 object array 선택
//
{
    recursive_element = [];
    if(tag == "" || tag == null)
    {
        __count_id = 0;
    }
    getElementByNodeName_rec(object, tag);
    return recursive_element;
}

function Check_Reuse(hash_code)
//
// Purpose : 재 사용할 화면 양식을 Redis DB에서 불러오기
//
{
    ODW_3.ResetODW();
    ODW_3.SetParam("hash", 0, hash_code);
    ODW_3.SetParam("key_name", 0, "contents");
    if( ! ODW_3.Query("hget_data") )
    {
        Form.Alert( ODW_3.GetError() );
        return; 
    }
    
    var data = JSON.parse( ODW_3.GetParam( "json_result", 0 ) );
    
    return data.Contents;
}

function Get_Doc_Name(contents, mapname)
//
// Purpose : Design widget의 map_name 추출
//
{
    var ctrl = contents["ods_design"]["layout"]["list_ctrl"]["ctrl"];
    for(var idx in ctrl)
    {
        for(var pidx in ctrl[idx]["ppts"]["ppt"])
        {
            if(ctrl[idx]["ppts"]["ppt"][pidx]["@name"] == "Map_Name" && ctrl[idx]["ppts"]["ppt"][pidx]["@val"] == mapname)
                return ctrl[idx];
        }
    }
    return null;
}

function write_data(hash, key_name, val_str )
//
// Purpose : Redis DB에 자료 저장
//
{
    ODW_3.ResetODW(); 
    ODW_3.SetParam("hash", 0,  hash);
    ODW_3.SetParam("key_name", 0,  key_name);
    ODW_3.SetParam("val_str", 0, val_str);
    if( ! ODW_3.Insert("hset_data") )
    {
        Form.Alert( ODW_3.GetError() );
        return false; 
    }
    return true;
}
