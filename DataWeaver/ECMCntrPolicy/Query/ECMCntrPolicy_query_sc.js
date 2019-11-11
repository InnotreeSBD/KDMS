

var dbconn = ODS.GetConnection();


var sql ="SELECT a.plcy_id, a.cntr_id, a.FileTitle \r\n"
         +"    , a.FileName, a.Hash_Code, a.ApDt, a.ApUserID, a.FileCategory \r\n"
         +"FROM ECMCntrPolicy a \r\n"
         +"WHERE a.plcy_id=@plcy_id \r\n"

dbconn.AddParameterInt("@plcy_id", Request.ParamGet("plcy_id"));


ODS.TraceQueryState("plcy_query_rn", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
rset.Close();


