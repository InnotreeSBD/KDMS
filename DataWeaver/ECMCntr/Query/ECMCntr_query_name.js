
var dbconn = ODS.GetConnection();

var sql ="SELECT cntr_nm name, cntr_nm value \r\n"
         +"FROM ECMCntr  \r\n"
         +"WHERE 1=1 \r\n"
         +"   AND cntr_lv != '0' \r\n";
//dbconn.AddParameter("@target_name", Request.ParamGet("target_name"));
//dbconn.AddParameter("@db_vendor", Request.ParamGet("db_vendor"));
//dbconn.AddParameter("@db_server", Request.ParamGet("db_server"));
//dbconn.AddParameter("@db_port", Request.ParamGet("db_port"));
//dbconn.AddParameter("@db_name", Request.ParamGet("db_name"));
//dbconn.AddParameter("@db_user_id", Request.ParamGet("db_user_id"));
//dbconn.AddParameter("@db_password", Request.ParamGet("db_password"));
//dbconn.AddParameter("@db_reserved1", Request.ParamGet("db_reserved1"));
//dbconn.AddParameter("@db_reserved2", Request.ParamGet("db_reserved2"));
//dbconn.AddParameter("@db_reserved3", Request.ParamGet("db_reserved3"));
//dbconn.AddParameter("@db_reserved5", Request.ParamGet("db_reserved5"));


var rset = dbconn.ExecuteReader(sql);
//Response.SendRecordSet(rset);
Response.SUB_SetRecordSet("ST01", rset);
rset.Close();
