var Query_Type = "";
var sheet = "";

function Form_Load(  )
{
    Query_type = Form.DialogParamGet("Doc_Type");
    sheet = Form.DialogParamGet("WType");
    SelectDocList(Form.DialogParamGet("Category"));
    WGSheet_1.Toolbar_Add("select", "선택", 1);
    WGSheet_1.Toolbar_Add("cancel2", "닫기", 1);
   
    WGSheet_1.Toolbar_Visible("ok", false);
    WGSheet_1.Toolbar_Visible("cancel", false);
    WGSheet_1.FitColToGridWidth();
}

// -----------------------------------------------------------------------------
function SelectDocList(category)
//
// Purpose : Redis DB에 저장되어 있는 문서 목록 혹은 화면 양식 목록 불러오기
//           문서 목록인 경우 key = category 지정, Doc_Category = "Data"
//           화면 양식인 경우 key = "Item" 지정
//
{
    ODW_1.ResetODW(); 
    ODW_1.SetParam("db_no", 0, "9");
    ODW_1.SetParam("key_name", 0, "meta");
    if(Query_type == "Data")
    {
        ODW_1.SetParam("key", 0, category);
        ODW_1.SetParam("Doc_Category", 0, "Data");
    }
    else
    {
        ODW_1.SetParam("key", 0, "Item");
    }
    if( ! ODW_1.Query("list_docs_dtaq") )
    {
        Form.Alert( ODW_1.GetError() );
        return; 
    }
    var ret = ODW_1.GetParam("json_result", 0);
    data = JSON.parse( ret );
    for(var idx in data)
        data[idx]["No"] = parseInt(idx) + 1;
    WGSheet_1.ClearWidget();
    WGSheet_1.SetJsonData("map", data);
}

function WGSheet_1_OnToolbarClick( btn_id )
{
    if( btn_id == "select")
    {
        Form.DialogParamSet("doc_title", WGSheet_1.GetGridCellText("Title", WGSheet_1.GetCurrentRow()));
        Form.DialogParamSet("doc_hash_code", WGSheet_1.GetGridCellText("Hash_Code", WGSheet_1.GetCurrentRow()));
        Form.DialogParamSet("WType", sheet);
        Form.DialogParamSet("ReturnCount", 1);
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
    Form.DialogParamSet("WType", sheet);
    Form.DialogParamSet("ReturnCount", 1);
    Form.CloseView(1);
}