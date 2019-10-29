var prefix = "__Encode";
var contentsXML = "";
var file_ext;
var file_id = "";
var field = [];
var file_data = "";

function Form_Load(  )
{
    Get_list_From_DB();
}

function BTN_SelectFile_Click(  )
{
    FIIO_1.SetExtName("custom:All images (*.hwp, *.doc, *.xls, *.xlsx) | *.hwp; *.doc; *.xls; *.xlsx;");
    FIIO_1.SelectOpenFile();
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
        
        TXT_FileName_src.SetText(file_name);
        // SetEnabled(true)
        TXT_FileName.SetEnabled(true);
        TXT_FileTitle.SetEnabled(true);
        BTN_UploadFile.SetEnabled(true);
    }
    
}

function BTN_UploadFile_Click(  )
{
    ODW_2.ResetODW(); 
    ODW_2.SetParam("FileData", 0, TXT_FileData.GetText());
    ODW_2.SetParam("FileName", 0, TXT_FileName.GetText());
    ODW_2.SetParam("FileExt", 0, file_ext);
    ODW_2.SetParam("FileTitle", 0, WGSheet_1.GetFieldData("query", "FileTitle"));
    if( ! ODW_2.Insert("file_upload_seq") )
    {
        Form.Alert( ODW_2.GetError() );
        return; 
    }
    
    TXT_FileName.SetText(ODW_2.GetParam("file_name", 0));
//    Send_to_Doc_Converter(TXT_FileName.GetText());
    Send_to_Doc_Converter(ODW_2.GetParam("file_name", 0));
}

function Get_list_From_DB()
//
// Purpose : Redis DB에 저장되어 있는 문서의 목록 추출
//
{
    ODW_2.ResetODW();
    ODW_2.SetParam("key_name", 0, "meta");
    ODW_2.SetParam("key", 0, "Document");
    ODW_2.SetParam("Doc_Category", 0, "Form");
    if( ! ODW_2.Query("list_docs") )
    {
        Form.Alert( ODW_2.GetError() );
        return; 
    }
    var ret = ODW_2.GetParam("json_result", 0);
    data = JSON.parse( ret );
    WGSheet_1.ClearWidget();
    for ( var idx in data )
    {
        var insert_row = WGSheet_1.InsertRow(-1);
        WGSheet_1.SetGridCellText("No", insert_row, parseInt(idx) + 1);
        WGSheet_1.SetGridCellText("Pal_Title", insert_row, data[idx]["Title"]);
        WGSheet_1.SetGridCellText("Filename", insert_row, data[idx]["Filename"]);
        WGSheet_1.SetGridCellText("Reg_NM", insert_row, data[idx]["Reg_NM"]);
        WGSheet_1.SetGridCellText("Reg_Date", insert_row, data[idx]["Reg_Date"]);
        WGSheet_1.SetGridCellText("Hash_Code", insert_row, data[idx]["Hash_Code"]);
    }
//    WGSheet_1.SortColumn("No", "");
    if(data.length > 0)
    	WGSheet_1_OnSelectRecordChanged("", "", 0);
}

function Send_to_Doc_Converter(filename)
//
// Purpose : 서버에 업로드된 문서를 변환하기 위하여 각각의 문서 변환기 호출
//
{
    var file_ext = filename.substring(filename.indexOf(".") + 1);
    var file_id = sha1(filename);
    if(file_ext.indexOf("hwp") > -1)
    {
        ODW_3.ResetODW();
        ODW_3.SetParam("filename", 0, filename);
        if(!ODW_3.Query("HwpXMLParser") )
        {
            Form.Alert(ODW_3.GetError());
            return;
        }
        var data_src = ODW_3.GetParam("hwp_section", 0);
        var preview_src = ODW_3.GetParam("hwp_preview", 0);

        var meta_obj = {};
        meta_obj["title"] = TXT_FileTitle.GetText();
        meta_obj["category"] = "Document";
        meta_obj["doc_type"] = "hwp";
        meta_obj["doc_cate"] = "Form";
        meta_obj["file_name"] = TXT_FileName.GetText();
        meta_obj["file_name_src"] = TXT_FileName_src.GetText();
        meta_obj["reg_date"] = Form.GetServerDate("yyyy-MM-dd HH:mm:ss");
        meta_obj["reg_nm"] = Form.GetUserName();
 
        if(write_data("9", file_id, "meta", JSON.stringify(meta_obj)) == false)
            return;

        var dom = parseXML(data_src);

        var hp_run = getElementByNodeName(dom.children[0], "hp:ctrl");
        var item_data = {};
        item_data["Type"] = "hwp";
        item_data["field_data"] = hp_run;
        if(write_data("9", file_id, "item_data", JSON.stringify(item_data)) == false)
        {
            del_redis_data(file_id);
            return;
        }

        if(write_data("9", file_id, "raw", prefix + Form.Base64Encode(data_src)) == false)
        {
            del_redis_data(file_id);
            return;
        }
        if(write_data("9", file_id, "Preview", preview_src) == false)
        {
            del_redis_data(file_id);
            return;
        }
        ODW_3.ResetODW();
        ODW_3.SetParam("filename", 0, filename);
        if(!ODW_3.Query("HwpXMLPreview") )
        {
            Form.Alert(ODW_3.GetError());
            del_redis_data(file_id);
            return;
        }
        var file_path = ODW_3.GetParam( "http_result" , 0);
        data_object["Preview_Html"] = file_path;
        if(write_data("9", file_id, "Preview_Html", file_path) == false)
        {
            del_redis_data(file_id);
            return;
        }
        Get_list_From_DB();
    }
    else if(file_ext.indexOf("doc") > -1)
    {
        ODW_1.ResetODW();
        ODW_1.SetParam("doc_ext",0,"docx");
        ODW_1.SetParam("doc_filename",0,filename);
        ODW_1.Query("call_api");        

        var http_result = JSON.parse(ODW_1.GetParam("http_result", 0));

        if(typeof(http_result.document) == "undefined")
        {
            Form.Alert("Data Convert Error : " + http_result.errorCode + "\nMessage : " + http_result.message);
            return;
        }
        var data_src = http_result.document;

        var meta_obj = {};
        meta_obj["title"] = TXT_FileTitle.GetText();
        meta_obj["file_name"] = TXT_FileName.GetText();
        meta_obj["file_name_src"] = TXT_FileName_src.GetText();
        meta_obj["reg_date"] = Form.GetServerDate("yyyy-MM-dd HH:mm:ss");
        meta_obj["reg_nm"] = Form.GetUserName();
        meta_obj["category"] = "Document";
        meta_obj["doc_cate"] = "Form";
        meta_obj["doc_type"] = "doc";
        file_id = sha1(TXT_FileName.GetText());

        if(write_data("9", file_id, "meta", JSON.stringify(meta_obj)) == false)
            return;
        PreProcessor(data_src);
        if(write_data("9", file_id, "raw", prefix + Form.Base64Encode(JSON.stringify(data_src))) == false)
//        if(write_data("9", file_id, "raw", file_data) == false)
        {
            del_redis_data(file_id);
            return;
        }
        if(write_data("9", file_id, "doc_file", file_data) == false)
        {
            del_redis_data(file_id);
            return;
        }
        var outer = get_outer_text(data_src);
        if(write_data("9", file_id, "Preview", outer) == false)
        {
            del_redis_data(file_id);
            return;
        }
        var item_data = {};
        item_data["Type"] = "doc";
        item_data["field_data"] = field;
        if(write_data("9", file_id, "item_data", JSON.stringify(item_data)) == false)
        {
            return;
        }
        ODW_3.ResetODW();
        ODW_3.SetParam("filename", 0, filename);
        ODW_3.SetParam("filter", 0, "doc-html");
 		if(!ODW_3.Query("HwpXMLPreview") )
        {
            Form.Alert(ODW_3.GetError());
            del_redis_data(file_id);
            return;
        }
        var file_path = ODW_3.GetParam( "http_result" , 0);
        data_object["Preview_Html"] = file_path;
        if(write_data("9", file_id, "Preview_Html", file_path) == false)
        {
            del_redis_data(file_id);
            return;
        }
        Get_list_From_DB();
    }
    else if(file_ext.indexOf("xls") > -1)
    {
        file_id = sha1(filename);
        ODW_1.ResetODW();
        ODW_1.SetParam("doc_ext",0,"xlsx");
        ODW_1.SetParam("doc_upload_mode",0,"local");
        ODW_1.SetParam("output_mode",0,"json_data");
        ODW_1.SetParam("output_type",0,"json");
        ODW_1.SetParam("output_select",0,"sheet1");
        ODW_1.SetParam("doc_filename",0,filename);
        ODW_1.Query("call_api");        

        var http_result = JSON.parse(ODW_1.GetParam("http_result", 0));

        if(typeof(http_result.sheet1) == "undefined")
        {
            Form.Alert("Data Convert Error : " + http_result.errorCode + "\nMessage : " + http_result.message);
            return;
        }
        var data_src = http_result.sheet1;

        var meta_obj = {};
        meta_obj["title"] = TXT_FileTitle.GetText();
        meta_obj["file_name"] = TXT_FileName.GetText();
        meta_obj["file_name_src"] = TXT_FileName_src.GetText();
        meta_obj["reg_date"] = Form.GetServerDate("yyyy-MM-dd HH:mm:ss");
        meta_obj["reg_nm"] = Form.GetUserName();
        meta_obj["category"] = "Document";
        meta_obj["doc_cate"] = "Form";
        meta_obj["doc_type"] = "xls";
        file_id = sha1(TXT_FileName.GetText());

        if(write_data("9", file_id, "meta", JSON.stringify(meta_obj)) == false)
            return;
        Get_list_From_DB();
return;
        PreProcessor(data_src);
        if(write_data("9", file_id, "comumn", prefix + Form.Base64Encode(JSON.stringify(data_src))) == false)
          return;
        var outer = get_outer_text(data_src);
        if(write_data("9", file_id, "Preview", outer) == false)
            return;
        if(write_data("9", file_id, "item_data", JSON.stringify(field)) == false)
            return;
    }
}

function Get_Hwp_Data( type, key_name )
//
// Purpose : Redis DB에서 한글 문서 자료 불러오기
//
{
    ODW_2.ResetODW(); 
    ODW_2.SetParam("hash", 0,  key_name);
//    ODW_2.SetParam("db_no", 0, "9");
    if(type == "XML")
        ODW_2.SetParam("key_name", 0,  "raw");
    else if(type == "Prev")
        ODW_2.SetParam("key_name", 0,  "Preview");
    else if(type == "Para")
        ODW_2.SetParam("key_name", 0,  "style_data");
    else
        ODW_2.SetParam("key_name", 0,  "item_data");
    if( ! ODW_2.Query("hget_data") )
    {
        Form.Alert( ODW_2.GetError() );
        return; 
    }
    var ret = ODW_2.GetParam("json_result", 0);
    return ret;
}

function getElementByNodeName (object, tag)
//
// Purpose : 한글 문서 XML 내용에서 한글 누름틀 Object만 추출
//
{
    recursive_element = [];
    if(tag == "" || tag == null)
    {
        count_id = 0;
    }
    getElementByNodeName_rec(recursive_element, object, tag);
    for(var idx in recursive_element)
        recursive_element[idx]["Text"] = recursive_element[idx]["Text"].join("\n");
    return recursive_element;
}

function getElementByNodeName_rec (recursive_element, object, tag)
//
// Purpose : 한글문서 XML 내용에서 한글 누름틀 Object만 추출
//
{
    for(var idx = 0; idx < object.childElementCount; idx++)
    {
        if(object.children[idx].nodeName == "hp:fieldBegin")
        {
            var json_obj = xmlToJson(object.children[idx]);
            analysys_hwp("start_field", json_obj["@name"]);
        }
        else if(object.children[idx].nodeName == "hp:fieldEnd")
        {
            analysys_hwp("end_field", "");
        }
        else if((object.children[idx].nodeName == "hp:t") && on_field)
        {
            analysys_hwp("append_field", object.children[idx].textContent);
        }
        getElementByNodeName_rec(recursive_element, object.children[idx], tag);
    }
}

var ret_obj = {};
var recursive_element = [];
var on_field = false;

function analysys_hwp(cmd, value)
//
// Purpose : 한글 문서의 누름틀 분석
//
{
    switch (cmd)
    {
        case "start_field" :
            ret_obj = {};
            ret_obj["title"] = value;
            ret_obj["Text"] = [];
            on_field = true;
            break;
        case "end_field" :
            recursive_element.push(ret_obj);
            on_field = false;
            break;
        case "append_field" :
            ret_obj["Text"].push(value);
            break;
    }
}


function WGSheet_1_OnMenuPrepare( menu )
{
//    menu.CleareMenuItem();
    menu.RemoveMenuItem("excelexport"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("filter"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("clearsort"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("copy"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("paste"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
}

var data_object = {};
var gid = 0;

function del_redis_data(HashCode)
//
// Purpose : Redis DB에 저장되어 있는 자료 삭제
//
{
    ODW_2.ResetODW(); 
    ODW_2.SetParam("hash", 0, HashCode);
    if( ! ODW_2.Delete("del_data") )
    {
        Form.Alert( ODW_2.GetError() );
        return; 
    }
}

function BTN_DeleteFile_Click(  )
{
    var HashCode = WGSheet_1.GetGridCellText("Hash_Code", WGSheet_1.GetCurrentRow());
    del_redis_data(HashCode);
    Get_list_From_DB();
}

function write_data(db_no, hash, key_name, val_str )
//
// Purpose : Redis DB에 자료 저장
//
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

function get_outer_text (content)
//
// Purpose : DOC 문서의 XML 내용에서 문자열만 추출
//
{
    var contentsXML = "";
    var wt = this.__getElementByNodeName(content, "w:t");
    for(var idx in wt)
    {
        if(typeof(wt[idx]["children"]) == "object")
            contentsXML = contentsXML + wt[idx]["children"][0].text;
    }
    return contentsXML;
}

function get_outer_text_excel (content)
//
// Purpose : XLS 문서의 XML 내용에서 문자열만 추출
//
{
    var contentsXML = "";
    var wt = this.__getElementByNodeName(content, "column");
    for(var idx in wt)
    {
        if(typeof(wt[idx]["children"]) == "object")
        {
            if(wt[idx]["children"].length == 1)
                contentsXML = contentsXML + wt[idx]["children"][0]["children"][0].text;
            else if(wt[idx]["children"].length == 2)
            {
            //    Children 0 => Function
            //    Children 1 => Value
            if(typeof(wt[idx]["children"][0]["children"]) == "object")
                contentsXML = contentsXML + wt[idx]["children"][0]["children"][0].text;
            else if(typeof(wt[idx]["children"][1]["children"]) == "object")
                contentsXML = contentsXML + wt[idx]["children"][1]["children"][0].text;
            }
        }
    }
    return contentsXML;
}

function PreProcessor(obj)
//
// Purpose : DOC 문서의 XML 내용에서 필드 추출하기 위한 선 처리 과정 
//           "$필드화면이름_필드이름//map이름$" 형태로 만들기 위한 선처리
//           선처리가 필요한 사유는 DOC문서의 경우 사용자의 입력하는 순서에 따라 여러개의 Object로 분리됨
//
{
    field = [];
    var field_data = {};
    var wt = this.__getElementByNodeName(obj, "w:t");
    var wt_prefix = [];
    wt_prefix_remove = new Array;
    wt_first = true;
    var _start_flag = 0;
    var _str = "";
    g_gid_list = new Array;

    for(var i = 0 ; i < wt.length ; i++ )
    {
        if(typeof(wt[i]["children"]) != "undefined")
        {
            if( wt[i]["children"][0].text.indexOf("$$$") > -1)
            {
                wt[i]["children"][0].text = wt[i]["children"][0].text.replace("$$$", "");
            }
            // $가 없음
            if( wt[i]["children"][0].text.indexOf("$") == -1 )
            {
                // 시작 $를 찾은상태
                if( _start_flag != 0 )
                {
                    g_gid_list.push(wt[i]["children"][0].gid);
                    _str = _str + wt[i]["children"][0].text;
                    wt_prefix_remove.push(wt[i]["children"]["gid"])
                    wt[i]["children"][0].text = "";
                }
                else
                {
                    wt_prefix.push(wt[i]);
                }
            }
            else // $가 있음
            {
                _str = _str + wt[i]["children"][0].text;
                // 시작 $를 찾지 않은 상태
                if( _start_flag == 0 )
                {
                    // $가 정상적으로 묶여있을때
                    if( Form.SubString(wt[i]["children"][0].text,1, wt[i]["children"][0].text.length).indexOf("$") > -1 ) 
                    {
                        wt[i]["children"][0].text = _str;
                        wt_prefix.push(wt[i]);
                        _str="";
                    }
                    // $가 정상적으로 묶여있지 않을때
                    else // 시작
                    {
                        _start_flag = i;
                    }
                }
                else // 닫는 $
                {
                    wt[_start_flag]["children"][0].text = _str;
                    wt[i]["children"][0].text = "";
                    wt_prefix.push(wt[_start_flag]);
                    wt_prefix_remove.push(wt[i]["children"]["gid"]);
                    _start_flag = 0;
                    _str="";
                }
            }
        }
    }
    for( var i = 0 ; i < wt_prefix.length ; i++ )
    {
        if(
            (wt_prefix[i]["children"][0].text.length > 2) &&
            (wt_prefix[i]["children"][0].text[0] == "$") &&
            (wt_prefix[i]["children"][0].text[wt_prefix[i]["children"][0].text.length - 1] == "$")
            )
        {
            var text_value = wt_prefix[i]["children"][0]["text"];
            var label_check = text_value.substr(1, text_value.length - 2);
            field_data = {};
            if( label_check.indexOf("//") > -1 )
            {
                var temp1 = label_check.split("//");
                var temp2 = temp1[0].split("__");
                if(temp2[1].length != 0)
                    wt_prefix[i]["map_name"] = temp2[1];
                if(temp1[1].length != 0)
                    wt_prefix[i]["search_name"] = temp1[1];
                if(temp2[0].length != 0)
                    wt_prefix[i]["children"][0]["text"] = temp2[0];
                field_data["gid"] = wt_prefix[i]["gid"];
                field_data["map_name"] = temp2[1];
                field_data["search_name"] = temp1[1];
                field_data["label"] = temp2[0];
                field.push(field_data);
            }
            else if(label_check.indexOf("__") > -1 )
            {
                var temp = label_check.split("__");
                if(temp[1].length != 0)
                    wt_prefix[i]["map_name"] = temp[1];
                if(temp[0].length != 0)
                    wt_prefix[i]["children"][0]["text"] = temp[0];
                field_data["gid"] = wt_prefix[i]["gid"];
                field_data["map_name"] = temp[1];
                field_data["label"] = temp[0];
                field.push(field_data);
            }
        }
    }
}

function __getElementByNodeName (object, tag)
//
// Purpose : tag로 전달받은 object들의 array를 리턴
//
{
    __recursive_element = [];
    if(tag == "" || tag == null)
    {
        this.__count_id = 0;
    }
    this.__getElementByNodeName_rec(object, tag);
    return __recursive_element;
}

function __getElementByNodeName_rec (object, tag)
//
// Purpose : 문서 내용 json object에서 tag에 해당하는 object만 선택
//
{
    if(typeof(object) == "string" || typeof(object) == "number" || typeof(object) == "undefined")
    {
        return;
    }

    if((object["name"] == tag) || (object["nodeName"] == tag))
    {
        if(tag == "Row")
            row_gid_array.push(object["gid"])
        else if(tag == "Data")
        {
            if( (row_gid_array.length-1) - 1 > -1 )
                object["grid_gid"] = row_gid_array[(row_gid_array.length-1) - 1]; // yhlim
            if( start_row != null )
                object["data_start_row"] = start_row;
        }
        __recursive_element.push(object);
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
            this.__getElementByNodeName_rec(object[item], tag);
        }
    }
}


function WGSheet_1_OnSelectChanged( col_name, col, row )
{

}

function WGSheet_1_OnUpdateEnd( row )
{
    ODW_2.ResetODW(); // HwpXMLRead
    var Hash_Code = WGSheet_1.GetGridCellText("Hash_Code", row);
    ODW_2.SetParam("hash", 0, WGSheet_1.GetGridCellText("Hash_Code", row));
    ODW_2.SetParam("key_name", 0, "Preview_Html");
    if ( !ODW_2.Query("hget_data") )
    {
        Form.Alert(ODW_2.GetError());
        return;
    }
    var data_src = ODW_2.GetParam("json_result", 0);
    if(data_src == "null" || data_src == "")
    {
        Form.Alert("미리보기 자료가 저장되지 않았읍니다.");
        return;
    }
    ODW_2.ResetODW(); // HwpXMLRead
    ODW_2.Query("get_hwp_ip");
    var server_ip = ODW_2.GetParam("json_result", 0);
    var server_port = ODW_2.GetParam("json_result", 1);
    var server_service = ODW_2.GetParam("json_result", 2);
	MAP_1.SetMapURL("http://localhost:8080/hermes/resource/store/" + data_src);
}

function WGSheet_1_OnUpdateAllEnd( row )
{
    
}



function WGSheet_1_OnInsertEnd( row )
{
    
}

function WGSheet_1_OnSelectRecordChanged( col_name, col, row )
{
    ODW_2.ResetODW(); // HwpXMLRead
    var Hash_Code = WGSheet_1.GetGridCellText("Hash_Code", row);
    if(Hash_Code == "")
    	return;
    ODW_2.SetParam("hash", 0, WGSheet_1.GetGridCellText("Hash_Code", row));
    ODW_2.SetParam("key_name", 0, "Preview_Html");
    if ( !ODW_2.Query("hget_data") )
    {
        Form.Alert(ODW_2.GetError());
        return;
    }
    var data_src = ODW_2.GetParam("json_result", 0);
    if(data_src == "null" || data_src == "")
    {
        Form.Alert("미리보기 자료가 저장되지 않았읍니다.");
        return;
    }
    ODW_3.ResetODW(); // HwpXMLRead
    ODW_3.Query("get_hwp_ip");
    var server_ip = ODW_3.GetParam("http_result", 0);
    var server_port = ODW_3.GetParam("http_result", 1);
    var server_service = ODW_3.GetParam("http_result", 2);
	MAP_1.SetMapURL("http://"+server_ip+":"+server_port+server_service + data_src);}