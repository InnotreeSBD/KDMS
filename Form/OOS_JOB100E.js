var is_open = false;
var ux_dom = null;
var contents = "";
var Prefix = "__Encode";
var __count_id = 0;
var __recursive_element = null;
var __subject = null;
var __filename = null;
var __start = [];
var __end = [];
var __delete = [];
var __clone_obj = null;
var g_img_arr = new Array;
var ms_excel = null;
var category = "";
var process = "";

function Form_Load(  )
{
    var MenuID = Form.GetMenuID(); // 호출프로그램 메뉴ID
    var ParamObj = new Array(WMDA_1); // 위젯들 열거
    Toolbar_Authority(); 
    DGN_Design.InitMode( true, 800, 600 );

    WMDA_1.Toolbar_Visible("master_grid", "ok", false);
    WMDA_1.Toolbar_Visible("master_grid", "cancel", false);
    WMDA_1.Toolbar_Visible("master_grid", "insert", false);
    
//    WMDA_1.Toolbar_Visible("master_grid", "query", false);
    
    WMDA_1.Toolbar_Add("master_grid", "insert2", "입력", 0);
    WMDA_1.Toolbar_Add("master_grid", "ok2", "저장", 0);
    WMDA_1.Toolbar_Add("master_grid", "delete2", "삭제", 0);
    WMDA_1.Toolbar_Add("master_grid", "cancel2", "취소", 0);
//    WMDA_1.Toolbar_Add("master_grid", "cancel2", "취소", 0);
//    WMDA_1.Toolbar_Add("master_grid", "back", "이전", 0);
    
    WMDA_1.Toolbar_Add("master_grid", "print", "출력", 1);
    WMDA_1.Toolbar_Enable("master_grid", "ok2", false);
    WMDA_1.Toolbar_Enable("master_grid", "insert2", false);
    
    WMDA_1.Toolbar_Enable("master_grid", "insert2", false );
    WMDA_1.Toolbar_Enable("master_grid", "delete2", false );
    WMDA_1.Toolbar_Enable("master_grid", "cancel2", false );
    DATE_temp.AddMonths(-1);
    var StDt = DATE_temp.GetValue();
    
    WMDA_1.SetFieldData("query", "StDt", 0, StDt);
    WGSheet_1.SetFieldData("query", "StDt", StDt);
    DATE_temp.AddMonths(1);
    DATE_temp.AddDays(1);
    
    WGSheet_1.SetFieldData("query", "EndDt", DATE_temp.GetValue());
    
    
    WMDA_1.RunQueryMaster(false);
}

function WGSheet_1_OnMenuClick( menu_code, menu_label, col_name, col, row, cell_val )
 {
 }
 
function Form_OnKeyDown( key_val, key_name, ctrl_key, alt_key, shift_key, ctrl_name, widget_name, panel_name )
{
    Form.Trace("Form_OnKeyDown ( key_val : "+key_val+"\r\n"+"key_name : "+key_name
        +"\r\n"+"ctrl_key : "+ctrl_key+"\r\n"+"alt_key : "+alt_key+"\r\n"+"shift_key : "+shift_key+"\r\n"
        +"ctrl_name : "+ctrl_name+"\r\n"+"widget_name : "+widget_name+"\r\n"+"panel_name : "+panel_name+" )\r\n");
    if( widget_name == "WMDA_1" && panel_name == "query")
    {
        if( key_name == "RETURN" )
        {
            
            DATE_temp.SetValue(WMDA_1.GetFieldData("query", "EndDt", 0));
            DATE_temp.AddDays(1);
            WGSheet_1.SetFieldData("query", "EndDt", DATE_temp.GetValue());
        
            WGSheet_1.SetFieldData("query", "StDt", WMDA_1.GetFieldData("query", "StDt", 0));
//            WGSheet_1.SetFieldData("query", "doc_desc", WMDA_1.GetFieldData("query", "doc_desc", 0));
            WGSheet_1.SetFieldData("query", "doc_title", WMDA_1.GetFieldData("query", "doc_title", 0));
            WGSheet_1.SetFieldData("query", "user_create", WMDA_1.GetFieldData("query", "user_create", 0));
            
            WGSheet_1.RunQuery();
        }
    }
}

var g_instance_row
var g_toolbar; // 출력시 사용
//------------------------------------------------------------------------------
function WMDA_1_OnToolbarClick( panel_name, btn_id )
{
    if ( panel_name == "master_grid" )
    {
        if ( btn_id == "query" )
        {
            WMDA_1.Toolbar_SkipExecute("master_grid");
            WMDA_1.RunQueryMaster(false);
            return;
        }
        else if ( btn_id == "insert2" )
        {
            DGN_Design.SetDesignLayout( contents, "" );
            WMDA_1.Toolbar_SkipExecute("master_grid");
            
            g_instance_row = WGSheet_1.InsertRow(0);

            WGSheet_1.SetGridCellText("dgn_code", g_instance_row, TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 4));
            WGSheet_1.SetGridCellText("dgn_hash_code", g_instance_row, TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 10));
            WGSheet_1.SetGridCellText("doc_hash_code", g_instance_row, TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 8));

            GetDesign ( "", TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 10) )
            
            //Init_Data();
            Run_Init();

            category = TRE_1.NodeGetCell(TRE_1.GetKey_ParentNode(TRE_1.GetKey_ParentNode(TRE_1.CurrentNodeKey())),0);
            process = TRE_1.NodeGetCell(TRE_1.GetKey_ParentNode(TRE_1.CurrentNodeKey()),3);

            toobar_control( 3, "insert" );
            // WSF_1.SetFieldData("doc_title", TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 3)+"-");
            WSF_1.SetFieldData("doc_title", make_doc_title());
//            WSF_1.SetFieldData("doc_desc", "");
            WSF_1.SetFieldData("doc_inst_id", "");
//            WSF_1.SetFieldFocus("doc_title");
        }
        else if( btn_id == "ok2" ) // 저장버튼        
        {
            if( WSF_1.GetFieldData("doc_title") == "" )
            {
                Form.Alert( "문서제목을 입력해 주세요" );
                WSF_1.SetFieldFocus("doc_title");
                return;
            }
            
            var cur_row = WGSheet_1.GetCurrentRow();
            // 입력 data 저장.
            category = TRE_1.NodeGetCell(TRE_1.GetKey_ParentNode(TRE_1.GetKey_ParentNode(TRE_1.CurrentNodeKey())),0);
            process = TRE_1.NodeGetCell(TRE_1.GetKey_ParentNode(TRE_1.CurrentNodeKey()),3);
            
            var doc_code = WGSheet_1.GetGridCellText("doc_code", cur_row);
            var doc_name = TRE_1.NodeGetCell( TRE_1.CurrentNodeKey(), 3);
            var doc_title = WSF_1.GetFieldData("doc_title");
//            var doc_desc = WSF_1.GetFieldData("doc_desc");
            
            WGSheet_1.SetGridCellText("doc_title", cur_row, doc_title);
//            WGSheet_1.SetGridCellText("doc_desc", cur_row, doc_desc);
            WGSheet_1.SetGridCellText("doc_contents", cur_row, save_data);
            WGSheet_1.SetGridCellText("print_doc_code", cur_row, TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 11));
            WGSheet_1.SetGridCellText("print_doc_hash_code", cur_row, TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 12));
            
            var dgn_code = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 4);
            var save_data = DGN_Design.GetInputData( "xml" );
            
            ODW_3.ResetODW();

            ODW_3.SetParam("hash_code", 0, WGSheet_1.GetGridCellText("hash_code", cur_row));
            ODW_3.SetParam("doc_title", 0, doc_title);
            ODW_3.SetParam("dgn_code", 0, dgn_code);
//            ODW_3.SetParam("doc_desc", 0, doc_desc);
            ODW_3.SetParam("doc_code", 0, doc_code);
            ODW_3.SetParam("doc_contents", 0, save_data);
            ODW_3.SetParam("dt_create", 0, WGSheet_1.GetGridCellText("dt_create", cur_row));
            
            var query_str = "TBL_211_update_sc";
            
            if( !ODW_3.Update(query_str) )
                Form.Alert( ODW_3.GetError());
            var Hashcode = WGSheet_1.GetGridCellText("hash_code", cur_row); // Get HashCode 
            var doc_code = ODW_3.GetParam("doc_code", 0);
            
            WGSheet_1.SetGridCellText("dgn_code", cur_row, ODW_3.GetParam("dgn_code", 0));
            WGSheet_1.SetGridCellText("doc_code", cur_row, ODW_3.GetParam("doc_code", 0));
            WGSheet_1.SetGridCellText("dt_create", cur_row, ODW_3.GetParam("dt_create", 0));
            WGSheet_1.SetGridCellText("dt_update", cur_row, ODW_3.GetParam("dt_update", 0));

            WGSheet_1.SetGridCellText("user_create", cur_row, ODW_3.GetParam("user_create", 0));
            WGSheet_1.SetGridCellText("user_update", cur_row, ODW_3.GetParam("user_update", 0));
            
            var hash_code2 = SaveJobDataBunch(dgn_code, Hashcode, doc_code);
            
            WGSheet_1.SetGridCellText("hash_code", cur_row, hash_code2);
        }
        else if( btn_id == "print" ) // 출력
        {
            g_toolbar = "print";
            var doc_inst_id = "";
            PrintFile( doc_inst_id );
        }
        else if( btn_id == "delete2" ) // 데이터 (inst) 삭제
        {
            Form.ConfirmAsync("del_job", "삭제하면 복구가 불가능 합니다.\n 정말로 삭제하시겠읍니까 ?", "삭제확인");
        	
        }
        else if( btn_id == "cancel2" ) // 데이터 (inst) 삭제
        {
            var cur_row = WGSheet_1.GetCurrentRow();
            if( WGSheet_1.ModifyGet(cur_row) == "1" )
                WGSheet_1.DeleteRow(cur_row);
            toobar_control(3, "query");
        }
    }
}


function WMDA_1_OnEditChanged( panel_name, ctrl_name, val )
{
    if( panel_name == "query" )
    {
        if( ctrl_name == "EndDt" )
        {
            DATE_temp.SetValue(WMDA_1.GetFieldData("query", "EndDt", 0));
            DATE_temp.AddDays(1);
            WGSheet_1.SetFieldData("query", "EndDt", DATE_temp.GetValue());
        }
        else
        {
            WGSheet_1.SetFieldData("query", ctrl_name, WMDA_1.GetFieldData("query", ctrl_name, 0));
        }
    }
}

function toobar_control( lv, status )
{
    if( lv < 3 )
    {
        WMDA_1.Toolbar_Enable("master_grid", "insert2", false);
        WMDA_1.Toolbar_Enable("master_grid", "ok2", false);
        WMDA_1.Toolbar_Enable("master_grid", "delete2", false);
        WMDA_1.Toolbar_Enable("master_grid", "cancel2", false);
        
        WSF_1.SetFieldProperty("doc_title", "Enabled", false);
//        WSF_1.SetFieldProperty("doc_desc", "Enabled", false);
        _set_DGNWidget( false );
    }
    else if( status == "insert" )
    {
        WGSheet_1.SetEnabled(false);
        WMDA_1.Toolbar_Enable("master_grid", "insert2", false);
        WMDA_1.Toolbar_Enable("master_grid", "ok2", true);
        WMDA_1.Toolbar_Enable("master_grid", "delete2", false);
        WMDA_1.Toolbar_Enable("master_grid", "cancel2", true);
        
        WSF_1.SetFieldProperty("doc_title", "Enabled", true);
//        WSF_1.SetFieldProperty("doc_desc", "Enabled", true);
        _set_DGNWidget( true );
    }
    else // query or nomal
    {
        WGSheet_1.SetEnabled(true);
        WSF_1.SetFieldProperty("doc_title", "Enabled", true);
        if( WGSheet_1.GetRowCount() > 0 && WGSheet_1.GetGridCellText("hash_code", WGSheet_1.GetCurrentRow()) != "" )
        {
            WMDA_1.Toolbar_Enable("master_grid", "insert2", true);
            WMDA_1.Toolbar_Enable("master_grid", "ok2", true);
            WMDA_1.Toolbar_Enable("master_grid", "delete2", true);
            WMDA_1.Toolbar_Enable("master_grid", "cancel2", false);
            
            WSF_1.SetFieldProperty("doc_title", "Enabled", true);
            _set_DGNWidget( true );
        }
        else
        {
            WMDA_1.Toolbar_Enable("master_grid", "insert2", true);
            WMDA_1.Toolbar_Enable("master_grid", "ok2", false);
            WMDA_1.Toolbar_Enable("master_grid", "delete2", false);
            WMDA_1.Toolbar_Enable("master_grid", "cancel2", false);
            
            WSF_1.SetFieldProperty("doc_title", "Enabled", false);
            _set_DGNWidget( false );
        }
    }
}


function _set_DGNWidget( enabled )
//
// Purpose : 각 Design Widget의 사용가능/불가 설정
//
{
return;
    list = DGN_Design.MetaGetNameList();
    for( var i = 0 ; i < list.length ; i++ )
    {
        DGN_Design.MetaSetProperty( list[i], "Enabled", enabled );
    }
}

function PrintFile( instance_id )
//
// Purpose : 문서 출력
//
{
    var Hashcode = WGSheet_1.GetGridCellText("hash_code", WGSheet_1.GetCurrentRow());
    // 문서출력 
    if(Hashcode == "") 
    {
        Form.Alert("출력할 문서가 없습니다.");
        return;
    }
    else
    {
        var data = JSON.parse(get_data("9", Hashcode, "Job"));
        if(typeof(data) == "undefined")
        {
            Form.Alert("PrintFile : 데이타가 없읍니다.");
            return;
        }
        var hash_code = data.Doc_Obj["sel_doc_id"];
        var Contents = "";
        if(typeof(data.Contents) == "object")
        {
            Contents = data.Contents;
        }
        else
        {
            Contents = Form.Base64Decode(data.Contents.substr(Prefix.length));
            Contents = JSON.parse(Contents);
        }
        for(var idx in Contents)
            if((Contents[idx].ctrltype != "grid") && (Contents[idx].ctrltype != "image"))
                Contents[idx].Text = Contents[idx].Text.replaceAll("<br>", '\n');
        LoadDocData(Contents, data.Doc_Obj, hash_code);
    }
}

function SaveJobDataBunch(dgn_code, Hashcode, doc_code)
//
// Purpose : 사용자 입력 데이터를 저장
//
{
    var job_code = doc_code; // 혼동되지 않게 rename
    
    var Job_Obj = {};
    var Doc_Obj = {};
    var Job_Data = {};
    var Job_Data_Arr = [];
    var list_names = DGN_Design.MetaGetNameList();
    
    var grid_list = []; // name : grid_1 ...
    var grid_list_position = []; // json position : i
    var column_list = [];
    var column_map_list = [];
    
    var search_name_key_list = [];
    var search_name_val_list = [];
    for ( var i = 0 ; i < list_names.length ; i++ )
    {
        var map_name = DGN_Design.MetaGetProperty(list_names[i], "map_name");
        var search_name = DGN_Design.MetaGetProperty(list_names[i], "search_name");
        var ctrltype = DGN_Design.MetaGetCtrlType(list_names[i]);
        
        Job_Data = {};
        Job_Data["gid"] = DGN_Design.MetaGetProperty(list_names[i], "gid");
        Job_Data["label"] = DGN_Design.MetaGetProperty(list_names[i], "Label");
        Job_Data["uid"] = list_names[i]; // ctrl_name
        Job_Data["dgn_code"] = dgn_code; // ctrl_name
        
        if( search_name != "" )
            search_name_key_list.push(search_name); // ctrl_name
        
        if ( DGN_Design.MetaGetCtrlType(list_names[i]) == "edit" && DGN_Design.MetaGetProperty(list_names[i], "Multiline") == "1" )
        {
            Job_Data["ctrltype"] = "multiline"; // ctrl_name
        }
        else
        {
            Job_Data["ctrltype"] = ctrltype; // ctrl_name
        }
        
        if ( DGN_Design.MetaGetCtrlType(list_names[i]) == "image" )
        {
            if( DGN_Design.GetFieldData("", list_names[i], 0).length > 0 )
            {
                var doc_id = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 4);
                var ctrl_name = list_names[i];
                var file_data = DGN_Design.GetFieldData("", list_names[i], 0);
                var file_name = doc_id+"_"+ctrl_name;
                var file_ext = file_data.substring(file_data.indexOf("."), file_data.indexOf("&"));
                var image_data = file_data.substr(file_data.indexOf("&")+1);
                
                for ( var j = 0 ; j < g_img_arr.length ; j++ )
                {
                    if ( g_img_arr[j].ctrl_name == list_names[i] )
                    {
                        if ( g_img_arr[j].file_name.lastIndexOf(".") == -1 )
                            break;
                        
                        var file_ext_t = g_img_arr[j].file_name.substr(g_img_arr[j].file_name.lastIndexOf("."));
                        if ( file_ext_t.length > 0 )
                            file_ext = file_ext_t;
                        break;
                    }
                }
                
                ODW_4.ResetODW();
                ODW_4.SetParam("file_name", 0, file_name+file_ext);
                ODW_4.SetParam("file_data", 0, image_data);
                if( !ODW_4.Insert("img_upload") )
                    Form.Alert(ODW_4.GetError());
                
                if ( ODW_4.GetParam("rslt_data", 0) == "1" )
                {
                    Job_Data["image"] = image_data;
                    Job_Data["file_name"] = file_name+file_ext;
                    Job_Data["textValue"] = "kk_image:"+file_name+file_ext;
                }
                else
                {
                    Job_Data["image"] = "";
                    Job_Data["textValue"] = "";
                }
            }
        }
        else if ( DGN_Design.MetaGetCtrlType(list_names[i]) == "grid" )
        {
            grid_list.push(list_names[i]);
            grid_list_position.push(i);
            Job_Data["column_list"] = new Array;
            Job_Data["column_map_list"] = new Array;
            Job_Data["column_list_text"] = new Array;
            Job_Data["grid_data"] = new Array;
        }
        else if ( DGN_Design.MetaGetCtrlType(list_names[i]) == "grid_column" )
        {
            var panel_name = DGN_Design.MetaGetParentName(list_names[i]);
            var count = DGN_Design.GetRowCount(panel_name);
            var column_name_arry = new Array;
            var column_data_arry = new Array;
            
            column_name_arry.push(list_names[i])
            
            for( var grid_row = 0 ; grid_row < count ; grid_row++ )
            {
                var cell_data = DGN_Design.GetFieldData(panel_name, list_names[i], grid_row);
                column_data_arry.push( cell_data.trim() )
            }
            
            Job_Data["Text"] = DGN_Design.GetFieldData("", list_names[i], 0);
            Job_Data["column_data_arry"] = column_data_arry;
            Job_Data["panel_name"] = DGN_Design.MetaGetParentName(list_names[i]);
            Job_Data["panel_idx"] = DGN_Design.MetaGetParentName(list_names[i]);
        }
        else
        {
            Job_Data["Text"] = DGN_Design.GetFieldData("", list_names[i], 0);
        }
        
        if( map_name != "" )
        {
            Job_Data["map_name"] = map_name;
        }
        Job_Data_Arr.push(Job_Data);
        if( search_name != "" )
            search_name_val_list.push(DGN_Design.GetFieldData("", list_names[i], 0));
    }

    // grid data 처리
    if( grid_list.length >= 0 )
    {
        for( var i = 0 ; i < Job_Data_Arr.length ; i++ )
        {
            if( Job_Data_Arr[i]["ctrltype"] != "grid_column" )
                continue;
            panel_name = Job_Data_Arr[i]["panel_name"];
            var first_flag = true;
            for( var j = 0 ; j < Job_Data_Arr.length ; j++ )
            {
                if( Job_Data_Arr[j]["uid"] == panel_name )
                {
                    Job_Data_Arr[j]["row_count"] = Job_Data_Arr[i]["column_data_arry"].length;
                    Job_Data_Arr[j]["column_list"].push(Job_Data_Arr[i]["uid"]);
                    Job_Data_Arr[j]["column_map_list"].push(Job_Data_Arr[i]["map_name"]);
                    Job_Data_Arr[j]["column_list_text"].push(Job_Data_Arr[i]["Text"]);
                    Job_Data_Arr[j]["grid_data"].push(Job_Data_Arr[i]["column_data_arry"])
                }
            }
        }
        for( var i = 0 ; i < Job_Data_Arr.length ; i++ )
        {
            if( Job_Data_Arr[i]["ctrltype"] != "grid" )
                continue;
            var grid_data = Job_Data_Arr[i]["grid_data"];
            var grid_data_temp = grid_data;
            
            var copy_grid_data = new Array;
            for( var j = 0 ; j < Job_Data_Arr[i]["row_count"] ; j++ )
            {
                var copy_grid_data_sub = new Array;
                for( var k = 0 ; k < Job_Data_Arr[i]["column_list"].length ; k++ )
                {
                    var val = Job_Data_Arr[i]["grid_data"][k][j];
                    if( !val )
                        val = "";
                    copy_grid_data_sub.push(val);
                }
                copy_grid_data.push(copy_grid_data_sub);
            }
            
            Job_Data_Arr[i]["grid_data"] = copy_grid_data;
        }
    }
    
    var search_name_obj = {}; // 
    for( var search_idx in search_name_key_list )
    {
        search_name_obj[search_name_key_list[search_idx]] = search_name_val_list[search_idx];
    }
    var meta = {};
    var grid_contents = {};
    Doc_Obj["sel_doc_id"] = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 8);    // 문서 Hash Code
    Doc_Obj["sel_doc_code"] = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 2);    // 문서 code
    Doc_Obj["sel_doc_title"] = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 9);    // 문서 파일 제목(filename이 아님)
    meta["dgn_hash"] = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 7);        // 저장한 문서 설명
    meta["reg_date"] = WGSheet_1.GetGridCellText("dt_create", WGSheet_1.GetCurrentRow());    // 등록 시간
    meta["category"] = category;        // 업무 구분
    meta["process"] = process;            // 단계 구분
    meta["doc_title"] = WSF_1.GetFieldData("doc_title");

    var Hash_Code = sha1(meta["doc_title"]);

    if(write_data("9", Hash_Code, "meta", JSON.stringify(meta)) == false)
        return;

    Job_Obj["Dgn_Code"] = dgn_code; // 화면양식 코드
    Job_Obj["Doc_Obj"] = Doc_Obj;
    Job_Obj["meta"] = meta;
    
    Job_Obj["search_name_key_list"] = search_name_key_list;
    Job_Obj["search_name_val_list"] = search_name_val_list;
    Job_Obj["search_name_obj"] = search_name_obj;
    Job_Obj["Printed"] = 0;
    Job_Obj["job_code"] = job_code;
    
    Job_Obj["Contents"] = Job_Data_Arr;    // Mash 연결된 화면 uid 리스트 Array
    if(write_data("9", Hash_Code, "Job", JSON.stringify(Job_Obj)) == false)
        return;
    ODW_3.ResetODW();
    ODW_3.SetParam("hash_code", 0, Hash_Code);
    ODW_3.SetParam("doc_code", 0, doc_code);

    if( !ODW_3.Update("update_hash") )
        Form.Alert(ODW_3.GetError());
    WGSheet_1.SetGridCellText("hash_code", WGSheet_1.GetCurrentRow(), Hash_Code);
    toobar_control( 3, "query" )
    return Hash_Code;
}

function Form_OnConfirmResult( confirm_id, result )
{
    if(confirm_id == "del_confirm")
    {
        if(result)
        {
            WMDA_1_OnToolbarClick( "master_grid" , "delete2" );
        }
    }
    if(confirm_id == "del_job")
    {
        if(result)
        {
            var doc_code = TRE_1.NodeGetCell( TRE_1.CurrentNodeKey(), 2);
            var hash_code = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 7);
            
            var del_row = WGSheet_1.GetCurrentRow();
            var doc_code = WGSheet_1.GetGridCellText("doc_code", del_row);
            var hash_code = WGSheet_1.GetGridCellText("hash_code", del_row);
            
            ODW_3.ResetODW()
            ODW_3.SetParam("doc_code", 0, doc_code);
            if( !ODW_3.Delete("TBL_211_delete_sc" ) )
            {
                Form.Alert( ODW_3.GetError() );
            }
            TRE_1.NodeSetCell(TRE_1.CurrentNodeKey(), 7, "");
            
            ODW_4.ResetODW();
            ODW_4.SetParam("key_name", 0, hash_code);
            if( ! ODW_4.Delete("del_data") )
            {
                Form.Alert( ODW_4.GetError() );
                return;
            }

            if( del_row - 1 >= 0 )
            {
                WGSheet_1.GridFocusRow(del_row - 1);
            }
            
            WGSheet_1.DeleteRow(del_row);
            
            LoadJobDataBunch(TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 4), TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 7));
            var dgn_code = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 4);
            var dgn_hash_code = TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 10); // inst hash_code
            
            GetDesign(dgn_code, dgn_hash_code);
        }
    }
}

function LoadJobDataBunch(dgn_code, Hashcode)
//
// Purpose : Redis DB에 저장되어 있는 사용자 입력 데이터를 불러오기
//
{
    g_img_arr = new Array();
    if( (Hashcode == "undefined" ) || ( Hashcode == "" ))
    {
        toobar_control( 3, "query" )
        return;
    }
    else
    {
        toobar_control( 3, "query" )
    }
    
    var data = JSON.parse(get_data("9", Hashcode, "Job"));
    if(typeof(data) == "undefined")
    {
        Form.Alert("LoadJobDataBunch : 데이타가 없읍니다.");
        return;
    }
    var Job_Obj = data;

    if(typeof(Job_Obj.Contents) != "object")
        var Contents_JSON = JSON.parse(Form.Base64Decode(Job_Obj.Contents.substr(Prefix.length)));
    else
        var Contents_JSON = Job_Obj.Contents;

    var list_names = DGN_Design.MetaGetNameList();
    var img_cnt = 0;
    for (var idx in list_names)
    {
        var map_name = DGN_Design.MetaGetProperty(list_names[idx], "Map_Name")
        if(map_name == "")
        {
        	if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "grid_column" )
        	    continue;
        	if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "button" )
        	    continue;
        	if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "label" )
        	    continue;
            for(var cidx in Contents_JSON)
            {
                if ((typeof(Contents_JSON[cidx]["map_name"]) == "undefined") &&
                    (Contents_JSON[cidx]["dgn_code"] == dgn_code) &&
                    (Contents_JSON[cidx]["ctrltype"] == DGN_Design.MetaGetCtrlType(list_names[idx])) &&
                    (Contents_JSON[cidx]["label"] == DGN_Design.MetaGetProperty(list_names[idx], "Label")))
                 {
                    if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "edit" )
                    {
                        DGN_Design.SetFieldData("", list_names[idx], 0, Contents_JSON[cidx].Text.replaceAll("<br>", '\n'));
                        break;
                    }
                    else if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "grid" )
                    {
                        DGN_Design.ClearGrid(list_names[idx]);
                        break;
                    }
                    else if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "combo" )
                    {
                        var odw_temp = Form.GetNewODW("");
                        odw_temp.BatchQueryAddLocal("combo_data", 0, 0, Contents_JSON[cidx].Text);
                        odw_temp.BatchQueryAddLocal("combo_data", 1, 0, Contents_JSON[cidx].Text);
                        DGN_Design.SetSelectRecordData(list_names[idx], "", odw_temp, "combo_data");
                        DGN_Design.SetFieldData("", list_names[idx], 0, Contents_JSON[cidx].Text);
                        break;
                    }
                    else if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "check" )
                    {
                        DGN_Design.SetFieldData("", list_names[idx], 0 , Contents_JSON[cidx].Text);
                        break;
                    }
                    else if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "datetime" )
                    {
                        DGN_Design.SetFieldData("", list_names[idx], 0, Contents_JSON[cidx].Text);
                        break;
                    }
                 }
            }
        }
        else
        {
            for(var cidx in Contents_JSON)
            {
                if(Contents_JSON[cidx]["map_name"] == map_name)
                {
                    if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "edit" )
                    {
                        DGN_Design.SetFieldData("", list_names[idx], 0, Contents_JSON[cidx].Text.replaceAll("<br>", '\n'));
                        break;
                    }
                    else if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "datetime" )
                    {
                        DGN_Design.SetFieldData("", list_names[idx], 0, Contents_JSON[cidx].Text);
                        break;
                    }
                    else if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "grid" )
                    {
                        DGN_Design.ClearGrid(list_names[idx]);
                        break;
                    }
                    else if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "grid_column" )
                    {
                        DGN_Design.SetFieldData("", list_names[idx], 0, Contents_JSON[cidx].Text);
                        var panel_name = DGN_Design.MetaGetParentName(list_names[idx]);
                        var first_flag = true;
                        if( !Contents_JSON[cidx]["column_data_arry"] ) // 의문의 null값... ??
                            continue;
                        for( var grid_row = 0 ; grid_row < Contents_JSON[cidx]["column_data_arry"].length ; grid_row++ )
                        {
                            DGN_Design.SetFieldData(panel_name, list_names[idx], grid_row, Contents_JSON[cidx].column_data_arry[grid_row]);
                        }
                        break;
                    }
                    else if ( Contents_JSON[cidx].ctrltype == "combo" )
                    {
                        var odw_temp = Form.GetNewODW("");
                        odw_temp.BatchQueryAddLocal("combo_data", 0, 0, Contents_JSON[cidx].Text);
                        odw_temp.BatchQueryAddLocal("combo_data", 1, 0, Contents_JSON[cidx].Text);
                        DGN_Design.SetSelectRecordData(list_names[idx], "", odw_temp, "combo_data");
                        DGN_Design.SetFieldData("", list_names[idx], 0, Contents_JSON[cidx].Text);
                        break;
                    }
                    else if ( DGN_Design.MetaGetCtrlType(list_names[idx]) == "image" )
                    {
                        if ( Contents_JSON[cidx].image != "" )
                        {
                            DGN_Design.SetFieldData("", list_names[idx], 0, Contents_JSON[cidx].image);
                            var img_obj = new Object();
                            img_obj.ctrl_name = list_names[idx];
                            img_obj.file_name = Contents_JSON[cidx].file_name;
                            g_img_arr[img_cnt] = img_obj;
                            img_cnt++;
                        }
                        else
                        {
                            DGN_Design.SetFieldData("", list_names[idx], 0, "");
                        }
                        break;
                    }
                }
            }
        }
    }
}

function WMDA_1_OnQueryMasterEnd( result, row_count )
{
    WMDA_1.Toolbar_SkipExecute("master_grid");

    TRE_1.NodeDeleteAll();

    ODW_5.ResetODW();
    if( !ODW_5.Query("query_tree_root") )
        Form.Alert( ODW_5.GetError() );
            
    for( var i = 0 ; i < ODW_5.GetCount() ; i++ )
    {
        TRE_1.NodeInsertByKey("", ODW_5.GetParam("doc_id", i), ODW_5.GetParam("doc_name", i), -1, 0, 0);
        TRE_1.NodeSetCell(ODW_5.GetParam("doc_id", i), 5, "1" ) 
    }
            
    TRE_1.ColumnAdd(7, "Hashcode", 100); // hash code
            
    ODW_5.ResetODW();
    if( !ODW_5.Query("query_tree") )
        Form.Alert(ODW_5.GetError());
            
    for ( var i = 0 ; i < ODW_5.GetCount() ; i++ )
    {
        var parent_id = ODW_5.GetParam("parent_id", i);
        var doc_id = ODW_5.GetParam("doc_id", i);
        var doc_name = ODW_5.GetParam("doc_name", i);
        TRE_1.NodeInsertByKey(parent_id, doc_id, doc_name, -1, 0, 0);
        TRE_1.NodeSetCell(doc_id, 1, doc_id);
        TRE_1.NodeSetCell(doc_id, 2, ODW_5.GetParam("doc_code", i));
        TRE_1.NodeSetCell(doc_id, 3, doc_name);
        TRE_1.NodeSetCell(doc_id, 4, WMDA_1.GetFieldData("master_grid", "dgn_code", i));
        TRE_1.NodeSetCell(doc_id, 5, WMDA_1.GetFieldData("master_grid", "lv", i));
        TRE_1.NodeSetCell(doc_id, 6, WMDA_1.GetFieldData("master_grid", "disp_seq", i));
        TRE_1.NodeSetCell(doc_id, 7, WMDA_1.GetFieldData("master_grid", "hash_code", i));
        TRE_1.NodeSetCell(doc_id, 8, WMDA_1.GetFieldData("master_grid", "doc_hash_code", i)); // DOC hash_code
        TRE_1.NodeSetCell(doc_id, 9, WMDA_1.GetFieldData("master_grid", "doc_title2", i)); // DOC hash_code
        TRE_1.NodeSetCell(doc_id, 9, WMDA_1.GetFieldData("master_grid", "doc_title2", i));
        TRE_1.NodeSetCell(doc_id, 10, ODW_5.GetParam("hash_code", i)); // DGN hash_code
        TRE_1.NodeSetCell(doc_id, 11, WMDA_1.GetFieldData("master_grid", "print_doc_code", i));
        TRE_1.NodeSetCell(doc_id, 12, WMDA_1.GetFieldData("master_grid", "print_doc_hash_code", i));
        
        if( parseInt(ODW_5.GetParam("lv", i)) < 4 )
            TRE_1.ExpandNode(parent_id, true);
                
    }
    TRE_1.SelectNode("0");
    
    // 마지막 노드에 focus 
    if( TRE_1.NodeExist("1") )
        TRE_1.SelectNode("1");
}

//------------------------------------------------------------------------------
function TRE_1_OnSelectChanged( node_key )
{
    WSF_1.SetFieldData("doc_title", "");
//    WSF_1.SetFieldData("doc_desc", "");
    
    var doc_id = TRE_1.NodeGetCell(node_key, 1);
    var doc_code = TRE_1.NodeGetCell(node_key, 2);
    var doc_name = TRE_1.NodeGetCell(node_key, 3);
    var dgn_code = TRE_1.NodeGetCell(node_key, 4);
    
    Form.SetViewData("dgn_code", dgn_code);
    var lv = TRE_1.NodeGetCell(node_key, 5);
    var disp_seq = TRE_1.NodeGetCell(node_key, 6);
    var hash_code = TRE_1.NodeGetCell(node_key, 7); // inst hash_code
    var dgn_hash_code = TRE_1.NodeGetCell(node_key, 10); // dgn hash_code
    
    GetDesign(dgn_code, dgn_hash_code);
    
    WGSheet_1.SetFieldData("query", "dgn_code", dgn_code);
    WGSheet_1.RunQuery();
    
    toobar_control( lv, "query" )
}

function GetDesign ( dgn_code, hash_code )
//
// Purpose : Redis DB에 저장되어 있는 화면 정보를 불러오기
//
{
    if(hash_code == "")
        return;
    var data = JSON.parse(get_data("9", hash_code, "contents"));
    if(typeof(data) == "undefined")
    {
        Form.Alert("GetDesign : 데이타가 없읍니다.");
        return;
    }

    var contents = data.Contents;
    if(typeof(contents) == "object")
    {
        contents = json2xml(contents);
        DGN_Design.SetDesignLayout( contents );
        is_open = true;
    }
    else
    {
        if(contents.indexOf(Prefix) == 0)
        {
            contents = contents.substr(Prefix.length);
            contents = Form.Base64Decode( contents )
        }
        if(contents.substring(0,1) != "<")
            contents = json2xml(JSON.parse(contents ));
        DGN_Design.SetDesignLayout( contents );
        is_open = true;
    }
}

function DGN_Design_OnReady( param1, param2 )
{
    if( WGSheet_1.GetRowCount() <= 0)
    {
        toobar_control( 3, "query" )
    }
}

function DGN_Design_OnValueChanged( panel_name, ctrl_name, ctrl_type, irow, val_old, val_new )
{
    Run_Action( ctrl_name, irow );
}

function DGN_Design_OnButtonClick( ctrl_name, event_code, map_table, map_name )
{
    Run_Action( ctrl_name, 0 );
}

function Init_Data (  )
//
// Purpose : Data 초기화
//
{
    var node_key = string = TRE_1.CurrentNodeKey();
    var hash_code = TRE_1.NodeGetCell(node_key, 7); // inst hash_code
    var dgn_code = TRE_1.NodeGetCell(node_key, 4);
    var doc_name = TRE_1.NodeGetCell(node_key, 3);
    
    ODW_6.ResetODW(); // SET_100
    ODW_6.SetParam("dgn_code", 0, dgn_code);
    if ( !ODW_6.Query("query_rn") )
    {
        Form.Alert(ODW_6.GetError());
        return;
    }
    if ( ODW_6.GetCount() == 0 )
        return;
    
    var odw_temp = Form.GetNewODW("TBL_Dynamic");
    for ( var i = 0 ; i < ODW_6.GetCount() ; i++ )
    {
        var ctrl_name = ODW_6.GetParam("ctrl_name", i);
        var init_value = ODW_6.GetParam("init_value", i);
        var set_sql = ODW_6.GetParam("set_sql", i);
        var ctrl_type = DGN_Design.MetaGetCtrlType(ctrl_name);
        var panel_name = DGN_Design.MetaGetParentName(ctrl_name);
        var panel_type = DGN_Design.MetaGetCtrlType(panel_name);
        if ( panel_type != "grid" ) panel_name = "";
        var panel_type = DGN_Design.MetaGetCtrlType(panel_name);
        var row = 0;
        
        if ( ctrl_type == "combo" && set_sql != "" )
        {
            odw_temp.ResetODW();
            odw_temp.SetParam("sql", 0, set_sql);
            odw_temp.SetParam("param", 0, "");
            odw_temp.SetParam("param_val", 0, "");
            odw_temp.SetParam("target_db", 0, "");
            if ( !odw_temp.Query("query_combo") )
            {
                Form.Alert(odw_temp.GetError());
                return;
            }
            if ( panel_type == "grid" )
                DGN_Design.SetSelectRecordData(panel_name, ctrl_name, odw_temp, "ST01");
            else
                DGN_Design.SetSelectRecordData(ctrl_name, "", odw_temp, "ST01");
        }
        DGN_Design.SetFieldData(panel_name, ctrl_name, row, init_value);
    }
}

function Run_Init (  )
//
// Purpose : 사용자 함수 초기화
//
{
    ODW_1.ResetODW(); // TBL_020
    ODW_1.SetParam("dgn_code", 0, Form.GetViewData("dgn_code"));
    ODW_1.SetParam("action_gubun", 0, "99");
    if ( !ODW_1.Query("query_event") )
    {
        Form.Alert(ODW_1.GetError());
        return;
    }
    
    if ( ODW_1.GetCount() == 0 )
        return;
    var action_type = ODW_1.GetParam("action_type", 0);
    var action_contents = ODW_1.GetParam("action_contents", 0);
    if ( action_type == "function" )
    {
        if ( action_contents == "" )
            return;
        
        var param_arr = new Array();
        var param_json = new Object();
        var param_panel_index = -1;
        var param_row_index = -1;
        var target_db = ODW_1.GetParam("target_db", 0);
        
        param_json.target_db = target_db;
        
        //param_arr[0] = target_db;
        Form.SetViewData("target_db", target_db);
        Form.SetViewData("param_json", param_json);
        if(action_contents != null)
        {
            var action_func_params = action_contents.split("(");
            if(action_func_params.length > 1)
            {
                action_contents = action_func_params[0];
                action_contents = action_contents.replace(/ /gi, "");
                
                if(action_func_params.indexOf("{") > -1)
                {
                    param_arr = [];
                    param_arr.push(action_func_params[1].substring(0, action_func_params[1].length-1));
                }
                else
                {
                    action_func_params[1] = action_func_params[1].replace(/ /gi, "");
                    action_func_params = action_func_params[1].substring(0, action_func_params[1].length-1)
                    action_func_params = action_func_params.split(",");
                    param_arr = [];
                    for(var idx = 0; idx < action_func_params.length; idx++ )
                        param_arr.push(action_func_params[idx]);
                }
            }
        }
        Form.InvokeMethod( action_contents, param_arr );
    }
}

function Run_Action ( ctrl_name, cur_row )
//
// Purpose : 사용자 함수 실행
//
{
    ODW_1.ResetODW(); // TBL_020
    ODW_1.SetParam("dgn_code", 0, Form.GetViewData("dgn_code"));
    ODW_1.SetParam("action_ctrl", 0, ctrl_name);
    ODW_1.SetParam("action_gubun", 0, "30");
    if ( !ODW_1.Query("query_event") )
    {
        Form.Alert(ODW_1.GetError());
        return;
    }
    
    if ( ODW_1.GetCount() == 0 )
        return;
    var action_type = ODW_1.GetParam("action_type", 0);
    var action_contents = ODW_1.GetParam("action_contents", 0);
    if ( action_type == "function" )
    {
        if ( action_contents == "" )
            return;
        
        var param_arr = new Array();
        var param_json = new Object();
        var param_panel_index = -1;
        var param_row_index = -1;
        var target_db = ODW_1.GetParam("target_db", 0);
        
        param_json.target_db = target_db;
        param_json.cur_ctrl_name = ctrl_name;
        
        Form.SetViewData("target_db", target_db);
        Form.SetViewData("cur_ctrl_name", ctrl_name);
        Form.SetViewData("param_json", param_json);
        if(action_contents != null)
        {
            var action_func_params = action_contents.split("(");
            if(action_func_params.length > 1)
            {
                action_contents = action_func_params[0];
                action_contents = action_contents.replace(/ /gi, "");
                
                if(action_func_params.indexOf("{") > -1)
                {
                    param_arr = [];
                    param_arr.push(action_func_params[1].substring(0, action_func_params[1].length-1));
                }
                else
                {
                    action_func_params[1] = action_func_params[1].replace(/ /gi, "");
                    action_func_params = action_func_params[1].substring(0, action_func_params[1].length-1)
                    action_func_params = action_func_params.split(",");
                    param_arr = [];
                    for(var idx = 0; idx < action_func_params.length; idx++ )
                        param_arr.push(action_func_params[idx]);
                }
            }
        }
        Form.InvokeMethod( action_contents, param_arr );
    }
}

function LoadDocData( Contents, Doc_Obj, HashCode )
//
// Purpose : Redis DB에 저장되어 있는 양식 문서 XML 불러오기
//
{
    var meta = JSON.parse(get_data("9", HashCode, "meta"));
    if(typeof(meta) == "undefined")
    {
        Form.Alert("LoadDocData : 데이타가 없읍니다.");
        return;
    }
    var data = get_data("9", HashCode, "raw");
    if(data == "")
    {
        Form.Alert("LoadDocData : 데이타가 없읍니다.");
        return;
    }
    merge_data(meta.file_name, data, Contents, Doc_Obj);
}

function merge_data(xml_file_name, obj, list, Doc_Obj)
//
// Purpose : 양식 문서와 사용자 입력 양식 데이터를 머지
//
{
    var obj_raw = obj;
    if(obj_raw.indexOf(Prefix) == 0)
    {
        obj_raw = obj_raw.substr(Prefix.length);
        obj_raw = Form.Base64Decode(obj_raw);
    }
	var filename = xml_file_name.split(".");
	if(filename[1].indexOf("hwp") == 0)
	{
//		xmlDpc = loadXMLDoc(obj_raw);
		var dom = parseXML(obj_raw);
        var hp_run = dom.getElementsByTagName("hp:run");
//		xmlToJson(obj_raw);
		return;
	}
	else
	{
	    var sel_obj = JSON.parse(obj_raw);
	    if(sel_obj["children"][0]["type"] == "element")
        	var find_obj = print_save(Doc_Obj, sel_obj["children"][0]["children"][0], list);
    	else
	        var find_obj = print_save(Doc_Obj, sel_obj["children"][1]["children"][0], list);
	    if (find_obj == undefined)
	    {
        	Form.Alert("print error");
    	}
    	else
    	{
	        __save_office_xml(xml_file_name, sel_obj, Doc_Obj.sel_doc_id);
	    }
	}
}
function getElementByNodeNameHwp (object, tag)
//
// Purpose : 한글 문서 XML 내용에서 한글 누름틀 Object만 추출
//
{
    recursive_element = [];
    if(tag == "" || tag == null)
    {
        count_id = 0;
    }
    getElementByNodeName_recHwp(recursive_element, object, tag);
    for(var idx in recursive_element)
        recursive_element[idx]["Text"] = recursive_element[idx]["Text"].join("\n");
    return recursive_element;
}

function getElementByNodeName_recHwp (recursive_element, object, tag)
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
        getElementByNodeName_recHwp(recursive_element, object.children[idx], tag);
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

function getElementByNodeName (object, tag)
//
// Purpose : tag에 해당하는 object array 선택
//
{
    __recursive_element = [];
    if(tag == "" || tag == null)
    {
        __count_id = 0;
    }
    getElementByNodeName_rec(object, tag);
    return __recursive_element;
}

function getElementByNodeName_rec (object, tag)
//
// Purpose : tag에 해당하는 object array 선택
//
{
    if(typeof(object) == "string" || typeof(object) == "number" || typeof(object) == "undefined")
    {
        return;
    }

    if(object["name"] == tag)
    {
        __recursive_element.push(object);
    }
    else
    {
        for(var item in object)
        {
            if(item == 'parent')
                continue;
            if(tag == "" || tag == null)
            {
                object[item]['parent'] = object;
            }
            else if(tag == "Delete")
            {
                if(object[item] != null)
                {
                    delete object[item]['parent'];    // deleteNode
                }
            }
            getElementByNodeName_rec(object[item], tag);
        }
    }
}

function print_save (Doc_obj, sel_obj, list)
//
// Purpose : 양식 문서와 데이터를 융합
//
{
    var item = {};

    getElementByNodeName(sel_obj, "");
    
    if(sel_obj["name"] == "xlsxBody")
        ms_excel = true;
    else
        ms_excel = false;
        
    print_edit(sel_obj, list);
    
    getElementByNodeName(sel_obj, "Delete");
    return sel_obj;
}

function __save_office_xml (xmlFileName, saveXML, src_file_hash)
//
// Purpose : XML 내용을 문서로 역 변환
//
{ 
	
    if(xmlFileName.indexOf("hwp") > -1)
    {
    }
    else
    {
        var file_ext = xmlFileName.split(".");;
		var json_data = {};
		json_data["document"] = saveXML;
		ODW_4.ResetODW();
	    ODW_4.SetParam("hash", 0,  src_file_hash);
	    ODW_4.SetParam("key_name", 0,  "doc_file");
	    if( ! ODW_4.Query("hget_data") )
	    {
        	Form.Alert( ODW_4.GetError() );
        	return false; 
    	}
//var payload_data = {
//	"doc_ext":"docx",
//	"doc_upload_mode":"local",
//	"doc_path":encodeURIComponent("C:/TEMP/XPopcorn/DOC/XML/"+xmlFileName),
////	"doc_file":ODW_4.GetParam("json_result", 0),
//	"json_upload_mode":"json_data",
//	"output_mode":"download",
//	"json_data":JSON.stringify(json_data, null, "")
//};
//var url = "http://localhost:8090/api/converter";
////var queryParams = '?' + 'doc_ext' + '=' + 'docx';
////    queryParams += '&' + 'doc_upload_mode' + '=' + 'local';
////    queryParams += '&' + 'doc_path' + '=' + "C:/TEMP/XPopcorn/DOC/XML/"+encodeURIComponent(xmlFileName);
////    queryParams += '&' + 'output_mode' + '=' + "download";
////    queryParams += '&' + 'json_data' + '=' + json_data;
//		Form.AjaxJsonParam("doc_ext", "docx");
//		Form.AjaxJsonParam("doc_upload_mode", "local");
//		Form.AjaxJsonParam("doc_path", "C:/TEMP/XPopcorn/DOC/XML/"+xmlFileName);
//		Form.AjaxJsonParam("output_mode", "download");
//		Form.AjaxJsonParam("json_upload_mode", "json_data");
//		Form.AjaxJsonParam("json_data", JSON.stringify(json_data, null, ""));
//		Form.AjaxJsonCall("call_05", url, "get", "json");
////		Form.AjaxJsonCall("call_05", url, "POST", JSON.stringify(payload_data, null, '\t'));
//return;


        ODW_8.ResetODW();
        ODW_8.SetParam("doc_ext", 0, file_ext[file_ext.length-1]);
        ODW_8.SetParam("doc_filename", 0, xmlFileName);
        ODW_8.SetParam("doc_file", 0, ODW_4.GetParam("json_result", 0));
        ODW_8.SetParam("json_data", 0, JSON.stringify(json_data));
//Form.Alert(JSON.stringify(json_data.document));
        if( !ODW_8.Query( "call_convert_api" ) )
        {
            Form.Alert( ODW_8.GetError() );
            return;
        }
        
        var data =  ODW_8.GetParam( "http_result", 0 ); // file_name
        
	    FIIO_1.FileDirectDownloadByName(null, data, xmlFileName, true);
        return;
    }
}

function Form_OnCloseDialog( view_code, dialog_result )
{
    if ( !dialog_result )
    {
        Form.DialogClear();
        return;
    }
    
    var dialog_code = Form.GetViewData("dialog_code");
    var panel_name = Form.GetViewData("panel");
    var ctrl_name = Form.GetViewData("control");
    var row = Number(Form.GetViewData("row"));
    var param_val = Form.DialogParamGet(Form.GetViewData("param_name"));
    
    if ( row == "" ) row = 0;
    //Form.Alert("panel_name : "+panel_name+" _ ctrl_name : "+ctrl_name+" _ row : "+row+" _ param_name : "+Form.GetViewData("param_name")+" _ param_val : "+param_val);
    if ( view_code == dialog_code )
    {
        DGN_Design.SetFieldData(panel_name, ctrl_name, row, param_val);
    }
    Form.DialogClear();
}


function WGSheet_1_OnSelectRecordChanged( col_name, col, row )
{
    WSF_1.SetFieldData("doc_title", WGSheet_1.GetGridCellText("doc_title", row));
    WSF_1.SetFieldData("doc_name", WGSheet_1.GetGridCellText("doc_name", row));
//    WSF_1.SetFieldData("doc_desc", WGSheet_1.GetGridCellText("doc_desc", row));
    WSF_1.SetFieldData("doc_inst_id", WGSheet_1.GetGridCellText("doc_inst_id", row));
    WSF_1.SetFieldData("dgn_code", WGSheet_1.GetGridCellText("dgn_code", row));
    LoadJobDataBunch( WGSheet_1.GetGridCellText("dgn_code", row), WGSheet_1.GetGridCellText("hash_code", row) );
}

function WGSheet_1_OnQueryEnd( row_count )
{
    WGSheet_1.GridFocusRow(0);
}

function plusZero(num, data) 
//
// Purpose : 숫자를 문자로 변환하면서, 1단위 숫자일 경우 "0" 추가
//
{
    data = String(data);
    if(data.length < num)
    {
        while(data.length < num)
        data = "0"+data;
    }
    return data;
 }

function make_doc_title ()
//
// Purpose : 양식 데이터 문서 이름 자동 생성
//
{
    var user_name = "";
    var odw_temp = Form.GetNewODW("BAHr"); 
    odw_temp.ResetODW();
    odw_temp.SetParam("UserID", 0, Form.GetUserID());
    if(!odw_temp.Query("query_user_code") )
    {
    	Form.Alert("사용자 등록이 되지 않았읍니다.");
    }
    user_name = odw_temp.GetParam("HrNm", 0);
//    if(user_code == "")
//    	user_code = "99";
    var d = new Date();
    var now_date = d.getFullYear().toString() + plusZero(2, (d.getMonth() + 1).toString()) + plusZero(2, d.getDate().toString());
    var doc_title = now_date+"_"+user_name+"_";

    return doc_title;	
}

function DGN_Design_OnGridCellDoubleClick( grid_name, col_name, icol, irow )
{
	Run_Action("button_2", irow);
//    Form.Alert("DBLClick");
}

function EtcButton_Authority(ToobarID, PropertyName, bool)
{
    // 툴바/위젯버튼외 권한 처리
    switch( ToobarID )
    {
        case "insert":
        break;
        
        case "update":
        break;
        
        case "delete":
        break;
    }
}


function WGSheet_1_OnMenuPrepare( menu )
{
    menu.RemoveMenuItem("filter"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("clearsort"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("copy"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
    menu.RemoveMenuItem("paste"); //excelexport, filter, sort, clearsort, search,copy,paste 각 항목에 대해서 호출 가능.
}

function write_data(db_no, hash, key_name, val_str )
{
    ODW_4.ResetODW(); 
    ODW_4.SetParam("hash", 0,  hash);
    ODW_4.SetParam("key_name", 0,  key_name);
    ODW_4.SetParam("val_str", 0, val_str);
    if( ! ODW_4.Insert("hset_data") )
    {
        Form.Alert( ODW_4.GetError() );
        return false; 
    }
    return true;
}

function get_data(db_no, hash, key_name )
//
// Purpose : Redis DB에 저장되어 있는 데이터 불러오기
//
{
    ODW_4.ResetODW(); 
    ODW_4.SetParam("hash", 0,  hash);
    ODW_4.SetParam("key_name", 0,  key_name);
    if( ! ODW_4.Query("hget_data") )
    {
        Form.Alert( ODW_4.GetError() );
        return ""; 
    }
    return ODW_4.GetParam( "json_result", 0 );
}


function Form_OnJsonResult( result, call_id, status, data )
{
	if(call_id == "call_05")
	{
	
	}
    
}

function print_edit( obj, items )
{
	for(var idx in obj)
	{
		if(!isNaN(idx) || idx == "children")
//		if(idx == "children")
		{
			print_edit(obj[idx], items);
		}
		else
		{
//			if ( (g_toolbar == "print" && idx == "gid" ) || ( g_toolbar == "print2" && idx == "map_name" ))
//			if ( idx == "gid" || idx == "map_name" )
			if ( idx == "map_name" )
			{
				for (var i = 0; i < items.length; i++) 
				{
					if( (typeof(items[i].map_name) != "undefined") &&
						((String(items[i].gid) == String(obj.gid) ) ||
						( String(items[i].map_name) == String(obj.map_name) ) ))
					{
						switch(items[i].ctrltype)
						{
							case "combo" :
							case "datetime" :
							case "edit" :
							case "check" :
								if( ms_excel )
								{
									var _text= items[i].Text
									// 콤마제거
									if( _text && _text.indexOf(",") )
									{
										var replace_val = _text.replaceAll(/,/g, "");
										if( !isNaN( replace_val ) )
										{
											items[i].Text = replace_val;
										}
									}
									if( isNaN(items[i].Text) || items[i].Text == "" )
										obj["ss:Type"] = "String";
									else 
										obj["ss:Type"] = "Number";
								}
								obj["children"]["0"].text = items[i].Text;
								break;
							
							case "image" :
								//obj.textValue = "nextwithpic:" + items[i].Text;
								obj["children"]["0"].text = items[i].textValue;
								break;
							
							case "multiline" :
								obj["children"]["0"].text = items[i].textValue;
								return;
								var obj_num = 0;
								for(var j in obj.parent)
								{
									if(typeof(obj.parent[j]) == "object")
									{
										obj_num++;
									}
								}
								var split_val = items[i].Text.split("\n");
								if(split_val.length == 1)
								{
									//obj.textValue = data[0];
									obj["children"]["0"].textValue = items[i].Text;
								}
								else
								{
									for (var k in split_val)
									{
										var clone_obj = clone(obj.parent);
										var wt = getElementByNodeName(clone_obj, "w:t");
										var clone_br = clone(wt);
										clone_br[0].nodeName = "w:br";
										clone_br[0].textValue = "";
										if(k == 0)
											obj.textValue = split_val[k];
										else
										{
											wt[0].textValue = split_val[k];
											obj.parent[obj_num + (k*2-1) - 2] = clone_br[0]; // -2 : length-1, parent
											obj.parent[obj_num + (k*2) - 2] = wt[0];
										}
									}
								}
								break;
							
							case "grid" :
									var header = items[i].column_list_text;
									var header_map = items[i].column_map_list;
									var lines = items[i].grid_data; // $$ 라인 처리
									var table_len = lines.length;
									if(ms_excel) // Excel
									{
										var tr = getElementByNodeName(obj.parent, "Row");
										var tr_clon = tr;
										for (var idx = 0 ; idx < tr.length ; idx++ )
										{
											if (tr_clon[0].gid < obj.gid)
												tr_clon.splice(0,1);
										}
										tr = tr_clon;
									}
									else // Word
										var tr = getElementByNodeName(obj, "w:tr");
									
									var tr_len = tr.length || 0;

									if(tr_len > 0)
									{
										lines_header_map_array = [];
										var mapping_flag = false;
										var lines_ii = 0;
										for (var ii = 0; lines_ii <= table_len; ii++)
										{
											// 셀병합 후 추가로직
											if(!mapping_flag  && ms_excel)
											{
												if( lines.length > 0 )
												{
													var data_start_column = getElementByNodeName(tr[ii+1], "Cell");
													//if( data_start_column[0][0] && data_start_column[0][0].textValue.indexOf("$", 1) > -1 && data_start_column[0][0].textValue.indexOf("$") > -1 && data_start_column[0][0].textValue.indexOf("$$$") == -1 )
													if( header_map.indexOf(data_start_column[0][0].map_name) > -1 )
													{
													
														for( var mapping_idx = 0 ; mapping_idx < data_start_column.length ; mapping_idx++ )
														{
															var data_cell = getElementByNodeName(data_start_column[mapping_idx], "Data");
															if( data_cell[0] )
																var map_name = data_cell[0]["map_name"];
															else 
																var map_name = null;
															
															lines_header_map_array.push(map_name); //position 정보 입력
														}
														mapping_flag = true;
														lines_ii = 1;
														continue; // header 정보를 입력한 다음 row 부터 데이터 삽입
													}
													else
													{
														continue; // mapping_flag:false 로, header 정보를 다시 찾음
													}
												}
											}
											
											var tc = null;
											if(lines_ii >= tr_len)
											{
												if (!ms_excel)
												{
													var one_row = clone(tr[tr_len-1]);
													obj[ii+2] = one_row; // insert row
													tc = getElementByNodeName(obj[ii+2], "w:tc");
												}
												else
													break;
											}
											else
											{
												if(ms_excel)
													tc = getElementByNodeName(tr[ii], "Cell"); // tc: row 에 대한 cell obj
												else
													tc = getElementByNodeName(tr[ii], "w:tc");
											}
											var tc_len = tc.length;

											for(var j = 0 ; j < tc_len; j++)
											{
												for( var lines_j = 0 ; lines_j < tc_len ; lines_j++)
												{
													if(ms_excel)
														var text = getElementByNodeName(tc[j], "Data"); // text : row, cell 에 대한 data
													else
														var text = getElementByNodeName(tc[j], "w:t");
													if(text.length > 0)
													{
														if(ii == 0) // 그리드 헤더처리 
														{
															continue;
														}
														else 
														{
															// $$영역 처리
															if( ms_excel)
															{
																if( lines_header_map_array[j] != header_map[lines_j])
																{
																	continue;
																}
															}
															
															if (lines_j < lines[lines_ii-1].length)
															{
																// 숫자일경우 콤마제거
																if( lines[lines_ii-1][lines_j] && lines[lines_ii-1][lines_j].indexOf(",") )
																{
																	var replace_val = lines[lines_ii-1][lines_j].replaceAll(/,/g, "");
																	if( !isNaN( replace_val ) )
																	{
																		lines[lines_ii-1][lines_j] = replace_val;
																	}
																}
																text[0].textValue = lines[lines_ii-1][lines_j] || "";
																if(ms_excel)
																{
																	if( lines[lines_ii-1][lines_j] == "" )
																	{
																		text[0]["ss:Type"] = "String";
																		text[0].textValue = "";
																	}
																	else if(!isNaN(lines[lines_ii-1][lines_j]))
																		text[0]["ss:Type"] = "Number";
																	else
																		text[0]["ss:Type"] = "String";
																}
															}
														}
//														lines_j++;
													}
													else
													{
														if(ms_excel)
														{
															lines_j_flag = true;
															var one_cel = null;
															var found = false;
															for(var cl = j;cl < tc_len; cl++)
															{
																for(var idx in tc[cl].parent)
																{
																	if(tc[cl].parent[idx].nodeName == "Cell")
																	{
																		for(var cidx in tc[cl].parent[idx])
																		{
	
																			if(tc[cl].parent[idx][cidx].nodeName == "Data")
																			{	
																				if( tc[cl][cidx] != null && (tc[cl][cidx].textValue == null && ii == 1 ) )
																				{
																					lines_j_flag = false;
																				}
																				one_cel = clone(tc[cl].parent[idx][cidx]);
																				one_cel.textValue = "";
																				found = true;
																				break;
																			}
																		}
																	}
																	if(found)
																		break;
																}
																if(found)
																	break;
															}
															if( found && lines_j_flag  )
															{
																if( lines_header_map_array[j] != header_map[lines_j] )
	//															if( lines_j + 1 != tc[cl][cidx]["column_idx"] )
																{
																	continue;
																}
																
																if( ii-1 < 0 )
																	continue;
																tc[cl][cidx] = one_cel;
																
																// 콤마제거
																if( lines[lines_ii-1][lines_j] && lines[lines_ii-1][lines_j].indexOf(",") )
																{
																	var replace_val = lines[lines_ii-1][lines_j].replaceAll(/,/g, "");
																	if( !isNaN( replace_val ) )
																	{
																		lines[lines_ii-1][lines_j] = replace_val;
																	}
																}
																
																tc[cl][cidx].textValue = lines[lines_ii-1][lines_j] || "";
																if( lines[lines_ii-1][lines_j] == "" )
																{
																	tc[cl][cidx]["ss:Type"] = "String";
																	tc[cl][cidx].textValue = "";
																}
																else if(!isNaN(lines[lines_ii-1][lines_j]))
																	tc[cl][cidx]["ss:Type"] = "Number";
																else
																	tc[cl][cidx]["ss:Type"] = "String";
															}
														}
													}
												}
											}
											lines_ii++;
										}
									}
								break;
						}
					}
				}
			}
		}
	}
}