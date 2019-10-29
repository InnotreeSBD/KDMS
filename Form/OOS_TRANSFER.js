

function Form_Load(  )
{
        load_db(); 
}

function load_db()
{
    ODW_1.ResetODW(); 
    if( ! ODW_1.Query("list_storage") )
    {
        Form.Alert( ODW_1.GetError() );
        return; 
    }
    var data = ODW_1.GetParam( "json_result", 0 );
    if(data == "")
        return;
    data = JSON.parse( data );
    WGSheet_1.ClearWidget();
    for(var idx in data)
    {
	    var insert_row = WGSheet_1.InsertRow(-1);
	    var find_obj = data[idx];
	
	    WGSheet_1.SetGridCellText("auth", insert_row, find_obj.auth)
	    WGSheet_1.SetGridCellText("date", insert_row, find_obj.date)
	    WGSheet_1.SetGridCellText("hash", insert_row, find_obj.hash)
	    WGSheet_1.SetGridCellText("title", insert_row, find_obj.title)
	    WGSheet_1.SetGridCellText("filename", insert_row, find_obj.filename)
    }

}


function BTN_1_Click(  )
{
//var data = {
//	"no" : Request.ParamGet("No"),
//	"filename" : Request.ParamGet("Filename"),
//	"title" : Request.ParamGet("Title"),
//	"body" : Request.ParamGet("Body"),
//	"created" : Request.ParamGet("Created"),
//	"hash_code" : Request.ParamGet("Hash_Code")
//};
	var cnt = WGSheet_1.GetRowCount();
	for(var idx = 0; idx < cnt;idx++)
	{
		if(WGSheet_1.GetGridCellText("sel", idx) == 0)
			continue;
	    var Hash_Code = WGSheet_1.GetGridCellText("hash", idx);
	    var title = WGSheet_1.GetGridCellText("title", idx);
	    var filename = WGSheet_1.GetGridCellText("filename", idx);
	    ODW_1.ResetODW(); 
	    ODW_1.SetParam("hash", 0, Hash_Code);
	    ODW_1.SetParam("key_name", 0, "Contents_data");
	    ODW_1.SetParam("db_no", 0, "9");

	    if( ! ODW_1.Query("redis_hget_data") )
	    {
        	Form.Alert( ODW_1.GetError() );
	        return; 
	    }
	    var data = ODW_1.GetParam( "json_result", 0 );
		if(data == "")
			return;
	    var data = JSON.parse(data);
	    ODW_2.ResetODW(); 
	    ODW_2.SetParam("Filename", 0, filename);
	    ODW_2.SetParam("Body", 0, data.field_data.join("\n"));
	    ODW_2.SetParam("Created", 0, Form.GetServerDate("yyyyMMddHHmmss"));
	    ODW_2.SetParam("hash_code", 0, Hash_Code);
	    ODW_2.SetParam("Title", 0, title);
	    if( ! ODW_2.Insert("collect") )
	    {
        	Form.Alert( ODW_2.GetError() );
        	return; 
    	}
	    var ret_data = ODW_2.GetParam( "http_result", 0 );
	    if(ret_data == "")
	        return;
	    ret_data = JSON.parse( ret_data );
	    WGSheet_1.SetGridCellText("ret_str", idx, ret_data["message"]);
    }
}