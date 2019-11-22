

var dbconn = ODS.GetConnection();


var sql ="SELECT DataID, CmpyCd, EFormID \r\n"
         +"    , DataNm, Remarks, ApUserID \r\n"
         +"    , ApDt, UpUserID, UpDt \r\n"
         +"FROM EFormData  \r\n"
         +"WHERE EFormID=@EFormID \r\n"

//if ( Request.ParamGet("CmpyCd") != "" ) sql =sql+"   AND CmpyCd = @CmpyCd \r\n"

dbconn.AddParameterInt("@DataID", Request.ParamGet("DataID"));
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
dbconn.AddParameter("@DataNm", Request.ParamGet("DataNm"));
dbconn.AddParameter("@Remarks", Request.ParamGet("Remarks"));
dbconn.AddParameter("@ApUserID", Request.ParamGet("ApUserID"));
dbconn.AddParameter("@ApDt", Request.ParamGet("ApDt"));
dbconn.AddParameter("@UpUserID", Request.ParamGet("UpUserID"));
dbconn.AddParameter("@UpDt", Request.ParamGet("UpDt"));

ODS.TraceQueryState("query_master", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
rset.Close();


