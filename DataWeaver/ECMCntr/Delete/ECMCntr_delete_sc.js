

var dbconn = ODS.GetConnection();


var sql ="DELETE FROM ECMCntrPolicy \r\n"
         +"WHERE cntr_id=@cntr_id \r\n"

dbconn.AddParameter("@cntr_id", Request.ParamGet("cntr_id"));
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM ECMCntr \r\n"
         +"WHERE cntr_id=@cntr_id \r\n"


dbconn.AddParameter("@cntr_id", Request.ParamGet("cntr_id"));


var count = dbconn.ExecuteNonQuery(sql);


