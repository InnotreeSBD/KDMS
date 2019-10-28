var search_engine = "";
var pdf_file_name = "";

function Form_Load(  )
{
    WShtAC_1.Toolbar_Visible("ok", false);
    WShtAC_1.Toolbar_Visible("cancel", false);
    
    BTN_6.SetVisible(0);
    WMDA_1.SetFieldData("query", "box_id", 0, 0);
    WMDA_1.RunQueryMaster(false);
    WShtAC_1.Toolbar_Add("move", "폴더이동", 0); // save xml data on popstore
    WShtAC_1.Toolbar_Add("download", "문서출력", 0); 
    ODW_6.ResetODW();
    ODW_6.SetParam("ENV_TITLE", 0, "SEARCH_ENGINE")
    ODW_6.Query("Environment_query_sc");
    search_engine = ODW_6.GetParam("ENV_VALUE", 0);
}

function BTN_1_Click(  )
{
    WSG_1.RunInsert();
}

var g_root = false;
function WSG_1_OnInsertPopup(  )
{
    if ( g_root )
    {
        var node_key = 0;
        var lv = -1;
        g_root = false;
    
    }
    else
    {
        var node_key = TRE_1.CurrentNodeKey();
        if ( node_key == "" )
            node_key = 0;
            
        var lv = Number(TRE_1.NodeGetCell(node_key, 3));
    }    
    WSG_1.SetFieldData("insert", "up_cntr_id", node_key);
    WSG_1.SetFieldData("insert", "cntr_lv", lv+1);
    WSG_1.SetFieldData("insert", "use_yn", "Y");
    WSG_1.SetFieldData("insert", "box_id", 0);
    WSG_1.SetFieldData("insert", "acl_chk", "1");
    
}

function WSG_1_OnUpdatePopup(  )
{
    if ( TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 7) == "" )
    {
        WSG_1.SetFieldData("update", "acl_chk", "0");
        WSG_1.SetFieldProperty("update", "acl_chk", "Enabled", 0);
    }
    else
    {
        WSG_1.SetFieldData("update", "acl_chk", "1");
        WSG_1.SetFieldProperty("update", "acl_chk", "Enabled", 1);
    }
}

function TreeQuery()
{
    TRE_1.NodeDeleteAll();
    
    ODW_1.ResetODW()
    ODW_1.SetParam("box_id", 0, 0 );
    ODW_1.SetParam("query_type", 0, "root" );
    if ( !ODW_1.Query("ECMCntr_query_tree") )
        Form.Alert( ODW_1.GetError() );
    
    if ( ODW_1.GetCount() == 0 )
    {
        BTN_6.SetVisible(1);
        return;
    }
    else
    {
        TRE_1.NodeInsertByKey("", ODW_1.GetParam("cntr_id", 0), ODW_1.GetParam("cntr_nm", 0), -1, 0, 0);
        TRE_1.NodeSetCell(ODW_1.GetParam("cntr_id", 0), 3, ODW_1.GetParam("cntr_lv", 0));
    }
    
    var row_count = WMDA_1.GetRowCount("master_grid");
    for ( var i = 0 ; i < row_count ; i++ )
    {
        var up_cntr_id = WMDA_1.GetFieldData("master_grid", "up_cntr_id", i);
        var cntr_id = WMDA_1.GetFieldData("master_grid", "cntr_id", i);
        var cntr_nm = WMDA_1.GetFieldData("master_grid", "cntr_nm", i);
        TRE_1.NodeInsertByKey(up_cntr_id, cntr_id, cntr_nm, -1, 0, 0);
        TRE_1.NodeSetCell(cntr_id, 1, cntr_id);
        TRE_1.NodeSetCell(cntr_id, 2, cntr_nm);
        TRE_1.NodeSetCell(cntr_id, 3, WMDA_1.GetFieldData("master_grid", "cntr_lv", i));
        TRE_1.NodeSetCell(cntr_id, 4, WMDA_1.GetFieldData("master_grid", "sort_seq", i));
        TRE_1.NodeSetCell(cntr_id, 5, WMDA_1.GetFieldData("master_grid", "use_yn", i));
        TRE_1.NodeSetCell(cntr_id, 6, WMDA_1.GetFieldData("master_grid", "box_id", i));
        TRE_1.NodeSetCell(cntr_id, 7, WMDA_1.GetFieldData("master_grid", "up_cntr_id", i));
        

        if( parseInt(WMDA_1.GetFieldData("master_grid", "cntr_lv", i)) < 4 )
            TRE_1.ExpandNode(up_cntr_id, true);
    }
    
    TRE_1.SelectNode("00000000000000000000000000000001");
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    TreeQuery();
}

function WSG_1_OnInsertEnd( row )
{
    var up_cntr_id = WSG_1.GetFieldData("insert", "up_cntr_id");
    var cntr_id = WSG_1.GetFieldData("insert", "cntr_id");
    var cntr_nm = WSG_1.GetFieldData("insert", "cntr_nm");
    
    TRE_1.NodeInsertByKey(up_cntr_id, cntr_id, cntr_nm, -1, 0, 0);
        
    TRE_1.NodeSetCell(cntr_id, 1, cntr_id);
    TRE_1.NodeSetCell(cntr_id, 2, cntr_nm);
    TRE_1.NodeSetCell(cntr_id, 3, WSG_1.GetFieldData("insert", "cntr_lv"));
    TRE_1.NodeSetCell(cntr_id, 4, WSG_1.GetFieldData("insert", "sort_seq"));
    TRE_1.NodeSetCell(cntr_id, 5, WSG_1.GetFieldData("insert", "use_yn"));
    TRE_1.NodeSetCell(cntr_id, 6, WSG_1.GetFieldData("insert", "box_id"));
    TRE_1.NodeSetCell(cntr_id, 7, WSG_1.GetFieldData("insert", "up_cntr_id"));

    TRE_1.ExpandNode(up_cntr_id, true);
    if ( up_cntr_id == 0 )
    {
        WMDA_1.RunQueryMaster(false);
        BTN_6.SetVisible(0);
    }
}

function BTN_2_Click(  )
{
    WSG_1.RunUpdate();
}

function TRE_1_OnSelectChanged( node_key )
{
    WSG_1.SetFieldData("query", "cntr_id", node_key);
    WSG_1.RunQuery();
    
    ODW_2.ResetODW();
    ODW_2.SetParam("cntr_id", 0, node_key);
    if ( !ODW_2.Query("ECMCntrPolicy_query_rn") )
        Form.Alert(ODW_2.GetError());
    
    WShtAC_1.SetFieldData("query", "cntr_id", node_key);
    WShtAC_1.RunQuery();
    WShtAC_1.Toolbar_Enable("delete", true);
}

function WSG_1_OnQueryEnd( row_count )
{
    WSG_1.GridFocusRow(0);
}

function WSG_1_OnUpdateEnd( row )
{
    var cntr_id = TRE_1.CurrentNodeKey();
    
    TRE_1.NodeSetCell(cntr_id, 0, WSG_1.GetFieldData("update", "cntr_nm"));
    TRE_1.NodeSetCell(cntr_id, 2, WSG_1.GetFieldData("update", "cntr_nm"));
    TRE_1.NodeSetCell(cntr_id, 5, WSG_1.GetFieldData("update", "use_yn"));
    
    ODW_2.ResetODW();
    ODW_2.SetParam("cntr_id", 0, TRE_1.CurrentNodeKey());
    if ( !ODW_2.Query("ECMCntrPolicy_query_rn") )
        Form.Alert(ODW_2.GetError());
}

function BTN_3_Click(  )
{
    Form.ConfirmAsync("confirm_delete_folder", "삭제하면 복구할 수 없습니다.\n정말로 삭제하시겠읍니까 ?", "삭제 확인");
}

function BTN_6_Click(  )
{
    g_root = true;
    WSG_1.RunInsert();
}

function WShtAC_1_OnToolbarClick( btn_id )
{
    WShtAC_1.Toolbar_SkipExecute();
    if ( btn_id == "query" )
    {
        TRE_1_OnSelectChanged(TRE_1.CurrentNodeKey());
    }
    else if ( btn_id == "delete" )
    {
        Form.ConfirmAsync("confirm_delete_file", "삭제하면 복구할 수 없습니다.\n정말로 삭제하시겠읍니까 ?", "삭제 확인");
    }
    else if ( btn_id == "insert" )
    {
        if(TRE_1.CurrentNodeKey() != "")
        {
            Form.DialogClear();
            Form.DialogParamSet("cntr_id", TRE_1.CurrentNodeKey());
            Form.DialogParamSet("FileCategory", TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 2) );
            Form.DialogParamSet("ReturnCount", 0);
            Form.DialogParamSet("CallType", "insert");
        
            Form.ShowDialog("OOS_DOC120");
        }
        else
        {
            Form.Alert("입력할 폴더가 선택되지 않았읍니다.");
        }
    }
    else if(btn_id == "download")
    {
        Form.ConfirmAsync("confirm_down_file", "원본 문서를 다운로드 하시겠읍니까 ?", "다운로드 확인");
    }
    else if(btn_id == "move")
    {
        Form.ShowDialog("OOS_DOC130");
    }
}

function Form_OnCloseDialog( view_code, dialog_result )
{
    if ( Form.DialogParamGet("ReturnCount") == 0 )
    {
        return;
    }
    
    if ( view_code == "OOS_DOC120" )
    {
        var cur_row = WShtAC_1.GetCurrentRow();
        if ( Form.DialogParamGet("CallType") == "insert" )
        {
            cur_row = WShtAC_1.InsertRow(-1);
        }
        WShtAC_1.SetGridCellText("plcy_id", cur_row, Form.DialogParamGet("plcy_id"))
        WShtAC_1.SetGridCellText("cntr_id", cur_row, Form.DialogParamGet("cntr_id"))
        WShtAC_1.SetGridCellText("memb_div_cd", cur_row, Form.DialogParamGet("memb_div_cd"))
        WShtAC_1.SetGridCellText("memb_id", cur_row, Form.DialogParamGet("memb_id"))
        WShtAC_1.SetGridCellText("plcy_cd", cur_row, Form.DialogParamGet("plcy_cd"))
        WShtAC_1.SetGridCellText("acl_lv", cur_row, Form.DialogParamGet("acl_lv"))
        WShtAC_1.SetGridCellText("FileTitle", cur_row, Form.DialogParamGet("FileTitle"))
        WShtAC_1.SetGridCellText("FileName", cur_row, Form.DialogParamGet("FileName"))
        WShtAC_1.SetGridCellText("ApDt", cur_row, Form.DialogParamGet("ApDt"))
        WShtAC_1.SetGridCellText("HrNm", cur_row, Form.DialogParamGet("HrNm"))
        WShtAC_1.SetGridCellText("Hash_Code", cur_row, Form.DialogParamGet("Hash_Code"))
        WShtAC_1.SetGridCellText("FileCategory", cur_row, Form.DialogParamGet("FileCategory"))
        WShtAC_1.ModifySet(cur_row, 0);
        TRE_1_OnSelectChanged(TRE_1.CurrentNodeKey());
    }
    else if(view_code == "OOS_DOC130")
    {
        var plcy_id = WShtAC_1.GetGridCellText("plcy_id", WShtAC_1.GetCurrentRow());
        var Hash_Code = WShtAC_1.GetGridCellText("Hash_Code", WShtAC_1.GetCurrentRow());
        ODW_2.ResetODW();
        ODW_2.SetParam("cntr_id", 0, Form.DialogParamGet("cntr_id"));
        ODW_2.SetParam("FileCategory", 0, Form.DialogParamGet("file_category"));
        ODW_2.SetParam("plcy_id", 0, plcy_id);
        if (! ODW_2.Update("ECMCntrPolicy_update_rn"))
        {
            Form.Alert( ODW_2.GetError() );
            return; 
        }

        ODW_3.ResetODW(); // HwpXMLRead
        ODW_3.SetParam("hash", 0, Hash_Code);
        ODW_3.SetParam("key_name", 0, "meta");
        ODW_3.Query("hget_data");
        var ret_val = ODW_3.GetParam("json_result", 0);
        if(ret_val == "")
        	return;
        meta = JSON.parse(ret_val);

	    ODW_5.ResetODW();
	    ODW_5.SetParam("No", 0, meta["doc_id"]);
	    ODW_5.Delete("delete");

        ODW_3.ResetODW(); // HwpXMLRead
        ODW_3.SetParam("hash", 0, Hash_Code);
        ODW_3.SetParam("key_name", 0, "Contents_data");
        ODW_3.Query("hget_data");
        var ret_val = ODW_3.GetParam("json_result", 0);
        if(ret_val == "")
        	return;
        ret_val = JSON.parse(ret_val);

	    ODW_5.ResetODW(); 
	    ODW_5.SetParam("Filename", 0, meta["file_name_src"]);
	    ODW_5.SetParam("Body", 0, ret_val.field_data.join("\n"));
	    ODW_5.SetParam("Created", 0, meta["reg_date"]);
	    ODW_5.SetParam("hash_code", 0, Hash_Code);
	    ODW_5.SetParam("Title", 0, meta["title"]);
	    ODW_5.SetParam("Author", 0, meta["reg_nm"]);
	    ODW_5.SetParam("Category", 0, Form.DialogParamGet("file_category"));
	    if( ! ODW_5.Insert("collect") )
	    {
        	Form.Alert( ODW_5.GetError() );
        	return; 
    	}
        
       TRE_1_OnSelectChanged(TRE_1.CurrentNodeKey());
    }
}

function WShtAC_1_OnButtonDown( panel_name, ctrl_name )
{
    if ( panel_name == "grid" && ctrl_name == "btn_delete" )
    {
        var cur_row = WShtAC_1.GetCurrentRow();
        WShtAC_1.RunDelete(cur_row);
    }
}

var old_hash_code = "";

function WShtAC_1_OnSelectChanged( col_name, col, row )
{
    if(WShtAC_1.GetCurrentRow() == -1)
        return;
    var Hash_Code = WShtAC_1.GetGridCellText("Hash_Code", WShtAC_1.GetCurrentRow());
    if(Hash_Code == "")
        return;
    if(check_pdf(row))
    {
    	if(old_hash_code != "")
    	{
	        ODW_3.ResetODW();
	        ODW_3.SetParam("hash", 0, old_hash_code);
	        ODW_3.Delete("del_file");
    	}
        ODW_3.ResetODW();
        ODW_3.SetParam("hash", 0, Hash_Code);
        ODW_3.Insert("down_file");
    	var File_Name = ODW_3.GetParam("json_result", 0);
        
        pdf_file_name = "/ODS_Storage/" + File_Name;
        MAP_1.SetMapURL("/od_oos/pdfjs/web/viewer.html");
        disp_outer_text(Hash_Code);
        old_hash_code = Hash_Code;
	    return;
    }
    if(check_exist(Hash_Code))
    {
        show_preview(Hash_Code);
        disp_outer_text(Hash_Code);
    }
    else
    {
	    TXT_1.SetText("");
    	MAP_1.SetMapURL("");
    }
}

function check_pdf(row)
{
    var FileName = WShtAC_1.GetGridCellText("FileName", row);
	var FileArr = FileName.split(".");
	if(FileArr[FileArr.length - 1].toUpperCase() == "PDF")
		return true;
	return false;
}

function show_preview(Hash_Code)
{
    ODW_3.ResetODW(); // HwpXMLRead
    ODW_3.SetParam("hash", 0, Hash_Code);
    ODW_3.SetParam("key_name", 0, "Preview_Html");
    if ( !ODW_3.Query("hget_data") )
    {
        Form.Alert(ODW_3.GetError());
        return;
    }
    var data_src = ODW_3.GetParam("json_result", 0);
    if(data_src == "undefined" || data_src == "" || data_src == "null")
    {
        Form.Alert("미리보기 자료가 저장되지 않았읍니다.");
        return;
    }
    data_src = JSON.parse(data_src);
    ODW_7.ResetODW(); // HwpXMLRead
    ODW_7.Query("get_hwp_ip");
    var server_ip = ODW_7.GetParam("http_result", 0);
    var server_port = ODW_7.GetParam("http_result", 1);
    var server_service = ODW_7.GetParam("http_result", 2);
	MAP_1.SetMapURL("http://"+server_ip+":"+server_port+server_service + data_src["Preview_Html"]);
}

function disp_outer_text( Hash_Code)
{
    ODW_3.ResetODW(); 
    ODW_3.SetParam("hash", 0, Hash_Code);
    ODW_3.SetParam("key_name", 0, "Contents_data");
    if( ! ODW_3.Query("hget_data") )
    {
        Form.Alert( ODW_3.GetError() );
        return; 
    }
    var data = ODW_3.GetParam( "json_result", 0 );
    if(data == "undefined" || data == "" || data == "null")
    {
        Form.Alert("자료가 저장되지 않았읍니다.");
        return;
    }
    data = JSON.parse(data);
    var outer = data.field_data.join("\n");
    TXT_1.SetText(outer);
}

function WShtAC_1_OnQueryEnd( result, row_count )
{
	if(row_count == 0)
	{
	    TXT_1.SetText("");
    	MAP_1.SetMapURL("");
	
	}
	else
	{
	    WShtAC_1.SortColumn("ApDt", false);
    }
}

function Form_OnConfirmResult( confirm_id, result )
{
    if((confirm_id == "confirm_delete_folder") && result)
    {
        var rowcount = WShtAC_1.GetRowCount();
        for(var idx in rowcount)
        {
            Hash_Code = WShtAC_1.GetGridCellText("Hash_Code", idx);
            ODW_3.ResetODW(); // HwpXMLRead
            ODW_3.SetParam("hash", 0, Hash_Code);
            if( ! ODW_3.Delete("del_data") )
            {
                Form.Alert( ODW_3.GetError() );
                return; 
            }
        }
        var cntr_id = TRE_1.CurrentNodeKey();
        var up_cntr_id = TRE_1.GetKey_ParentNode(cntr_id, 1);
        var child_count = TRE_1.NodeChildCount(cntr_id);
        if ( child_count > 0 )
        {
            int = Form.ShowMessageBox("하위폴더가 존재하므로 삭제할 수 없습니다.", "알림", 0, 1);
            return;
        }
        ODW_1.ResetODW();
        ODW_1.SetParam("cntr_id", 0, cntr_id);
        ODW_1.Delete("ECMCntr_delete_sc");
    
        TRE_1.NodeDelete(cntr_id);
        TRE_1.SelectNode(up_cntr_id);
    }
    else if ((confirm_id == "confirm_delete_file") && result)
    {
        var Hash_Code = WShtAC_1.GetGridCellText("Hash_Code", WShtAC_1.GetCurrentRow());
        var solr_id = WShtAC_1.GetGridCellText("id", WShtAC_1.GetCurrentRow());
        ODW_3.ResetODW(); // HwpXMLRead
        ODW_3.SetParam("hash", 0, Hash_Code);
        ODW_3.SetParam("key_name", 0, "meta");
        ODW_3.Query("hget_data");
        var ret_val = ODW_3.GetParam("json_result", 0);
        if(ret_val == "")
        	return;
        ret_val = JSON.parse(ret_val);
        var doc_id = ret_val["doc_id"];

        ODW_3.ResetODW(); // HwpXMLRead
        ODW_3.SetParam("hash", 0, Hash_Code);
        if( ! ODW_3.Delete("del_data") )
        {
            Form.Alert( ODW_3.GetError() );
            return; 
        }
        var ret_val = ODW_3.GetParam("http_result", 0);
        
        var plcy_id = WShtAC_1.GetGridCellText("plcy_id", WShtAC_1.GetCurrentRow());
        ODW_2.ResetODW();
        ODW_2.SetParam("plcy_id", 0, plcy_id);
        if( ! ODW_2.Delete("ECMCntrPolicy_delete_sc") )
        {
            Form.Alert( ODW_2.GetError() );
            return; 
        }
        
        if(ODW_2.GetParam("result", 0) > 0)
        {
            WShtAC_1.DeleteRow(WShtAC_1.GetCurrentRow());
            TRE_1_OnSelectChanged(TRE_1.CurrentNodeKey());
        }
        if(search_engine == "solr")
        {
	        ODW_4.ResetODW(); // HwpXMLRead
	        ODW_4.SetParam("id", 0, solr_id);
	        if( ! ODW_4.Delete("Delete_Document") )
	        {
	            Form.Alert( "인덱스 파일에서 삭제되지 않았읍니다.\n관리자에게 다음의 ID를 통보해 주세요\nID = " + solr_id );
	        }
	    }
	    else if(search_engine == "doub")
	    {
//	        var doc_id = ret_val["doc_id"];
	        ODW_5.ResetODW();
	        ODW_5.SetParam("No", 0, doc_id);
	        ODW_5.Delete("delete");
	    }
        
    }
    else if ((confirm_id == "confirm_down_file") && result)
    {
        var Hash_Code = WShtAC_1.GetGridCellText("Hash_Code", WShtAC_1.GetCurrentRow());
        ODW_3.ResetODW(); // HwpXMLRead
        ODW_3.SetParam("hash", 0, Hash_Code);
        if ( !ODW_3.Insert("file_download_seq") )
        {
            Form.Alert(ODW_3.GetError());
            return;
        }
        var filepath = ODW_3.GetParam("file_name", 0);
        var src_file = ODW_3.GetParam("FileName", 0)
        FIIO_1.FileDirectDownloadByName(null, filepath, src_file, true);
    }
}

function WShtAC_1_OnMenuPrepare( menu )
{
    var menu_col_name = menu.GetMenuColName();
    var menu_col = menu.GetMenuCol();
    var menu_row = menu.GetMenuRow();

    menu.ClearMenuItem();
    Form.SetViewData( "menu_col_name", menu_col_name );
    Form.SetViewData( "menu_row", menu_row );    
}

function check_exist(Hash_Code)
{
    ODW_3.ResetODW(); // HwpXMLRead
    ODW_3.SetParam("hash", 0, Hash_Code);
    if( ! ODW_3.Query("hexists") )
    {
        Form.Alert( ODW_3.GetError() );
        return false; 
    }
    var ret_val = ODW_3.GetParam("json_result", 0);
	if(ret_val == "true")
		return true;
	return false;
}
