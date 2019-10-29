
var Prefix = "__Encode";
function Form_Load(  )
{
    DGN_Design.InitMode( true, 800, 600 );
    
    var dgn_code = Form.DialogParamGet("dgn_code");
    var dgn_name = Form.DialogParamGet("dgn_name");
    var hash_code = Form.DialogParamGet("hash_code");
    Form.SetViewData("dgn_code", dgn_code);
    Form.SetViewData("dgn_name", dgn_name);
    Form.SetViewData("hash_code", hash_code);
    if( hash_code == "" )
	{
		DGN_Design.SetDesignLayout( "", "" );
		
		return;
	}
	
	ODW_2.ResetODW();
    ODW_2.SetParam("hash", 0, hash_code);
    ODW_2.SetParam("key_name", 0, "contents");
    if( ! ODW_2.Query("hget_data") )
    {
        Form.Alert( ODW_2.GetError() );
        return; 
    }
    
    var data = JSON.parse( ODW_2.GetParam( "json_result", 0 ) );
    
    var contents = data.Contents;
	
	if(typeof(contents) == "object")
	{
		contents = json2xml(contents);
	}
	else
	{
		if(contents.indexOf(Prefix) == 0)
		{
			contents = contents.substr(Prefix.length);
			contents = itree_Base64.decode( contents )
		}
		if(contents[0] != "<")
		{
			contents = JSON.parse(contents);
			contents = json2xml(contents);
		}
	}
	DGN_Design.SetDesignLayout( contents, "" );
}

function Form_OnCloseDialog( view_code, dialog_result )
{
    var popup_close = Form.GetViewData("popup_close");
    Form.Alert(popup_close);
    Form.InvokeMethod( popup_close, [] );
    Form.DialogClear();
}

function DGN_Design_OnReady( param1, param2 )
{
    Init_Data();
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
// Purpose : 데이터 초기화
//
{
    var hash_code = Form.GetViewData("hash_code");
    var dgn_code = Form.GetViewData("dgn_code");
    var dgn_name = Form.GetViewData("dgn_name");
    
    ODW_6.ResetODW(); // SET_100
    ODW_6.SetParam("dgn_code", 0, dgn_code);
    if ( !ODW_6.Query("query_rn") )
    {
        Form.Alert(ODW_6.GetError());
        return;
    }
    if ( ODW_6.GetCount() == 0 ) return;
    
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
    console.log("panel_name : "+panel_name+", ctrl_name : "+ctrl_name+", row : "+row+", init_value : "+init_value);
    }
}

function Run_Action ( ctrl_name, cur_row )
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

  if ( ODW_1.GetCount() == 0 ) return;
  var action_type = ODW_1.GetParam("action_type", 0);
  var action_contents = ODW_1.GetParam("action_contents", 0);

  if ( action_type == "function" )
  {
    if ( action_contents == "" ) return;

    var param_arr = new Array();
    var param_json = new Object();
    var param_panel_index = -1;
    var param_row_index = -1;
    var target_db = ODW_1.GetParam("target_db", 0);

    param_json.target_db = target_db;
    param_json.cur_ctrl_name = ctrl_name;

    //param_arr[0] = target_db;
    Form.SetViewData("target_db", target_db);
    Form.SetViewData("cur_ctrl_name", ctrl_name);
    Form.SetViewData("param_json", param_json);
    if(action_contents != null)
    {
      var action_func_params = action_contents.split("(");
      if(action_func_params.length > 1)
      {
        console.log("split '(' in");
        action_contents = action_func_params[0];

        if(action_func_params.indexOf("{") > -1)
        {
            console.log("split '{' in");
            param_arr = [];
            param_arr.push(action_func_params[1].substring(0, action_func_params[1].length-1));
        }
        else
        {
          console.log("simple arg");
          action_func_params = action_func_params[1].substring(0, action_func_params[1].length-1)
          action_func_params = action_func_params.split(",");
          param_arr = [];
          for(var idx = 0; idx < action_func_params.length; idx++ )
              param_arr.push(action_func_params[idx]);
        }
      }
    }
    Form.InvokeMethod( action_contents, param_arr );
    console.log(action_contents);
  }
}