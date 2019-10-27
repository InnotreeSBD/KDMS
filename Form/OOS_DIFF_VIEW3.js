function Form_Load(  )
{
	TXT_1.SetText(Get_File_name(Form.DialogParamGet("Source_Hash")));
	TXT_2.SetText(Get_File_name(Form.DialogParamGet("Target_Hash")));
	Load_File(Form.DialogParamGet("Source_Hash"), Form.DialogParamGet("Target_Hash"));
}

function Load_File(src_hash, tgt_hash)
//
// Purpose : 2개의 문서를 Redis DB에서 가져와서, 문서 내용 비교 수행
//
{
	var outer1 = Get_File_data(src_hash);
	var outer2 = Get_File_data(tgt_hash);

	var result = diffline( outer1, outer2);
    WGSheet_1.ClearWidget();
    var result_old = result[0].split("\n");
    var result_new = result[1].split("\n");
    var len = result_old.length;
    var no = 0;
    for ( var idx = 0; idx < len; idx++)
    {
    	result_old[idx] = result_old[idx].replaceAll("\r", "");
    	result_new[idx] = result_new[idx].replaceAll("\r", "");
    	if((result_old[idx] != result_new[idx]) && !((result_old[idx] == "") && (result_new[idx] == "")))
    	{
	        var insert_row = WGSheet_1.InsertRow(no);
	        WGSheet_1.SetGridCellText("No", insert_row, no + 1);
	        WGSheet_1.SetGridCellText("From_Text", insert_row, result_old[idx]);
	        WGSheet_1.SetGridCellText("To_Text", insert_row, result_new[idx]);
	        no++;
	    }
    }
	WGSheet_1.MultiLineRecalcAll();
}

function Get_File_name(Hash_Code)
//
// Purpose : Redis DB에 저장되어 있는 meta 정보를 호출하여, filename을 리턴
//
{
	ODW_1.ResetODW();
	ODW_1.SetParam("hash", 0, Hash_Code);
	ODW_1.SetParam("key_name", 0, "meta");
	ODW_1.SetParam("db_no", 0, "9");
    if( ! ODW_1.Query("redis_hget_data") )
    {
        Form.Alert( ODW_1.GetError() );
        return null; 
    }
    var data = JSON.parse(ODW_1.GetParam( "json_result", 0 ));
    
    return data["file_name_src"];
}

function Get_File_data(Hash_Code)
//
// Purpose : Redis DB에 저장되어 있는 Contents 정보를 호출하여 리턴
//
{
	ODW_1.ResetODW();
	ODW_1.SetParam("hash", 0, Hash_Code);
	ODW_1.SetParam("key_name", 0, "Contents_data");
	ODW_1.SetParam("db_no", 0, "9");
    if( ! ODW_1.Query("redis_hget_data") )
    {
        Form.Alert( ODW_1.GetError() );
        return null; 
    }
    var data = JSON.parse(ODW_1.GetParam( "json_result", 0 ));
    
    return data["field_data"].join("\n");
}
