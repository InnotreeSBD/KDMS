

var dbconn = ODS.GetConnection();


var sql ="DELETE FROM EForm WHERE EFormID=@EFormID \r\n"


dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));


ODS.TraceQueryState("EForm_delete_sc_root", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);


