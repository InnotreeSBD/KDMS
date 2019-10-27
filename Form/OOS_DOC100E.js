
function Form_Load(  )
{
    SelectDocList();
   WGSheet_1.Toolbar_Add("select", "선택", 1);
   WGSheet_1.Toolbar_Add("cancel2", "닫기", 1);
   
   WGSheet_1.Toolbar_Visible("ok", false);
   WGSheet_1.Toolbar_Visible("cancel", false);
   WGSheet_1.FitColToGridWidth();
}

// -----------------------------------------------------------------------------
function SelectDocList()
//
// Purpose : Redis DB에 저장되어 있는 양식 문서 목록 전시
//
{
    ODW_1.ResetODW(); 
    ODW_1.SetParam("key_name", 0, "meta");
    ODW_1.SetParam("key", 0, "Document");
    ODW_1.SetParam("Doc_Category", 0, "Form");
    if( ! ODW_1.Query("list_docs") )
    {
        Form.Alert( ODW_1.GetError() );
        return; 
    }
    var ret = ODW_1.GetParam("json_result", 0);
    data = JSON.parse( ret );
    WGSheet_1.ClearWidget();
    for ( var idx in data )
    {
        var insert_row = WGSheet_1.InsertRow(-1);
        WGSheet_1.SetGridCellText("No", insert_row, parseInt(idx) + 1);
        WGSheet_1.SetGridCellText("Title", insert_row, data[idx]["Title"]);
        WGSheet_1.SetGridCellText("Filename_src", insert_row, data[idx]["Filename"]);
//        WGSheet_1.SetGridCellText("Reg_NM", insert_row, data[idx]["Reg_NM"]);
        WGSheet_1.SetGridCellText("Reg_Date", insert_row, data[idx]["Reg_Date"]);
        WGSheet_1.SetGridCellText("Hash_Code", insert_row, data[idx]["Hash_Code"]);
    }
    WGSheet_1.SortColumn("No", "");
}

function WGSheet_1_OnToolbarClick( btn_id )
{
    if( btn_id == "select")
    {
        Form.DialogParamSet("doc_title", WGSheet_1.GetGridCellText("Title", WGSheet_1.GetCurrentRow()));
        Form.DialogParamSet("doc_hash_code", WGSheet_1.GetGridCellText("Hash_Code", WGSheet_1.GetCurrentRow()));
        Form.DialogParamSet("return_count", 1);
        Form.CloseView(1);
        
    }
    else if( btn_id == "cancel2" )
    {   
        Form.DialogParamSet("return_count", 0);
        Form.CloseView(0);
    }
    
}

function WGSheet_1_OnCellDoubleClick( col_name, col, row, val )
{
    Form.DialogParamSet("doc_title", WGSheet_1.GetGridCellText("Title", WGSheet_1.GetCurrentRow()));
    Form.DialogParamSet("doc_hash_code", WGSheet_1.GetGridCellText("Hash_Code", WGSheet_1.GetCurrentRow()));
    Form.DialogParamSet("return_count", 1);
    Form.CloseView(1);
}