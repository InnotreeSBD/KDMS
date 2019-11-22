

var dbconn = ODS.GetConnection();


var sql ="SELECT LineID, DataID, EFormID \r\n"
         +"    , CmpyCd, FieldCd, FieldTp, GridCd \r\n"
         +"    , RowNo, FieldVal, ImgData \r\n"
         +"    , ApUserID, ApDt, UpUserID \r\n"
         +"    , UpDt \r\n"
         +"FROM EFormDataLine  \r\n"
         +"WHERE DataID=@DataID \r\n"

if ( Request.ParamGet("CmpyCd") != "" ) sql =sql+"   AND CmpyCd = @CmpyCd \r\n"

dbconn.AddParameterInt("@DataID", Request.ParamGet("DataID"));
dbconn.AddParameter("@CmpyCd", Request.ParamGet("CmpyCd"));

ODS.TraceQueryState("query_detail", sql, dbconn);
var rset = dbconn.ExecuteReader(sql);
Response.SendRecordSet(rset);
Response.SUB_SetRecordSet("ST01", rset);
rset.Close();


