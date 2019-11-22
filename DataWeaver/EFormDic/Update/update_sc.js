//==============================================================================
var ApUserID = ODS.GetUserID();
var ApDt = ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
//==============================================================================

//==============================================================================
// 트리 수정시 수행되는 method
//==============================================================================



var dbconn = ODS.GetConnection();


var sql ="UPDATE EFormDic SET  \r\n"
         +"DicID=@DicID, DicCd=@DicCd, CmpyCd=@CmpyCd \r\n"
         +"    , DicNm=@DicNm, DicXML=@DicXML, MapSQL=@MapSQL \r\n"
         +"    , CatCd1=@CatCd1, CatCd2=@CatCd2, ParentID=@ParentID \r\n"
         +"    , Lv=@Lv, DispSeq=@DispSeq, Remarks=@Remarks \r\n"
         +"    , UpUserID=@UpUserID \r\n"
         +"    , UpDt=@UpDt \r\n"
         +"WHERE DicID=@DicID \r\n"


dbconn.AddParameterInt("@DicID", Request.ParamGet("DicID"));
dbconn.AddParameter("@DicCd", Request.ParamGet("DicCd"));
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@DicNm", Request.ParamGet("DicNm"));
dbconn.AddParameter("@DicXML", Request.ParamGet("DicXML"));
dbconn.AddParameter("@MapSQL", Request.ParamGet("MapSQL"));
dbconn.AddParameter("@CatCd1", Request.ParamGet("CatCd1"));
dbconn.AddParameter("@CatCd2", Request.ParamGet("CatCd2"));
dbconn.AddParameterInt("@ParentID", Request.ParamGet("ParentID"));
dbconn.AddParameterInt("@Lv", Request.ParamGet("Lv"));
dbconn.AddParameterInt("@DispSeq", Request.ParamGet("DispSeq"));
dbconn.AddParameter("@Remarks", Request.ParamGet("Remarks"));
dbconn.AddParameter("@ApUserID", ApUserID);
dbconn.AddParameter("@ApDt", ApDt);
dbconn.AddParameter("@UpUserID", ApUserID);
dbconn.AddParameter("@UpDt", ApDt);


ODS.TraceQueryState("EFormDic_update_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

