

function Form_Load(  )
{
//    show_preview("b802cbb11e79ee33fde55fa015b415372df99bb9");
    show_preview(Form.DialogParamGet("Hash_Code"));
}

var old_hash_code = "";

function show_preview(Hash_Code)
{
    ODW_1.ResetODW();
    ODW_1.SetParam("hash", 0, Hash_Code);
    ODW_1.SetParam("key_name", 0, "meta");
    if ( !ODW_1.Query("hget_data") )
    {
        Form.Alert(ODW_1.GetError());
        return;
    }
    var data_src = JSON.parse(ODW_1.GetParam("json_result", 0));
    if(data_src["doc_type"] == "pdf")
    {
    	if(old_hash_code != "")
    	{
	        ODW_1.ResetODW();
	        ODW_1.SetParam("hash", 0, old_hash_code);
	        ODW_1.Delete("del_file");
    	}
        ODW_1.ResetODW();
        ODW_1.SetParam("hash", 0, Hash_Code);
        ODW_1.Insert("down_file");
    	var File_Name = ODW_1.GetParam("json_result", 0);

        pdf_file_name = "/ODS_Storage/" + File_Name;
        MAP_1.SetMapURL("/od_oos/pdfjs/web/viewer.html");
        old_hash_code = Hash_Code;
    	return;
    }

    ODW_1.ResetODW();
    ODW_1.SetParam("hash", 0, Hash_Code);
    ODW_1.SetParam("key_name", 0, "Preview_Html");
    if ( !ODW_1.Query("hget_data") )
    {
        Form.Alert(ODW_1.GetError());
        return;
    }
    var data_src = ODW_1.GetParam("json_result", 0);
    if(data_src == "undefined" || data_src == "" || data_src == "null")
    {
        Form.Alert("미리보기 자료가 저장되지 않았읍니다.");
        return;
    }
    data_src = JSON.parse(data_src);
    ODW_2.ResetODW(); // HwpXMLRead
    ODW_2.Query("get_hwp_ip");
    var server_ip = ODW_2.GetParam("http_result", 0);
    var server_port = ODW_2.GetParam("http_result", 1);
    var server_service = ODW_2.GetParam("http_result", 2);
	MAP_1.SetMapURL("http://"+server_ip+":"+server_port+server_service + data_src["Preview_Html"]);
}
