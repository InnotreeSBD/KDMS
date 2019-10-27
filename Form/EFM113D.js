

function Form_Load(  )
{
    var EFormID = Form.DialogParamGet("EFormID");
    if ( EFormID == "" ) Form.CloseView(0);
    
    ODW_1.ResetODW();
    ODW_1.SetParam("EFormID", 0, EFormID);
    ODW_1.Query("query_sc");
    
    DGN_Design.InitMode( true, 800, 600 );
    DGN_Design.MetaShowLayout("form_border", false);
    DGN_Design.MetaShowLayout("toolbar_ctrl", false);
    DGN_Design.SetDesignLayout( ODW_1.GetParam("EFormXML", 0), "" );
    DGN_Design.SetLayoutSize( 800, 600);
}