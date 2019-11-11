

var dbconn = ODS.GetConnection();


var sql ="SELECT a.plcy_id, a.cntr_id, a.FileTitle \r\n"
         +"    ,a.FileName , a.Hash_Code, a.ApDt, a.HrNm, a.FileCategory \r\n"
         +"   , '수정' btn_update, '삭제' btn_delete  \r\n"
         +"FROM ECMCntrPolicy a \r\n"
         +"WHERE a.cntr_id=@cntr_id \r\n"

sql =sql+" ORDER BY plcy_id \r\n"

//dbconn.AddParameterInt("@plcy_id", Request.ParamGet("plcy_id"));
dbconn.AddParameter("@cntr_id", Request.ParamGet("cntr_id"));

//dbconn.AddParameter("@FileTitle", Request.ParamGet("FileTitle"));
//dbconn.AddParameter("@FileName", Request.ParamGet("FileName"));
//dbconn.AddParameter("@Hash_Code", Request.ParamGet("Hash_Code"));
//
//dbconn.AddParameter("@ApDt", Request.ParamGet("ApDt"));
//dbconn.AddParameter("@HrNm", Request.ParamGet("HrNm"));
//dbconn.AddParameter("@ApUserID", Request.ParamGet("ApUserID"));
//dbconn.AddParameter("@UpDt", Request.ParamGet("UpDt"));
//dbconn.AddParameter("@UpUserID", Request.ParamGet("UpUserID"));


ODS.TraceQueryState("plcy_query_rn", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
rset.Close();


