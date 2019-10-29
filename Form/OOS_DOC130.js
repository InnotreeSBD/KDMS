
function Form_Load(  )
{
	TreeQuery();
}

function TreeQuery()
{
    TRE_1.NodeDeleteAll();
    
    ODW_1.ResetODW()
    ODW_1.SetParam("box_id", 0, 0 );
    ODW_1.SetParam("query_type", 0, "root" );
    if ( !ODW_1.Query("ECMCntr_query_tree") )
        Form.Alert( ODW_1.GetError() );
    
    if ( ODW_1.GetCount() == 0 )
    {
        BTN_6.SetVisible(1);
        return;
    }
    else
    {
        TRE_1.NodeInsertByKey("", ODW_1.GetParam("cntr_id", 0), ODW_1.GetParam("cntr_nm", 0), -1, 0, 0);
        TRE_1.NodeSetCell(ODW_1.GetParam("cntr_id", 0), 3, ODW_1.GetParam("cntr_lv", 0));
    }
    
    ODW_1.ResetODW()
    ODW_1.SetParam("box_id", 0, 0 );
    if ( !ODW_1.Query("ECMCntr_query_tree") )
        Form.Alert( ODW_1.GetError() );

    var row_count = ODW_1.GetCount();
    for ( var i = 0 ; i < row_count ; i++ )
    {
        var up_cntr_id = ODW_1.GetParam("up_cntr_id", i);
        var cntr_id = ODW_1.GetParam("cntr_id", i);
        var cntr_nm = ODW_1.GetParam("cntr_nm", i);
        TRE_1.NodeInsertByKey(up_cntr_id, cntr_id, cntr_nm, -1, 0, 0);
        TRE_1.NodeSetCell(cntr_id, 1, cntr_id);
        TRE_1.NodeSetCell(cntr_id, 2, cntr_nm);

        TRE_1.NodeSetCell(cntr_id, 3, ODW_1.GetParam("cntr_lv", i));
        TRE_1.NodeSetCell(cntr_id, 4, ODW_1.GetParam("sort_seq", i));
        TRE_1.NodeSetCell(cntr_id, 5, ODW_1.GetParam("use_yn", i));
        TRE_1.NodeSetCell(cntr_id, 6, ODW_1.GetParam("box_id", i));
        TRE_1.NodeSetCell(cntr_id, 7, ODW_1.GetParam("up_cntr_id", i));

        if( parseInt(ODW_1.GetParam("cntr_lv", 0)) < 4 )
            TRE_1.ExpandNode(up_cntr_id, true);
    }
    
    TRE_1.SelectNode("00000000000000000000000000000001");
}

function BTN_1_Click(  )
{
    Form.DialogParamSet("cntr_id", TRE_1.CurrentNodeKey());
    Form.DialogParamSet("file_category", TRE_1.NodeGetCell(TRE_1.CurrentNodeKey(), 2));
    Form.DialogParamSet("ReturnCount", 1);
    Form.CloseView(1);
}

function BTN_2_Click(  )
{
    Form.DialogParamSet("ReturnCount", 0);
    Form.CloseView(0);
}