

var dbconn = ODS.GetConnection();


var sql ="SELECT @CmpyCd CmpyCd, @Lv1 Lv1, @Lv2 Lv2, @Lv3 Lv3 \r\n"
         +"FROM EFormCategory  \r\n"
         +"WHERE 1=1 \r\n"

dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@Lv1", Request.ParamGet("Lv1"));
dbconn.AddParameter("@Lv2", Request.ParamGet("Lv2"));
dbconn.AddParameter("@Lv3", Request.ParamGet("Lv3"));

ODS.TraceQueryState("query_master", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
rset.Close();


