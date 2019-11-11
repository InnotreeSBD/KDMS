//==============================================================================
var ApUserID = ODS.GetUserID();
var ApDt = ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
//==============================================================================

//==============================================================================
// 트리 수정시 수행되는 method
//==============================================================================


var dbconn = ODS.GetConnection();


var sql ="UPDATE EForm SET  \r\n"
         +"EFormID=@EFormID, EFormCd=@EFormCd, CmpyCd=@CmpyCd \r\n"
         +"    , EFormNm=@EFormNm, EFormTp=@EFormTp, EFormXML=@EFormXML, MapSQL=@MapSQL \r\n"
         +"    , CatCd1=@CatCd1, CatCd2=@CatCd2, ParentID=@ParentID \r\n"
         +"    , Lv=@Lv, DispSeq=@DispSeq, Remarks=@Remarks \r\n"
         +"    , DicID=@DicID, CallType=@CallType, UpUserID=@UpUserID, UpDt=@UpDt \r\n"
         +"WHERE EFormID=@EFormID \r\n"


dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
dbconn.AddParameter("@EFormCd", Request.ParamGet("EFormCd"));
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@EFormNm", Request.ParamGet("EFormNm"));
dbconn.AddParameter("@EFormTp", Request.ParamGet("EFormTp"));
dbconn.AddParameter("@EFormXML", Request.ParamGet("EFormXML"));
dbconn.AddParameter("@MapSQL", Request.ParamGet("MapSQL"));
dbconn.AddParameter("@CatCd1", Request.ParamGet("CatCd1"));
dbconn.AddParameter("@CatCd2", Request.ParamGet("CatCd2"));
dbconn.AddParameterInt("@ParentID", Request.ParamGet("ParentID"));
dbconn.AddParameterInt("@Lv", Request.ParamGet("Lv"));
dbconn.AddParameterInt("@DispSeq", Request.ParamGet("DispSeq"));
dbconn.AddParameter("@Remarks", Request.ParamGet("Remarks"));
dbconn.AddParameterInt("@DicID", Request.ParamGet("DicID"));
dbconn.AddParameter("@CallType", Request.ParamGet("CallType"));
dbconn.AddParameter("@ApUserID", ApUserID);
dbconn.AddParameter("@ApDt", ApDt);
dbconn.AddParameter("@UpUserID", ApUserID);
dbconn.AddParameter("@UpDt", ApDt);


ODS.TraceQueryState("EForm_update_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

