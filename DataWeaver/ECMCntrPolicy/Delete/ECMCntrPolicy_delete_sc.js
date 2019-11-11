

var dbconn = ODS.GetConnection();


var sql ="DELETE FROM ECMCntrPolicy \r\n"
         +"WHERE plcy_id=@plcy_id \r\n"


dbconn.AddParameterInt("@plcy_id", Request.ParamGet("plcy_id"));
dbconn.AddParameter("@cntr_id", Request.ParamGet("cntr_id"));
dbconn.AddParameter("@ApDt", Request.ParamGet("ApDt"));
dbconn.AddParameter("@ApUserID", Request.ParamGet("ApUserID"));
dbconn.AddParameter("@UpDt", Request.ParamGet("UpDt"));
dbconn.AddParameter("@UpUserID", Request.ParamGet("UpUserID"));

dbconn.AddParameter("@FileTitle", Request.ParamGet("FileTitle"));
dbconn.AddParameter("@FileName", Request.ParamGet("FileName"));
dbconn.AddParameter("@Hash_Code", Request.ParamGet("Hash_Code"));



var count = dbconn.ExecuteNonQuery(sql);

Response.SetCellData( "result", 0, count );
