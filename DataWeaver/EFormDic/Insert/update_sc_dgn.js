//==============================================================================
var ApUserID = ODS.GetUserID();
var ApDt = ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
//==============================================================================

//==============================================================================
// 디자인 삽입할때 사용되는 method
//==============================================================================



var dbconn = ODS.GetConnection();


var sql ="UPDATE EFormDic SET  \r\n"
         +" DicXML=@DicXML, UpUserID=@UpUserID \r\n"
         +"    , UpDt=@UpDt \r\n"
         +"WHERE DicID=@DicID \r\n"


dbconn.AddParameterInt("@DicID", Request.ParamGet("DicID"));
dbconn.AddParameter("@DicXML", Request.ParamGet("DicXML"));
dbconn.AddParameter("@UpUserID", ApUserID);
dbconn.AddParameter("@UpDt", ApDt);


ODS.TraceQueryState("EFormDic_update_sc_dgn", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);


