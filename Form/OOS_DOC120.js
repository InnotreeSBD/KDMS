
var g_plcy_id = "";
var file_data = "";
var g_cntr_id = "";
var meta_obj = {};
var file_id = "";
var file_ext = "";
var __recursive_element = [];
var search_engine = "";

function Form_Load(  )
{
    g_plcy_id = Form.DialogParamGet("plcy_id");
    if ( g_plcy_id != "" )
    {
        WSF_1.SetFieldData("plcy_id", g_plcy_id);
        WSF_1.RunQuery();
    }
    else
    {
        WSF_1.SetFieldData("cntr_id", Form.DialogParamGet("cntr_id"));
    }
    WSF_1.SetFieldData("HrNm", Form.GetUserName());
    WSF_1.SetFieldData("FileCategory", Form.DialogParamGet("FileCategory"));
    BTN_Upload.SetEnabled(false);
    ODW_6.ResetODW();
    ODW_6.SetParam("ENV_TITLE", 0, "SEARCH_ENGINE");
    ODW_6.Query("Environment_query_sc");
    search_engine = ODW_6.GetParam("ENV_VALUE", 0);
}

function WSF_1_OnInsertEnd( row_count )
{
    Form.DialogParamSet("ReturnCount", 1);
    
    Form.DialogParamSet("plcy_id", WSF_1.GetFieldData("plcy_id"));
    Form.DialogParamSet("cntr_id", WSF_1.GetFieldData("cntr_id"));
        
    Form.DialogParamSet("FileTitle", meta_obj["title"]);
    Form.DialogParamSet("FileName", meta_obj["file_name_src"]);
    Form.DialogParamSet("ApDt", meta_obj["reg_date"]);
    Form.DialogParamSet("HrNm", meta_obj["reg_nm"]);
    Form.DialogParamSet("Hash_Code", file_id);
    Form.DialogParamSet("FileCategory", WSF_1.GetFieldData("FileCategory"));

    Form.CloseView(1);
}

function WSF_1_OnUpdateEnd( row_count )
{
    Form.DialogParamSet("ReturnCount", 1);
    
    Form.DialogParamSet("plcy_id", WSF_1.GetFieldData("plcy_id"));
    Form.DialogParamSet("cntr_id", WSF_1.GetFieldData("cntr_id"));

    Form.DialogParamSet("FileTitle", meta_obj["title"]);
    Form.DialogParamSet("FileName", meta_obj["file_name_src"]);
    Form.DialogParamSet("ApDt", meta_obj["reg_date"]);
    Form.DialogParamSet("HrNm", meta_obj["reg_nm"]);
    Form.DialogParamSet("Hash_Code", file_id);

    Form.CloseView(1);
}

function FIIO_1_OnSelectChanged( file_count )
{
    if ( file_count > 1 )
    {
        Form.Alert("파일을 하나만 선택하여주십시오.");
    }
    else if ( file_count == 1 )
    {
        var file_path = FIIO_1.GetSelectFile(0);
        var file_name = FIIO_1.PathFileName(file_path);
        file_data = FIIO_1.ReadFileBase64(file_path);
        
        file_ext = FIIO_1.PathExtName(file_path);
        
        TXT_FilePath.SetText(file_path);
        TXT_FileData.SetText(file_data);
        
        WSF_1.SetFieldData("FileName", file_name);
        BTN_Upload.SetEnabled(true);
    }
}

function Send_to_Doc_Converter(filename)
{
    var file_ext = filename.substring(filename.indexOf(".") + 1);
    file_id = sha1(filename);
    Convert_To_Text(file_ext.substr(0,3), filename, WSF_1.GetFieldData("FileTitle"), WSF_1.GetFieldData("FileName"));
    Convert_To_Html(file_ext.substr(0,3), filename)
}

function del_redis_data(HashCode)
{
    ODW_2.ResetODW(); 
    ODW_2.SetParam("hash", 0, HashCode);
    if( ! ODW_2.Delete("del_data") )
    {
        Form.Alert( ODW_2.GetError() );
        return; 
    }
}

function write_data(db_no, hash, key_name, val_str )
{
    ODW_2.ResetODW(); 
    ODW_2.SetParam("hash", 0,  hash);
    ODW_2.SetParam("key_name", 0,  key_name);
    ODW_2.SetParam("val_str", 0, val_str);
    if( ! ODW_2.Insert("hset_data") )
    {
        Form.Alert( ODW_2.GetError() );
        return false; 
    }
    return true;
}


function BTN_Select_Click(  )
{
    FIIO_1.SetExtName("custom:All images (*.hwp, *.doc, *.xls, *.xlsx) | *.hwp; *.doc; *.xls; *.xlsx;");
    FIIO_1.SelectOpenFile();
}

function BTN_Upload_Click(  )
{
    if ( g_plcy_id == "" )
    {
        ODW_2.ResetODW(); 
        ODW_2.SetParam("FileData", 0, TXT_FileData.GetText());
        ODW_2.SetParam("FileName", 0, WSF_1.GetFieldData("FileName"));
        ODW_2.SetParam("FileExt", 0, file_ext);
        ODW_2.SetParam("FileTitle", 0, WSF_1.GetFieldData("FileTitle"));
        if( ! ODW_2.Insert("file_upload_seq") )
        {
            Form.Alert( ODW_2.GetError() );
            return; 
        }

        WSF_1.SetFieldData("FileNameNo", ODW_2.GetParam("file_name", 0));
        Send_to_Doc_Converter(WSF_1.GetFieldData("FileNameNo"));
        WSF_1.SetFieldData("Hash_Code", file_id);
        WSF_1.SetFieldData("HrNm", Form.GetUserName());
        WSF_1.RunInsert();
    }
    else
    {
        WSF_1.RunUpdate();
    }
}

function BTN_Cancel_Click(  )
{
    Form.DialogParamSet("ReturnCount", 0);
    Form.CloseView(1);
}

function write_meta(title, filename, src_file, category, ext, doc_cate)
{
	var file_id = sha1(filename);
    meta_obj["title"] = title;
    meta_obj["file_name"] = filename;
    meta_obj["file_name_src"] = src_file;
    meta_obj["reg_date"] = Form.GetServerDate("yyyy-MM-dd HH:mm:ss");
    meta_obj["reg_nm"] = Form.GetUserName();
    meta_obj["category"] = category;
    meta_obj["doc_type"] = ext;
    meta_obj["doc_cate"] = doc_cate;
    if(write_data("9", file_id, "meta", JSON.stringify(meta_obj)) == false)
        return false;
    else
        return true;
}

function Convert_To_Text(ext, filename, title, src_file)
{
    if(write_meta(title, filename, src_file, "Storage", ext, "Data") == false)
        return;
	var file_id = sha1(filename);

    if(write_data("9", file_id, "raw", file_data) == false)
    {
        del_redis_data(file_id);
        return;
    }
    ODW_1.ResetODW();
    ODW_1.SetParam("filename", 0, filename);
    if(ext == "hwp")
        ODW_1.SetParam("filter", 0, "hwp-text");
    else if(ext == "doc")
        ODW_1.SetParam("filter", 0, "doc-text");
    else if(ext == "xls" || ext == "cell")
        ODW_1.SetParam("filter", 0, "xls-text");
    else if(ext == "ppt" || ext == "show")
        ODW_1.SetParam("filter", 0, "ppt-text");
    else
        ODW_1.SetParam("filter", 0, "doc-text");
    if(!ODW_1.Query("HwpTxtConv") )
    {
        Form.Alert(ODW_1.GetError());
        return;
    }
    var Status = ODW_1.GetParam( "response" , 0);
    if(Status != 0)
    {
    	Form.Alert("Error :\n"+ODW_1.GetParam( "http_result" , 0));
        del_redis_data(file_id);
    	return;
    }
    var CellPreview = ODW_1.GetParam( "http_result" , 0);
    if(CellPreview == "")
    {
        Form.Alert("파일 변환이 잘못되었읍니다.");
        del_redis_data(file_id);
        return;
    }
    var item_data = {};
    item_data["Type"] = "cell";
    item_data["field_data"] = [];
    item_data["field_data"].push(CellPreview);
    if(write_data("9", file_id, "Contents_data", JSON.stringify(item_data)) == false)
    {
        del_redis_data(file_id);
        return;
    }
    if(search_engine == "solr")
    {
	    ODW_4.ResetODW();
	    ODW_4.SetParam("auth", 0, Form.GetUserName());
	    ODW_4.SetParam("contents", 0, CellPreview);
	    ODW_4.SetParam("date", 0, Form.GetServerDate("yyyy-MM-dd HH:mm:ss"));
	    ODW_4.SetParam("hash_code", 0, file_id);
	    ODW_4.SetParam("title", 0, title);
	    ODW_4.SetParam("category", 0, WSF_1.GetFieldData("FileCategory"));
	    if(!ODW_4.Insert("Add_Document") )
	    {
        	Form.Alert("인덱싱 파일 생성이 잘못되었읍니다.");
	        return;
	    }
	}
	else if(search_engine == "doub")
	{
	    ODW_5.ResetODW(); 
	    ODW_5.SetParam("Filename", 0, filename);
	    ODW_5.SetParam("Body", 0, item_data.field_data.join("\n"));
	    ODW_5.SetParam("Created", 0, Form.GetServerDate("yyyyMMddHHmmss"));
	    ODW_5.SetParam("hash_code", 0, file_id);
	    ODW_5.SetParam("Title", 0, title);
	    if( ! ODW_5.Insert("collect") )
	    {
        	Form.Alert( ODW_5.GetError() );
        	return; 
    	}
	    meta_obj["doc_id"] = ODW_5.GetParam( "No", 0 );
	    write_data("9", file_id, "meta", JSON.stringify(meta_obj));
	    var ret_data = ODW_5.GetParam( "http_result", 0 );
	}
}

function Convert_To_Html(ext, filename)
{
	var file_id = sha1(filename);
    ODW_1.ResetODW();
    ODW_1.SetParam("filename", 0, filename);
    if(ext == "hwp")
        ODW_1.SetParam("filter", 0, "hwp-html");
    else if(ext == "doc")
        ODW_1.SetParam("filter", 0, "doc-html");
    else if(ext == "xls" || ext == "cell")
        ODW_1.SetParam("filter", 0, "xls-html");
    else if(ext == "ppt" || ext == "show")
        ODW_1.SetParam("filter", 0, "ppt-html");
    else
        ODW_1.SetParam("filter", 0, "doc-html");
    if(!ODW_1.Query("HwpXMLPreview") )
    {
        Form.Alert(ODW_1.GetError());
        del_redis_data(file_id);
        return;
    }
    var file_path = ODW_1.GetParam( "http_result" , 0);
    var data_object = {};
    data_object["Preview_Html"] = file_path;
    if(write_data("9", file_id, "Preview_Html", JSON.stringify(data_object)) == false)
    {
        del_redis_data(file_id);
        return;
    }
}
