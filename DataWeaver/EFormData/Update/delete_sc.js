

var dbconn = ODS.GetConnection();


var sql ="DELETE FROM EFormData \r\n"
         +"WHERE DataID=@DataID \r\n"

dbconn.AddParameterInt("@DataID", Request.ParamGet("DataID"));
var count = dbconn.ExecuteNonQuery(sql);



var sql ="DELETE FROM EFormDataLine \r\n"
         +"WHERE DataID=@DataID \r\n"

dbconn.AddParameterInt("@DataID", Request.ParamGet("DataID"));
ODS.TraceQueryState("EFormData_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);


