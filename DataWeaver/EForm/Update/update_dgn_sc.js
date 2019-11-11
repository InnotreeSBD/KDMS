//==============================================================================
var ApUserID = ODS.GetUserID();
var ApDt = ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
//==============================================================================

//==============================================================================
// 디자인 삽입할때 사용되는 method
//==============================================================================

var dbconn = ODS.GetConnection();


var sql ="UPDATE EForm SET  \r\n"
         +" EFormXML=@EFormXML, UpUserID=@UpUserID, UpDt=@UpDt \r\n"
         +"WHERE EFormID=@EFormID \r\n"

dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
dbconn.AddParameter("@EFormXML", Request.ParamGet("EFormXML"));
dbconn.AddParameter("@UpUserID", ApUserID);
dbconn.AddParameter("@UpDt", ApDt);


ODS.TraceQueryState("EForm_update_sc_dgn", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);


