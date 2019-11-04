

var dbconn = ODS.GetConnection();

var sql ="SELECT cntr_id, box_id, up_cntr_id \r\n"
         +"    , cntr_nm, cntr_lv, use_yn \r\n"
         +"    , sort_seq, ApDt, ApUserID \r\n"
         +"    , UpDt, UpUserID \r\n"
         +"FROM ECMCntr  \r\n"
         +"WHERE cntr_id=@cntr_id \r\n"


dbconn.AddParameterInt("@cntr_id", Request.ParamGet("cntr_id"));


ODS.TraceQueryState("ECMCntr_query_sc ", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
rset.Close();


