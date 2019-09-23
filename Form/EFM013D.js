

function Form_Load(  )
{
    var DicID = Form.DialogParamGet("DicID");
    if ( DicID == "" ) Form.CloseView(0);
    
    ODW_1.ResetODW();
    ODW_1.SetParam("DicID", 0, DicID);
    ODW_1.Query("query_sc");
    
    DGN_Design.InitMode( true, 800, 600 );
    DGN_Design.MetaShowLayout("form_border", false);
    DGN_Design.MetaShowLayout("toolbar_ctrl", false);
    DGN_Design.SetDesignLayout( ODW_1.GetParam("DicXML", 0), "" );
    DGN_Design.SetLayoutSize( 800, 600);
}