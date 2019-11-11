// --------------------------------------------------------------
var ApDt =ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
var ApUserID = ODS.GetUserID();
// --------------------------------------------------------------


var dbconn = ODS.GetConnection();


var sql ="UPDATE ECMCntrPolicy SET  \r\n"
         +"    , UpDt=@UpDt \r\n"
         +"    , UpUserID=@UpUserID \r\n"
         +"WHERE plcy_id=@plcy_id \r\n"


dbconn.AddParameterInt("@plcy_id", Request.ParamGet("plcy_id"));
dbconn.AddParameter("@cntr_id", Request.ParamGet("cntr_id"));
dbconn.AddParameter("@ApDt", Request.ParamGet("ApDt"));
dbconn.AddParameter("@ApUserID", Request.ParamGet("ApUserID"));
dbconn.AddParameter("@UpDt", ApDt);
dbconn.AddParameter("@UpUserID", ApUserID);

ODS.TraceQueryState("plcy_update_sc", sql, dbconn);

var count = dbconn.ExecuteNonQuery(sql);
