

function Form_Load(  )
{
    DATE_from.AddYears(-1);
    set_DownloadContextMenu();
    ODW_3.ResetODW();
    ODW_3.Query("get_user");
    var cnt = ODW_3.GetCount();
    var ret = [];
    for(var idx = 0; idx < cnt; idx++)
    {
    	COD_1.PopupAddRow(0, -1);
	    COD_1.PopupSetCell(0, 0, ODW_3.GetParam("HrNm", idx));
	    COD_1.PopupSetCell(1, 0, ODW_3.GetParam("HrNm", idx));
	}
//	var odw_temp = Form.GetNewODW("");
//	odw_temp.BatchQueryInit();
//	odw_temp.BatchQueryAdd("get_user");
//	if( !odw_temp.BatchQueryRun() )
//		Form.Alert( odw_temp.GetError() );
//
//	COD_1.SetRecordData(odw_temp, "get_user");
//
//	COD_1.PopupAddRow(0, 0);
//	COD_1.PopupSetCell(1, 0, "");	
////	COD_1.SetRecordData(odw_temp, "get_user");
}


function BTN_2_Click(  )
{
    TXT_1.SetText("");
    TXT_2.SetText("");
    TXT_3.SetText("");
    TXT_4.SetText("");
}

function WGSheet_1_OnMenuPrepare( menu )
{
    menu.RemoveMenuItem("excelexport"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("filter"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("clearsort"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("copy"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("paste"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    
}

function set_DownloadContextMenu ()
{
    WGSheet_1.AddGridMenu("Menu0", "문서 보기");
//    WGSheet_1.AddGridMenu("Menu1", "문서 비교");
    WGSheet_1.AddGridMenu("Menu2", "문서 다운로드");
}


function WGSheet_1_OnMenuClick( menu_code, menu_label, col_name, col, row, cell_val )
{
    switch(menu_code)
    {
        case "Menu0" :
            Form.DialogParamSet("Hash_Code", WGSheet_1.GetGridCellText("Hash_Code", WGSheet_1.GetCurrentRow()));
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


function BTN_1_Click(  )
{
	if(TXT_1.GetText() == "")
	{
            Form.Alert("검색어가 입력되지 않았읍니다.");
            return;
	}
    var search_obj = {};
    search_obj["ST_Date"] = DATE_from.GetValue();
    DATE_to.AddDays(1);
    search_obj["ED_Date"] = DATE_to.GetValue();
    search_obj["Text_val"] = TXT_1.GetText();
    search_obj["Title"] = TXT_2.GetText();
//    search_obj["Filename"] = TXT_3.GetText();
    search_obj["ApUserID"] = TXT_4.GetText();

        ODW_1.ResetODW(); 
        ODW_1.SetParam("search_str", 0, JSON.stringify(search_obj));
        if( ! ODW_1.Query("query_simple") )
        {
            Form.Alert( ODW_1.GetError() );
            return; 
        }
        var data = ODW_1.GetParam( "http_response", 0 );
        if(data == "")
            return;
        data = JSON.parse( data );
        WGSheet_1.ClearWidget();
        if(data.length > 0)
        {
            for ( var idx in data )
            {
                var cur_row = WGSheet_1.InsertRow(-1);
//                WGSheet_1.SetGridCellText("No", cur_row, parseInt(idx)+1);
                WGSheet_1.SetGridCellText("FileTitle", cur_row, data[idx]["FileTitle"]);
                WGSheet_1.SetGridCellText("FileName", cur_row, data[idx]["FileName"]);
                WGSheet_1.SetGridCellText("ApDt", cur_row, data[idx]["ApDt"]);
                WGSheet_1.SetGridCellText("ApUserID", cur_row, data[idx]["ApUserID"]);
                WGSheet_1.SetGridCellText("Hash_Code", cur_row, data[idx]["Hash_Code"]);
                WGSheet_1.SetGridCellText("id", cur_row, data[idx]["id"]);
            }
            WGSheet_1.SortColumn("ApDt", false);
        }
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

function COD_1_SelectChanged(  )
{
    TXT_4.SetText(COD_1.GetText());
//    var user = COD_1.GetText();
}