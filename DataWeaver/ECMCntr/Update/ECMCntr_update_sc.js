// --------------------------------------------------------------
var ApDt =ODS.Now().FormatString("yyyy-MM-dd HH:mm:ss");
var ApUserID = ODS.GetUserID();
// --------------------------------------------------------------

var dbconn = ODS.GetConnection();


var sql ="UPDATE ECMCntr SET  \r\n"
         +"  cntr_nm=@cntr_nm, use_yn=@use_yn \r\n"
         +"    , UpDt=@UpDt, UpUserID=@UpUserID \r\n"
         +"WHERE cntr_id=@cntr_id \r\n"


dbconn.AddParameter("@cntr_id", Request.ParamGet("cntr_id"));
dbconn.AddParameterInt("@box_id", Request.ParamGet("box_id"));
dbconn.AddParameter("@up_cntr_id", Request.ParamGet("up_cntr_id"));
dbconn.AddParameter("@cntr_nm", Request.ParamGet("cntr_nm"));
dbconn.AddParameterInt("@cntr_lv", Request.ParamGet("cntr_lv"));
dbconn.AddParameter("@use_yn", Request.ParamGet("use_yn"));
dbconn.AddParameterInt("@sort_seq", Request.ParamGet("sort_seq"));
dbconn.AddParameter("@ApDt", Request.ParamGet("ApDt"));
dbconn.AddParameter("@ApUserID", Request.ParamGet("ApUserID"));
dbconn.AddParameter("@UpDt", ApDt);
dbconn.AddParameter("@UpUserID", ApUserID);


var count = dbconn.ExecuteNonQuery(sql);

