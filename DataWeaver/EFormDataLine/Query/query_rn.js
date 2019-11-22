

var dbconn = ODS.GetConnection();


var sql ="SELECT LineID, DataID, EFormID \r\n"
         +"    , CmpyCd, FieldCd, FieldTp \r\n"
         +"    , GridCd, RowNo, FieldVal \r\n"
         +"    , ImgData, ApUserID, ApDt \r\n"
         +"    , UpUserID, UpDt \r\n"
         +"FROM EFormDataLine  \r\n"
         +"WHERE 1=1 \r\n"
         
if ( Request.ParamGet("EFormID") != "" )   sql=sql+"  AND EFormID=@EFormID \r\n"
if ( Request.ParamGet("FieldTp") != "" )   sql=sql+"  AND FieldTp=@FieldTp \r\n"


dbconn.AddParameterInt("@LineID", Request.ParamGet("LineID"));
dbconn.AddParameterInt("@DataID", Request.ParamGet("DataID"));
dbconn.AddParameterInt("@EFormID", Request.ParamGet("EFormID"));
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));
dbconn.AddParameter("@FieldCd", Request.ParamGet("FieldCd"));
dbconn.AddParameter("@FieldTp", Request.ParamGet("FieldTp"));
dbconn.AddParameter("@GridCd", Request.ParamGet("GridCd"));
dbconn.AddParameterInt("@RowNo", Request.ParamGet("RowNo"));
dbconn.AddParameter("@FieldVal", Request.ParamGet("FieldVal"));
dbconn.AddParameter("@ImgData", Request.ParamGet("ImgData"));
dbconn.AddParameter("@ApUserID", Request.ParamGet("ApUserID"));
dbconn.AddParameter("@ApDt", Request.ParamGet("ApDt"));
dbconn.AddParameter("@UpUserID", Request.ParamGet("UpUserID"));
dbconn.AddParameter("@UpDt", Request.ParamGet("UpDt"));

ODS.TraceQueryState("query_rn_search", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
//ODS.ShowWarning( Request.ParamGet("EFormID"))
Response.SendRecordSet(rset);
rset.Close();


