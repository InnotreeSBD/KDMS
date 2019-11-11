

var dbconn = ODS.GetConnection();


var sql ="DELETE FROM EForm WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM EFormField WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM EFormSQLMapper WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM EFormData WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM EFormDataLine WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM EFormSQL WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM EFormSQLTable WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM EFormSQLColumn WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM EFormSQLJoin WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);

var sql ="DELETE FROM EFormSQLWhere WHERE EFormID=@EFormID \r\n"
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
ODS.TraceQueryState("EForm_delete_sc", sql, dbconn);
var count = dbconn.ExecuteNonQuery(sql);



