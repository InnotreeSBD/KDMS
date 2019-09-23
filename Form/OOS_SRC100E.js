

function Form_Load(  )
{
    DATE_from.AddYears(-1);
    WGSheet_2.TopHead_MergeCell("COL_1", 0, "COL_5", 0);
    GRP_2.SetVisible(false);
    Form.SetControlPos("GRP_1", 10, 85, 1200, 800);
    BTN_3.SetText("▼");
	Set_Combo();
}

function BTN_1_Click(  )
{
        var cur_row = WGSheet_1.InsertRow(-1);
        WGSheet_1.SetGridCellText("No", cur_row, "0001");
        WGSheet_1.SetGridCellText("FileTitle", cur_row, "테스트");
        WGSheet_1.SetGridCellText("FileName", cur_row, "File.hwp");
        WGSheet_1.SetGridCellText("ApDt", cur_row, "20190916");
        WGSheet_1.SetGridCellText("ApUserID", cur_row, "이재환");
        WGSheet_1.SetGridCellText("Hash_Code", cur_row, "11111111");
        WGSheet_1.SetGridCellText("PreView", cur_row, "ods_image://bpm_icon/icon023.png");
        WGSheet_1.SetGridCellText("PrintDoc", cur_row, "ods_image://bpm_icon/icon028.png");
return;
    if(TXT_1.GetText() == "")
    {
            Form.Alert("검색어가 입력되지 않았읍니다.");
            return;
    }

    ODW_3.ResetODW(); 
    ODW_3.SetParam("SearchWord", 0, TXT_1.GetText());
    if(GRP_2.GetVisible())
    {
        ODW_3.SetParam("StartDay", 0, DATE_from.GetValue().replace(/-/g, "")+"000000");
        ODW_3.SetParam("EndDay", 0, DATE_to.GetValue().replace(/-/g, "")+"235959");
    }
    if( ! ODW_3.Query("search") )
    {
        Form.Alert( ODW_3.GetError() );
        return; 
    }
    var cnt = ODW_3.GetCount();
    if( cnt == 0)
        return;
    WGSheet_1.ClearWidget();
    for(var idx = 0; idx < cnt;idx++)
    {
        var data = JSON.parse(ODW_3.GetParam( "http_result", idx ));
        var cur_row = WGSheet_1.InsertRow(-1);
        WGSheet_1.SetGridCellText("No", cur_row, data["no"]);
        WGSheet_1.SetGridCellText("FileTitle", cur_row, data["title"]);
        WGSheet_1.SetGridCellText("FileName", cur_row, data["filename"]);
        WGSheet_1.SetGridCellText("ApDt", cur_row, data["created"]);
        WGSheet_1.SetGridCellText("ApUserID", cur_row, data["created"]);
        WGSheet_1.SetGridCellText("Hash_Code", cur_row, data["hash_code"]);
        WGSheet_1.SetGridCellText("PreView", cur_row, "ods_image://bpm_icon/icon023.png");
        WGSheet_1.SetGridCellText("PrintDoc", cur_row, "ods_image://bpm_icon/icon028.png");
    }
    WGSheet_1.SortColumn("ApDt", false);
    relation_search();
}

function relation_search(  )
{
    ODW_3.ResetODW(); 
    ODW_3.SetParam("SearchWord", 0, TXT_1.GetText());
    if( ! ODW_3.Query("relation") )
    {
        Form.Alert( ODW_3.GetError() );
        return; 
    }
    var cnt = ODW_3.GetCount();
    if( cnt == 0)
        return;
    WGSheet_2.ClearWidget();
    for(var idx = 0; idx < 2;idx++)
    {
        var cur_row = WGSheet_2.InsertRow(-1);
        for(var idx_col = 0; idx_col < 5; idx_col++)
        {
            var data = JSON.parse(ODW_3.GetParam( "http_result", idx*5+idx_col ));
            WGSheet_2.SetGridCellText("COL_"+(idx_col+1), cur_row, data["word"]);
//            WGSheet_2.SetGridCellText("COL_"+(idx_col+1), cur_row, TXT_1.GetText() + " " + data["word"]);
        }
    }
}

//function BTN_1_Click(  )
//{
//    if(TXT_1.GetText() == "")
//    {
//            Form.Alert("검색어가 입력되지 않았읍니다.");
//            return;
//    }
//    var search_obj = {};
//    search_obj["Text_val"] = TXT_1.GetText();
//
//        ODW_1.ResetODW(); 
//        ODW_1.SetParam("search_str", 0, JSON.stringify(search_obj));
//        if( ! ODW_1.Query("query_simple") )
//        {
//            Form.Alert( ODW_1.GetError() );
//            return; 
//        }
//        var data = ODW_1.GetParam( "http_response", 0 );
//        if(data == "")
//            return;
//        data = JSON.parse( data );
//        WGSheet_1.ClearWidget();
//        if(data.length > 0)
//        {
//            for ( var idx in data )
//            {
//                var cur_row = WGSheet_1.InsertRow(-1);
//                WGSheet_1.SetGridCellText("FileTitle", cur_row, data[idx]["FileTitle"]);
//                WGSheet_1.SetGridCellText("FileName", cur_row, data[idx]["FileName"]);
//                WGSheet_1.SetGridCellText("ApDt", cur_row, data[idx]["ApDt"]);
//                WGSheet_1.SetGridCellText("ApUserID", cur_row, data[idx]["ApUserID"]);
//                WGSheet_1.SetGridCellText("Hash_Code", cur_row, data[idx]["Hash_Code"]);
//                WGSheet_1.SetGridCellText("id", cur_row, data[idx]["id"]);
//            }
//            WGSheet_1.SortColumn("ApDt", false);
//        }
//}

function WGSheet_1_OnMenuPrepare( menu )
{
//    var menu_col_name = menu.GetMenuColName();
//    var menu_col = menu.GetMenuCol();
//    var menu_row = menu.GetMenuRow();

    menu.ClearMenuItem();
//    menu.AddMenuItem("Menu0", "문서 보기");
//    menu.AddMenuItem("Menu2", "문서 다운로드");
//    Form.SetViewData( "menu_col_name", menu_col_name );
//    Form.SetViewData( "menu_row", menu_row );    
}

function WGSheet_1_OnMenuClick( menu_code, menu_label, col_name, col, row, cell_val )
{
    switch(menu_code)
    {
        case "Menu0" :
            Form.DialogParamSet("Hash_Code", WGSheet_1.GetGridCellText("Hash_Code", Form.GetViewData( "menu_row" )));
            Form.ShowDialog("ODS_VIEW100E");
            break;
        case "Menu1" :
            Form.DialogParamSet("Doc_Type", "Data");
            Form.DialogParamSet("WType", "Sheet_2");
            Form.DialogParamSet("Category", "Storage");
            Form.ShowDialog("DtaQ_Doc_Select");
            break;
        case "Menu2" :
            Form.ConfirmAsync("confirm_down_file", "원본 문서를 다운로드 하시겠읍니까 ?", "다운로드 확인");
            break;
    }
}

function BTN_2_Click(  )
{
    TXT_1.SetText("");
//    TXT_2.SetText("");
}

function Form_OnConfirmResult( confirm_id, result )
{
    if ((confirm_id == "confirm_down_file") && result)
    {
        ODW_2.ResetODW(); // HwpXMLRead
        ODW_2.SetParam("hash", 0, WGSheet_1.GetGridCellText("Hash_Code", WGSheet_1.GetCurrentRow()));
        ODW_2.SetParam("db_no", 0, "9");
        if ( !ODW_2.Insert("file_download_seq") )
        {
            Form.Alert(ODW_2.GetError());
            return;
        }
        var filepath = ODW_2.GetParam("file_name", 0);
        var src_file = ODW_2.GetParam("FileName", 0)
        FIIO_1.FileDirectDownloadByName(null, filepath, src_file, true);
    }
}

function WGSheet_2_OnCellClick( col_name, col, row, val )
{
    TXT_1.SetText(WGSheet_2.GetGridCellText(col_name, row));
    BTN_1_Click();
}

function Form_OnKeyDown( key_val, key_name, ctrl_key, alt_key, shift_key, ctrl_name, widget_name, panel_name )
{
    if(ctrl_name == "TXT_1" && key_name == "RETURN")
    {
        BTN_1_Click();
    }
}


function BTN_3_Click(  )
{
    if(GRP_2.GetVisible())
    {
        GRP_2.SetVisible(false);
        Form.SetControlPos("GRP_1", 10, 85, 1200, 800);
        BTN_3.SetText("▼");
        LBL_1.SetText("상세검색 펼치기");
    }
    else
    {
        GRP_2.SetVisible(true);
        Form.SetControlPos("GRP_1", 10, 210, 1200, 800);
        BTN_3.SetText("▲");
        LBL_1.SetText("상세검색 접기");
    }
}

function Set_Combo(  )
{
	Category.PopupClearData();
    ODW_4.ResetODW();
    ODW_4.SetParam("query_name", 0, "DB");
    ODW_4.Query("ECMCntr_query_name");
    
    Category.SetRecordData( ODW_4, "ST01" );
}


function WGSheet_1_OnCellClick( col_name, col, row, val )
{
    if(col_name == "PreView")
    {
        Form.DialogParamSet("Hash_Code", WGSheet_1.GetGridCellText("Hash_Code", row));
        Form.ShowDialog("ODS_VIEW100E");
    }
    else if(col_name == "PrintDoc")
    {
        Form.ConfirmAsync("confirm_down_file", "원본 문서를 다운로드 하시겠읍니까 ?", "다운로드 확인");
    }
}